import joblib
import pandas as pd
import numpy as np

# Load the trained model
MODEL_PATH = 'models/best_model_Advanced.joblib'
model = joblib.load(MODEL_PATH)

def predict_calories(input_dict):
    """
    Accepts a dictionary of feature values, converts to DataFrame, predicts calories.
    Adds any missing features (with value 0) expected by the model.
    Args:
        input_dict (dict): Feature values for prediction.
    Returns:
        np.ndarray: Model prediction(s).
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
    prediction = model.predict(df)
    return prediction
