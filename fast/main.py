import os
import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
import google.generativeai as genai
import aiohttp
import base64

load_dotenv()

GOOGLE_API_KEY = os.getenv("GENAI_API_KEY")
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")

genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

generation_config = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

conversations = {}

try:
    with open("index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
except FileNotFoundError:
    html_content = "<h1>WebSocket Client</h1><p>index.html not found.</p>"


@app.get("/")
async def get_home():
    return HTMLResponse(html_content)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    print(f"Client {client_id} connected.")

    voice_id = "21m00Tcm4TlvDq8ikWAM"  # ElevenLabs voice ID
    uri = f"wss://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream-input"

    try:
        async with aiohttp.ClientSession() as session:
            async with session.ws_connect(uri, headers={"xi-api-key": ELEVEN_API_KEY}) as eleven_ws:

                async def audio_forwarder():
                    """Forwards ElevenLabs audio back to the client browser"""
                    try:
                        while True:
                            message = await eleven_ws.receive()
                            if message.type == aiohttp.WSMsgType.BINARY:
                                await websocket.send_bytes(message.data)

                            elif message.type == aiohttp.WSMsgType.TEXT:
                                data = json.loads(message.data)
                                if data.get("audio"):
                                    audio_bytes = base64.b64decode(data["audio"])
                                    await websocket.send_bytes(audio_bytes)
                                    with open("output_stream.mp3", "ab") as f:
                                        f.write(audio_bytes)

                                if data.get("isFinal"):
                                    break

                            elif message.type in (aiohttp.WSMsgType.CLOSED, aiohttp.WSMsgType.ERROR):
                                break
                    except Exception as e:
                        print(f"Error receiving from ElevenLabs: {e}")

                # Start chat session for this client
                if client_id not in conversations:
                    conversations[client_id] = model.start_chat(history=[
                        {"role": "user", "parts": [
                            "From now on, always reply in 10 words or fewer. "
                            "Speak naturally like a voice assistant, keep it short."
                        ]}
                    ])
                chat_session = conversations[client_id]


                # Gemini introduces itself
                response = await chat_session.send_message_async(
                    "Introduce yourself to the user in a friendly and conversational way."
                )
                print("AI intro:", response.text)

                # Speak the introduction
                await eleven_ws.send_json({
                    "text": response.text,
                    "voice_settings": {"stability": 0.7, "similarity_boost": 0.8},
                    "try_trigger_generation": True,
                })
                await eleven_ws.send_json({"text": ""})
                await audio_forwarder()

                # Main chat loop
                while True:
                    user_text = await websocket.receive_text()
                    print(f"User said: {user_text}")

                    if user_text.lower().strip() in ("exit", "quit", "bye"):
                        farewell = "Goodbye! It was nice talking to you."
                        await eleven_ws.send_json({
                            "text": farewell,
                            "try_trigger_generation": True,
                        })
                        await eleven_ws.send_json({"text": ""})
                        await audio_forwarder()
                        break

                    # Get Gemini reply
                    response = await chat_session.send_message_async(user_text)
                    print("AI response:", response.text)

                    # Send reply to ElevenLabs for speech
                    await eleven_ws.send_json({
                        "text": response.text,
                        "voice_settings": {"stability": 0.7, "similarity_boost": 0.8},
                        "try_trigger_generation": True,
                    })
                    await eleven_ws.send_json({"text": ""})
                    await audio_forwarder()

    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected.")
    except Exception as e:
        print(f"An unexpected error occurred in the main endpoint: {e}")
    finally:
        if client_id in conversations:
            del conversations[client_id]
        print("Connection closed.")
