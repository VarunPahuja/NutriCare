
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Activity {
  id: number;
  date: string;
  meal: string;
  calories: number;
  highlights: string;
  status: 'Met Goal' | 'Skipped' | 'Overeaten';
}

const RecentActivities = () => {
  const [filter, setFilter] = useState('all');
  
  const activities: Activity[] = [
    {
      id: 1,
      date: 'Today, 8:30 AM',
      meal: 'Breakfast - Greek Yogurt Bowl',
      calories: 350,
      highlights: 'High Protein, Low Sugar',
      status: 'Met Goal',
    },
    {
      id: 2,
      date: 'Today, 1:15 PM',
      meal: 'Lunch - Quinoa Salad',
      calories: 420,
      highlights: 'High Fiber, Rich in Antioxidants',
      status: 'Met Goal',
    },
    {
      id: 3,
      date: 'Yesterday, 7:00 PM',
      meal: 'Dinner - Salmon with Vegetables',
      calories: 580,
      highlights: 'Omega-3, Low Carb',
      status: 'Met Goal',
    },
    {
      id: 4,
      date: 'Yesterday, 3:30 PM',
      meal: 'Snack - Protein Shake',
      calories: 180,
      highlights: 'High Protein, Low Fat',
      status: 'Met Goal',
    },
    {
      id: 5,
      date: '2 days ago, 12:45 PM',
      meal: 'Lunch - Grilled Chicken Sandwich',
      calories: 650,
      highlights: 'High Calories, Moderate Carbs',
      status: 'Overeaten',
    },
    {
      id: 6,
      date: '3 days ago, 7:30 AM',
      meal: 'Breakfast - Planned: Oatmeal',
      calories: 0,
      highlights: 'N/A',
      status: 'Skipped',
    },
  ];
  
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(act => {
        if (filter === 'onTrack') return act.status === 'Met Goal';
        if (filter === 'missed') return act.status === 'Overeaten';
        if (filter === 'skipped') return act.status === 'Skipped';
        return true;
      });
      
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Met Goal':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Overeaten':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'Skipped':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Met Goal':
        return 'bg-green-500/20 text-green-500';
      case 'Overeaten':
        return 'bg-red-500/20 text-red-500';
      case 'Skipped':
        return 'bg-amber-500/20 text-amber-500';
      default:
        return '';
    }
  };

  return (
    <div className="fitness-card p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
        <h2 className="text-lg font-semibold header-underline mb-3 sm:mb-0">Recent Activities</h2>
        
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all" onClick={() => setFilter('all')}>All</TabsTrigger>
            <TabsTrigger value="onTrack" onClick={() => setFilter('onTrack')}>On-Track</TabsTrigger>
            <TabsTrigger value="missed" onClick={() => setFilter('missed')}>Missed</TabsTrigger>
            <TabsTrigger value="skipped" onClick={() => setFilter('skipped')}>Skipped</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-fitness-border">
              <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Meal</th>
              <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Calories</th>
              <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Highlights</th>
              <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fitness-border">
            {filteredActivities.map((activity) => (
              <tr key={activity.id} className="hover:bg-fitness-secondary/30 transition-colors">
                <td className="py-3 text-sm">{activity.date}</td>
                <td className="py-3 text-sm font-medium">{activity.meal}</td>
                <td className="py-3 text-sm">{activity.calories > 0 ? `${activity.calories} kcal` : '-'}</td>
                <td className="py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-fitness-primary/20 text-fitness-primary">
                    {activity.highlights}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center">
                    {getStatusIcon(activity.status)}
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getStatusClass(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button variant="outline" className="text-xs px-3 py-1">
          View All Activities
        </Button>
      </div>
    </div>
  );
};

export default RecentActivities;
