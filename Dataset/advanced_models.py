import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.multioutput import MultiOutputRegressor
import joblib
import os
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from lightgbm import LGBMRegressor

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

df = pd.read_csv('data/cleaned_nutricare.csv')
X, features = feature_engineering(df)
# Only predict macros - calories will be derived from macros
target_cols = ['Recommended_Protein', 'Recommended_Carbs', 'Recommended_Fats']
y = df[target_cols]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Train models
models = {
    'XGBoost': MultiOutputRegressor(XGBRegressor(random_state=42, verbosity=0)),
    'LightGBM': MultiOutputRegressor(LGBMRegressor(random_state=42, verbose=-1)),
    'CatBoost': MultiOutputRegressor(CatBoostRegressor(verbose=0, random_state=42))
}

results = []
best_r2 = -np.inf
best_model = None
best_model_name = None

def evaluate(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    return mae, rmse, r2

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mae, rmse, r2 = evaluate(y_test, y_pred)
    results.append({'Model': name, 'MAE': mae, 'RMSE': rmse, 'R2': r2})
    if r2 > best_r2:
        best_r2 = r2
        best_model = model
        best_model_name = name

# 4. Leaderboard
leaderboard = pd.DataFrame(results).sort_values('R2', ascending=False)
os.makedirs('models', exist_ok=True)
leaderboard.to_csv('models/advanced_model_comparison.csv', index=False)
joblib.dump(best_model, 'models/best_model_Advanced.joblib')

print('Leaderboard saved to models/advanced_model_comparison.csv')
print(f'Best model: {best_model_name} (R2={best_r2:.3f}) saved to models/best_model_Advanced.joblib')
