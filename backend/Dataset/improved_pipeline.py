import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
import joblib
from sklearn.multioutput import MultiOutputRegressor
import os

# ------------- Helper Functions -------------

def evaluate(y_true, y_pred):
    """Return MAE, RMSE, R2 for multi-output regression."""
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    return mae, rmse, r2

def baseline_predictor(df, disease_col, target_cols):
    """Predict median target values by disease group."""
    medians = df.groupby(disease_col)[target_cols].median()
    preds = pd.DataFrame(index=df.index)
    for col in target_cols:
        preds[col] = df[disease_col].map(medians[col])
    return preds

def feature_engineering(df):
    """Add ratio features and one-hot encode categoricals."""
    # Ratios (avoid division by zero)
    total = df['Recommended_Carbs'] + df['Recommended_Protein'] + df['Recommended_Fats']
    total = total.replace(0, np.nan)
    df['Carb_ratio'] = df['Recommended_Carbs'] / total
    df['Protein_ratio'] = df['Recommended_Protein'] / total
    df['Fat_ratio'] = df['Recommended_Fats'] / total
    df[['Carb_ratio', 'Protein_ratio', 'Fat_ratio']] = df[['Carb_ratio', 'Protein_ratio', 'Fat_ratio']].fillna(0)
    # One-hot encode disease, gender, activity level
    # Only one-hot encode columns that exist
    one_hot_cols = [col for col in ['Chronic_Disease', 'Gender'] if col in df.columns]
    df = pd.get_dummies(df, columns=one_hot_cols, drop_first=True)
    # Features to keep
    features = ['Age', 'BMI', 'Carb_ratio', 'Protein_ratio', 'Fat_ratio'] + \
               [col for col in df.columns if col.startswith('Chronic_Disease_') or col.startswith('Gender_')]
    features = [f for f in features if f in df.columns]
    return df, features

def get_targets():
    return ['Recommended_Calories', 'Recommended_Protein', 'Recommended_Carbs', 'Recommended_Fats']

def model_leaderboard(results):
    print("\n=== Model Leaderboard (sorted by R²) ===")
    print(results.sort_values('R2', ascending=False)[['Model', 'MAE', 'RMSE', 'R2']])

# ------------- Main Pipeline -------------

# 1. Load data
df = pd.read_csv('data/cleaned_nutricare.csv')

# 2. Baseline Model
target_cols = get_targets()
baseline_preds = baseline_predictor(df, 'Chronic_Disease', target_cols)
mae, rmse, r2 = evaluate(df[target_cols], baseline_preds)
results = pd.DataFrame([{'Model': 'Baseline (Median by Disease)', 'MAE': mae, 'RMSE': rmse, 'R2': r2}])

# 3. Feature Engineering
df, features = feature_engineering(df)
X = df[features]
y = df[target_cols]

# 4. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Model Training & Evaluation

models = {
    'LinearRegression': LinearRegression(),
    'RandomForest': MultiOutputRegressor(RandomForestRegressor(random_state=42)),
    'GradientBoosting': MultiOutputRegressor(GradientBoostingRegressor(random_state=42)),
    'XGBoost': MultiOutputRegressor(XGBRegressor(random_state=42, verbosity=0)),
    'CatBoost': MultiOutputRegressor(CatBoostRegressor(verbose=0, random_state=42))
}

# Hyperparameter grids for tuning
param_grids = {
    'RandomForest': {
        'estimator__n_estimators': [50, 100, 200],
        'estimator__max_depth': [3, 5, 10]
    },
    'GradientBoosting': {
        'estimator__n_estimators': [50, 100, 200],
        'estimator__learning_rate': [0.01, 0.1, 0.2]
    },
    'XGBoost': {
        'estimator__n_estimators': [50, 100, 200],
        'estimator__learning_rate': [0.01, 0.1, 0.2]
    }
}

best_r2 = -np.inf
best_model = None
best_model_name = None

for name, model in models.items():
    if name in param_grids:
        search = RandomizedSearchCV(model, param_grids[name], n_iter=5, cv=3, scoring='r2', random_state=42)
        search.fit(X_train, y_train)
        model = search.best_estimator_
    else:
        model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mae, rmse, r2 = evaluate(y_test, y_pred)
    results = pd.concat([results, pd.DataFrame([{'Model': name, 'MAE': mae, 'RMSE': rmse, 'R2': r2}])], ignore_index=True)
    if r2 > best_r2:
        best_r2 = r2
        best_model = model
        best_model_name = name

# 6. Reporting
os.makedirs('models', exist_ok=True)
results.to_csv('models/model_comparison.csv', index=False)
joblib.dump(best_model, f'models/best_model_{best_model_name}.joblib')

model_leaderboard(results)
print(f"\nBest model: {best_model_name} (R²={best_r2:.3f}) saved to models/best_model_{best_model_name}.joblib")

# End of script
