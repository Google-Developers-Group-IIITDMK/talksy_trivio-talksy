import os
import asyncio
import platform
import tempfile
from dotenv import load_dotenv
import speech_recognition as sr
import google.generativeai as genai
from elevenlabs import generate, play, set_api_key 


load_dotenv()  


GENAI_API_KEY = os.getenv("GENAI_API_KEY")
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY") 


genai.configure(api_key=GENAI_API_KEY)
set_api_key(ELEVEN_API_KEY)


model = genai.GenerativeModel("gemini-1.5-flash")

recognizer = sr.Recognizer()

if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


def listen_once(timeout=5, phrase_time_limit=10):
    """Capture one phrase from the microphone."""
    with sr.Microphone() as source:
        print("🎤 Listening...")
        recognizer.adjust_for_ambient_noise(source, duration=0.3)
        audio = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
    try:
        return recognizer.recognize_google(audio)
    except sr.UnknownValueError:
        return None
    except sr.RequestError:
        return "__stt_error__"


def speak_eleven(text, voice="Rachel"):
    """Convert text to speech using ElevenLabs and play it."""
    if not text:
        return
    print(f"Bot :: {text}")
    audio = generate(text=text, voice=voice, model="eleven_multilingual_v2")
    play(audio)


def main():
    speak_eleven("Hello! I am your AI friend. Let's have a chat.")
    conversation = []

    while True:
        user_text = listen_once()

        if user_text == "__stt_error__":
            speak_eleven("Speech service error. Please check your internet.")
            continue
        if not user_text:
            speak_eleven("I didn't catch that. Could you repeat?")
            continue

        print(f"You :: {user_text}")
        if user_text.lower().strip() in ("exit", "quit", "bye"):
            speak_eleven("Goodbye! It was nice talking to you.")
            break

        conversation.append(f"User: {user_text}")

        
        try:
            prompt = "\n".join(conversation) + "\nAI:"
            response = model.generate_content(prompt)
            bot_reply = response.text.strip()
            conversation.append(f"AI: {bot_reply}")
            speak_eleven(bot_reply)
        except Exception as e:
            print("Gemini API error:", e)
            speak_eleven("Sorry, something went wrong. Please say that again.")

if __name__ == "__main__":
    main()
