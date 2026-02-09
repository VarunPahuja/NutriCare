import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt
import shap

# 1. Load model and data
model_path = 'models/best_model_RandomForest.joblib'
data_path = 'data/cleaned_nutricare.csv'
model = joblib.load(model_path)
df = pd.read_csv(data_path)

# Feature engineering (must match training)
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

X, features = feature_engineering(df)
os.makedirs('reports/feature_importance', exist_ok=True)

# 2. Feature importances and SHAP for each output
target_names = ['Recommended_Calories', 'Recommended_Protein', 'Recommended_Carbs', 'Recommended_Fats']
for i, target in enumerate(target_names):
    # Feature importances
    importances = model.estimators_[i].feature_importances_
    indices = importances.argsort()[::-1][:20]
    plt.figure(figsize=(10,8))
    plt.barh([features[j] for j in indices][::-1], importances[indices][::-1])
    plt.xlabel('Importance')
    plt.title(f'RandomForest Feature Importances (Top 20) - {target}')
    plt.tight_layout()
    plt.savefig(f'reports/feature_importance/rf_feature_importance_{target}.png')
    plt.close()

    # SHAP analysis
    explainer = shap.TreeExplainer(model.estimators_[i])
    shap_values = explainer.shap_values(X)

    # SHAP summary beeswarm
    shap.summary_plot(shap_values, X, show=False, max_display=20)
    plt.tight_layout()
    plt.savefig(f'reports/feature_importance/shap_beeswarm_{target}.png')
    plt.close()

    # SHAP feature importance
    shap.summary_plot(shap_values, X, plot_type="bar", show=False, max_display=20)
    plt.tight_layout()
    plt.savefig(f'reports/feature_importance/shap_importance_{target}.png')
    plt.close()

print('Feature importance and SHAP plots saved to reports/feature_importance/')
