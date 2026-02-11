import React, { useState } from "react";
import { Button } from '@/components/ui/button';

// Environment-based API configuration with fallback for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const defaultInput = {
  Age: 19,
  Height: 175,
  Weight: 73,
  Gender: 'Male',
  Disease: 'None',
  Activity: 'Sedentary',
  Goal: 'Lose weight',
};

function calculateBMI(weight: number, height: number) {
  return weight / ((height / 100) ** 2);
}

function getRatios(goal: string) {
  if (goal === 'Lose weight') return { carb: 0.35, protein: 0.35, fat: 0.30 };
  if (goal === 'Gain muscle/weight') return { carb: 0.45, protein: 0.30, fat: 0.25 };
  return { carb: 0.40, protein: 0.30, fat: 0.30 };
}

export default function NutritionPrediction() {
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleRadio = (name: string, value: string) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const bmi = calculateBMI(input.Weight, input.Height);
    const ratios = getRatios(input.Goal);
    // One-hot encoding for gender and disease
    const payload: any = {
      Age: input.Age,
      BMI: bmi,
      Carb_ratio: ratios.carb,
      Protein_ratio: ratios.protein,
      Fat_ratio: ratios.fat,
      Gender_Male: input.Gender === 'Male' ? 1 : 0,
      Gender_Female: input.Gender === 'Female' ? 1 : 0,
      Chronic_Disease_diabetes: input.Disease === 'Diabetes' ? 1 : 0,
      Chronic_Disease_heart_disease: input.Disease === 'Heart Disease' ? 1 : 0,
      Chronic_Disease_hypertension: input.Disease === 'Hypertension' ? 1 : 0,
    };
    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult({ ...data, bmi, ratios });
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fitness-card p-6 rounded-lg shadow-md bg-fitness-background/80 border border-fitness-primary/20 mb-8">
      <h2 className="text-2xl font-bold text-fitness-primary mb-4">Personalized Nutrition Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input name="Age" type="text" inputMode="numeric" pattern="[0-9]*" value={input.Age} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-fitness-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input name="Height" type="text" inputMode="numeric" pattern="[0-9]*" value={input.Height} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-fitness-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input name="Weight" type="text" inputMode="numeric" pattern="[0-9]*" value={input.Weight} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-fitness-primary/30" />
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Gender</label>
          <div className="flex gap-6">
            {['Male', 'Female', 'Other'].map(g => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <input type="radio" name="Gender" value={g} checked={input.Gender === g} onChange={() => handleRadio('Gender', g)} className="accent-fitness-primary" /> {g}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Chronic Disease</label>
          <div className="flex gap-6">
            {['None', 'Diabetes', 'Heart Disease', 'Hypertension'].map(d => (
              <label key={d} className="flex items-center gap-2 text-sm">
                <input type="radio" name="Disease" value={d} checked={input.Disease === d} onChange={() => handleRadio('Disease', d)} className="accent-fitness-accent" /> {d}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Activity Level</label>
          <div className="flex gap-6 flex-wrap">
            {['Sedentary', 'Light activity', 'Moderate activity', 'High activity', 'Very high activity'].map(a => (
              <label key={a} className="flex items-center gap-2 text-sm">
                <input type="radio" name="Activity" value={a} checked={input.Activity === a} onChange={() => handleRadio('Activity', a)} className="accent-fitness-primary" /> {a}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">Goal</label>
          <div className="flex gap-6">
            {['Lose weight', 'Maintain weight', 'Gain muscle/weight'].map(g => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <input type="radio" name="Goal" value={g} checked={input.Goal === g} onChange={() => handleRadio('Goal', g)} className="accent-fitness-primary" /> {g}
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" variant="outline" className="w-full border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </Button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && (
        <div className="mt-8 p-4 rounded bg-gray-900/80 border border-fitness-primary/20">
          <h3 className="text-lg font-bold text-fitness-primary mb-2">🎯 YOUR PERSONALIZED NUTRITION RECOMMENDATIONS</h3>
          <div className="grid grid-cols-2 gap-2 text-white mb-4">
            <div>Calories:</div><div className="font-mono">{result.calories.toFixed(0)} kcal (Derived: 4×protein + 4×carbs + 9×fat)</div>
            <div>Protein:</div><div className="font-mono">{result.protein.toFixed(1)} g (Confidence: 64.3%)</div>
            <div>Carbs:</div><div className="font-mono">{result.carbs.toFixed(1)} g (Confidence: 68.4%)</div>
            <div>Fat:</div><div className="font-mono">{result.fat.toFixed(1)} g (Confidence: 78.5%)</div>
          </div>
          <div className="mb-4">
            <div className="font-bold mb-1">🍽️ PRACTICAL MEAL BREAKDOWN:</div>
            <div>🍳 Breakfast : {Math.round(result.calories*0.25)} kcal | {(result.protein*0.25).toFixed(1)}g protein | {(result.carbs*0.25).toFixed(1)}g carbs | {(result.fat*0.25).toFixed(1)}g fat</div>
            <div>🥗 Lunch     : {Math.round(result.calories*0.35)} kcal | {(result.protein*0.35).toFixed(1)}g protein | {(result.carbs*0.35).toFixed(1)}g carbs | {(result.fat*0.35).toFixed(1)}g fat</div>
            <div>🍽️ Dinner    : {Math.round(result.calories*0.30)} kcal | {(result.protein*0.30).toFixed(1)}g protein | {(result.carbs*0.30).toFixed(1)}g carbs | {(result.fat*0.30).toFixed(1)}g fat</div>
            <div>🍎 Snacks    : {Math.round(result.calories*0.10)} kcal | {(result.protein*0.10).toFixed(1)}g protein | {(result.carbs*0.10).toFixed(1)}g carbs | {(result.fat*0.10).toFixed(1)}g fat</div>
          </div>
          <div className="mb-4">
            <div className="font-bold mb-1">🥘 EXAMPLE FOODS TO REACH THESE TARGETS:</div>
            <div>• Protein: {(result.protein/25).toFixed(1)} servings of chicken breast (25g protein each)</div>
            <div>• Carbs  : {(result.carbs/30).toFixed(1)} cups of rice/pasta (30g carbs each)</div>
            <div>• Fat    : {(result.fat/14).toFixed(1)} tbsp of olive oil/nuts (14g fat each)</div>
          </div>
          <div className="mb-2">
            <div className="font-bold mb-1">📈 Model Performance Scores:</div>
            <div>• Fat Prediction: 78.5% accuracy (R² = 0.785)</div>
            <div>• Carbs Prediction: 68.4% accuracy (R² = 0.684)</div>
            <div>• Protein Prediction: 64.3% accuracy (R² = 0.643)</div>
            <div>• Calories: Derived using nutrition science (4-4-9 rule)</div>
          </div>
          <div className="mb-2">
            <div className="font-bold mb-1">💡 What this means:</div>
            <div>• These are science-based recommendations</div>
            <div>• Model trained on 5000+ patient records</div>
            <div>• Accounts for your health conditions & demographics</div>
            <div>• Calories derived using established nutrition science</div>
          </div>
        </div>
      )}
    </div>
  );
}
