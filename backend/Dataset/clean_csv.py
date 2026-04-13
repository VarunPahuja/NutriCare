
import pandas as pd
import numpy as np
import os

# 1. Load the CSV
df = pd.read_csv('Dataset/Personalized_Diet_Recommendations.csv')

# 2. Remove duplicate entries
df = df.drop_duplicates()

# 3. Standardize disease names to lowercase with underscores
def standardize_disease(val):
    if pd.isna(val) or val.lower() == 'none':
        return 'none'
    return val.strip().lower().replace(' ', '_')
df['Chronic_Disease'] = df['Chronic_Disease'].apply(standardize_disease)

# 4. Ensure all nutrient columns are numeric
nutrient_cols = [
    'Caloric_Intake', 'Protein_Intake', 'Carbohydrate_Intake', 'Fat_Intake',
    'Recommended_Calories', 'Recommended_Protein', 'Recommended_Carbs', 'Recommended_Fats'
]
for col in nutrient_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# 5. Fill missing nutritional values with median for that disease group
disease_groups = ['diabetes', 'hypertension', 'heart_disease']
for col in nutrient_cols:
    for disease in disease_groups:
        mask = (df['Chronic_Disease'] == disease)
        median_val = df.loc[mask, col].median()
        df.loc[mask & df[col].isna(), col] = median_val

# 6. Save cleaned dataset as cleaned_nutricare.csv in /data
os.makedirs('data', exist_ok=True)
df.to_csv('data/cleaned_nutricare.csv', index=False)

# 7. Print summary
print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")
print("\nSample rows per disease group:")
for disease in disease_groups:
    print(f"\nDisease group: {disease}")
    print(df[df['Chronic_Disease'] == disease].head(3))
