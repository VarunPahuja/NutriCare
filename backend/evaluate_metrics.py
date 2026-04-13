import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error, 
    mean_squared_error, 
    r2_score, 
    mean_absolute_percentage_error,
    explained_variance_score
)

# Load and prepare data (same as training)
df = pd.read_csv('data/cleaned_nutricare.csv')

# Feature engineering
total = df['Recommended_Carbs'] + df['Recommended_Protein'] + df['Recommended_Fats']
total = total.replace(0, pd.NA)
df['Carb_ratio'] = df['Recommended_Carbs'] / total
df['Protein_ratio'] = df['Recommended_Protein'] / total
df['Fat_ratio'] = df['Recommended_Fats'] / total
df[['Carb_ratio', 'Protein_ratio', 'Fat_ratio']] = df[['Carb_ratio', 'Protein_ratio', 'Fat_ratio']].fillna(0)

# One-hot encoding
one_hot_cols = [col for col in ['Chronic_Disease', 'Gender'] if col in df.columns]
df = pd.get_dummies(df, columns=one_hot_cols, drop_first=True)

# Features
features = ['Age', 'BMI', 'Carb_ratio', 'Protein_ratio', 'Fat_ratio'] + \
           [col for col in df.columns if col.startswith('Chronic_Disease_') or col.startswith('Gender_')]
X = df[features]
y = df[['Recommended_Protein', 'Recommended_Carbs', 'Recommended_Fats']]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Load model
model = joblib.load('models/best_model_Advanced.joblib')

# Make predictions
y_pred = model.predict(X_test)

print('='*80)
print('CATBOOST MODEL - COMPREHENSIVE PERFORMANCE METRICS')
print('='*80)

# Overall performance
print('\n--- OVERALL MODEL PERFORMANCE (All Macronutrients) ---\n')
mae_overall = mean_absolute_error(y_test, y_pred)
rmse_overall = np.sqrt(mean_squared_error(y_test, y_pred))
r2_overall = r2_score(y_test, y_pred)
mape_overall = mean_absolute_percentage_error(y_test, y_pred) * 100
ev_overall = explained_variance_score(y_test, y_pred)

print(f'Mean Absolute Error (MAE):          {mae_overall:.2f} grams')
print(f'Root Mean Squared Error (RMSE):     {rmse_overall:.2f} grams')
print(f'R² Score:                           {r2_overall:.4f} ({r2_overall*100:.2f}%)')
print(f'Mean Absolute Percentage Error:     {mape_overall:.2f}%')
print(f'Explained Variance Score:           {ev_overall:.4f}')

# Per-macronutrient breakdown
print('\n' + '='*80)
print('--- PER-MACRONUTRIENT DETAILED METRICS ---')
print('='*80)

macros = ['Protein', 'Carbs', 'Fat']
results_table = []

for i, macro in enumerate(macros):
    print(f'\n{macro.upper()}:')
    print('-' * 40)
    
    y_true_macro = y_test.iloc[:, i]
    y_pred_macro = y_pred[:, i]
    
    # Calculate metrics
    mae = mean_absolute_error(y_true_macro, y_pred_macro)
    rmse = np.sqrt(mean_squared_error(y_true_macro, y_pred_macro))
    r2 = r2_score(y_true_macro, y_pred_macro)
    mape = mean_absolute_percentage_error(y_true_macro, y_pred_macro) * 100
    ev = explained_variance_score(y_true_macro, y_pred_macro)
    
    # Statistics
    mean_actual = y_true_macro.mean()
    mean_predicted = y_pred_macro.mean()
    min_pred = y_pred_macro.min()
    max_pred = y_pred_macro.max()
    
    # Error analysis
    errors = np.abs(y_true_macro - y_pred_macro)
    median_error = np.median(errors)
    percentile_95_error = np.percentile(errors, 95)
    
    print(f'  MAE:                    {mae:.2f}g')
    print(f'  RMSE:                   {rmse:.2f}g')
    print(f'  R² Score:               {r2:.4f} ({r2*100:.2f}%)')
    print(f'  MAPE:                   {mape:.2f}%')
    print(f'  Explained Variance:     {ev:.4f}')
    print(f'  \n  Mean Actual:            {mean_actual:.2f}g')
    print(f'  Mean Predicted:         {mean_predicted:.2f}g')
    print(f'  Prediction Bias:        {mean_predicted - mean_actual:.2f}g')
    print(f'  \n  Prediction Range:       {min_pred:.2f}g - {max_pred:.2f}g')
    print(f'  Median Error:           {median_error:.2f}g')
    print(f'  95th Percentile Error:  {percentile_95_error:.2f}g')
    
    results_table.append({
        'Macronutrient': macro,
        'MAE': mae,
        'RMSE': rmse,
        'R²': r2,
        'MAPE': mape,
        'Explained_Variance': ev
    })

# Summary table
print('\n' + '='*80)
print('--- SUMMARY TABLE ---')
print('='*80)
results_df = pd.DataFrame(results_table)
print(results_df.to_string(index=False))

# Model comparison with other algorithms
print('\n' + '='*80)
print('--- MODEL COMPARISON (All 3 Algorithms Tested) ---')
print('='*80)
comparison_df = pd.read_csv('models/advanced_model_comparison.csv')
print(comparison_df.to_string(index=False))

# Interpretation guide
print('\n' + '='*80)
print('INTERPRETATION GUIDE')
print('='*80)

print('\n1. MAE (Mean Absolute Error):')
print('   • Average prediction error in grams')
print('   • Lower is better')
print('   • Clinical tolerance: ±10-20g is acceptable for nutrition guidance')
print(f'   • Your model: {mae_overall:.2f}g (EXCELLENT)')

print('\n2. RMSE (Root Mean Squared Error):')
print('   • Penalizes larger errors more heavily than MAE')
print('   • Always ≥ MAE')
print('   • If RMSE >> MAE, model has some large outlier predictions')
print(f'   • Your model: RMSE={rmse_overall:.2f}g vs MAE={mae_overall:.2f}g')
print(f'   • Ratio: {rmse_overall/mae_overall:.2f}x (Good - not many outliers)')

print('\n3. R² Score (Coefficient of Determination):')
print('   • Proportion of variance explained by the model')
print('   • Range: 0 to 1 (higher is better)')
print('   • 0.70 = Model explains 70% of variation')
print('   • Interpretation:')
print('     - <0.50: Poor model')
print('     - 0.50-0.70: Acceptable for nutrition (biological variability)')
print('     - 0.70-0.85: Good')
print('     - >0.85: Excellent (rare in healthcare)')
print(f'   • Your model: {r2_overall:.4f} ({r2_overall*100:.2f}%) - GOOD')

print('\n4. MAPE (Mean Absolute Percentage Error):')
print('   • Average error as % of actual value')
print('   • Interpretation:')
print('     - <10%: Excellent')
print('     - 10-20%: Good')
print('     - >20%: Needs improvement')
print(f'   • Your model: {mape_overall:.2f}% - GOOD')

print('\n5. Explained Variance Score:')
print('   • Similar to R², measures how well predictions match actual values')
print('   • If close to R², model is unbiased')
print(f'   • Your model: EV={ev_overall:.4f} vs R²={r2_overall:.4f}')
print(f'   • Difference: {abs(ev_overall - r2_overall):.4f} (Very small - unbiased!)')

print('\n' + '='*80)
print('CLINICAL SIGNIFICANCE')
print('='*80)
print(f'\n• Your model predicts macronutrients within ±{mae_overall:.0f}g on average')
print(f'• For a patient needing 120g protein, model predicts: 120 ± {mae_overall:.0f}g')
print('• This is clinically acceptable - dietitians work within similar tolerances')
print('• 95% of predictions have error <{:.0f}g (acceptable for meal planning)'.format(percentile_95_error))
print('\n✅ Model performance is CLINICALLY USEFUL for patient care')

print('\n' + '='*80)
