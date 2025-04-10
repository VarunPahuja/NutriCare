
import React from 'react';
import { Activity, Droplet, HeartPulse, Moon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MacroProps {
  name: string;
  percent: number;
  color: string;
  value: string;
}

const MacroProgress = ({ name, percent, color, value }: MacroProps) => {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-300">{name}</span>
        <span className="text-xs text-gray-400">{value}</span>
      </div>
      <div className="relative h-2 w-full bg-fitness-muted rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  progress?: number;
}

const MetricCard = ({ icon, label, value, sublabel, progress }: MetricCardProps) => {
  return (
    <div className="flex items-center p-3 bg-fitness-secondary/40 rounded-lg border border-fitness-border">
      <div className="p-2 mr-3 rounded-lg bg-fitness-primary/10">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">{label}</span>
          <span className="text-sm font-semibold">{value}</span>
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-2" />
        )}
        {sublabel && (
          <span className="text-xs text-gray-500 mt-1">{sublabel}</span>
        )}
      </div>
    </div>
  );
};

const CurrentPlanOverview = () => {
  return (
    <div className="fitness-card p-5">
      <h2 className="text-lg font-semibold mb-4 header-underline">Current Plan Overview</h2>
      
      <div className="bg-gradient-to-br from-fitness-secondary/60 to-fitness-muted p-4 rounded-lg border border-fitness-border mb-5">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-full bg-fitness-primary/20 mr-3">
            <HeartPulse className="w-5 h-5 text-fitness-primary" />
          </div>
          <div>
            <h3 className="font-medium">Type 2 Diabetes Management</h3>
            <p className="text-sm text-gray-400">Customized nutritional plan</p>
          </div>
        </div>
        
        <div className="bg-fitness-muted/50 p-3 rounded-lg border border-fitness-border">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Daily Calorie Goal</span>
            <span className="text-sm font-medium">1,800 kcal</span>
          </div>
          <Progress value={65} className="h-2 mb-3" />
          <span className="text-xs text-gray-400">1,170 / 1,800 kcal consumed today</span>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3">Macronutrient Distribution</h3>
        <MacroProgress name="Carbs" percent={45} color="bg-blue-500" value="203g (45%)" />
        <MacroProgress name="Protein" percent={30} color="bg-fitness-primary" value="135g (30%)" />
        <MacroProgress name="Fat" percent={25} color="bg-purple-500" value="50g (25%)" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <MetricCard 
          icon={<Droplet className="w-4 h-4 text-blue-400" />}
          label="Water Intake"
          value="1.8L / 2.5L"
          progress={72}
        />
        <MetricCard 
          icon={<Moon className="w-4 h-4 text-indigo-400" />}
          label="Sleep Tracker"
          value="7.5h"
          sublabel="Good quality"
        />
        <MetricCard 
          icon={<Activity className="w-4 h-4 text-green-400" />}
          label="Active Calories"
          value="420 / 600 kcal"
          progress={70}
        />
      </div>
    </div>
  );
};

export default CurrentPlanOverview;
