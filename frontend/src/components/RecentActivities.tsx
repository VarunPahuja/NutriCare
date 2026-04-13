import React from 'react';
import { ClipboardList } from 'lucide-react';

const RecentActivities = () => {
  return (
    <div className="fitness-card p-5">
      <h2 className="text-lg font-semibold header-underline mb-5">Recent Activities</h2>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-fitness-muted/30 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-sm text-gray-400">No recent activity yet.</p>
        <p className="text-xs text-gray-500 mt-1">
          Start logging your meals and workouts to see activity here.
        </p>
      </div>
    </div>
  );
};

export default RecentActivities;
