import os
import sys
import uuid
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from piper_tts import synthesize_speech_piper, SUPPORTED_LANGUAGES
from predict import predict_image

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin requests from React frontend

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/api/tts/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "piper_engine": "ready",
        "supported_languages": SUPPORTED_LANGUAGES,
        "prediction_engine": "ready"
    })

@app.route("/api/predict", methods=["POST"])
def handle_prediction():
    """
    POST /api/predict
    Multipart form-data with file field 'file' or 'image'
    Returns JSON diagnosis report
    """
    if "file" not in request.files and "image" not in request.files:
        return jsonify({"error": "No image file provided in request."}), 400

    file_obj = request.files.get("file") or request.files.get("image")
    if not file_obj or file_obj.filename == "":
        return jsonify({"error": "Selected image file is empty."}), 400

    # Save temp file
    ext = os.path.splitext(file_obj.filename)[1] or ".jpg"
    unique_filename = f"{uuid.uuid4().hex}_{file_obj.filename}"
    temp_filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
    file_obj.save(temp_filepath)

    try:
        # Run prediction pipeline
        result = predict_image(temp_filepath)
        return jsonify(result), 200

    except Exception as e:
        print(f"❌ Error processing upload prediction: {e}")
        return jsonify({"error": str(e), "success": False}), 500
    finally:
        # Clean up temp file if needed or keep for logs
        if os.path.exists(temp_filepath):
            try:
                os.remove(temp_filepath)
            except Exception:
                pass

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
    print("🌾 Starting AgriVision AI Server (TTS + Leaf Diagnostics) on http://localhost:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=False)
