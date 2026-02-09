#!/usr/bin/env python3

import joblib
import pandas as pd
import numpy as np

print("Loading model...")
try:
    MODEL_PATH = 'models/best_model_Advanced.joblib'
    model = joblib.load(MODEL_PATH)
    print(f"Model loaded successfully: {type(model)}")
    
    # Test input
    input_dict = {
        'Age': 25,
        'BMI': 22.9,
        'Carb_ratio': 0.40,
        'Protein_ratio': 0.30,
        'Fat_ratio': 0.30
    }
    
    print("Creating DataFrame...")
    df = pd.DataFrame([input_dict])
    print(f"DataFrame shape: {df.shape}")
    print(f"DataFrame columns: {df.columns.tolist()}")
    
    # Get expected features
    expected_features = None
    if hasattr(model, 'feature_names_'):
        expected_features = list(model.feature_names_)
        print(f"Model feature_names_: {expected_features}")
    elif hasattr(model, 'estimators_') and hasattr(model.estimators_[0], 'feature_names_'):
        expected_features = list(model.estimators_[0].feature_names_)
        print(f"Estimator feature_names_: {expected_features}")
    else:
        print("No feature names found")
    
    if expected_features:
        print("Adding missing features...")
        for col in expected_features:
            if col not in df.columns:
                df[col] = 0
        df = df[expected_features]
        print(f"Final DataFrame shape: {df.shape}")
    
    print("Making prediction...")
    prediction = model.predict(df)
    print(f"Prediction shape: {prediction.shape}")
    print(f"Prediction: {prediction}")
    
    if prediction.ndim > 1:
        prediction = prediction[0]
    
    protein, carbs, fat = prediction
    calories = (protein * 4) + (carbs * 4) + (fat * 9)
    
    print(f"Results:")
    print(f"  Calories: {calories:.0f} kcal")
    print(f"  Protein: {protein:.1f} g")
    print(f"  Carbs: {carbs:.1f} g")
    print(f"  Fat: {fat:.1f} g")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
