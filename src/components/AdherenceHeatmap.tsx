
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

interface HeatmapCellProps {
  date: number;
  value: number;
  month: string;
}

const HeatmapCell = ({ date, value, month }: HeatmapCellProps) => {
  // Convert value to a color intensity (darkest color for highest adherence)
  const getColorIntensity = (value: number) => {
    if (value >= 90) return 'bg-emerald-500/90';
    if (value >= 75) return 'bg-emerald-500/70';
    if (value >= 50) return 'bg-emerald-500/50';
    if (value >= 25) return 'bg-emerald-500/30';
    return 'bg-emerald-500/10';
  };

  return (
    <div
      className={`relative w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all ${getColorIntensity(
        value
      )} hover:scale-105`}
      title={`${date} ${month}: ${value}% adherence`}
    >
      <span className="text-xs font-medium">{date}</span>
    </div>
  );
};

const timeFilters = ["Day", "Week", "Month", "Quarter", "Year"];

const AdherenceHeatmap = () => {
  const [activeFilter, setActiveFilter] = useState("Month");

  // Generate dummy data for the heatmap
  const generateHeatmapData = () => {
    const days = Array.from({ length: 31 }, (_, i) => ({
      date: i + 1,
      value: Math.floor(Math.random() * 100),
      month: "May",
    }));
    return days;
  };

  const heatmapData = generateHeatmapData();

  return (
    <div className="fitness-card p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold header-underline">Adherence Heatmap</h2>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-fitness-primary" />
          <span className="text-sm text-gray-400">May 2025</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-5">
        {timeFilters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            className={`text-xs py-1 px-3 rounded-lg ${
              activeFilter === filter 
                ? "bg-fitness-primary text-white" 
                : "bg-transparent border-fitness-border text-gray-300"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {heatmapData.slice(0, 28).map((day, index) => (
          <HeatmapCell
            key={index}
            date={day.date}
            value={day.value}
            month={day.month}
          />
        ))}
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Low Adherence</span>
          <div className="flex space-x-1">
            <div className="w-5 h-3 rounded-sm bg-emerald-500/10"></div>
            <div className="w-5 h-3 rounded-sm bg-emerald-500/30"></div>
            <div className="w-5 h-3 rounded-sm bg-emerald-500/50"></div>
            <div className="w-5 h-3 rounded-sm bg-emerald-500/70"></div>
            <div className="w-5 h-3 rounded-sm bg-emerald-500/90"></div>
          </div>
          <span className="text-xs text-gray-400">High Adherence</span>
        </div>
      </div>
    </div>
  );
};

export default AdherenceHeatmap;
