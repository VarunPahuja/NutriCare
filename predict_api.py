from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import joblib
import pandas as pd
import os
from pathlib import Path
from typing import Optional, Dict, Any

# Load environment variables from .env file
load_dotenv()

# Debug: confirm environment variable loading
print("OpenRouter key loaded:", bool(os.getenv("OPENROUTER_API_KEY")))

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

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
    if not os.getenv("OPENROUTER_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY environment variable not set")
    
    if not client:
        raise HTTPException(status_code=500, detail="OpenRouter API not available")
    
    # Construct system prompt
    system_prompt = """You are a clinical nutrition assistant.
Use the provided user profile to generate personalized advice.
Do NOT ask follow-up questions.
Do NOT ask for more details.
Do NOT repeat general questionnaire.
Provide concise, structured advice.

Format response strictly as:

## Summary
(2-3 sentences personalized)

## Key Recommendations
- Bullet points

## What To Be Careful About
- Bullet points

Keep under 300 words."""
    
    # Build user message with profile if available
    user_message = ""
    if request.context:
        age = request.context.get('age')
        weight = request.context.get('weight')
        activity = request.context.get('activity')
        goal = request.context.get('goal')
        conditions = request.context.get('conditions', [])
        
        user_message += "User Profile:\n"
        if age:
            user_message += f"Age: {age}\n"
        if weight:
            user_message += f"Weight: {weight} kg\n"
        if activity:
            user_message += f"Activity: {activity}\n"
        if goal:
            user_message += f"Goal: {goal}\n"
        if conditions:
            user_message += f"Conditions: {', '.join(conditions)}\n"
        user_message += "\n"
    
    user_message += request.message
    
    try:
        response = client.chat.completions.create(
            model="mistralai/mistral-7b-instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        
        # Get raw response text
        raw_response = response.choices[0].message.content
        
        # Post-process into structured JSON
        structured_response = process_llm_response(raw_response)
        
        return structured_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenRouter API error: {str(e)}")
