# AgriVision Machine Learning Pipeline 🌿🤖

This folder contains the complete Machine Learning (ML) training pipeline, inference scripts, and TensorFlow Lite conversion tools for **AgriVision** crop disease detection.

---

## 📋 Directory Overview

| File | Description |
| :--- | :--- |
| **`train.py`** | Trains a MobileNetV2 transfer learning model on PlantVillage, fine-tunes top layers, evaluates test accuracy, saves `.keras` model, and exports `.tflite` model. |
| **`predict.py`** | Runs single leaf image inference using either TFLite model (`agrivision_model.tflite`) or Keras SavedModel. |
| **`requirements.txt`** | Python dependencies required for training, data processing, and TFLite export. |
| **`README.md`** | Step-by-step setup and execution guide for VS Code users. |

---

## 🛠️ Step 1: VS Code Environment Setup

1. Open VS Code and open the workspace terminal (`Ctrl + ~`).
2. Navigate to the `ml` folder:
   ```bash
   cd ml
   ```
3. Create a Python Virtual Environment:
   - **Windows (PowerShell / Command Prompt)**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
4. Select the Python Interpreter in VS Code:
   - Press `Ctrl + Shift + P` (or `Cmd + Shift + P` on Mac).
   - Type `Python: Select Interpreter`.
   - Select `ml/venv/Scripts/python.exe` (or `ml/venv/bin/python`).

5. Upgrade `pip` and install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

---

## 🌾 Step 2: Download PlantVillage Dataset

To train the model, download the **PlantVillage** dataset:

1. **Option A: Kaggle CLI (Recommended)**:
   ```bash
   pip install kaggle
   kaggle datasets download -d emmarex/plantdisease
   unzip plantdisease.zip -d ./plantvillage
   ```

2. **Option B: Direct Download**:
   - Download PlantVillage from Kaggle: [PlantVillage Dataset on Kaggle](https://www.kaggle.com/datasets/emmarex/plantdisease)
   - Extract the dataset folder into `ml/plantvillage/` so the directory structure looks like:
     ```text
     ml/
     ├── plantvillage/
     │   ├── Tomato___Early_blight/
     │   ├── Corn_(maize)___Common_rust_/
     │   ├── Potato___Late_blight/
     │   └── ...
     ├── train.py
     ├── predict.py
     └── requirements.txt
     ```

---

## 🚀 Step 3: Run Model Training (`train.py`)

Run the training pipeline script:

```bash
python train.py --data_dir ./plantvillage --epochs 20 --batch_size 32
```

### Key Training Options:
- `--data_dir`: Path to dataset folder (default: `./plantvillage`).
- `--img_size`: Input resolution (default: `224`).
- `--batch_size`: Batch size (default: `32`).
- `--epochs`: Total training epochs (default: `20`).
- `--output_dir`: Output directory for models (default: `./models`).

### Output Artifacts Generated in `ml/models/`:
1. `agrivision_model.keras`: Full Keras model.
2. `agrivision_model.tflite`: Quantized MobileNetV2 TensorFlow Lite model (< 10 MB) ready for offline browser / mobile deployment.
3. `class_names.json`: JSON mapping of all crop disease labels.

---

## 🔍 Step 4: Run Single Image Inference (`predict.py`)

Test disease diagnosis on any leaf image file:

```bash
python predict.py --image path/to/sample_leaf.jpg --model ./models/agrivision_model.tflite
```

### Sample Output:
```text
==================================================
🌱 AGRIVISION DIAGNOSTIC RESULT
==================================================

🏆 Primary Diagnosis: Tomato___Early_blight
🎯 Confidence Score: 97.45%

📊 Top 3 Probabilities:
   • Tomato___Early_blight: 97.45%
   • Tomato___Late_blight: 2.10%
   • Tomato___Healthy: 0.45%
==================================================
```

---

## 📲 Step 5: Exporting TFLite for Offline Frontend Deployment

Once `agrivision_model.tflite` and `class_names.json` are created in `ml/models/`:
1. Copy `agrivision_model.tflite` to `public/models/agrivision_model.tflite`.
2. Use `@tensorflow/tfjs-tflite` or standard TFLite web runtime in the frontend for 100% offline edge inference!
