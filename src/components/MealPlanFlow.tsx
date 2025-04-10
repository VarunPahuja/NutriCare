
import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Card } from '@/components/ui/card';

interface NutritionData {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const data: NutritionData[] = [
  { day: 'Mon', calories: 1750, protein: 120, carbs: 180, fat: 45 },
  { day: 'Tue', calories: 1830, protein: 135, carbs: 190, fat: 48 },
  { day: 'Wed', calories: 1650, protein: 110, carbs: 170, fat: 42 },
  { day: 'Thu', calories: 1900, protein: 140, carbs: 200, fat: 50 },
  { day: 'Fri', calories: 1800, protein: 125, carbs: 185, fat: 47 },
  { day: 'Sat', calories: 2100, protein: 150, carbs: 220, fat: 55 },
  { day: 'Sun', calories: 1950, protein: 130, carbs: 210, fat: 52 },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-3 bg-fitness-card border border-fitness-border shadow-lg">
        <p className="text-sm font-medium mb-1">{label}</p>
        <p className="text-xs text-fitness-primary">
          {payload[0].name}: {payload[0].value}
        </p>
        <p className="text-xs text-blue-400">
          Protein: {payload[1]?.value}g
        </p>
        <p className="text-xs text-purple-400">
          Fat: {payload[2]?.value}g
        </p>
      </Card>
    );
  }
  return null;
};

const MealPlanFlow = () => {
  const [chartWidth, setChartWidth] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      setChartWidth(chartContainerRef.current.offsetWidth);
    }
    
    const handleResize = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const metrics = [
    { name: 'Calories', value: '1,854', unit: 'kcal', change: '+3.2%', color: 'text-fitness-primary' },
    { name: 'Avg. Protein', value: '130', unit: 'g', change: '+5.4%', color: 'text-blue-400' },
    { name: 'Avg. Carbs', value: '193', unit: 'g', change: '-2.1%', color: 'text-purple-400' },
  ];

  return (
    <div className="fitness-card p-5">
      <h2 className="text-lg font-semibold mb-4 header-underline">Nutrition Intake Chart</h2>
      
      <div className="grid grid-cols-3 gap-3 mb-5">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-fitness-muted/40 p-3 rounded-lg border border-fitness-border">
            <div className={`text-sm ${metric.color}`}>{metric.name}</div>
            <div className="flex items-end mt-1">
              <span className="text-lg font-bold">{metric.value}</span>
              <span className="text-xs ml-1 text-gray-400">{metric.unit}</span>
            </div>
            <div className={`text-xs mt-1 ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {metric.change} last week
            </div>
          </div>
        ))}
      </div>
      
      <div ref={chartContainerRef} className="w-full relative">
        <div className="absolute -top-5 -left-5 w-32 h-32 shape-blob opacity-20"></div>
        <div className="absolute -bottom-5 -right-5 w-32 h-32 shape-blob opacity-20"></div>
        
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="calories"
              name="Calories"
              stroke="#FF6B00"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#FF6B00', strokeWidth: 2 }}
              className="animate-float"
            />
            <Line
              type="monotone"
              dataKey="protein"
              name="Protein"
              stroke="#3ABFF8"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#3ABFF8', strokeWidth: 2 }}
              className="animate-float"
              style={{ animationDelay: '0.5s' }}
            />
            <Line
              type="monotone"
              dataKey="fat"
              name="Fat"
              stroke="#D8B4FE"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: '#D8B4FE', strokeWidth: 2 }}
              className="animate-float"
              style={{ animationDelay: '1s' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MealPlanFlow;
