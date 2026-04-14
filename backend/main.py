from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import json
import traceback
from pathlib import Path
from typing import Optional, Dict, Any
from groq import Groq
from dotenv import load_dotenv

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

# Load .env from backend/ first, then fall back to root
load_dotenv(dotenv_path=BASE_DIR / ".env")
load_dotenv(dotenv_path=BASE_DIR.parent / ".env")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
print(f"Groq key loaded: {bool(GROQ_API_KEY)}")

groq_client = None
if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)

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
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq API key not configured")

    system_prompt = """You are a clinical nutrition assistant for NutriCare, a health platform for patients in India.

Rules:
- Always give advice specific to the user's health conditions, goals, and location
- Suggest Indian foods and meals where relevant (dal, roti, sabzi, idli, etc.)
- If the user has diabetes: emphasize low glycemic index foods, avoid sugar, limit white rice/maida
- If the user has hypertension: emphasize low sodium, potassium-rich foods
- If the user has heart disease: emphasize omega-3, low saturated fat
- Reference their workout data and medication if provided in context
- Be specific, not generic - no generic "eat protein, carbs and fat" advice
- Keep responses under 200 words
- Format with bullet points for readability
"""

    user_message = ""
    if request.context:
        user_message += "=== Patient Profile ===\n"
        if request.context.get('name'):
            user_message += f"Name: {request.context['name']}\n"
        if request.context.get('age'):
            user_message += f"Age: {request.context['age']}\n"
        if request.context.get('weight'):
            user_message += f"Weight: {request.context['weight']} kg\n"
        if request.context.get('activity'):
            user_message += f"Activity level: {request.context['activity']}\n"
        if request.context.get('goal'):
            user_message += f"Health goal: {request.context['goal']}\n"
        if request.context.get('conditions'):
            user_message += f"Medical conditions: {request.context['conditions']}\n"
        if request.context.get('location'):
            user_message += f"Location: {request.context['location']}\n"
        if request.context.get('medications'):
            user_message += f"Current medications: {request.context['medications']}\n"
        if request.context.get('recent_workouts'):
            user_message += f"Recent workouts: {request.context['recent_workouts']}\n"
        if request.context.get('last_prediction'):
            user_message += f"Last nutrition target: {request.context['last_prediction']}\n"
        user_message += "======================\n\n"

    user_message += f"Patient question: {request.message}"

    def generate():
        try:
            stream = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                stream=True,
                max_tokens=300,
            )
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    delta = chunk.choices[0].delta.content
                    yield f"data: {json.dumps({'content': delta})}\n\n"
        except Exception as e:
            traceback.print_exc()
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
        }
    )
