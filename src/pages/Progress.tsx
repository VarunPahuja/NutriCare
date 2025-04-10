
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, CalendarDays, Utensils, Scale, Timer } from 'lucide-react';

const weeklyData = [
  { name: 'Mon', calories: 1720, target: 1800, proteins: 110, carbs: 180, fats: 60 },
  { name: 'Tue', calories: 1850, target: 1800, proteins: 120, carbs: 165, fats: 65 },
  { name: 'Wed', calories: 1650, target: 1800, proteins: 105, carbs: 150, fats: 55 },
  { name: 'Thu', calories: 1950, target: 1800, proteins: 130, carbs: 190, fats: 70 },
  { name: 'Fri', calories: 1780, target: 1800, proteins: 115, carbs: 160, fats: 62 },
  { name: 'Sat', calories: 2100, target: 1800, proteins: 125, carbs: 210, fats: 75 },
  { name: 'Sun', calories: 1600, target: 1800, proteins: 100, carbs: 145, fats: 58 },
];

const monthlyData = [
  { name: 'Week 1', weight: 72.5, bodyFat: 25, water: 60 },
  { name: 'Week 2', weight: 72.1, bodyFat: 24.7, water: 61 },
  { name: 'Week 3', weight: 71.8, bodyFat: 24.5, water: 62 },
  { name: 'Week 4', weight: 71.3, bodyFat: 24.1, water: 63 },
];

const Progress = () => {
  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10"></div>
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10"></div>
      
      {/* Navigation */}
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold gradient-text">
            Your Progress
          </h1>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Card className="bg-fitness-card/90 border-fitness-border p-3 flex items-center space-x-3">
              <div className="p-2 bg-fitness-muted rounded-full">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Weekly Goal Progress</p>
                <p className="text-lg font-bold">87%</p>
              </div>
            </Card>
            
            <Card className="bg-fitness-card/90 border-fitness-border p-3 flex items-center space-x-3">
              <div className="p-2 bg-fitness-muted rounded-full">
                <CalendarDays className="h-5 w-5 text-fitness-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Streak</p>
                <p className="text-lg font-bold">12 days</p>
              </div>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="nutrition" className="mb-8">
          <TabsList className="bg-fitness-muted/70 backdrop-blur-sm w-full justify-start">
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="measurements">Body Measurements</TabsTrigger>
            <TabsTrigger value="activity">Physical Activity</TabsTrigger>
            <TabsTrigger value="habits">Habits & Sleep</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nutrition" className="mt-6 space-y-6">
            <Card className="bg-fitness-card/90 border-fitness-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="mr-2 h-5 w-5 text-fitness-primary" />
                  Calorie Intake
                </CardTitle>
                <CardDescription>
                  Past 7 days compared to your daily target
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2E303E" />
                      <XAxis dataKey="name" stroke="#8E9196" />
                      <YAxis stroke="#8E9196" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1D1E26', border: '1px solid #2E303E' }}
                        labelStyle={{ color: 'white' }}
                      />
                      <Bar dataKey="calories" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" fill="#3ABFF8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle className="text-lg">Macronutrient Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Protein</span>
                        <span>115g / 120g</span>
                      </div>
                      <div className="w-full bg-fitness-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Carbs</span>
                        <span>180g / 200g</span>
                      </div>
                      <div className="w-full bg-fitness-muted rounded-full h-2.5">
                        <div className="bg-fitness-primary h-2.5 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Fat</span>
                        <span>62g / 60g</span>
                      </div>
                      <div className="w-full bg-fitness-muted rounded-full h-2.5">
                        <div className="bg-fitness-accent h-2.5 rounded-full" style={{ width: '103%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle className="text-lg">Nutrient Focus Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Fiber</span>
                        <span>22g / 25g</span>
                      </div>
                      <div className="w-full bg-fitness-muted rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Sugar</span>
                        <span>18g / 25g</span>
                      </div>
                      <div className="w-full bg-fitness-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Sodium</span>
                        <span>1850mg / 2000mg</span>
                      </div>
                      <div className="w-full bg-fitness-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle className="text-lg">Water Intake</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="#2E303E" 
                          strokeWidth="10"
                        />
                        <circle
                          cx="50" cy="50" r="45"
                          fill="none"
                          stroke="#3ABFF8"
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset="70"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                        75%
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium">1.5L / 2.0L</p>
                      <p className="text-sm text-gray-400">6 glasses out of 8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="measurements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scale className="mr-2 h-5 w-5 text-fitness-primary" />
                    Weight Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2E303E" />
                        <XAxis dataKey="name" stroke="#8E9196" />
                        <YAxis stroke="#8E9196" domain={['dataMin - 1', 'dataMax + 1']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1D1E26', border: '1px solid #2E303E' }}
                          labelStyle={{ color: 'white' }}
                        />
                        <Line type="monotone" dataKey="weight" stroke="#FF6B00" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-fitness-card/90 border-fitness-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Timer className="mr-2 h-5 w-5 text-fitness-primary" />
                    Body Composition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2E303E" />
                        <XAxis dataKey="name" stroke="#8E9196" />
                        <YAxis stroke="#8E9196" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1D1E26', border: '1px solid #2E303E' }}
                          labelStyle={{ color: 'white' }}
                        />
                        <Line type="monotone" dataKey="bodyFat" name="Body Fat %" stroke="#FF6B00" strokeWidth={2} />
                        <Line type="monotone" dataKey="water" name="Water %" stroke="#3ABFF8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="text-center py-12 text-gray-400">
              <h3 className="text-lg font-medium">Activity tracking coming soon</h3>
              <p className="mt-2">We're working on integrating with your favorite fitness trackers</p>
            </div>
          </TabsContent>
          
          <TabsContent value="habits">
            <div className="text-center py-12 text-gray-400">
              <h3 className="text-lg font-medium">Habit tracking coming soon</h3>
              <p className="mt-2">Track your sleep patterns and build healthy habits</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Progress;
