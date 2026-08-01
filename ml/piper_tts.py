import os
import glob
import io
import wave
import subprocess

VOICES_DIR = os.path.join(os.path.dirname(__file__), "voices")

SUPPORTED_LANGUAGES = ['en', 'hi', 'kn', 'ta', 'te', 'mr']

def find_piper_model_for_lang(lang_code):
    """
    Locates the .onnx voice model and .onnx.json config inside ml/voices/<lang_code>/
    """
    if lang_code not in SUPPORTED_LANGUAGES:
        lang_code = 'en'

    lang_dir = os.path.join(VOICES_DIR, lang_code)
    if not os.path.exists(lang_dir):
        return None, None, f"Voice directory 'ml/voices/{lang_code}/' does not exist."

    onnx_files = glob.glob(os.path.join(lang_dir, "*.onnx"))
    json_files = glob.glob(os.path.join(lang_dir, "*.onnx.json"))

    if not onnx_files:
        return None, None, f"No Piper .onnx model found in 'ml/voices/{lang_code}/'."

    model_path = onnx_files[0]
    config_path = json_files[0] if json_files else f"{model_path}.json"

    return model_path, config_path, None

def synthesize_speech_piper(text, lang_code='en'):
    """
    Synthesizes speech using Piper TTS engine offline.
    Returns (wav_bytes, error_message, fallback_used)
    """
    model_path, config_path, err = find_piper_model_for_lang(lang_code)
    fallback_used = False

    # Check fallback to English if target language voice model is missing
    if err and lang_code != 'en':
        model_path, config_path, err_fallback = find_piper_model_for_lang('en')
        if not err_fallback:
            fallback_used = True
            err = None

    if err or not model_path:
        return None, f"Piper Voice Model Missing: {err}", False

    try:
        # Import piper library if available, else run piper binary via subprocess
        try:
            from piper import PiperVoice
            voice = PiperVoice.load(model_path, config_path=config_path)
            
            wav_buffer = io.BytesIO()
            with wave.open(wav_buffer, 'wb') as wav_file:
                voice.synthesize(text, wav_file)
            
            wav_bytes = wav_buffer.getvalue()
            return wav_bytes, None, fallback_used

        except ImportError:
            # Fallback to CLI piper binary call if piper Python package is running CLI executable
            process = subprocess.Popen(
                ["piper", "--model", model_path, "--config", config_path, "--output-raw"],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            raw_pcm, stderr = process.communicate(input=text.encode("utf-8"))

            if process.returncode != 0:
                return None, f"Piper execution error: {stderr.decode('utf-8')}", fallback_used

            # Convert raw PCM to WAV
            wav_buffer = io.BytesIO()
            with wave.open(wav_buffer, 'wb') as wav_file:
                wav_file.setnchannels(1)
                wav_file.setsampwidth(2)
                wav_file.setframerate(22050)
                wav_file.writeframes(raw_pcm)

            return wav_buffer.getvalue(), None, fallback_used

    except Exception as ex:
        return None, f"Synthesis Error: {str(ex)}", fallback_used
