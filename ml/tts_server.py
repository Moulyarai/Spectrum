import os
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from piper_tts import synthesize_speech_piper, SUPPORTED_LANGUAGES

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin requests from React frontend

@app.route("/api/tts/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "piper_engine": "ready",
        "supported_languages": SUPPORTED_LANGUAGES
    })

@app.route("/api/tts", methods=["POST"])
def generate_speech():
    """
    POST /api/tts
    Payload: { "text": "...", "lang": "en" | "hi" | "kn" | "ta" | "te" | "mr" }
    Returns: audio/wav binary stream
    """
    data = request.get_json(force=True, silent=True) or {}
    text = data.get("text", "").strip()
    lang = data.get("lang", "en").lower()

    if not text:
        return jsonify({"error": "Missing 'text' parameter in request body."}), 400

    wav_bytes, error_msg, fallback_used = synthesize_speech_piper(text, lang)

    if error_msg:
        return jsonify({
            "error": error_msg,
            "lang": lang,
            "solution": f"Place Piper ONNX model & json config in 'ml/voices/{lang}/'"
        }), 404

    response = Response(wav_bytes, mimetype="audio/wav")
    response.headers["X-Fallback-Used"] = "true" if fallback_used else "false"
    return response

if __name__ == "__main__":
    print("🌾 Starting AgriVision Offline Piper TTS Server on http://localhost:5000 ...")
    print("📁 Voices Directory: ml/voices/{en,hi,kn,ta,te,mr}/")
    app.run(host="0.0.0.0", port=5000, debug=False)
