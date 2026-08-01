import os
import json
import argparse
import numpy as np
from PIL import Image
import tensorflow as tf

def parse_args():
    parser = argparse.ArgumentParser(description="AgriVision Single Leaf Image Disease Predictor")
    parser.add_argument("--image", type=str, required=True, help="Path to leaf image file to diagnose")
    parser.add_argument("--model", type=str, default="./models/agrivision_model.tflite", help="Path to TFLite or Keras model")
    parser.add_argument("--class_map", type=str, default="./models/class_names.json", help="Path to class names JSON mapping")
    parser.add_argument("--img_size", type=int, default=224, help="Input image dimension")
    return parser.parse_args()

def load_and_preprocess_image(image_path, img_size):
    """
    Loads and resizes image to required dimensions (224x224).
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Leaf image file '{image_path}' not found!")
    
    img = Image.open(image_path).convert("RGB")
    img_resized = img.resize((img_size, img_size))
    img_array = np.array(img_resized, dtype=np.float32)
    
    # Expand dims for batch: (1, 224, 224, 3)
    input_data = np.expand_dims(img_array, axis=0)
    return input_data

def predict_tflite(model_path, input_data):
    """
    Runs inference using TFLite Interpreter.
    """
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()

    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    # Preprocess scaling for MobileNetV2: [-1, 1]
    input_data = (input_data / 127.5) - 1.0

    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()

    predictions = interpreter.get_tensor(output_details[0]['index'])[0]
    return predictions

def predict_keras(model_path, input_data):
    """
    Runs inference using Keras SavedModel.
    """
    model = tf.keras.models.load_model(model_path)
    predictions = model.predict(input_data)[0]
    return predictions

def main():
    args = parse_args()

    # Load class mapping
    if os.path.exists(args.class_map):
        with open(args.class_map, "r") as f:
            class_names = json.load(f)
    else:
        print(f"⚠️ Class map JSON not found at {args.class_map}. Using fallback numerical indices.")
        class_names = None

    # Preprocess image
    print(f"📷 Preprocessing leaf image: {args.image}")
    input_data = load_and_preprocess_image(args.image, args.img_size)

    # Run inference depending on model format (.tflite vs .keras/.h5)
    print(f"🤖 Loading Model: {args.model}")
    if args.model.endswith(".tflite"):
        predictions = predict_tflite(args.model, input_data)
    else:
        predictions = predict_keras(args.model, input_data)

    # Get top predictions
    top_indices = np.argsort(predictions)[::-1][:3]

    print("\n" + "="*50)
    print("🌱 AGRIVISION DIAGNOSTIC RESULT")
    print("="*50)

    top_1_idx = top_indices[0]
    top_1_class = class_names[top_1_idx] if class_names else f"Class #{top_1_idx}"
    top_1_conf = predictions[top_1_idx] * 100

    print(f"\n🏆 Primary Diagnosis: {top_1_class}")
    print(f"🎯 Confidence Score: {top_1_conf:.2f}%\n")

    print("📊 Top 3 Probabilities:")
    for idx in top_indices:
        c_name = class_names[idx] if class_names else f"Class #{idx}"
        c_prob = predictions[idx] * 100
        print(f"   • {c_name}: {c_prob:.2f}%")

    print("\n" + "="*50)

if __name__ == "__main__":
    main()
