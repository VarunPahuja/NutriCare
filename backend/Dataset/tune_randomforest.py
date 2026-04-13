import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_squared_error
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

df = pd.read_csv('data/cleaned_nutricare.csv')
X, features = feature_engineering(df)
# Only predict macros - calories will be derived from macros
target_cols = ['Recommended_Protein', 'Recommended_Carbs', 'Recommended_Fats']
y = df[target_cols]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Hyperparameter tuning
param_dist = {
    'estimator__n_estimators': [50, 100, 200, 300, 400],
    'estimator__max_depth': [None, 5, 10, 20, 30],
    'estimator__min_samples_split': [2, 5, 10],
    'estimator__min_samples_leaf': [1, 2, 4],
    'estimator__max_features': ['sqrt', 'log2']
}
rf = MultiOutputRegressor(RandomForestRegressor(random_state=42))
search = RandomizedSearchCV(rf, param_distributions=param_dist, n_iter=20, cv=5, scoring='neg_mean_squared_error', verbose=2, random_state=42, n_jobs=-1, return_train_score=True)
search.fit(X_train, y_train)

# 3. Save results
os.makedirs('models', exist_ok=True)
results = pd.DataFrame(search.cv_results_)
results.to_csv('models/rf_tuning_results.csv', index=False)
joblib.dump(search.best_estimator_, 'models/best_model_RandomForest_Tuned.joblib')

print('Best params:', search.best_params_)
print('Tuning results saved to models/rf_tuning_results.csv')
print('Best tuned model saved to models/best_model_RandomForest_Tuned.joblib')
