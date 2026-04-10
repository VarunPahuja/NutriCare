import React from 'react';
import { CalendarIcon } from 'lucide-react';

const AdherenceHeatmap = () => {
  return (
    <div className="fitness-card p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold header-underline">Adherence Heatmap</h2>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-fitness-primary" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-fitness-muted/30 rounded-full flex items-center justify-center mb-4">
          <CalendarIcon className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-sm text-gray-400">
          No data yet — start logging workouts to see your adherence.
        </p>
      </div>
    </div>
  );
};

export default AdherenceHeatmap;
