import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

# Load preprocessed data
X_train = pd.read_csv('data/X_train.csv')
X_test = pd.read_csv('data/X_test.csv')
y_train = pd.read_csv('data/y_train.csv')
y_test = pd.read_csv('data/y_test.csv')

models = {
    'LinearRegression': LinearRegression(),
    'RandomForest': MultiOutputRegressor(RandomForestRegressor(random_state=42, n_jobs=-1)),
    'GradientBoosting': MultiOutputRegressor(GradientBoostingRegressor(random_state=42))
}

results = []
best_model = None
best_score = -np.inf
best_name = ''

for name, model in models.items():
    print(f'\nTraining {name}...')
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    results.append({'Model': name, 'MAE': mae, 'RMSE': rmse, 'R2': r2})
    print(f'{name} - MAE: {mae:.2f}, RMSE: {rmse:.2f}, R2: {r2:.3f}')
    if r2 > best_score:
        best_score = r2
        best_model = model
        best_name = name

# Save best model
os.makedirs('models', exist_ok=True)
joblib.dump(best_model, f'models/best_model_{best_name}.joblib')

# Save results
results_df = pd.DataFrame(results)
results_df.to_csv('models/model_comparison.csv', index=False)

print(f'\nBest model: {best_name} (R2: {best_score:.3f})')
print('Model comparison saved to models/model_comparison.csv')
print(f'Best model saved to models/best_model_{best_name}.joblib')
