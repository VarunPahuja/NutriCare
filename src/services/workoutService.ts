
import { supabase } from "@/integrations/supabase/client";
import { WorkoutSession, Exercise } from "@/pages/TrackWorkout";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Function to fetch and parse CSV workout data from Supabase storage
export const fetchWorkoutDataFromCSV = async (): Promise<WorkoutSession[]> => {
  try {
    // Fetch the CSV file from the 'workouts' bucket
    const { data, error } = await supabase.storage
      .from('workouts')
      .download('workout_data.csv');
    
    if (error || !data) {
      console.error('Error fetching workout CSV:', error);
      return [];
    }

    // Parse the CSV content
    const text = await data.text();
    const rows = text.split('\n');
    
    // Skip header row and parse each data row
    const workouts: WorkoutSession[] = [];
    
    // Assuming CSV format: id,date,type,duration,exercises (JSON string)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;
      
      const columns = row.split(',');
      if (columns.length < 5) continue;
      
      // Parse exercises from JSON string
      let exercises: Exercise[] = [];
      try {
        exercises = JSON.parse(columns[4].replace(/"/g, ''));
      } catch (e) {
        console.warn('Could not parse exercises JSON:', e);
      }
      
      workouts.push({
        id: parseInt(columns[0]),
        date: columns[1],
        type: columns[2],
        duration: parseInt(columns[3]),
        exercises,
      });
    }
    
    // Store workouts in localStorage for offline access
    localStorage.setItem('nutricare_workout_history', JSON.stringify(workouts));
    return workouts;
  } catch (error) {
    console.error('Error processing workout data:', error);
    return [];
  }
};

// Function to save workout data to Supabase database
export const saveWorkoutToSupabase = async (workout: WorkoutSession): Promise<boolean> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    if (!userId) {
      toast.error("You must be logged in to save workouts");
      return false;
    }
    
    // Convert Exercise[] to Json type by using JSON.stringify and then parsing it
    // This satisfies TypeScript's type checking while preserving the data structure
    const exercisesJson = JSON.parse(JSON.stringify(workout.exercises)) as Json;
    
    const { error } = await supabase.from('workouts').insert({
      user_id: userId,
      date: new Date(workout.date).toISOString(),
      type: workout.type,
      duration: workout.duration,
      exercises: exercisesJson
    });
    
    if (error) {
      console.error('Error saving workout to Supabase:', error);
      toast.error("Failed to save workout data");
      return false;
    }
    
    toast.success("Workout saved to your account");
    return true;
  } catch (error) {
    console.error('Error in saveWorkoutToSupabase:', error);
    return false;
  }
};

// Function to fetch workout data from Supabase database
export const fetchWorkoutsFromSupabase = async (): Promise<WorkoutSession[]> => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching workouts from Supabase:', error);
      return [];
    }
    
    // Transform database records to WorkoutSession format
    const workouts: WorkoutSession[] = data.map(record => {
      // Safely cast the exercises field from Json to Exercise[]
      const exercises = (record.exercises as unknown) as Exercise[];
      
      return {
        id: parseInt(record.id.slice(0, 8), 16), // Create a numeric ID from UUID
        date: record.date,
        type: record.type,
        duration: record.duration,
        exercises: exercises || []
      };
    });
    
    return workouts;
  } catch (error) {
    console.error('Error in fetchWorkoutsFromSupabase:', error);
    return [];
  }
};
