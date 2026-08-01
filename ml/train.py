import os
import sys
import json
import argparse
import numpy as np
from PIL import Image, ImageDraw

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2

def parse_args():
    parser = argparse.ArgumentParser(description="Multi-Crop AgriVision AI Model Trainer")
    parser.add_argument("--data_dir", type=str, default="./ml/plantvillage", help="Path to PlantVillage dataset directory")
    parser.add_argument("--img_size", type=int, default=224, help="Input image dimension (224x224)")
    parser.add_argument("--batch_size", type=int, default=16, help="Batch size")
    parser.add_argument("--epochs", type=int, default=15, help="Number of training epochs")
    parser.add_argument("--output_dir", type=str, default="./models", help="Directory to save trained model")
    return parser.parse_args()

SUPPORTED_CROPS = [
    "Tomato", "Potato", "Pepper Bell", "Corn", "Apple",
    "Grape", "Peach", "Strawberry", "Cherry", "Arecanut"
]

def extract_crop_name(class_folder_name):
    clean_name = class_folder_name.replace("(", "").replace(")", "").replace("_", " ")
    for crop in SUPPORTED_CROPS:
        if crop.lower() in clean_name.lower():
            return crop
    return clean_name.split()[0] if clean_name else "Unknown"

def create_sample_multi_crop_dataset(data_dir, img_size=224):
    print(f"\n⚠️ Dataset directory '{data_dir}' not found or empty.")
    print("🌱 Generating multi-crop dataset structure (Tomato, Potato, Corn, Pepper, Arecanut)...")

    sample_classes = [
        "Corn_(maize)___Common_rust_",
        "Potato___Late_blight",
        "Tomato___Early_blight",
        "Tomato___Healthy"
    ]

    np.random.seed(42)

    for class_name in sample_classes:
        class_path = os.path.join(data_dir, class_name)
        os.makedirs(class_path, exist_ok=True)

        for i in range(30):
            # Create distinct synthetic feature patterns per class
            img = Image.new("RGB", (img_size, img_size), color=(34, 139, 34))
            draw = ImageDraw.Draw(img)
            
            if "early_blight" in class_name.lower():
                for _ in range(20):
                    x, y, r = np.random.randint(15, img_size-15), np.random.randint(15, img_size-15), np.random.randint(6, 20)
                    draw.ellipse([x-r, y-r, x+r, y+r], fill=(139, 69, 19), outline=(100, 50, 10))
            elif "late_blight" in class_name.lower():
                for _ in range(25):
                    x, y, r = np.random.randint(10, img_size-10), np.random.randint(10, img_size-10), np.random.randint(8, 25)
                    draw.rectangle([x-r, y-r, x+r, y+r], fill=(70, 40, 20))
            elif "rust" in class_name.lower():
                for _ in range(30):
                    x, y, r = np.random.randint(10, img_size-10), np.random.randint(10, img_size-10), np.random.randint(4, 12)
                    draw.ellipse([x-r, y-r, x+r, y+r], fill=(218, 165, 32))
            elif "healthy" in class_name.lower():
                # Clean healthy green leaf without spots
                for _ in range(5):
                    x, y, r = np.random.randint(20, img_size-20), np.random.randint(20, img_size-20), np.random.randint(10, 30)
                    draw.ellipse([x-r, y-r, x+r, y+r], fill=(46, 139, 87))

            img.save(os.path.join(class_path, f"sample_{i+1}.jpg"))

    print(f"✅ Multi-crop dataset created at '{data_dir}' with {len(sample_classes)} classes.\n")

def main():
    args = parse_args()
    os.makedirs(args.output_dir, exist_ok=True)

    if not os.path.exists(args.data_dir) or len(os.listdir(args.data_dir)) == 0:
        create_sample_multi_crop_dataset(args.data_dir, args.img_size)

    # 1. Load dataset with Keras utility
    train_ds = tf.keras.utils.image_dataset_from_directory(
        args.data_dir,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(args.img_size, args.img_size),
        batch_size=args.batch_size
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        args.data_dir,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(args.img_size, args.img_size),
        batch_size=args.batch_size
    )

    # Store exact class names order matching Keras dataset
    class_folders = train_ds.class_names
    num_classes = len(class_folders)

    print(f"🔍 Dynamically detected {num_classes} crop classes from dataset:")
    class_info_map = {}
    for idx, folder in enumerate(class_folders):
        crop = extract_crop_name(folder)
        disease = folder.replace("___", " - ").replace("_", " ")
        class_info_map[idx] = {
            "folder": folder,
            "crop": crop,
            "disease": disease
        }
        print(f"   [{idx}] Folder: {folder} | Crop: {crop} | Disease: {disease}")

    # Save class mapping metadata for predict.py
    class_map_path = os.path.join(args.output_dir, "class_names.json")
    with open(class_map_path, "w", encoding="utf-8") as f:
        json.dump(class_info_map, f, indent=2)
    print(f"📄 Saved class mapping to {class_map_path}")

    # Data Augmentation Layer
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.15),
        layers.RandomZoom(0.15)
    ])

    # 2. Model Architecture (MobileNetV2 with embedded rescaling)
    inputs = tf.keras.Input(shape=(args.img_size, args.img_size, 3))
    x = data_augmentation(inputs)
    # Rescaling [0, 255] -> [-1, 1] for MobileNetV2
    x = layers.Rescaling(scale=1./127.5, offset=-1.0)(x)

    base_model = MobileNetV2(
        input_shape=(args.img_size, args.img_size, 3),
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False

    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = tf.keras.Model(inputs, outputs)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    checkpoint_path = os.path.join(args.output_dir, "agrivision_model.keras")
    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True),
        tf.keras.callbacks.ModelCheckpoint(checkpoint_path, monitor="val_loss", save_best_only=True)
    ]

    print("\n🚀 Starting Multi-Crop AI Model Training...")
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=args.epochs,
        callbacks=callbacks
    )

    model.save(checkpoint_path)
    print(f"\n✅ Trained Keras model saved at: {checkpoint_path}")

    # Convert to TFLite format
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_model = converter.convert()
    tflite_path = os.path.join(args.output_dir, "agrivision_model.tflite")
    with open(tflite_path, "wb") as f:
        f.write(tflite_model)
    print(f"⚡ Exported TFLite model to: {tflite_path}\n")

if __name__ == "__main__":
    main()
