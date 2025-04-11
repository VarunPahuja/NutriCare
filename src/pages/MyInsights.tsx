
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie, BarChart2, TrendingUp, Calendar, Dumbbell, Timer } from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { WorkoutSession } from './TrackWorkout';

const MyInsights = () => {
  // Sample data for nutrition charts
  const nutritionData = [
    { name: 'Mon', protein: 120, carbs: 180, fat: 60 },
    { name: 'Tue', protein: 145, carbs: 150, fat: 55 },
    { name: 'Wed', protein: 130, carbs: 190, fat: 70 },
    { name: 'Thu', protein: 160, carbs: 170, fat: 65 },
    { name: 'Fri', protein: 125, carbs: 200, fat: 75 },
    { name: 'Sat', protein: 150, carbs: 160, fat: 50 },
    { name: 'Sun', protein: 140, carbs: 185, fat: 60 },
  ];

  const weightData = [
    { date: 'Jan', weight: 188 },
    { date: 'Feb', weight: 186 },
    { date: 'Mar', weight: 185 },
    { date: 'Apr', weight: 183 },
    { date: 'May', weight: 180 },
    { date: 'Jun', weight: 178 },
    { date: 'Jul', weight: 176 },
  ];
  
  const calorieData = [
    { date: 'Mon', actual: 2200, target: 2400 },
    { date: 'Tue', actual: 2350, target: 2400 },
    { date: 'Wed', actual: 2150, target: 2400 },
    { date: 'Thu', actual: 2400, target: 2400 },
    { date: 'Fri', actual: 2300, target: 2400 },
    { date: 'Sat', actual: 2500, target: 2400 },
    { date: 'Sun', actual: 2450, target: 2400 },
  ];

  // State for workout data
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [workoutDurationData, setWorkoutDurationData] = useState<any[]>([]);
  const [workoutTypeData, setWorkoutTypeData] = useState<any[]>([]);

  // Load workout history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('nutricare_workout_history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setWorkoutHistory(parsedHistory);
        
        // Process workout data for charts
        processWorkoutData(parsedHistory);
      } catch (e) {
        console.error('Failed to parse workout history:', e);
      }
    }
  }, []);

  // Process workout data for visualization
  const processWorkoutData = (workoutData: WorkoutSession[]) => {
    // Process workout duration over time
    const durationData = workoutData.map(workout => ({
      date: format(parseISO(workout.date), 'MMM dd'),
      duration: Math.round(workout.duration / 60), // Convert seconds to minutes
    }));
    setWorkoutDurationData(durationData);

    // Process workout types
    const typeCount: Record<string, number> = {};
    workoutData.forEach(workout => {
      typeCount[workout.type] = (typeCount[workout.type] || 0) + 1;
    });
    
    const typeData = Object.keys(typeCount).map(type => ({
      type,
      count: typeCount[type]
    }));
    setWorkoutTypeData(typeData);
  };

  // Format time for display
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Background decoration elements
  const BlurredCircle = ({ className }: { className: string }) => (
    <div className={`absolute rounded-full mix-blend-overlay blur-3xl ${className}`}></div>
  );

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      {/* Background effects */}
      <BlurredCircle className="w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10" />
      <BlurredCircle className="w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10" />
      
      {/* Navigation */}
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold gradient-text">
              My Insights
            </h1>
          </div>
        </div>

        <Tabs defaultValue="nutrition" className="w-full">
          <TabsList className="grid w-full md:w-3/4 lg:w-1/2 grid-cols-4 mb-8">
            <TabsTrigger value="nutrition" className="flex gap-2 items-center">
              <ChartPie className="h-4 w-4" /> Nutrition
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex gap-2 items-center">
              <TrendingUp className="h-4 w-4" /> Progress
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex gap-2 items-center">
              <BarChart2 className="h-4 w-4" /> Calories
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex gap-2 items-center">
              <Dumbbell className="h-4 w-4" /> Workouts
            </TabsTrigger>
          </TabsList>
          
          {/* Nutrition Tab */}
          <TabsContent value="nutrition">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle>Weekly Macronutrient Breakdown</CardTitle>
                <CardDescription>Track your protein, carbs, and fat intake</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={nutritionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ background: '#222', border: '1px solid #333' }} 
                    />
                    <Legend />
                    <Bar dataKey="protein" name="Protein (g)" fill="#9b87f5" />
                    <Bar dataKey="carbs" name="Carbs (g)" fill="#1EAEDB" />
                    <Bar dataKey="fat" name="Fat (g)" fill="#7E69AB" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle>Weight Tracking</CardTitle>
                <CardDescription>Monthly weight progress (lbs)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weightData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip 
                      contentStyle={{ background: '#222', border: '1px solid #333' }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#9b87f5" 
                      strokeWidth={2}
                      dot={{ r: 4 }} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Calories Tab */}
          <TabsContent value="calories">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle>Calorie Tracking</CardTitle>
                <CardDescription>Daily calorie intake vs target</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={calorieData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip 
                      contentStyle={{ background: '#222', border: '1px solid #333' }} 
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      name="Actual Calories"
                      stroke="#9b87f5" 
                      strokeWidth={2}
                      dot={{ r: 4 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      name="Target Calories"
                      stroke="#1EAEDB" 
                      strokeWidth={2}
                      dot={{ r: 4 }} 
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Workouts Tab */}
          <TabsContent value="workouts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workout Duration Chart */}
              <Card className="fitness-card">
                <CardHeader>
                  <CardTitle>Workout Duration</CardTitle>
                  <CardDescription>Minutes spent working out per session</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={workoutDurationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ background: '#222', border: '1px solid #333' }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="duration" 
                        name="Duration (min)"
                        stroke="#9b87f5" 
                        strokeWidth={2}
                        dot={{ r: 4 }} 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Workout Type Distribution */}
              <Card className="fitness-card">
                <CardHeader>
                  <CardTitle>Workout Type Distribution</CardTitle>
                  <CardDescription>Breakdown of workout types</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={workoutTypeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="type" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ background: '#222', border: '1px solid #333' }} 
                      />
                      <Legend />
                      <Bar dataKey="count" name="Number of Workouts" fill="#1EAEDB" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Recent Workout History */}
              <Card className="fitness-card lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Workout History</CardTitle>
                  <CardDescription>Your latest recorded workouts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-fitness-border text-left">
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Type</th>
                          <th className="pb-3 font-medium">Duration</th>
                          <th className="pb-3 font-medium">Exercises</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workoutHistory.length > 0 ? (
                          [...workoutHistory]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 5)
                            .map((workout) => (
                              <tr key={workout.id} className="border-b border-fitness-border/30">
                                <td className="py-3">{format(parseISO(workout.date), 'MMM dd, yyyy')}</td>
                                <td className="py-3 capitalize">{workout.type}</td>
                                <td className="py-3">{formatTime(workout.duration)}</td>
                                <td className="py-3">{workout.exercises.length} exercises</td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-gray-400">
                              No workout data available. Track your workouts to see analysis here.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyInsights;
