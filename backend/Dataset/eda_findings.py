import pandas as pd
import numpy as np
import os

# Load the cleaned dataset
df = pd.read_csv('data/cleaned_nutricare.csv')

summary_lines = []

# Dataset Overview
summary_lines.append('=== Dataset Overview ===')
summary_lines.append(f'Rows: {df.shape[0]}, Columns: {df.shape[1]}')
missing = df.isnull().sum()
missing = missing[missing > 0]
if not missing.empty:
    summary_lines.append('Missing values:')
    for col, val in missing.items():
        summary_lines.append(f'  {col}: {val}')
else:
    summary_lines.append('No missing values found.')

# Key Statistics
summary_lines.append('\n=== Key Statistics (Numerical Columns) ===')
desc = df.describe().T
for col in desc.index:
    mean = desc.loc[col, 'mean']
    median = df[col].median()
    std = desc.loc[col, 'std']
    mode = df[col].mode().iloc[0] if not df[col].mode().empty else 'N/A'
    summary_lines.append(f'{col}: mean={mean:.2f}, median={median:.2f}, mode={mode}, std={std:.2f}')

# Notable Correlations
summary_lines.append('\n=== Notable Correlations (|corr| > 0.5) ===')
corr = df.select_dtypes(include=[np.number]).corr()
notable = []
for i, col1 in enumerate(corr.columns):
    for j, col2 in enumerate(corr.columns):
        if i < j:
            val = corr.loc[col1, col2]
            if isinstance(val, float) and abs(val) > 0.5:
                notable.append((col1, col2, val))
if notable:
    for col1, col2, val in notable:
        summary_lines.append(f'{col1} <-> {col2}: corr={val:.2f}')
else:
    summary_lines.append('No strong correlations found.')

# Outliers Found
summary_lines.append('\n=== Outliers Found (values outside 1.5*IQR) ===')
outlier_reported = False
for col in df.select_dtypes(include=[np.number]).columns:
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    outliers = df[(df[col] < Q1 - 1.5 * IQR) | (df[col] > Q3 + 1.5 * IQR)]
    if not outliers.empty:
        summary_lines.append(f'{col}: {len(outliers)} outliers')
        outlier_reported = True
if not outlier_reported:
    summary_lines.append('No significant outliers detected.')

# Patterns or Insights
summary_lines.append('\n=== Patterns or Insights ===')
# Example: BMI distribution, common diseases, etc.
if 'BMI' in df.columns:
    mean_bmi = df['BMI'].mean()
    summary_lines.append(f'Average BMI: {mean_bmi:.2f}')
if 'Chronic_Disease' in df.columns:
    top_disease = df['Chronic_Disease'].value_counts().idxmax()
    summary_lines.append(f'Most common chronic disease: {top_disease}')
if 'Recommended_Calories' in df.columns:
    avg_cal = df['Recommended_Calories'].mean()
    summary_lines.append(f'Average recommended calories: {avg_cal:.2f}')

# Write to summary file
os.makedirs('data', exist_ok=True)
with open('data/eda_summary.txt', 'w') as f:
    for line in summary_lines:
        f.write(line + '\n')

print('EDA summary written to data/eda_summary.txt')
