import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import joblib
import os

# Try to import XGBoost and CatBoost
try:
    from xgboost import XGBRegressor
except ImportError:
    XGBRegressor = None
try:
    from catboost import CatBoostRegressor
except ImportError:
    CatBoostRegressor = None

def evaluate(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    r2 = r2_score(y_true, y_pred)
    return mae, rmse, r2

def baseline_predictor(df, targets, group_col='Chronic_Disease'):
    # Group by disease and use median as prediction
    medians = df.groupby(group_col)[targets].median()
    preds = df[group_col].map(medians.to_dict())
    preds = pd.DataFrame(list(preds))
    return preds

def feature_engineering(df):
    # One-hot encode disease
    ohe = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    disease_ohe = ohe.fit_transform(df[['Chronic_Disease']])
    disease_ohe_df = pd.DataFrame(disease_ohe, columns=ohe.get_feature_names_out(['Chronic_Disease']))
    # Ratios
    total = df['Carbohydrate_Intake'] + df['Protein_Intake'] + df['Fat_Intake']
    df['Carb_ratio'] = df['Carbohydrate_Intake'] / total
    df['Protein_ratio'] = df['Protein_Intake'] / total
    df['Fat_ratio'] = df['Fat_Intake'] / total
    # Combine
    features = ['Age', 'Gender', 'BMI']
    X = pd.concat([
        df[features].reset_index(drop=True),
        disease_ohe_df.reset_index(drop=True),
        df[['Carb_ratio', 'Protein_ratio', 'Fat_ratio']].reset_index(drop=True)
    ], axis=1)
    # Encode Gender
    X = pd.get_dummies(X, columns=['Gender'], drop_first=True)
    return X

def main():
    os.makedirs('models', exist_ok=True)
    df = pd.read_csv('data/cleaned_nutricare.csv')
    targets = ['Recommended_Calories', 'Recommended_Protein', 'Recommended_Carbs', 'Recommended_Fats']
    # 1. Baseline
    baseline_preds = baseline_predictor(df, targets)
    baseline_mae, baseline_rmse, baseline_r2 = evaluate(df[targets], baseline_preds)
    results = [{'Model': 'BaselineMedian', 'MAE': baseline_mae, 'RMSE': baseline_rmse, 'R2': baseline_r2}]
    # 2. Feature Engineering
    X = feature_engineering(df)
    y = df[targets]
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    # 3. Advanced Models
    model_defs = {
        'LinearRegression': LinearRegression(),
        'RandomForest': MultiOutputRegressor(RandomForestRegressor(random_state=42)),
        'GradientBoosting': MultiOutputRegressor(GradientBoostingRegressor(random_state=42)),
    }
    if XGBRegressor:
        model_defs['XGBoost'] = MultiOutputRegressor(XGBRegressor(random_state=42, verbosity=0))
    if CatBoostRegressor:
        model_defs['CatBoost'] = MultiOutputRegressor(CatBoostRegressor(random_state=42, verbose=0))
    # Hyperparameter tuning for RF, GB, XGB
    param_grids = {
        'RandomForest': {'estimator__n_estimators': [50, 100, 200]},
        'GradientBoosting': {'estimator__n_estimators': [50, 100, 200]},
        'XGBoost': {'estimator__n_estimators': [50, 100, 200]} if XGBRegressor else {},
    }
    best_models = {}
    for name, model in model_defs.items():
        print(f'\nTraining {name}...')
        if name in param_grids and param_grids[name]:
            search = RandomizedSearchCV(model, param_grids[name], n_iter=3, cv=3, random_state=42, n_jobs=-1)
            search.fit(X_train, y_train)
            model = search.best_estimator_
        else:
            model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        mae, rmse, r2 = evaluate(y_test, y_pred)
        results.append({'Model': name, 'MAE': mae, 'RMSE': rmse, 'R2': r2})
        best_models[name] = (model, r2)
    # 4. Reporting
    results_df = pd.DataFrame(results)
    results_df = results_df.sort_values('R2', ascending=False)
    results_df.to_csv('models/model_comparison.csv', index=False)
    best_name = results_df.iloc[0]['Model']
    joblib.dump(best_models[best_name][0], 'models/best_model.joblib')
    print('\nLeaderboard:')
    print(results_df[['Model', 'MAE', 'RMSE', 'R2']])
    print(f'\nBest model: {best_name} (R2: {results_df.iloc[0]["R2"]:.3f})')
    print('Model comparison saved to models/model_comparison.csv')
    print('Best model saved to models/best_model.joblib')

if __name__ == '__main__':
    main()
