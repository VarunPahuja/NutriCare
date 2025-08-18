import pandas as pd
import os

# 1. Load cleaned_nutricare.csv
df = pd.read_csv('data/cleaned_nutricare.csv')

def assign_nutrient_tag(row):
    if row['Recommended_Carbs'] < 100:
        return 'low_carb'
    elif row['Recommended_Protein'] > 150:
        return 'high_protein'
    elif row['Recommended_Fats'] < 60:
        return 'low_fat'
    else:
        return 'balanced'

# 2-3. Assign nutrient_tag

df['nutrient_tag'] = df.apply(assign_nutrient_tag, axis=1)

# 4. Save as tagged_nutricare.csv in /data
os.makedirs('data', exist_ok=True)
df.to_csv('data/tagged_nutricare.csv', index=False)

# 5. Print count of each nutrient_tag by disease group
print(df.groupby(['Chronic_Disease', 'nutrient_tag']).size().unstack(fill_value=0))
