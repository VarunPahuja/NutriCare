
// Supabase removed - using localStorage only
// import { supabase } from "@/integrations/supabase/client";
import { WorkoutSession, Exercise } from "@/pages/TrackWorkout";
import { toast } from "sonner";
// import { Json } from "@/integrations/supabase/types";

// Function to fetch and parse CSV workout data from Supabase storage
export const fetchWorkoutDataFromCSV = async (): Promise<WorkoutSession[]> => {
  try {
    // Supabase storage removed - return empty array
    console.log('Supabase removed - no CSV data available');
    return [];
  } catch (error) {
    console.error('Error processing workout data:', error);
    return [];
  }
};

// Function to save workout data to Supabase database
// Supabase removed - using localStorage only
export const saveWorkoutToSupabase = async (workout: WorkoutSession): Promise<boolean> => {
  try {
    // Save to localStorage instead of Supabase
    const existingWorkouts = localStorage.getItem('nutricare_workout_history');
    const workouts: WorkoutSession[] = existingWorkouts ? JSON.parse(existingWorkouts) : [];
    workouts.push(workout);
    localStorage.setItem('nutricare_workout_history', JSON.stringify(workouts));
    
    toast.success("Workout saved locally");
    return true;
  } catch (error) {
    console.error('Error in saveWorkoutToSupabase:', error);
    toast.error("Failed to save workout data");
    return false;
  }
};

// Function to fetch workout data from Supabase database
// Supabase removed - using localStorage only
export const fetchWorkoutsFromSupabase = async (): Promise<WorkoutSession[]> => {
  try {
    // Fetch from localStorage instead of Supabase
    const existingWorkouts = localStorage.getItem('nutricare_workout_history');
    if (existingWorkouts) {
      return JSON.parse(existingWorkouts) as WorkoutSession[];
    }
    return [];
  } catch (error) {
    console.error('Error in fetchWorkoutsFromSupabase:', error);
    return [];
  }
};
