import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

# Get all available voices
voices = elevenlabs.voices.get_all()

# Print voice information
for voice in voices.voices:
    print(f"Name: {voice.name}")
    print(f"Voice ID: {voice.voice_id}")
    print(f"Category: {voice.category}")
    print("---")
