
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WorkoutData {
  date: string;
  exercise_name: string;
  set_weight: number;
  set_repetitions: number;
  comment: string | null;
}

export interface TotalWeightByDay {
  date: string;
  totalWeight: number;
}

export interface ExerciseFrequency {
  exercise: string;
  count: number;
}

export interface PersonalRecord {
  exercise: string;
  maxWeight: number;
}

export interface VolumeOverTime {
  date: string;
  volume: number;
}

export function useWorkoutData() {
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [totalWeightByDay, setTotalWeightByDay] = useState<TotalWeightByDay[]>([]);
  const [popularExercises, setPopularExercises] = useState<ExerciseFrequency[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [volumeOverTime, setVolumeOverTime] = useState<VolumeOverTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkoutData() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setWorkoutData(data as WorkoutData[]);
          processWorkoutData(data as WorkoutData[]);
        }
      } catch (error) {
        console.error('Error fetching workout data:', error);
        setError('Failed to load workout data');
        toast.error('Failed to load workout data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkoutData();
  }, []);

  const processWorkoutData = (data: WorkoutData[]) => {
    // Process total weight lifted per day
    const weightByDayMap = new Map<string, number>();
    
    // Process volume over time
    const volumeByDayMap = new Map<string, number>();
    
    // Process exercise frequency
    const exerciseCountMap = new Map<string, number>();
    
    // Process personal records
    const prMap = new Map<string, number>();

    data.forEach(workout => {
      // Format date to YYYY-MM-DD
      const dateStr = new Date(workout.date).toISOString().split('T')[0];
      
      // Calculate total weight for this set
      const setWeight = workout.set_weight * workout.set_repetitions;
      
      // Add to total weight by day
      weightByDayMap.set(dateStr, (weightByDayMap.get(dateStr) || 0) + setWeight);
      
      // Add to volume by day
      volumeByDayMap.set(dateStr, (volumeByDayMap.get(dateStr) || 0) + setWeight);
      
      // Count exercise frequency
      exerciseCountMap.set(workout.exercise_name, (exerciseCountMap.get(workout.exercise_name) || 0) + 1);
      
      // Check for personal record
      const currentPR = prMap.get(workout.exercise_name) || 0;
      if (workout.set_weight > currentPR) {
        prMap.set(workout.exercise_name, workout.set_weight);
      }
    });

    // Convert maps to arrays for charts
    const weightByDay = Array.from(weightByDayMap, ([date, totalWeight]) => ({ date, totalWeight }));
    weightByDay.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setTotalWeightByDay(weightByDay);

    const volumeByDay = Array.from(volumeByDayMap, ([date, volume]) => ({ date, volume }));
    volumeByDay.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setVolumeOverTime(volumeByDay);

    const exerciseFrequency = Array.from(exerciseCountMap, ([exercise, count]) => ({ exercise, count }));
    exerciseFrequency.sort((a, b) => b.count - a.count);
    setPopularExercises(exerciseFrequency.slice(0, 10)); // Get top 10

    const records = Array.from(prMap, ([exercise, maxWeight]) => ({ exercise, maxWeight }));
    records.sort((a, b) => b.maxWeight - a.maxWeight);
    setPersonalRecords(records);
  };

  return {
    workoutData,
    totalWeightByDay,
    popularExercises,
    personalRecords,
    volumeOverTime,
    isLoading,
    error
  };
}
