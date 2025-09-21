import os
import uuid
import asyncio
import platform
import urllib.parse
import webbrowser
import tempfile
# import simpleaudio as sa
from playsound import playsound
from pydub import AudioSegment

# --- Fix Windows event loop for edge-tts ---
if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# TTS
import edge_tts

# STT
import speech_recognition as sr

# LLM + YouTube
import google.generativeai as genai
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

# ================== CONFIG ==================
GENAI_API_KEY = os.getenv("GENAI_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

genai.configure(api_key=GENAI_API_KEY)
youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

conversation = []

# persistent event loop (Python 3.11+ safe)
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

# --------- TTS: play directly ----------
# --------- TTS: play directly ----------
async def _tts_play(text, mood="neutral"):
    voice = "en-IN-NeerjaNeural"

    # --- Flexible mood mapping ---
    mood_map = {
        "neutral":  ("+0%",   "+0%"),
        "happy":    ("+15%",  "+10%"),
        "sad":      ("-10%",  "-5%"),
        "angry":    ("+10%",  "+15%"),
        "excited":  ("+20%",  "+12%"),
        "romantic": ("+5%",   "+8%"),
        "chill":    ("-5%",   "+0%"),
        "energetic":("+18%",  "+12%"),
        "serious":  ("-5%",   "-5%"),
        "confident":("+8%",   "+5%"),
        "playful":  ("+12%",  "+10%"),
        "narrative":("+0%",   "+3%"),
        "calm":     ("-8%",   "-3%"),
    }

    # Default to neutral if mood not in dict
    rate, volume = mood_map.get(mood, ("+0%", "+0%"))

    # Save to temp mp3
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
        path = f.name
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate, volume=volume)
    await communicate.save(path)

    playsound(path, block=True)
    os.remove(path)


def speak(text, mood="neutral"):
    if text:
        loop.run_until_complete(_tts_play(text, mood))

# --------- STT recognizer ----------
recognizer = sr.Recognizer()

def listen_once(timeout=5, phrase_time_limit=8):
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source, duration=0.2)
        audio = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return None
    except sr.RequestError:
        return "__stt_error__"

# --------- YouTube helpers ----------
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
    except Exception:
        return None
    return None

def open_youtube_for_song(song_title: str):
    vid = yt_best_video_id(song_title)
    if vid:
        webbrowser.open(f"https://www.youtube.com/watch?v={vid}&autoplay=1")
        return True
    webbrowser.open(f"https://www.youtube.com/results?search_query={urllib.parse.quote(song_title)}")
    return False

# ================== RUN ==================
def main():
    speak("Welcome to tripleITDM Kurnool's GDG Hackathon!")
    speak("Let's chat. I’ll sense your mood and suggest a perfect Indian song.")

    mood, song = "neutral", "Kesariya"  # defaults in case of failure

    while True:
        print("Listening...")
        utterance = listen_once(timeout=5, phrase_time_limit=8)

        if utterance == "__stt_error__":
            print("Bot :: Speech service error.")
            speak("Hmm, I’m facing a speech service issue. Please try again.")
            continue
        if utterance is None:
            print("Bot :: Didn't catch that.")
            speak("Sorry, I didn’t catch that. Could you repeat?")
            continue

        print(f"You :: {utterance}")
        conversation.append(utterance)

        if utterance.lower().strip() in ("exit", "quit", "bye"):
            break

        # Single Gemini call → reply, mood, song
        try:
            resp = model.generate_content(
                f"Conversation so far: {conversation}\n\n"
                "1. Reply briefly (<=15 words).\n"
                "2. Guess mood: [happy, sad, excited, romantic, chill, angry].\n"
                "3. Suggest ONE popular Indian song title (no artist).\n"
                "Format strictly as:\n"
                "reply=...\nmood=...\nsong=..."
            )
            text = resp.text.strip()
            reply = "Okay!"
            for line in text.splitlines():
                if line.startswith("reply="): reply = line.replace("reply=", "").strip()
                elif line.startswith("mood="): mood = line.replace("mood=", "").strip().lower()
                elif line.startswith("song="): song = line.replace("song=", "").strip()

            print(f"Bot :: {reply}")
            speak(reply, mood=mood)

        except Exception as e:
            print("Bot :: LLM error.", e)
            speak("Sorry, I had a small brain freeze. Please say that again!")
            continue

    # End → Final mood + song
    print(f"Bot :: Detected mood → {mood}")
    speak(f"Hmm… I feel you are {mood} right now.", mood=mood)

    print(f"Bot :: I recommend '{song}' 🎶")
    speak(f"I recommend {song}. Enjoy!", mood=mood)

    ok = open_youtube_for_song(song)
    if ok:
        speak("Opening YouTube now. 🎧 Enjoy the music!", mood=mood)
    else:
        speak("I couldn't find the exact song, showing similar results on YouTube.", mood=mood)

if __name__ == "__main__":
    main()
