import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from collections import Counter  # <-- Import Counter

# --- 1. Initialize FastAPI App ---
app = FastAPI(
    title="Nebula Lens API",
    description="API for cosmic object classification.",
    version="1.0.0"
)

# --- 2. Configure CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. Define the Input Data Model (6 Features) ---
class CosmicFeatures(BaseModel):
    u: float
    g: float
    r: float
    i: float
    z: float
    redshift: float

# --- 4. Load The Models AND THE SCALER ---
models_path = "./models/"
try:
    scaler_path = os.path.join(models_path, 'star_classifier_scaler.joblib')
    scaler = joblib.load(scaler_path)
    
    model_svm = joblib.load(os.path.join(models_path, 'model_svm.joblib'))
    model_mlp = joblib.load(os.path.join(models_path, 'model_mlp.joblib'))
    model_knn = joblib.load(os.path.join(models_path, 'model_knn.joblib'))
    model_rf = joblib.load(os.path.join(models_path, 'model_rf.joblib'))
    
    models = {
        "svm": model_svm,
        "mlp": model_mlp,
        "knn": model_knn,
        "rf": model_rf
    }
    print("Scaler and all models loaded successfully.")
except Exception as e:
    print(f"CRITICAL ERROR loading models or scaler: {e}")
    scaler = None
    models = {}

# --- 5. Define the Prediction Endpoint ---
@app.post("/predict")
async def predict(features: CosmicFeatures):
    if not models or not scaler:
        return {"error": "Models or Scaler are not loaded. Check backend server logs."}

    try:
        input_data = [
            features.u, features.g, features.r,
            features.i, features.z, features.redshift
        ]
        input_array = np.array(input_data).reshape(1, -1)
    except Exception as e:
        return {"error": f"Error creating input array: {e}"}

    try:
        input_scaled = scaler.transform(input_array)
    except Exception as e:
        return {"error": f"Error during data scaling: {e}"}

    predictions = {}
    for model_name, model in models.items():
        try:
            prediction_result = model.predict(input_scaled)[0]
            predictions[model_name] = prediction_result
        except Exception as e:
            predictions[model_name] = f"Error: {e}"

    # --- NEW: Calculate Model Agreement ---
    prediction_list = list(predictions.values())
    # Find the most common prediction and its count
    most_common = Counter(prediction_list).most_common(1)[0]
    agreement_prediction = most_common[0]
    agreement_count = most_common[1]
    
    model_agreement = {
        "prediction": agreement_prediction,
        "count": agreement_count,
        "total": len(prediction_list)
    }

    # --- (Placeholder) Performance Metrics ---
    # !! Remember to ask your friend for the real Precision/Recall/F1 values !!
    performance_metrics = {
        "svm": {"accuracy": 0.92, "precision": 0.91, "recall": 0.92, "f1_score": 0.91},
        "mlp": {"accuracy": 0.95, "precision": 0.94, "recall": 0.95, "f1_score": 0.94},
        "knn": {"accuracy": 0.89, "precision": 0.88, "recall": 0.89, "f1_score": 0.88},
        "rf": {"accuracy": 0.97, "precision": 0.97, "recall": 0.97, "f1_score": 0.97}
    }

    # --- Return the Full Response (with agreement) ---
    return {
        "predictions": predictions,
        "performance": performance_metrics,
        "model_agreement": model_agreement,  # <-- NEW
        "input_features": features.dict()
    }

# --- NEW: Feature Importance Endpoint ---
# This endpoint returns the feature importance from the Random Forest model
@app.get("/feature_importance")
def get_feature_importance():
    if not models or 'rf' not in models:
        return {"error": "Random Forest model not loaded."}
    
    try:
        rf_model = models['rf']
        importances = rf_model.feature_importances_
        feature_names = ['u', 'g', 'r', 'i', 'z', 'redshift']
        
        # Zip, sort by importance, and return as a dict
        zipped_data = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
        sorted_importances = {item[0]: item[1] for item in zipped_data}
        
        return sorted_importances
    except Exception as e:
        return {"error": f"Could not get feature importance: {e}"}


@app.get("/")
def read_root():
    return {"message": "Welcome to the Nebula Lens API!"}