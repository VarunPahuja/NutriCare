
import React from 'react';
import Navbar from '@/components/Navbar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPie, BarChart2, TrendingUp, Calendar } from 'lucide-react';

const MyInsights = () => {
  // Sample data for charts
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
          <TabsList className="grid w-full md:w-1/2 grid-cols-3 mb-8">
            <TabsTrigger value="nutrition" className="flex gap-2 items-center">
              <ChartPie className="h-4 w-4" /> Nutrition
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex gap-2 items-center">
              <TrendingUp className="h-4 w-4" /> Progress
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex gap-2 items-center">
              <BarChart2 className="h-4 w-4" /> Calories
            </TabsTrigger>
          </TabsList>
          
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
        </Tabs>
      </main>
    </div>
  );
};

export default MyInsights;
