import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { WorkoutLog } from '@/types/database';
import { toast } from 'sonner';

// Legacy types kept for MyInsights compatibility
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
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [totalWeightByDay] = useState<TotalWeightByDay[]>([]);
  const [popularExercises] = useState<ExerciseFrequency[]>([]);
  const [personalRecords] = useState<PersonalRecord[]>([]);
  const [volumeOverTime] = useState<VolumeOverTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkoutData() {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setIsLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('workout_logs')
          .select('*')
          .eq('patient_id', session.user.id)
          .order('date', { ascending: false });

        if (fetchError) throw fetchError;
        setLogs(data || []);
        setWorkoutData([]); // workout_logs use different schema, keep legacy type empty
      } catch (err) {
        console.error('Error fetching workout data:', err);
        setError('Failed to load workout data');
        toast.error('Failed to load workout data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkoutData();
  }, []);

  return {
    logs,
    workoutData,
    totalWeightByDay,
    popularExercises,
    personalRecords,
    volumeOverTime,
    isLoading,
    error,
  };
}
