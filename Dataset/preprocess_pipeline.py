import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import numpy as np
import os

# 1. Load dataset
df = pd.read_csv('data/cleaned_nutricare.csv')

# 2. Drop leakage columns (assuming these are the current intake columns)
leakage_cols = ['Caloric_Intake', 'Protein_Intake', 'Carbohydrate_Intake', 'Fat_Intake']
df = df.drop(columns=[col for col in leakage_cols if col in df.columns])

# 3. Keep relevant features and targets
features = ['Age', 'Gender', 'BMI', 'Chronic_Disease', 'Exercise_Frequency']
targets = ['Recommended_Calories', 'Recommended_Protein', 'Recommended_Carbs', 'Recommended_Fats']
df = df[features + targets]

# 4. Encode categorical variables
cat_features = ['Gender', 'Chronic_Disease', 'Exercise_Frequency']
num_features = ['Age', 'BMI']

# OneHotEncode categorical features (Exercise_Frequency is numeric, so remove it from cat_features)
cat_features = ['Gender', 'Chronic_Disease']
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
encoded = encoder.fit_transform(df[cat_features])
encoded_df = pd.DataFrame(encoded, columns=encoder.get_feature_names_out(cat_features))

# StandardScale numeric features
scaler = StandardScaler()
scaled = scaler.fit_transform(df[num_features])
scaled_df = pd.DataFrame(scaled, columns=num_features)

# Combine all features
X = pd.concat([scaled_df, encoded_df, df[['Exercise_Frequency']].reset_index(drop=True)], axis=1)
y = df[targets]

# 5. Split into train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. Save preprocessed data
os.makedirs('data', exist_ok=True)
X_train.to_csv('data/X_train.csv', index=False)
X_test.to_csv('data/X_test.csv', index=False)
y_train.to_csv('data/y_train.csv', index=False)
y_test.to_csv('data/y_test.csv', index=False)

print('Preprocessing complete. Files saved in data/.')
