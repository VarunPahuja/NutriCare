import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Timer, 
  Plus, 
  Trash2, 
  Dumbbell, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw,
  Save
} from 'lucide-react';
import { toast } from "sonner";

export interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface WorkoutSession {
  id: number;
  date: string;
  type: string;
  duration: number;
  exercises: Exercise[];
}

const WORKOUT_HISTORY_KEY = 'nutricare_workout_history';

const TrackWorkout = () => {
  const [workoutType, setWorkoutType] = useState('strength');
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 1, name: 'Squats', sets: 3, reps: 12, weight: 135 },
    { id: 2, name: 'Bench Press', sets: 3, reps: 10, weight: 155 },
  ]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(WORKOUT_HISTORY_KEY);
    if (savedHistory) {
      try {
        setWorkoutHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse workout history:', e);
      }
    }
  }, []);

  React.useEffect(() => {
    let interval: number | undefined;
    if (timerActive) {
      interval = window.setInterval(() => {
        setTimerSeconds(seconds => seconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAddExercise = () => {
    const newId = exercises.length > 0 ? Math.max(...exercises.map(ex => ex.id)) + 1 : 1;
    setExercises([...exercises, { id: newId, name: 'New Exercise', sets: 3, reps: 10, weight: 0 }]);
  };

  const handleRemoveExercise = (id: number) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const handleSaveWorkout = () => {
    const newWorkout: WorkoutSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: workoutType,
      duration: timerSeconds,
      exercises: [...exercises]
    };
    
    const updatedHistory = [...workoutHistory, newWorkout];
    setWorkoutHistory(updatedHistory);
    
    localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(updatedHistory));
    
    toast.success("Workout saved successfully!", {
      description: `${exercises.length} exercises recorded in ${formatTime(timerSeconds)}. Data available in My Insights.`,
      duration: 4000,
    });
    
    setTimerSeconds(0);
    setTimerActive(false);
  };

  const BlurredCircle = ({ className }: { className: string }) => (
    <div className={`absolute rounded-full mix-blend-overlay blur-3xl ${className}`}></div>
  );

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <BlurredCircle className="w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10" />
      <BlurredCircle className="w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10" />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold gradient-text">
              Track Workout
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="fitness-card col-span-1">
            <CardHeader>
              <CardTitle>Workout Type</CardTitle>
              <CardDescription>Select your workout type</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={workoutType} onValueChange={setWorkoutType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select workout type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">
                    <div className="flex items-center">
                      <Dumbbell className="mr-2 h-4 w-4" />
                      <span>Strength Training</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cardio">
                    <div className="flex items-center">
                      <Activity className="mr-2 h-4 w-4" />
                      <span>Cardio</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="hiit">
                    <div className="flex items-center">
                      <Timer className="mr-2 h-4 w-4" />
                      <span>HIIT</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="fitness-card col-span-1">
            <CardHeader>
              <CardTitle>Workout Timer</CardTitle>
              <CardDescription>Track your workout duration</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="text-4xl font-bold text-center my-4">
                {formatTime(timerSeconds)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setTimerActive(!timerActive)}
              >
                {timerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setTimerSeconds(0)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="fitness-card col-span-1">
            <CardHeader>
              <CardTitle>Complete Workout</CardTitle>
              <CardDescription>Save your workout progress</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-24">
              <Button 
                onClick={handleSaveWorkout}
                className="bg-fitness-primary hover:bg-fitness-primary/80 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Workout
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="fitness-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Exercises</CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddExercise}>
                <Plus className="h-4 w-4 mr-2" /> Add Exercise
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="fitness-card p-4 flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Exercise name"
                      value={exercise.name}
                      onChange={(e) => {
                        const newExercises = exercises.map(ex =>
                          ex.id === exercise.id ? { ...ex, name: e.target.value } : ex
                        );
                        setExercises(newExercises);
                      }}
                      className="bg-fitness-muted/30"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="w-full md:w-24">
                      <Input
                        type="number"
                        placeholder="Sets"
                        value={exercise.sets}
                        onChange={(e) => {
                          const newExercises = exercises.map(ex =>
                            ex.id === exercise.id ? { ...ex, sets: Number(e.target.value) } : ex
                          );
                          setExercises(newExercises);
                        }}
                        className="bg-fitness-muted/30"
                      />
                    </div>
                    <div className="w-full md:w-24">
                      <Input
                        type="number"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={(e) => {
                          const newExercises = exercises.map(ex =>
                            ex.id === exercise.id ? { ...ex, reps: Number(e.target.value) } : ex
                          );
                          setExercises(newExercises);
                        }}
                        className="bg-fitness-muted/30"
                      />
                    </div>
                    <div className="w-full md:w-28">
                      <Input
                        type="number"
                        placeholder="Weight"
                        value={exercise.weight}
                        onChange={(e) => {
                          const newExercises = exercises.map(ex =>
                            ex.id === exercise.id ? { ...ex, weight: Number(e.target.value) } : ex
                          );
                          setExercises(newExercises);
                        }}
                        className="bg-fitness-muted/30"
                      />
                    </div>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => handleRemoveExercise(exercise.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {exercises.length === 0 && (
                <div className="text-center p-6 text-gray-400">
                  No exercises added. Click "Add Exercise" to start tracking.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TrackWorkout;
