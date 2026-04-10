import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AdherenceHeatmap from '@/components/AdherenceHeatmap';
import CurrentPlanOverview from '@/components/CurrentPlanOverview';
import RecentActivities from '@/components/RecentActivities';
import FloatingAction from '@/components/FloatingAction';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

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
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            Welcome to NutriCare
          </h1>
        </div>

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <AdherenceHeatmap />
          </div>
          <div>
            <CurrentPlanOverview />
          </div>
        </div>

        {/* Recent activities */}
        <div>
          <RecentActivities />
        </div>

        {/* Resources section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 header-underline">Latest Nutrition Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="fitness-card p-5 flex flex-col">
              <div className="h-40 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
                <span className="text-4xl">🥗</span>
              </div>
              <h3 className="text-lg font-medium mb-1">Mediterranean Diet Tips</h3>
              <p className="text-sm text-gray-400 mb-3">Learn how to incorporate healthy Mediterranean meals into your plan.</p>
              <Button variant="link" className="mt-auto p-0 justify-start text-fitness-primary">
                Read Article
              </Button>
            </div>

            <div className="fitness-card p-5 flex flex-col">
              <div className="h-40 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center">
                <span className="text-4xl">🧘</span>
              </div>
              <h3 className="text-lg font-medium mb-1">Mindful Eating Practices</h3>
              <p className="text-sm text-gray-400 mb-3">How to develop a healthier relationship with food through mindfulness.</p>
              <Button variant="link" className="mt-auto p-0 justify-start text-fitness-primary">
                Read Article
              </Button>
            </div>

            <div className="fitness-card p-5 flex flex-col">
              <div className="h-40 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-red-500/20 to-orange-600/20 flex items-center justify-center">
                <span className="text-4xl">🩺</span>
              </div>
              <h3 className="text-lg font-medium mb-1">Managing Blood Sugar</h3>
              <p className="text-sm text-gray-400 mb-3">Practical tips for stabilizing blood sugar levels through smart food choices.</p>
              <Button variant="link" className="mt-auto p-0 justify-start text-fitness-primary">
                Read Article
              </Button>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => navigate('/nutrition-tips')}
              className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10"
            >
              View All Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <FloatingAction />
    </div>
  );
};

export default Index;
