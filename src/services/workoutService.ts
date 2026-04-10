import { supabase } from '@/lib/supabase';
import type { WorkoutLog } from '@/types/database';
import { toast } from 'sonner';

// Save a workout log to Supabase
export const saveWorkout = async (log: Omit<WorkoutLog, 'id' | 'created_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase.from('workout_logs').insert(log);
    if (error) throw error;
    toast.success('Workout saved successfully!');
    return true;
  } catch (error) {
    console.error('Error saving workout:', error);
    toast.error('Failed to save workout');
    return false;
  }
};

// Delete a workout log from Supabase
export const deleteWorkout = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('workout_logs').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
};

// Get all workout logs for a specific patient
export const getWorkouts = async (patientId: string): Promise<WorkoutLog[]> => {
  try {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
};

// Deprecated: CSV import stub (kept for API compatibility)
export const fetchWorkoutDataFromCSV = async (): Promise<never[]> => {
  console.log('CSV import is deprecated — use getWorkouts() instead');
  return [];
};
