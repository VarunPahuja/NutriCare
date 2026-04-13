import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
best_r2 = -np.inf
best_model = None
best_model_name = None
os.makedirs('models', exist_ok=True)

from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, StackingRegressor
from sklearn.linear_model import LinearRegression
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
import joblib
import os

# 1. Load data and feature engineering (must match training)
def feature_engineering(df):
    total = df['Recommended_Carbs'] + df['Recommended_Protein'] + df['Recommended_Fats']
    total = total.replace(0, pd.NA)
    df['Carb_ratio'] = df['Recommended_Carbs'] / total
    df['Protein_ratio'] = df['Recommended_Protein'] / total
    df['Fat_ratio'] = df['Recommended_Fats'] / total
    df[['Carb_ratio', 'Protein_ratio', 'Fat_ratio']] = df[['Carb_ratio', 'Protein_ratio', 'Fat_ratio']].fillna(0)
    one_hot_cols = [col for col in ['Chronic_Disease', 'Gender'] if col in df.columns]
    df = pd.get_dummies(df, columns=one_hot_cols, drop_first=True)
    features = ['Age', 'BMI', 'Carb_ratio', 'Protein_ratio', 'Fat_ratio'] + \
               [col for col in df.columns if col.startswith('Chronic_Disease_') or col.startswith('Gender_')]
    features = [f for f in features if f in df.columns]
    return df[features], features

def evaluate(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    return mae, rmse, r2

df = pd.read_csv('data/cleaned_nutricare.csv')
X, features = feature_engineering(df)
# Only predict macros - calories will be derived from macros
target_cols = ['Recommended_Protein', 'Recommended_Carbs', 'Recommended_Fats']
y = df[target_cols]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Define base models (single-output for stacking)
base_models = [
    ('rf', RandomForestRegressor(random_state=42)),
    ('gb', GradientBoostingRegressor(random_state=42)),
    ('xgb', XGBRegressor(random_state=42, verbosity=0)),
    ('cat', CatBoostRegressor(verbose=0, random_state=42))
]

results = []
best_r2 = -np.inf
best_model = None
best_model_name = None

# 3. Train stacking ensemble for each target
ensemble_models = {}
ensemble_preds = []
for i, target in enumerate(target_cols):
    # Fit base models for this target
    base_models_fitted = []
    for name, model in base_models:
        m = model.__class__(**model.get_params())
        m.fit(X_train, y_train[target])
        base_models_fitted.append((name, m))
        y_pred = m.predict(X_test)
        mae, rmse, r2 = evaluate(y_test[target], y_pred)
        results.append({'Model': f'{name}_{target}', 'MAE': mae, 'RMSE': rmse, 'R2': r2})
    # StackingRegressor for this target
    stack = StackingRegressor(
        estimators=base_models_fitted,
        final_estimator=LinearRegression(),
        passthrough=False,
        n_jobs=-1
    )
    stack.fit(X_train, y_train[target])
    y_pred_stack = stack.predict(X_test)
    ensemble_preds.append(y_pred_stack)
    mae, rmse, r2 = evaluate(y_test[target], y_pred_stack)
    results.append({'Model': f'StackingEnsemble_{target}', 'MAE': mae, 'RMSE': rmse, 'R2': r2})
    ensemble_models[target] = stack
    if r2 > best_r2:
        best_r2 = r2
        best_model = stack
        best_model_name = f'StackingEnsemble_{target}'

# Aggregate ensemble predictions for all targets
ensemble_preds = np.column_stack(ensemble_preds)
mae, rmse, r2 = evaluate(y_test, ensemble_preds)
results.append({'Model': 'StackingEnsemble_All', 'MAE': mae, 'RMSE': rmse, 'R2': r2})
if r2 > best_r2:
    best_r2 = r2
    best_model = ensemble_models
    best_model_name = 'StackingEnsemble_All'

# 4. Save results
leaderboard = pd.DataFrame(results).sort_values('R2', ascending=False)
os.makedirs('models', exist_ok=True)
leaderboard.to_csv('models/ensemble_comparison.csv', index=False)
joblib.dump(best_model, 'models/best_model_Ensemble.joblib')

print('Ensemble results saved to models/ensemble_comparison.csv')
print(f'Best model: {best_model_name} (R2={best_r2:.3f}) saved to models/best_model_Ensemble.joblib')
