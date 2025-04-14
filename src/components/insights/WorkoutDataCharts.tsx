
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";

const WorkoutDataCharts = () => {
  const { 
    totalWeightByDay, 
    popularExercises, 
    personalRecords, 
    volumeOverTime,
    isLoading, 
    error 
  } = useWorkoutData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fitness-card">
          <CardHeader>
            <CardTitle>Loading Data</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-fitness-primary text-lg">Loading workout data...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fitness-card">
          <CardHeader>
            <CardTitle>Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-red-400 text-lg">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!totalWeightByDay.length) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="fitness-card">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-gray-400 text-lg">No workout data found in the database</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Total Weight Lifted Per Day Chart */}
      <Card className="fitness-card">
        <CardHeader>
          <CardTitle>Total Weight Lifted Per Day</CardTitle>
          <CardDescription>Sum of weight × repetitions grouped by date</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer 
            config={{
              totalWeight: { label: "Total Weight", color: "#9b87f5" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={totalWeightByDay}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <ChartTooltip 
                  content={props => (
                    <ChartTooltipContent 
                      {...props}
                      labelKey="date"
                      indicator="dot"
                    />
                  )}
                />
                <Legend />
                <Bar dataKey="totalWeight" name="Total Weight" fill="var(--color-totalWeight, #9b87f5)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Most Performed Exercises Chart */}
      <Card className="fitness-card">
        <CardHeader>
          <CardTitle>Most Performed Exercises</CardTitle>
          <CardDescription>Top 10 exercises by frequency</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer 
            config={{
              count: { label: "Frequency", color: "#1EAEDB" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={popularExercises}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="exercise" type="category" stroke="#888" width={120} />
                <ChartTooltip 
                  content={props => (
                    <ChartTooltipContent 
                      {...props}
                      labelKey="exercise"
                      indicator="dot"
                    />
                  )}
                />
                <Legend />
                <Bar dataKey="count" name="Frequency" fill="var(--color-count, #1EAEDB)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Personal Record (PR) per Exercise */}
      <Card className="fitness-card">
        <CardHeader>
          <CardTitle>Personal Records</CardTitle>
          <CardDescription>Highest weight per exercise</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer 
            config={{
              maxWeight: { label: "Max Weight (kg)", color: "#7E69AB" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={personalRecords.slice(0, 10)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="exercise" type="category" stroke="#888" width={120} />
                <ChartTooltip 
                  content={props => (
                    <ChartTooltipContent 
                      {...props}
                      labelKey="exercise"
                      indicator="dot"
                    />
                  )}
                />
                <Legend />
                <Bar dataKey="maxWeight" name="Max Weight (kg)" fill="var(--color-maxWeight, #7E69AB)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Volume Over Time */}
      <Card className="fitness-card">
        <CardHeader>
          <CardTitle>Volume Over Time</CardTitle>
          <CardDescription>Track your total workout volume progress</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer 
            config={{
              volume: { label: "Total Volume", color: "#9b87f5" }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={volumeOverTime}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <ChartTooltip 
                  content={props => (
                    <ChartTooltipContent 
                      {...props}
                      labelKey="date"
                      indicator="dot"
                    />
                  )}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  name="Volume" 
                  stroke="var(--color-volume, #9b87f5)" 
                  strokeWidth={2}
                  dot={{ r: 4 }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutDataCharts;
