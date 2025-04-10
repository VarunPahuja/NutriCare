
import React from 'react';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import AdherenceHeatmap from '@/components/AdherenceHeatmap';
import CurrentPlanOverview from '@/components/CurrentPlanOverview';
import MealPlanFlow from '@/components/MealPlanFlow';
import RecentActivities from '@/components/RecentActivities';
import FloatingAction from '@/components/FloatingAction';
import { Book, Users, TrendingUp } from 'lucide-react';

const Index = () => {
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
        {/* Header section with title and key stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 gradient-text">
            Personalized Nutrition Dashboard
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Plans Created" 
              value="145"
              icon={Book}
              description="Nutrition plans created this year"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard 
              title="Active Consultations" 
              value="5"
              icon={Users}
              description="Ongoing nutritionist sessions"
              trend={{ value: 2, isPositive: true }}
            />
            <StatCard 
              title="Adherence Score" 
              value="87%"
              icon={TrendingUp}
              description="Overall plan adherence"
              trend={{ value: 4, isPositive: true }}
              className="bg-gradient-to-br from-fitness-muted to-fitness-secondary border-fitness-primary/30"
            />
          </div>
        </div>
        
        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <AdherenceHeatmap />
          </div>
          
          <div className="lg:col-span-1">
            <CurrentPlanOverview />
          </div>
          
          <div className="lg:col-span-1">
            <MealPlanFlow />
          </div>
        </div>
        
        {/* Recent activities table */}
        <div>
          <RecentActivities />
        </div>
      </main>
      
      <FloatingAction />
    </div>
  );
};

export default Index;
