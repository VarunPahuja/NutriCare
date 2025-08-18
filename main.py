from predict import predict_calories

# Example dummy input (replace with actual feature names and values as needed)
dummy_input = {
    'Age': 30,
    'BMI': 22.5,
    'Carb_ratio': 0.5,
    'Protein_ratio': 0.3,
    'Fat_ratio': 0.2
}

# List your target names here (update as needed)
target_names = ['Calories', 'Protein', 'Fat']

result = predict_calories(dummy_input)

# Print each prediction with its target name
if hasattr(result, '__iter__') and not isinstance(result, str):
    for name, value in zip(target_names, result[0]):
        print(f"Predicted {name}: {value}")
else:
    print("Predicted value:", result)
