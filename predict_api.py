from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import joblib
import pandas as pd
import os
import json
from pathlib import Path
from typing import Optional, Dict, Any

# Load environment variables from .env file
load_dotenv()

# Debug: confirm environment variable loading
print("OpenRouter key loaded:", bool(os.getenv("OPENROUTER_API_KEY")))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)

def process_llm_response(response_text: str) -> dict:
    """Post-process LLM response into structured JSON sections"""
    try:
        # Remove markdown symbols
        cleaned_text = response_text.replace("##", "").replace("**", "").replace("*", "")
        
        # Initialize variables
        summary_text = ""
        recommendations_list = []
        cautions_list = []
        
        # Split into lines and process
        lines = cleaned_text.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Detect section headers
            if "Summary" in line:
                current_section = "summary"
                continue
            elif "Key Recommendations" in line:
                current_section = "recommendations"
                continue
            elif "What To Be Careful About" in line:
                current_section = "cautions"
                continue
            
            # Process content based on current section
            if current_section == "summary":
                if line and not line.startswith("-"):
                    summary_text += line + " "
            elif current_section == "recommendations":
                if line.startswith("-") and len(recommendations_list) < 5:
                    recommendations_list.append(line[1:].strip())
            elif current_section == "cautions":
                if line.startswith("-") and len(cautions_list) < 4:
                    cautions_list.append(line[1:].strip())
        
        return {
            "summary": summary_text.strip(),
            "recommendations": recommendations_list,
            "cautions": cautions_list
        }
    
    except Exception:
        # Fallback if parsing fails
        return {
            "summary": response_text[:300],
            "recommendations": [],
            "cautions": []
        }

# OpenRouter API configuration
class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

# Configure OpenRouter client
client = None
if os.getenv("OPENROUTER_API_KEY"):
    client = OpenAI(
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1"
    )

# Deployment-safe model loading using relative path
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

@app.post("/chat")
async def chat(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="OpenRouter API not configured")

    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not set")

    system_prompt = """You are a clinical nutrition assistant. Provide concise, helpful nutrition advice. Keep responses under 200 words. Be direct and practical."""

    user_message = ""
    if request.context:
        for key, val in request.context.items():
            if val:
                user_message += f"{key}: {val}\n"
        user_message += "\n"

    user_message += request.message

    def generate():
        try:
            stream = client.chat.completions.create(
                model="nvidia/nemotron-3-super-120b-a12b:free",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                stream=True,
                max_tokens=400,
            )

            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield f"data: {json.dumps({'content': delta})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )
