# FastAPI ML Backend Setup & Running Guide
## How to Run Your NutriCare ML Prediction API

---

## 📋 OVERVIEW

Your FastAPI backend (`predict_api.py`) serves the ML model that predicts personalized nutrition recommendations (Protein, Carbs, Fat). This guide covers setup, running, testing, and troubleshooting.

**Current Setup:**
- **Backend:** FastAPI (Python)
- **ML Model:** CatBoost (saved as `best_model_Advanced.joblib`)
- **Frontend:** React (port 8080)
- **Backend Port:** 8000
- **Endpoint:** `POST http://localhost:8000/predict`

---

## STEP 1: Check Python Environment

### 1.1 Verify Python Installation

Open PowerShell and check Python version:

```powershell
python --version
# Should show: Python 3.8+ (preferably 3.10 or 3.11)
```

If not installed, download from [python.org](https://www.python.org/downloads/)

### 1.2 Check Virtual Environment

Your project already has a `.venv` folder. Activate it:

```powershell
# Navigate to your project
cd D:\Coding\NutriCare\NutriCare

# Activate virtual environment
.\.venv\Scripts\Activate.ps1
```

You should see `(.venv)` prefix in your terminal:
```
(.venv) PS D:\Coding\NutriCare\NutriCare>
```

**Troubleshooting:** If activation fails with "execution policy" error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## STEP 2: Install Required Dependencies

### 2.1 Create requirements.txt

Create `requirements.txt` file in your project root:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
joblib==1.3.2
pandas==2.1.3
numpy==1.26.2
scikit-learn==1.3.2
catboost==1.2.2
xgboost==2.0.2
python-multipart==0.0.6
```

### 2.2 Install Dependencies

With your virtual environment activated:

```powershell
# Make sure .venv is activated (you should see (.venv) prefix)
pip install -r requirements.txt
```

This will install:
- ✅ **FastAPI** - Web framework
- ✅ **Uvicorn** - ASGI server to run FastAPI
- ✅ **Joblib** - Load saved ML models
- ✅ **Pandas** - Data manipulation
- ✅ **Scikit-learn** - ML library
- ✅ **CatBoost** - Your ML model
- ✅ **XGBoost** - Additional ML model

**Installation time:** 2-5 minutes

---

## STEP 3: Verify Model Files

### 3.1 Check Model Exists

Your ML model should be at: `models/best_model_Advanced.joblib`

```powershell
# Check if model file exists
Test-Path .\models\best_model_Advanced.joblib
# Should return: True
```

If **False**, you need to train the model first:
```powershell
python Dataset/advanced_models.py
```

### 3.2 Check Model Size

```powershell
# Check model file size
(Get-Item .\models\best_model_Advanced.joblib).Length / 1MB
# Should be ~5-50 MB
```

---

## STEP 4: Run FastAPI Backend

### 4.1 Start the Server

**Method 1: Direct Command (Recommended)**

```powershell
# Make sure .venv is activated
uvicorn predict_api:app --reload --port 8000
```

**Method 2: With Host Binding (if Method 1 fails)**

```powershell
uvicorn predict_api:app --reload --host 0.0.0.0 --port 8000
```

**Method 3: Python Module**

```powershell
python -m uvicorn predict_api:app --reload --port 8000
```

### 4.2 Verify Server is Running

You should see output like:

```
INFO:     Will watch for changes in these directories: ['D:\\Coding\\NutriCare\\NutriCare']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [67890]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Success Signs:**
- ✅ No error messages
- ✅ Shows "Uvicorn running on http://127.0.0.1:8000"
- ✅ Shows "Application startup complete"

---

## STEP 5: Test the API

### 5.1 Open FastAPI Swagger Docs

Open your browser and go to:
```
http://localhost:8000/docs
```

You should see:
- **FastAPI** interactive documentation
- **POST /predict** endpoint

### 5.2 Test with Swagger UI

1. Click on **POST /predict**
2. Click **"Try it out"**
3. Replace the request body with:

```json
{
  "Age": 25,
  "BMI": 22.5,
  "Carb_ratio": 0.45,
  "Protein_ratio": 0.25,
  "Fat_ratio": 0.30,
  "Chronic_Disease_Diabetes": 0,
  "Chronic_Disease_Hypertension": 0,
  "Gender_Male": 1
}
```

4. Click **"Execute"**
5. You should see a response like:

```json
{
  "protein": 120.5,
  "carbs": 180.3,
  "fat": 65.2,
  "calories": 1789.5
}
```

### 5.3 Test with PowerShell (Alternative)

```powershell
# Test API with curl
curl -X POST "http://localhost:8000/predict" `
  -H "Content-Type: application/json" `
  -d '{
    "Age": 25,
    "BMI": 22.5,
    "Carb_ratio": 0.45,
    "Protein_ratio": 0.25,
    "Fat_ratio": 0.30,
    "Chronic_Disease_Diabetes": 0,
    "Chronic_Disease_Hypertension": 0,
    "Gender_Male": 1
  }'
```

---

## STEP 6: Connect Frontend to Backend

### 6.1 Start React Frontend

Open **SECOND PowerShell terminal** (don't close the FastAPI terminal!):

```powershell
cd D:\Coding\NutriCare\NutriCare
npm run dev
```

Frontend should start on: `http://localhost:8080`

### 6.2 Test Full Integration

1. Go to `http://localhost:8080/dashboard`
2. Find the **Nutrition Prediction** widget
3. Fill in the form:
   - Age: 25
   - Height: 170 cm
   - Weight: 70 kg
   - Gender: Male
   - Activity Level: Moderate
   - Goal: Maintain Weight
   - Chronic Disease: None
4. Click **"Predict Nutrition"**
5. You should see results instantly!

---

## STEP 7: Common Issues & Solutions

### Issue 1: "uvicorn: command not found"

**Solution:**
```powershell
# Make sure .venv is activated
.\.venv\Scripts\Activate.ps1

# Reinstall uvicorn
pip install uvicorn
```

### Issue 2: "ModuleNotFoundError: No module named 'fastapi'"

**Solution:**
```powershell
# Install missing package
pip install fastapi uvicorn
```

### Issue 3: "FileNotFoundError: models/best_model_Advanced.joblib"

**Solution:**
```powershell
# Train the model first
python Dataset/advanced_models.py

# Or use stacking ensemble
python Dataset/stacking_ensemble.py
```

### Issue 4: "Port 8000 already in use"

**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Or use different port
uvicorn predict_api:app --reload --port 8001
```

### Issue 5: Frontend can't connect to backend (CORS error)

**Solution:** Your `predict_api.py` already has CORS enabled:
```python
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
```
If still having issues, restart both servers.

### Issue 6: "Model predictions are wrong"

**Solution:**
```powershell
# Retrain the model
python Dataset/stacking_ensemble.py

# Or use CatBoost specifically
python Dataset/advanced_models.py
```

---

## STEP 8: Development Workflow

### 8.1 Daily Startup (2 Terminals Needed)

**Terminal 1 - Backend (FastAPI):**
```powershell
cd D:\Coding\NutriCare\NutriCare
.\.venv\Scripts\Activate.ps1
uvicorn predict_api:app --reload --port 8000
```

**Terminal 2 - Frontend (React):**
```powershell
cd D:\Coding\NutriCare\NutriCare
npm run dev
```

### 8.2 Check Both Are Running

- Backend: http://localhost:8000/docs (should show FastAPI docs)
- Frontend: http://localhost:8080 (should show your React app)

### 8.3 Stop Servers

- Press **Ctrl+C** in each terminal
- Deactivate virtual environment: `deactivate`

---

## STEP 9: API Endpoint Details

### POST /predict

**URL:** `http://localhost:8000/predict`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Request Body (Example):**
```json
{
  "Age": 30,
  "BMI": 24.5,
  "Carb_ratio": 0.45,
  "Protein_ratio": 0.30,
  "Fat_ratio": 0.25,
  "Chronic_Disease_Diabetes": 1,
  "Chronic_Disease_Hypertension": 0,
  "Chronic_Disease_Heart_Disease": 0,
  "Chronic_Disease_PCOS": 0,
  "Chronic_Disease_Thyroid": 0,
  "Gender_Male": 0
}
```

**Response (Example):**
```json
{
  "protein": 95.5,
  "carbs": 150.2,
  "fat": 55.8,
  "calories": 1484.6
}
```

**Feature Explanation:**
- `Age`: Patient age (years)
- `BMI`: Body Mass Index (calculated from height/weight)
- `Carb_ratio`: Proportion of carbs (0-1) based on goal
- `Protein_ratio`: Proportion of protein (0-1) based on goal
- `Fat_ratio`: Proportion of fat (0-1) based on goal
- `Chronic_Disease_*`: Binary flags (0 or 1) for each disease
- `Gender_Male`: 1 for Male, 0 for Female

---

## STEP 10: Production Deployment

### 10.1 Deploy to Railway/Render/Heroku

**Option A: Railway (Recommended)**

1. Create `Procfile`:
```
web: uvicorn predict_api:app --host 0.0.0.0 --port $PORT
```

2. Push to GitHub
3. Connect Railway to your repo
4. Set environment variables (if needed)
5. Deploy!

**Option B: Render**

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: nutricare-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn predict_api:app --host 0.0.0.0 --port $PORT
```

2. Connect Render to GitHub
3. Deploy

### 10.2 Update Frontend URL

After deployment, update your React frontend to use production URL:

```typescript
// In NutritionPrediction.tsx
const response = await fetch('https://your-app.railway.app/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```

---

## STEP 11: Performance Monitoring

### 11.1 Add Logging

Update `predict_api.py`:

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/predict")
async def predict(request: Request):
    logger.info("Received prediction request")
    # ... existing code
    logger.info(f"Prediction: P={protein}, C={carbs}, F={fat}")
    return {"protein": protein, "carbs": carbs, "fat": fat, "calories": calories}
```

### 11.2 Monitor Requests

Watch the terminal running FastAPI - you'll see:
```
INFO:     127.0.0.1:54321 - "POST /predict HTTP/1.1" 200 OK
INFO:     Received prediction request
INFO:     Prediction: P=120.5, C=180.3, F=65.2
```

---

## STEP 12: Advanced Features (Optional)

### 12.1 Add Health Check Endpoint

Add to `predict_api.py`:

```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}
```

Test: http://localhost:8000/health

### 12.2 Add Model Metadata Endpoint

```python
@app.get("/model/info")
async def model_info():
    return {
        "model_type": "CatBoost",
        "accuracy": {
            "protein_r2": 0.643,
            "carbs_r2": 0.684,
            "fat_r2": 0.785
        },
        "supported_diseases": [
            "Diabetes", "Hypertension", "Heart Disease", 
            "PCOS", "Thyroid"
        ]
    }
```

### 12.3 Add Input Validation

```python
from pydantic import BaseModel

class PredictionInput(BaseModel):
    Age: int
    BMI: float
    Carb_ratio: float
    Protein_ratio: float
    Fat_ratio: float
    Chronic_Disease_Diabetes: int
    Chronic_Disease_Hypertension: int
    Gender_Male: int

@app.post("/predict")
async def predict(input_data: PredictionInput):
    df = pd.DataFrame([input_data.dict()])
    # ... rest of code
```

---

## 🎯 QUICK REFERENCE COMMANDS

**Start Backend:**
```powershell
.\.venv\Scripts\Activate.ps1
uvicorn predict_api:app --reload --port 8000
```

**Start Frontend:**
```powershell
npm run dev
```

**Test API:**
```
http://localhost:8000/docs
```

**Check Logs:**
- Watch the terminal running FastAPI for request logs

**Stop Server:**
- Press **Ctrl+C**

---

## 📊 TROUBLESHOOTING CHECKLIST

If predictions don't work:

- [ ] Is FastAPI running? (Check http://localhost:8000/docs)
- [ ] Is model file present? (`models/best_model_Advanced.joblib`)
- [ ] Is virtual environment activated? (See `.venv` prefix)
- [ ] Are all dependencies installed? (`pip list | grep fastapi`)
- [ ] Is frontend using correct port? (Should be 8000)
- [ ] Check browser console for errors (F12 → Console tab)
- [ ] Check FastAPI terminal for error messages
- [ ] Try restarting both servers

---

## 💡 Tips for Your Lab Presentation

When demonstrating:

1. **Show FastAPI Docs:** Open `http://localhost:8000/docs` - it looks professional!
2. **Show Real-Time Logs:** Point out the terminal showing prediction requests
3. **Show Integration:** Submit form in React → See request in FastAPI terminal → Get results
4. **Explain CORS:** Mention you configured CORS for frontend-backend communication
5. **Mention Model:** "This CatBoost model achieved 70% average R² score"

**Demo Script:**
> "Our ML model is deployed via FastAPI, a modern Python web framework. When a patient enters their profile, the React frontend sends an HTTP POST request to our FastAPI backend. The backend loads the pre-trained CatBoost model, performs feature alignment, and returns personalized macronutrient predictions in under 500 milliseconds."

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Server Docs](https://www.uvicorn.org/)
- [Joblib for Model Persistence](https://joblib.readthedocs.io/)

---

**Estimated Setup Time:** 10-15 minutes (if all dependencies install smoothly)

**Common Issues Resolution Time:** 5-30 minutes

You're now ready to run your ML-powered nutrition prediction API! 🚀🤖
