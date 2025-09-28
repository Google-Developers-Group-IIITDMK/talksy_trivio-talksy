import os
import asyncio
import platform
import urllib.parse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, StreamingResponse
import io
import edge_tts
import google.generativeai as genai
from googleapiclient.discovery import build
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# ---------------- CONFIG -----------------
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

genai.configure(api_key=GENAI_API_KEY)
youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

conversation = []

# Fix Windows loop
if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
loop = asyncio.get_event_loop()

# ---------------- FastAPI APP -----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- TTS STREAMING -----------------
async def generate_tts_audio(text: str, mood="neutral") -> io.BytesIO:
    voice = "en-IN-NeerjaNeural"
    mood_map = {
        "neutral": ("+0%", "+0%"),
        "happy": ("+15%", "+10%"),
        "sad": ("-10%", "-5%"),
        "angry": ("+10%", "+15%"),
        "excited": ("+20%", "+12%"),
        "romantic": ("+5%", "+8%"),
        "chill": ("-5%", "+0%"),
        "energetic": ("+18%", "+12%"),
        "serious": ("-5%", "-5%"),
        "confident": ("+8%", "+5%"),
        "playful": ("+12%", "+10%"),
        "narrative": ("+0%", "+3%"),
        "calm": ("-8%", "-3%"),
    }
    rate, volume = mood_map.get(mood, ("+0%", "+0%"))

    # Save TTS to temporary file, then load into memory
    temp_file = "temp.mp3"
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate, volume=volume)
    await communicate.save(temp_file)

    buf = io.BytesIO()
    with open(temp_file, "rb") as f:
        buf.write(f.read())
    buf.seek(0)
    os.remove(temp_file)
    return buf

@app.get("/tts")
async def tts_endpoint(text: str, mood: str = "neutral"):
    audio_buf = await generate_tts_audio(text, mood)
    return StreamingResponse(audio_buf, media_type="audio/mpeg",
                             headers={"Content-Disposition": "inline; filename=tts.mp3"})

# ----------------- YOUTUBE -----------------
def yt_best_video_id(query: str):
    try:
        resp = youtube.search().list(
            q=query,
            part="snippet",
            type="video",
            maxResults=3,
            order="relevance",
            videoEmbeddable="true"
        ).execute()
        items = resp.get("items", [])
        if items:
            return items[0]["id"]["videoId"]
    except:
        return None
    return None

# ----------------- CHAT -----------------
class ChatRequest(BaseModel):
    text: str

@app.post("/api/chat")
async def chat(req: ChatRequest):
    user_text = req.text.strip()
    conversation.append(user_text)

    # Call LLM
    try:
        resp = model.generate_content(
            f"Conversation so far: {conversation}\n\n"
            "1. Reply briefly (<=15 words).\n"
            "2. Guess mood: [happy, sad, excited, romantic, chill, angry].\n"
            "3. Suggest ONE popular Indian song title (no artist).\n"
            "Format strictly as:\n"
            "reply=...\nmood=...\nsong=..."
        )
        reply, mood, song = "Okay!", "neutral", "Kesariya"
        text_resp = resp.text.strip()
        for line in text_resp.splitlines():
            if line.startswith("reply="): reply = line.replace("reply=", "").strip()
            elif line.startswith("mood="): mood = line.replace("mood=", "").strip().lower()
            elif line.startswith("song="): song = line.replace("song=", "").strip()
    except Exception:
        reply, mood, song = "Hmm, I had a brain freeze!", "neutral", "Kesariya"

    # TTS URL for browser
    tts_url = f"/tts?text={urllib.parse.quote(reply)}&mood={mood}"

    # YouTube link
    vid_id = yt_best_video_id(song)
    youtube_url = f"https://www.youtube.com/watch?v={vid_id}" if vid_id else f"https://www.youtube.com/results?search_query={urllib.parse.quote(song)}"

    return {
        "reply": reply,
        "mood": mood,
        "song": song,
        "youtube": youtube_url,
        "tts_url": tts_url
    }

# ----------------- SERVE INDEX.HTML -----------------
@app.get("/")
async def serve_index():
    with open("index.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())
