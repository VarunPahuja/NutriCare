from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import json
from pathlib import Path
from typing import Optional, Dict, Any

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)


class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "best_model_Advanced.joblib"
model = joblib.load(MODEL_PATH)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    df = pd.DataFrame([data])

    expected_features = None
    if hasattr(model, "feature_names_"):
        expected_features = list(model.feature_names_)
    elif hasattr(model, "estimators_") and hasattr(model.estimators_[0], "feature_names_"):
        expected_features = list(model.estimators_[0].feature_names_)

    if expected_features is not None:
        for col in expected_features:
            if col not in df.columns:
                df[col] = 0
        df = df[expected_features]

    prediction = model.predict(df)[0]
    protein, carbs, fat = prediction
    calories = protein * 4 + carbs * 4 + fat * 9
    return {"protein": protein, "carbs": carbs, "fat": fat, "calories": calories}


@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    # Placeholder deterministic assistant text; OPENAI_API_KEY can be plugged in later server-side.
    goal = (request.context or {}).get("goal")
    activity = (request.context or {}).get("activity")
    conditions = (request.context or {}).get("conditions")

    points = [
        "Focus meals around lean protein, vegetables, and high-fiber carbs.",
        "Keep hydration and meal timing consistent throughout the week.",
        "Track progress weekly and adjust portions gradually, not aggressively.",
    ]
    if goal:
        points.append(f"Align intake to your goal: {goal}.")
    if activity:
        points.append(f"Fuel around activity level: {activity}.")
    if conditions:
        points.append(f"Given conditions ({conditions}), verify major changes with your doctor.")

    response_text = "\n".join([f"- {point}" for point in points])

    def generate():
        try:
            for line in response_text.split("\n"):
                yield f"data: {json.dumps({'content': line + '\\n'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
