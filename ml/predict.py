"""Inference for the AgriVision model.

The model trained by ``train.py`` contains its MobileNetV2 [-1, 1]
``Rescaling`` layer.  Therefore inference deliberately supplies RGB pixels in
the original [0, 255] range: scaling them here as well would normalize twice.
"""

import argparse
import json
import os
import sys
from functools import lru_cache

import numpy as np
from PIL import Image
import tensorflow as tf

DEFAULT_CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "60"))
# This is an OOD guard, not a reduction applied to the model probability.
DEFAULT_UNSUPPORTED_CROP_THRESHOLD = float(os.getenv("UNSUPPORTED_CROP_THRESHOLD", "35"))


def parse_args():
    parser = argparse.ArgumentParser(description="AgriVision leaf predictor")
    parser.add_argument("--image", required=True, help="Path to the uploaded image")
    parser.add_argument("--model", help="Override model path")
    parser.add_argument("--class_map", help="Override class-map path")
    parser.add_argument("--threshold", type=float, default=DEFAULT_CONFIDENCE_THRESHOLD)
    parser.add_argument("--unsupported_threshold", type=float, default=DEFAULT_UNSUPPORTED_CROP_THRESHOLD)
    return parser.parse_args()


def _artifact_pairs(model_override=None, map_override=None):
    """Return matching model/map pairs, with the training output first.

    ``train.py`` defaults to ./models, whereas the previous predictor only
    searched ./ml/models. That allowed a stale model to be served.
    """
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pairs = []
    if model_override or map_override:
        pairs.append((model_override, map_override))
    env_model = os.getenv("AGRIVISION_MODEL_PATH")
    env_map = os.getenv("AGRIVISION_CLASS_MAP_PATH")
    if env_model or env_map:
        pairs.append((env_model, env_map))
    pairs.extend([
        (os.path.join(project_dir, "models", "agrivision_model.keras"), os.path.join(project_dir, "models", "class_names.json")),
        (os.path.join(project_dir, "ml", "models", "agrivision_model.keras"), os.path.join(project_dir, "ml", "models", "class_names.json")),
        (os.path.join(project_dir, "models", "agrivision_model.tflite"), os.path.join(project_dir, "models", "class_names.json")),
        (os.path.join(project_dir, "ml", "models", "agrivision_model.tflite"), os.path.join(project_dir, "ml", "models", "class_names.json")),
    ])
    return pairs


def resolve_artifacts(model_override=None, map_override=None):
    for model_path, class_map_path in _artifact_pairs(model_override, map_override):
        if model_path and class_map_path and os.path.isfile(model_path) and os.path.isfile(class_map_path):
            return os.path.abspath(model_path), os.path.abspath(class_map_path)
    raise FileNotFoundError("No matching trained model and class_names.json pair was found.")


def load_class_mapping(class_map_path):
    with open(class_map_path, encoding="utf-8") as source:
        raw_mapping = json.load(source)
    if isinstance(raw_mapping, list):
        return {index: {"folder": value} if isinstance(value, str) else value for index, value in enumerate(raw_mapping)}
    if isinstance(raw_mapping, dict):
        return {int(index): {"folder": value} if isinstance(value, str) else value for index, value in raw_mapping.items()}
    raise ValueError("class_names.json must contain a list or an index-to-class mapping.")


def model_input_size(model_path):
    """Read the trained input size instead of relying on a UI/default value."""
    if model_path.endswith(".tflite"):
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        shape = interpreter.get_input_details()[0]["shape"]
        return int(shape[1]), int(shape[2])
    model = get_keras_model(model_path)
    shape = model.input_shape
    return int(shape[1]), int(shape[2])


def load_and_preprocess_image(image_path, target_size):
    if not os.path.isfile(image_path):
        raise FileNotFoundError(f"Uploaded image not found: {image_path}")
    # Training uses image_dataset_from_directory: RGB, resize to 224, float pixels.
    with Image.open(image_path) as image:
        rgb_image = image.convert("RGB")
        resized_image = rgb_image.resize(target_size, Image.Resampling.BILINEAR)
        rgb_pixels = np.asarray(resized_image, dtype=np.float32)
    return np.expand_dims(rgb_pixels, axis=0)


@lru_cache(maxsize=2)
def get_keras_model(model_path):
    return tf.keras.models.load_model(model_path, compile=False)


def _softmax_if_needed(values):
    values = np.asarray(values, dtype=np.float32)
    if np.any(values < 0) or not np.isclose(np.sum(values), 1.0, atol=1e-3):
        shifted = values - np.max(values)
        return np.exp(shifted) / np.sum(np.exp(shifted))
    return values


def run_inference(model_path, input_data):
    if model_path.endswith(".tflite"):
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        input_detail = interpreter.get_input_details()[0]
        output_detail = interpreter.get_output_details()[0]
        interpreter.set_tensor(input_detail["index"], input_data.astype(input_detail["dtype"]))
        interpreter.invoke()
        output = interpreter.get_tensor(output_detail["index"])[0]
    else:
        # Do not normalize here. The selected training model embeds Rescaling.
        output = get_keras_model(model_path).predict(input_data, verbose=0)[0]
    return _softmax_if_needed(output)


def class_details(class_info):
    folder = class_info.get("folder", "Unknown")
    crop = class_info.get("crop") or folder.split("___", 1)[0].replace("_(maize)", "").replace("_", " ").strip()
    disease = class_info.get("disease") or folder.replace("___", " - ").replace("_", " ").strip()
    normalized = folder.lower()
    disease_key = (
        "tomato_early_blight" if "tomato" in normalized and "early" in normalized else
        "healthy_crop" if "tomato" in normalized and "healthy" in normalized else
        "corn_common_rust" if "corn" in normalized and "rust" in normalized else
        "potato_late_blight" if "potato" in normalized and "late" in normalized else
        normalized.replace("___", "_").replace(" ", "_")
    )
    return crop, disease, disease_key


def predict_image(image_path, model_path=None, class_map_path=None, threshold=DEFAULT_CONFIDENCE_THRESHOLD,
                  unsupported_threshold=DEFAULT_UNSUPPORTED_CROP_THRESHOLD):
    model_path, class_map_path = resolve_artifacts(model_path, class_map_path)
    class_map = load_class_mapping(class_map_path)
    input_data = load_and_preprocess_image(image_path, model_input_size(model_path))
    probabilities = run_inference(model_path, input_data)
    if len(probabilities) != len(class_map):
        raise ValueError(f"Model has {len(probabilities)} outputs but class_names.json has {len(class_map)} entries.")

    predicted_index = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_index] * 100)
    class_info = class_map[predicted_index]
    class_name = class_info.get("folder", f"Class_{predicted_index}")
    crop, disease, disease_key = class_details(class_info)
    # A closed-set classifier cannot directly name unknown crops. Low maximum
    # probability is the supported OOD signal, so keep it explicit/configurable.
    is_supported = confidence >= unsupported_threshold
    low_confidence = is_supported and confidence < threshold

    debug = {
        "uploaded_image_path": os.path.abspath(image_path),
        "image_shape_after_preprocessing": list(input_data.shape),
        "raw_prediction_probabilities": [round(float(value), 8) for value in probabilities],
        "predicted_class_index": predicted_index,
        "predicted_class_name": class_name,
        "confidence_score": round(confidence, 2),
    }
    print("AgriVision prediction debug: " + json.dumps(debug, ensure_ascii=False))

    return {
        "success": True, "filename": os.path.basename(image_path), "loaded_model": model_path,
        "class_map": class_map_path, "input_shape": debug["image_shape_after_preprocessing"],
        "raw_probabilities": debug["raw_prediction_probabilities"], "predicted_class_index": predicted_index,
        "predicted_class_name": class_name, "crop": crop, "disease": disease, "disease_key": disease_key,
        "confidence": round(confidence, 2), "confidence_threshold": threshold,
        "unsupported_crop_threshold": unsupported_threshold, "low_confidence": low_confidence,
        "is_supported": is_supported,
    }


def main():
    args = parse_args()
    result = predict_image(args.image, args.model, args.class_map, args.threshold, args.unsupported_threshold)
    if not result["is_supported"]:
        print("This crop is currently not supported by the trained model.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Prediction error: {error}", file=sys.stderr)
        sys.exit(1)
