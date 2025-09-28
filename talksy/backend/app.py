# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_chat import chat_with_ai

app = Flask(__name__)
CORS(app)

conversation = []   # keep chat history per session (simple memory)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_text = data.get("message", "")
    if not user_text:
        return jsonify({"error": "No message provided"}), 400

    try:
        bot_reply = chat_with_ai(conversation, user_text)
        return jsonify({"reply": bot_reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
