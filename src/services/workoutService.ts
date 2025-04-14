
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
    
    // Insert individual workout sets as separate rows in the workouts table
    // Each exercise in the workout becomes multiple rows (one per set)
    for (const exercise of workout.exercises) {
      for (let i = 0; i < exercise.sets; i++) {
        const { error } = await supabase.from('workouts').insert({
          date: new Date(workout.date).toISOString(),
          exercise_name: exercise.name,
          set_weight: exercise.weight,
          set_repetitions: exercise.reps,
          comment: workout.comment || null
        });
        
        if (error) {
          console.error('Error saving workout set to Supabase:', error);
          toast.error("Failed to save workout data");
          return false;
        }
      }
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
    
    // Group records by date and exercise to reconstruct the WorkoutSession format
    const workoutsByDate = new Map<string, WorkoutSession>();
    let workoutId = 0;
    
    for (const record of data) {
      const dateKey = record.date.split('T')[0]; // Extract YYYY-MM-DD
      
      if (!workoutsByDate.has(dateKey)) {
        workoutId++;
        workoutsByDate.set(dateKey, {
          id: workoutId,
          date: dateKey,
          type: 'strength', // Default type, assuming strength training
          duration: 3600, // Default duration (1 hour)
          exercises: [],
          comment: record.comment || ''
        });
      }
      
      const session = workoutsByDate.get(dateKey)!;
      
      // Check if exercise already exists in the session
      let exercise = session.exercises.find(ex => ex.name === record.exercise_name);
      
      if (!exercise) {
        exercise = {
          id: session.exercises.length + 1,
          name: record.exercise_name,
          sets: 1,
          reps: record.set_repetitions,
          weight: record.set_weight
        };
        session.exercises.push(exercise);
      } else {
        // Increment the sets count for this exercise
        exercise.sets += 1;
      }
    }
    
    return Array.from(workoutsByDate.values());
  } catch (error) {
    console.error('Error in fetchWorkoutsFromSupabase:', error);
    return [];
  }
};
