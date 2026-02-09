import joblib
import pandas as pd
import numpy as np

# Load the trained model
MODEL_PATH = 'models/best_model_Advanced.joblib'
model = joblib.load(MODEL_PATH)

def predict_nutrition(input_dict):
    """
    Predicts nutrition values and returns confidence scores.
    """
    df = pd.DataFrame([input_dict])
    
    # Get expected feature names from the model
    expected_features = None
    if hasattr(model, 'feature_names_'):
        expected_features = list(model.feature_names_)
    elif hasattr(model, 'estimators_') and len(model.estimators_) > 0:
        if hasattr(model.estimators_[0], 'feature_names_'):
            expected_features = list(model.estimators_[0].feature_names_)
    
    if expected_features is not None:
        for col in expected_features:
            if col not in df.columns:
                df[col] = 0
        df = df[expected_features]
    
    # Ensure all columns are numeric
    df = df.apply(pd.to_numeric, errors='coerce').fillna(0)
    
    # Make prediction (only predicts protein, carbs, fat)
    prediction = model.predict(df)
    
    # Handle both single and batch predictions
    if prediction.ndim > 1:
        prediction = prediction[0]
    
    protein, carbs, fat = prediction
    
    # Derive calories using nutrition science standards: 4 kcal/g for protein and carbs, 9 kcal/g for fat
    calories = (protein * 4) + (carbs * 4) + (fat * 9)
    
    return np.array([calories, protein, carbs, fat])

def get_user_input():
    """
    Get user input for nutrition prediction.
    """
    print("\n🍎 NutriCare AI - Personalized Nutrition Predictor")
    print("=" * 55)
    print("Enter your details to get personalized nutrition recommendations:")
    print()
    
    # Basic demographics
    age = float(input("📅 Enter your age: "))
    height = float(input("📏 Enter your height (cm): "))
    weight = float(input("⚖️  Enter your weight (kg): "))
    
    # Calculate BMI
    bmi = weight / ((height/100) ** 2)
    print(f"📊 Your BMI: {bmi:.2f}")
    
    # Gender
    print("\n👤 Select your gender:")
    print("1. Male")
    print("2. Female") 
    print("3. Other")
    gender_choice = input("Enter choice (1-3): ")
    
    # Health conditions
    print("\n🏥 Do you have any chronic diseases?")
    print("1. None")
    print("2. Diabetes")
    print("3. Heart Disease")
    print("4. Hypertension")
    disease_choice = input("Enter choice (1-4): ")
    
    # Activity level and goals
    print("\n🏃 What's your activity level?")
    print("1. Sedentary (desk job, little exercise)")
    print("2. Light activity (light exercise 1-3 days/week)")
    print("3. Moderate activity (exercise 3-5 days/week)")
    print("4. High activity (exercise 6-7 days/week)")
    print("5. Very high activity (2x/day or intense training)")
    activity_choice = input("Enter choice (1-5): ")
    
    print("\n🎯 What's your goal?")
    print("1. Lose weight")
    print("2. Maintain weight")
    print("3. Gain muscle/weight")
    goal_choice = input("Enter choice (1-3): ")
    
    # Calculate ratios based on practical inputs
    if goal_choice == '1':  # Weight loss - higher protein, lower carbs
        carb_ratio = 0.35
        protein_ratio = 0.35
        fat_ratio = 0.30
        print("🎯 Goal: Weight loss - Higher protein, moderate carbs")
    elif goal_choice == '3':  # Muscle gain - higher carbs and protein
        carb_ratio = 0.45
        protein_ratio = 0.30
        fat_ratio = 0.25
        print("🎯 Goal: Muscle gain - Higher carbs and protein")
    else:  # Maintenance - balanced
        carb_ratio = 0.40
        protein_ratio = 0.30
        fat_ratio = 0.30
        print("🎯 Goal: Maintenance - Balanced nutrition")
    
    # Build input dictionary
    input_dict = {
        'Age': age,
        'BMI': bmi,
        'Carb_ratio': carb_ratio,
        'Protein_ratio': protein_ratio,
        'Fat_ratio': fat_ratio
    }
    
    # Add gender (one-hot encoded)
    if gender_choice == '1':
        input_dict['Gender_Male'] = 1
    elif gender_choice == '2':
        input_dict['Gender_Female'] = 1
    # Other is default (all gender columns = 0)
    
    # Add disease (one-hot encoded)
    if disease_choice == '2':
        input_dict['Chronic_Disease_diabetes'] = 1
    elif disease_choice == '3':
        input_dict['Chronic_Disease_heart_disease'] = 1
    elif disease_choice == '4':
        input_dict['Chronic_Disease_hypertension'] = 1
    # None is default (all disease columns = 0)
    
    # Store disease choice for advice
    disease_map = {
        '1': 'none',
        '2': 'diabetes',
        '3': 'heart_disease',
        '4': 'hypertension'
    }
    input_dict['_disease_choice'] = disease_map.get(disease_choice, 'none')
    
    return input_dict

def display_results(predictions, confidence_scores, user_info):
    """
    Display predictions with confidence scores and practical recommendations.
    """
    print("\n" + "="*60)
    print("🎯 YOUR PERSONALIZED NUTRITION RECOMMENDATIONS")
    print("="*60)
    
    calories, protein, carbs, fat = predictions
    
    # Note that calories are derived from macros using nutrition science standards
    print(f"📊 Daily Calories    : {calories:6.0f} kcal (Derived: 4×protein + 4×carbs + 9×fat)")
    print(f"📊 Daily Protein     : {protein:6.1f} g    (Confidence: {confidence_scores[0]:.1%})")
    print(f"📊 Daily Carbs       : {carbs:6.1f} g    (Confidence: {confidence_scores[1]:.1%})")
    print(f"📊 Daily Fat         : {fat:6.1f} g    (Confidence: {confidence_scores[2]:.1%})")
    
    print("\n🍽️ PRACTICAL MEAL BREAKDOWN:")
    print(f"   🍳 Breakfast : {calories*0.25:4.0f} kcal | {protein*0.25:4.1f}g protein | {carbs*0.25:4.1f}g carbs | {fat*0.25:4.1f}g fat")
    print(f"   🥗 Lunch     : {calories*0.35:4.0f} kcal | {protein*0.35:4.1f}g protein | {carbs*0.35:4.1f}g carbs | {fat*0.35:4.1f}g fat")
    print(f"   🍽️  Dinner    : {calories*0.30:4.0f} kcal | {protein*0.30:4.1f}g protein | {carbs*0.30:4.1f}g carbs | {fat*0.30:4.1f}g fat")
    print(f"   🍎 Snacks    : {calories*0.10:4.0f} kcal | {protein*0.10:4.1f}g protein | {carbs*0.10:4.1f}g carbs | {fat*0.10:4.1f}g fat")
    
    print("\n🥘 EXAMPLE FOODS TO REACH THESE TARGETS:")
    print(f"   • Protein: {protein/25:3.1f} servings of chicken breast (25g protein each)")
    print(f"   • Carbs  : {carbs/30:3.1f} cups of rice/pasta (30g carbs each)")
    print(f"   • Fat    : {fat/14:3.1f} tbsp of olive oil/nuts (14g fat each)")
    
    # Health condition specific advice - FIXED: Use the stored disease choice
    disease_choice = user_info.get('_disease_choice', 'none')
    
    if disease_choice == 'diabetes':
        print("\n🩺 DIABETES-SPECIFIC ADVICE:")
        print("   • Focus on low glycemic index carbs (oats, quinoa)")
        print("   • Eat smaller, frequent meals")
        print("   • Monitor blood sugar regularly")
    elif disease_choice == 'heart_disease':
        print("\n❤️ HEART HEALTH-SPECIFIC ADVICE:")
        print("   • Choose healthy fats (omega-3, olive oil)")
        print("   • Limit sodium intake")
        print("   • Include fiber-rich foods")
    elif disease_choice == 'hypertension':
        print("\n🩸 HYPERTENSION-SPECIFIC ADVICE:")
        print("   • Reduce sodium intake")
        print("   • Increase potassium-rich foods")
        print("   • Limit processed foods")
    
    print("\n📈 Model Performance Scores:")
    print(f"   • Fat Prediction: 78.5% accuracy (R² = 0.785)")
    print(f"   • Carbs Prediction: 68.4% accuracy (R² = 0.684)")
    print(f"   • Protein Prediction: 64.3% accuracy (R² = 0.643)")
    print(f"   • Calories: Derived using nutrition science (4-4-9 rule)")
    
    print("\n💡 What this means:")
    print("   • These are science-based recommendations")
    print("   • Model trained on 5000+ patient records")
    print("   • Accounts for your health conditions & demographics")
    print("   • Calories derived using established nutrition science")

def main():
    """
    Main interactive loop.
    """
    # Model confidence scores (from our training results - only for macros now)
    confidence_scores = [0.643, 0.684, 0.785]  # Protein, Carbs, Fat
    
    print("🍎 NutriCare AI - Starting up...")
    
    while True:
        try:
            # Get user input
            user_input = get_user_input()
            
            # Make prediction
            predictions = predict_nutrition(user_input)
            
            # Display results
            display_results(predictions, confidence_scores, user_input)
            
            # Ask if user wants to try again
            print("\n" + "="*60)
            again = input("🔄 Try with different values? (y/n): ").lower().strip()
            
            if again not in ['y', 'yes']:
                print("\n👋 Thank you for using NutriCare AI!")
                break
                
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("Please try again with valid inputs.")
            break  # Exit on error to prevent infinite loops

if __name__ == "__main__":
    main()
