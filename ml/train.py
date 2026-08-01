import os
import json
import argparse
import numpy as np
from PIL import Image, ImageDraw
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

def parse_args():
    parser = argparse.ArgumentParser(description="Train MobileNetV2 Crop Disease Detection Model for AgriVision")
    parser.add_argument("--data_dir", type=str, default="./plantvillage", help="Path to PlantVillage dataset root directory")
    parser.add_argument("--img_size", type=int, default=224, help="Target image size (height & width)")
    parser.add_argument("--batch_size", type=int, default=32, help="Training batch size")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
    parser.add_argument("--output_dir", type=str, default="./models", help="Directory to save trained models")
    return parser.parse_args()

def create_sample_dataset(data_dir, img_size=224):
    """
    Creates a sample demonstration dataset structure if no local dataset is found,
    allowing `python train.py` to run out of the box without crashing.
    """
    print(f"\n⚠️ Dataset directory '{data_dir}' not found or empty.")
    print("🌱 Automatically generating sample crop dataset in './plantvillage' for out-of-the-box testing...")
    
    sample_classes = [
        "Tomato___Early_blight",
        "Tomato___Healthy",
        "Corn_(maize)___Common_rust_",
        "Potato___Late_blight"
    ]

    np.random.seed(42)

    for class_name in sample_classes:
        class_path = os.path.join(data_dir, class_name)
        os.makedirs(class_path, exist_ok=True)
        
        # Generate 15 sample images per class
        for i in range(15):
            img = Image.new("RGB", (img_size, img_size), color=(34, 139, 34))
            draw = ImageDraw.Draw(img)
            
            # Add synthetic spots/patterns based on disease
            if "Early_blight" in class_name or "Late_blight" in class_name:
                for _ in range(10):
                    x = np.random.randint(20, img_size - 20)
                    y = np.random.randint(20, img_size - 20)
                    r = np.random.randint(5, 20)
                    draw.ellipse([x-r, y-r, x+r, y+r], fill=(139, 69, 19))
            elif "rust" in class_name:
                for _ in range(15):
                    x = np.random.randint(20, img_size - 20)
                    y = np.random.randint(20, img_size - 20)
                    r = np.random.randint(3, 10)
                    draw.ellipse([x-r, y-r, x+r, y+r], fill=(218, 165, 32))
            
            img.save(os.path.join(class_path, f"sample_{i+1}.jpg"))

    print(f"✅ Generated sample dataset at: {data_dir} ({len(sample_classes)} classes)")
    print("💡 Tip: Replace files in './plantvillage' with full PlantVillage dataset for production model accuracy.\n")

def resolve_dataset_dir(data_dir, img_size):
    """
    Resolves dataset directory path, handling missing folders or nested folder structures.
    """
    if not os.path.exists(data_dir) or len(os.listdir(data_dir)) == 0:
        create_sample_dataset(data_dir, img_size)
        return data_dir

    # Check if data_dir contains category subfolders with images
    subdirs = [d for d in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, d))]
    
    has_images = False
    for sd in subdirs:
        sd_path = os.path.join(data_dir, sd)
        try:
            files = [f for f in os.listdir(sd_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
            if files:
                has_images = True
                break
        except Exception:
            continue

    if has_images:
        return data_dir

    # Search 1 level deeper for nested extracted folders (e.g. ./plantvillage/PlantVillage or ./plantvillage/color)
    for sd in subdirs:
        nested_path = os.path.join(data_dir, sd)
        try:
            nested_subdirs = [d for d in os.listdir(nested_path) if os.path.isdir(os.path.join(nested_path, d))]
            for nsd in nested_subdirs:
                nsd_path = os.path.join(nested_path, nsd)
                files = [f for f in os.listdir(nsd_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
                if files:
                    print(f"🔍 Auto-detected nested dataset directory: {nested_path}")
                    return nested_path
        except Exception:
            continue

    # If empty or invalid, create sample dataset
    create_sample_dataset(data_dir, img_size)
    return data_dir

def load_and_split_dataset(data_dir, img_size, batch_size):
    """
    Loads PlantVillage dataset and splits into Train (70%), Validation (15%), and Test (15%).
    """
    dataset_path = resolve_dataset_dir(data_dir, img_size)
    print(f"📁 Loading dataset from: {dataset_path}")

    # Load dataset
    full_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_path,
        shuffle=True,
        image_size=(img_size, img_size),
        batch_size=batch_size,
        label_mode='categorical'
    )

    class_names = full_ds.class_names
    num_classes = len(class_names)
    print(f"🌱 Total Crop Classes Found ({num_classes}): {class_names}")

    # Calculate dataset splits
    ds_batches = tf.data.experimental.cardinality(full_ds).numpy()
    
    if ds_batches <= 2:
        train_ds = full_ds
        val_ds = full_ds
        test_ds = full_ds
        print(f"📊 Dataset Batches ({ds_batches}) - Using for Train/Val/Test")
    else:
        train_size = max(1, int(0.70 * ds_batches))
        val_size = max(1, int(0.15 * ds_batches))
        test_size = max(1, ds_batches - train_size - val_size)

        train_ds = full_ds.take(train_size)
        val_ds = full_ds.skip(train_size).take(val_size)
        test_ds = full_ds.skip(train_size + val_size)
        print(f"📊 Dataset Batches Split -> Train: {train_size}, Validation: {val_size}, Test: {test_size}")

    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)
    test_ds = test_ds.cache().prefetch(buffer_size=AUTOTUNE)

    return train_ds, val_ds, test_ds, class_names

def build_mobilenetv2_model(img_size, num_classes):
    """
    Builds a MobileNetV2 transfer learning model optimized for crop disease identification.
    """
    data_augmentation = tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
        layers.RandomContrast(0.2),
    ], name="data_augmentation")

    base_model = MobileNetV2(
        input_shape=(img_size, img_size, 3),
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False

    inputs = tf.keras.Input(shape=(img_size, img_size, 3))
    x = data_augmentation(inputs)
    x = preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

    model = models.Model(inputs, outputs, name="AgriVision_MobileNetV2")

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy", tf.keras.metrics.TopKCategoricalAccuracy(k=min(3, num_classes), name="top_3_accuracy")]
    )

    return model, base_model

def train_model(model, train_ds, val_ds, epochs, output_dir):
    """
    Trains the model with EarlyStopping and ReduceLROnPlateau callbacks.
    """
    os.makedirs(output_dir, exist_ok=True)
    checkpoint_path = os.path.join(output_dir, "best_agrivision_model.keras")

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=5, restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=2, verbose=1, min_lr=1e-6
        ),
        tf.keras.callbacks.ModelCheckpoint(
            checkpoint_path, monitor="val_accuracy", save_best_only=True, verbose=1
        )
    ]

    print("\n🚀 Starting Initial Phase (Transfer Learning)...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        callbacks=callbacks
    )

    return history, checkpoint_path

def convert_to_tflite(model, output_dir):
    """
    Converts trained Keras model to TensorFlow Lite (.tflite) for browser/mobile offline inference.
    """
    print("\n⚡ Converting Model to TensorFlow Lite (.tflite)...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    tflite_model = converter.convert()

    tflite_path = os.path.join(output_dir, "agrivision_model.tflite")
    with open(tflite_path, "wb") as f:
        f.write(tflite_model)

    size_mb = os.path.getsize(tflite_path) / (1024 * 1024)
    print(f"✅ TFLite Model successfully saved to: {tflite_path} ({size_mb:.2f} MB)")
    return tflite_path

def main():
    args = parse_args()

    # Disable oneDNN verbosity if desired
    os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

    # Load dataset
    train_ds, val_ds, test_ds, class_names = load_and_split_dataset(
        args.data_dir, args.img_size, args.batch_size
    )

    # Save class names mapping
    os.makedirs(args.output_dir, exist_ok=True)
    class_map_path = os.path.join(args.output_dir, "class_names.json")
    with open(class_map_path, "w") as f:
        json.dump(class_names, f, indent=2)
    print(f"📝 Class names saved to: {class_map_path}")

    # Build model
    model, base_model = build_mobilenetv2_model(args.img_size, len(class_names))
    model.summary()

    # Train initial top layers
    history, best_model_path = train_model(
        model, train_ds, val_ds, args.epochs, args.output_dir
    )

    # Fine-tuning phase
    print("\n🔓 Starting Fine-Tuning Phase (Unfreezing MobileNetV2 top layers)...")
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy", tf.keras.metrics.TopKCategoricalAccuracy(k=min(3, len(class_names)), name="top_3_accuracy")]
    )

    fine_tune_epochs = min(5, args.epochs)
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=fine_tune_epochs,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(monitor="val_loss", patience=3, restore_best_weights=True)
        ]
    )

    # Evaluate on test dataset
    print("\n🧪 Evaluating Final Model on Test Dataset...")
    test_results = model.evaluate(test_ds)
    print(f"🎯 Test Loss: {test_results[0]:.4f} | Test Accuracy: {test_results[1]*100:.2f}%")

    # Save final Keras model
    final_model_path = os.path.join(args.output_dir, "agrivision_model.keras")
    model.save(final_model_path)
    print(f"💾 Full Keras Model saved to: {final_model_path}")

    # Convert to TFLite
    convert_to_tflite(model, args.output_dir)

    print("\n🎉 Training Pipeline Completed Successfully!")

if __name__ == "__main__":
    main()
