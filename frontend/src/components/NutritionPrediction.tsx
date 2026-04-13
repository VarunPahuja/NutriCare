import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

const API_BASE_URL = import.meta.env.BACKEND_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

interface PredictionResult {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  bmi: number;
  ratios: { carb: number; protein: number; fat: number };
}

export default function NutritionPrediction() {
  const { profile } = useAuth();
  const [input, setInput] = useState(defaultInput);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<Array<{ result: PredictionResult; date: string }>>([]);
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
    const payload: Record<string, number> = {
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
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const predictionResult: PredictionResult = { ...data, bmi, ratios };
      setResult(predictionResult);

      // Save to prediction_history if user is logged in
      if (profile) {
        await supabase.from('prediction_history').insert({
          patient_id: profile.id,
          inputs: input as Record<string, unknown>,
          result: { protein: data.protein, carbs: data.carbs, fat: data.fat, calories: data.calories },
        });
        setHistory(prev => [{ result: predictionResult, date: new Date().toISOString() }, ...prev].slice(0, 3));
      }
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.toLowerCase().includes('fetch')) {
        setError('Cannot connect to prediction server. Make sure the backend is running on ' + API_BASE_URL);
      } else {
        const message = err instanceof Error ? err.message : 'Prediction failed';
        setError(`Prediction failed: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fitness-card p-6 rounded-lg shadow-md bg-fitness-background/80 border border-fitness-primary/20 mb-8">
      <h2 className="text-2xl font-bold text-fitness-primary mb-2">Personalized Nutrition Prediction</h2>
      <p className="text-sm text-gray-400 mb-4">AI-powered prediction based on your health profile.</p>
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
          <div className="flex gap-6 flex-wrap">
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
            <div>Protein:</div><div className="font-mono">{result.protein.toFixed(1)} g</div>
            <div>Carbs:</div><div className="font-mono">{result.carbs.toFixed(1)} g</div>
            <div>Fat:</div><div className="font-mono">{result.fat.toFixed(1)} g</div>
          </div>
          <div className="mb-4">
            <div className="font-bold mb-1">🍽️ PRACTICAL MEAL BREAKDOWN:</div>
            <div>🍳 Breakfast : {Math.round(result.calories*0.25)} kcal | {(result.protein*0.25).toFixed(1)}g protein | {(result.carbs*0.25).toFixed(1)}g carbs | {(result.fat*0.25).toFixed(1)}g fat</div>
            <div>🥗 Lunch     : {Math.round(result.calories*0.35)} kcal | {(result.protein*0.35).toFixed(1)}g protein | {(result.carbs*0.35).toFixed(1)}g carbs | {(result.fat*0.35).toFixed(1)}g fat</div>
            <div>🍽️ Dinner    : {Math.round(result.calories*0.30)} kcal | {(result.protein*0.30).toFixed(1)}g protein | {(result.carbs*0.30).toFixed(1)}g carbs | {(result.fat*0.30).toFixed(1)}g fat</div>
            <div>🍎 Snacks    : {Math.round(result.calories*0.10)} kcal | {(result.protein*0.10).toFixed(1)}g protein | {(result.carbs*0.10).toFixed(1)}g carbs | {(result.fat*0.10).toFixed(1)}g fat</div>
          </div>
          <div className="mb-2">
            <div className="font-bold mb-1">💡 What this means:</div>
            <div>• AI-powered prediction based on your health profile</div>
            <div>• Accounts for your health conditions &amp; demographics</div>
            <div>• Calories derived using established nutrition science (4-4-9 rule)</div>
          </div>
        </div>
      )}

      {/* Prediction history */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-300 mb-3">Recent Predictions</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="bg-fitness-muted/30 rounded p-3 border border-fitness-border text-sm">
                <p className="text-xs text-gray-400 mb-1">{new Date(h.date).toLocaleString()}</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div><p className="text-xs text-gray-500">Calories</p><p className="font-medium">{h.result.calories.toFixed(0)}</p></div>
                  <div><p className="text-xs text-gray-500">Protein</p><p className="font-medium">{h.result.protein.toFixed(1)}g</p></div>
                  <div><p className="text-xs text-gray-500">Carbs</p><p className="font-medium">{h.result.carbs.toFixed(1)}g</p></div>
                  <div><p className="text-xs text-gray-500">Fat</p><p className="font-medium">{h.result.fat.toFixed(1)}g</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
