import React from 'react';
import { HeartPulse } from 'lucide-react';

const CurrentPlanOverview = () => {
  return (
    <div className="fitness-card p-5">
      <h2 className="text-lg font-semibold mb-4 header-underline">Current Plan Overview</h2>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-fitness-muted/30 rounded-full flex items-center justify-center mb-4">
          <HeartPulse className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-sm text-gray-400">
          No active plan yet.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Connect with a doctor to get your personalized nutrition plan.
        </p>
      </div>
    </div>
  );
};

export default CurrentPlanOverview;
