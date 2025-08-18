import pandas as pd

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

# Create a directory for plots
PLOTS_DIR = 'plots'
os.makedirs(PLOTS_DIR, exist_ok=True)

# Load the cleaned dataset
df = pd.read_csv('data/cleaned_nutricare.csv')

# 1. Show dataset shape, column names, and basic info
print('Shape:', df.shape)
print('\nColumns:', df.columns.tolist())
print('\nInfo:')
df.info()

# 2. Descriptive statistics for numerical columns
print('\nDescriptive statistics:')
print(df.describe())

# 3. Check for missing values and visualize with a heatmap
print('\nMissing values per column:')
print(df.isnull().sum())
plt.figure(figsize=(12, 6))
sns.heatmap(df.isnull(), cbar=False, cmap='viridis')
plt.title('Missing Values Heatmap')
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'missing_values_heatmap.png'))
plt.close()

# 4. Plot distributions of numerical features (histograms & boxplots)
numeric_cols = df.select_dtypes(include=[np.number]).columns
for col in numeric_cols:
    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    sns.histplot(data=df, x=col, kde=True)
    plt.title(f'Histogram of {col}')
    plt.subplot(1, 2, 2)
    sns.boxplot(x=df[col])
    plt.title(f'Boxplot of {col}')
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, f'{col}_hist_box.png'))
    plt.close()

# 5. Categorical features: value counts and bar plots
cat_cols = df.select_dtypes(include=['object']).columns
for col in cat_cols:
    print(f'\nValue counts for {col}:')
    print(df[col].value_counts())
    plt.figure(figsize=(10, 4))
    sns.countplot(y=col, data=df, order=df[col].value_counts().index)
    plt.title(f'Bar plot of {col}')
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, f'{col}_barplot.png'))
    plt.close()

# 6. Correlation heatmap for numerical variables
corr = df[numeric_cols].corr()
plt.figure(figsize=(14, 10))
sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', square=True)
plt.title('Correlation Heatmap')
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'correlation_heatmap.png'))
plt.close()

# 7. Highlight potential outliers or unusual trends
for col in numeric_cols:
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    outliers = df[(df[col] < Q1 - 1.5 * IQR) | (df[col] > Q3 + 1.5 * IQR)]
    if not outliers.empty:
        print(f"{col}: {len(outliers)} outliers")
        print(outliers[[col]].head())
