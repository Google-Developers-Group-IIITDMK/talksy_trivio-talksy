import os
import re
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import google.generativeai as genai
from elevenlabs import generate, set_api_key

load_dotenv()

# Configure APIs
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
genai.configure(api_key=GENAI_API_KEY)
set_api_key(ELEVEN_API_KEY)

# FastAPI app
app = FastAPI()

# Utility: Split long text into small TTS chunks
def chunk_text(text, max_len=250):
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunks, current = [], ""
    for s in sentences:
        if len(current) + len(s) + 1 > max_len:
            if current:
                chunks.append(current.strip())
            current = s
        else:
            current += " " + s
    if current:
        chunks.append(current.strip())
    return chunks

@app.websocket("/ws/chat")
async def chat_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time AI chat.
    Client sends: { "type": "message", "data": "Hello AI" }
    Server sends:
        - {"type":"reply","data":"AI text"}
        - Binary audio frames
    """
    await websocket.accept()
    conversation = []
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Send welcome
    await websocket.send_json({"type": "reply", "data": "Hello! I am your AI friend. Let's have a chat."})

    try:
        while True:
            # Receive user message
            data = await websocket.receive_json()
            if data["type"] != "message":
                continue

            user_msg = data["data"].strip()
            print(f"User :: {user_msg}")

            if user_msg.lower() in ("exit", "quit", "bye"):
                await websocket.send_json({"type": "reply", "data": "Goodbye! It was nice talking to you."})
                break

            conversation.append(f"User: {user_msg}")

            # Call Gemini
            try:
                prompt = "\n".join(conversation) + "\nAI:"
                response = model.generate_content(prompt)
                ai_reply = response.text.strip()
                conversation.append(f"AI: {ai_reply}")
            except Exception as e:
                ai_reply = "Sorry, something went wrong."
                print("Gemini API error:", e)

            # Send AI text to client
            await websocket.send_json({"type": "reply", "data": ai_reply})

            # Generate TTS audio in chunks and send as binary
            try:
                for chunk in chunk_text(ai_reply):
                    audio = generate(text=chunk,
                                     voice="Rachel",
                                     model="eleven_multilingual_v2")
                    await websocket.send_bytes(audio)  # Send audio chunk
            except Exception as e:
                print("ElevenLabs TTS error:", e)

    except WebSocketDisconnect:
        print("Client disconnected")
