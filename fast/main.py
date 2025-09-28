import os
import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from dotenv import load_dotenv
import google.generativeai as genai
import websockets
from elevenlabs import VoiceSettings


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
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings
)


conversations = {}


with open("index.html", "r") as f:
    html_content = f.read()

@app.get("/")
async def get_home():
    return HTMLResponse(html_content)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    print(f"Client {client_id} connected.")

    
    voice_id = "Rachel"  
    model_id = "eleven_flash_v2_5"  
    uri = f"wss://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream-input?model_id={model_id}"

    try:
        async with websockets.connect(uri,headers=[("xi-api-key", ELEVEN_API_KEY)]) as ws:
            
            voice_settings = VoiceSettings(
                stability=0.8,
                similarity_boost=0.8,
                style=0.0,
                use_speaker_boost=True,
                speed=1.0
            )

            
            init_message = {
                "text": " ",
                "voice_settings": voice_settings.dict(),
                "generation_config": generation_config,
                "xi_api_key": ELEVEN_API_KEY
            }
            await ws.send(json.dumps(init_message))

            if client_id not in conversations:
                conversations[client_id] = model.start_chat(history=[])
                print(f"Started new conversation for client {client_id}.")

            chat_session = conversations[client_id]

            try:
                greeting_text = "Hello! I am your AI friend. Let's have a chat."

                async def stream_greeting():
                    await ws.send(json.dumps({"text": greeting_text + " "}))
                    while True:
                        response = await ws.recv()
                        data = json.loads(response)
                        if "audioOutput" in data:
                            audio_data = data["audioOutput"]
                            await websocket.send_bytes(audio_data)
                        if "finalOutput" in data:
                            await websocket.send_text("EOS")
                            break

                asyncio.create_task(stream_greeting())

                while True:
                    user_text = await websocket.receive_text()
                    print(f"Client {client_id} (You) :: {user_text}")

                    if user_text.lower().strip() in ("exit", "quit", "bye"):
                        goodbye_text = "Goodbye! It was nice talking to you."
                        await ws.send(json.dumps({"text": goodbye_text + " "}))
                        while True:
                            response = await ws.recv()
                            data = json.loads(response)
                            if "audioOutput" in data:
                                audio_data = data["audioOutput"]
                                await websocket.send_bytes(audio_data)
                            if "finalOutput" in data:
                                await websocket.send_text("EOS")
                                break
                        break

                    try:
                        response = await chat_session.send_message_async(user_text, stream=True)

                        full_bot_reply = ""
                        async def text_iterator():
                            nonlocal full_bot_reply
                            async for chunk in response:
                                text_part = chunk.text
                                full_bot_reply += text_part
                                yield text_part

                        await ws.send(json.dumps({"text": full_bot_reply + " "}))
                        while True:
                            response = await ws.recv()
                            data = json.loads(response)
                            if "audioOutput" in data:
                                audio_data = data["audioOutput"]
                                await websocket.send_bytes(audio_data)
                            if "finalOutput" in data:
                                await websocket.send_text("EOS")
                                break

                    except Exception as e:
                        print(f"Error with Gemini or ElevenLabs: {e}")
                        error_message = "Sorry, something went wrong. Please say that again."
                        await ws.send(json.dumps({"text": error_message + " "}))
                        while True:
                            response = await ws.recv()
                            data = json.loads(response)
                            if "audioOutput" in data:
                                audio_data = data["audioOutput"]
                                await websocket.send_bytes(audio_data)
                            if "finalOutput" in data:
                                await websocket.send_text("EOS")
                                break

            except Exception as e:
                print(f"Error with ElevenLabs WebSocket: {e}")
                await websocket.send_text("An error occurred with the voice service. Please try again later.")

    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected.")
    finally:
        if client_id in conversations:
            del conversations[client_id]
            print(f"Cleared conversation history for client {client_id}.")
        await websocket.close()
