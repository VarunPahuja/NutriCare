import joblib
import pandas as pd
import numpy as np

# Load the trained model
MODEL_PATH = 'models/best_model_Advanced.joblib'
model = joblib.load(MODEL_PATH)

def predict_nutrition(input_dict):
    """
    Accepts a dictionary of feature values, converts to DataFrame, predicts macros and derives calories.
    Adds any missing features (with value 0) expected by the model.
    Args:
        input_dict (dict): Feature values for prediction.
    Returns:
        dict: Prediction results with calories derived from macros.
    """
    df = pd.DataFrame([input_dict])
    # Get expected feature names from the model (CatBoost stores them in feature_names_)
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
    # Ensure all columns are numeric (optional, for safety)
    df = df.apply(pd.to_numeric, errors='coerce').fillna(0)
    
    # Predict only macros (protein, carbs, fat)
    prediction = model.predict(df)[0]  # Get first (and only) row
    protein, carbs, fat = prediction
    
    # Derive calories using nutrition science standard: 4 kcal/g for protein and carbs, 9 kcal/g for fat
    calories = (protein * 4) + (carbs * 4) + (fat * 9)
    
    return {
        'calories': calories,
        'protein': protein,
        'carbs': carbs,
        'fat': fat
    }

def predict_calories(input_dict):
    """
    Legacy function name for backward compatibility.
    Returns numpy array format [calories, protein, carbs, fat] as expected by existing code.
    """
    result = predict_nutrition(input_dict)
    return np.array([result['calories'], result['protein'], result['carbs'], result['fat']])
