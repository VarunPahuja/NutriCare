from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pathlib import Path

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Deployment-safe model loading using relative path
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "best_model_Advanced.joblib"
model = joblib.load(MODEL_PATH)

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    df = pd.DataFrame([data])

    # Ensure columns match model expectations
    expected_features = None
    if hasattr(model, 'feature_names_'):
        expected_features = list(model.feature_names_)
    elif hasattr(model, 'estimators_') and hasattr(model.estimators_[0], 'feature_names_'):
        expected_features = list(model.estimators_[0].feature_names_)

    if expected_features is not None:
        for col in expected_features:
            if col not in df.columns:
                df[col] = 0
        df = df[expected_features]

    prediction = model.predict(df)[0]
    protein, carbs, fat = prediction
    calories = protein*4 + carbs*4 + fat*9
    return {"protein": protein, "carbs": carbs, "fat": fat, "calories": calories}
