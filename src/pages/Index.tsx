
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import AdherenceHeatmap from '@/components/AdherenceHeatmap';
import CurrentPlanOverview from '@/components/CurrentPlanOverview';
import MealPlanFlow from '@/components/MealPlanFlow';
import RecentActivities from '@/components/RecentActivities';
import FloatingAction from '@/components/FloatingAction';
import { Button } from '@/components/ui/button';
import { Book, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
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
        {/* Header section with title */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold gradient-text">
              Welcome to NutriCare
            </h1>
            
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                onClick={() => navigate('/meal-plans')}
                className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10"
              >
                View All Meal Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
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
        
        {/* Resources section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4 header-underline">Latest Nutrition Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="fitness-card p-5 flex flex-col">
              <div className="h-40 rounded-lg overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&h=400" 
                  alt="Mediterranean Diet" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium mb-1">Mediterranean Diet Tips</h3>
              <p className="text-sm text-gray-400 mb-3">Learn how to incorporate healthy Mediterranean meals into your plan.</p>
              <Button variant="link" className="mt-auto p-0 justify-start text-fitness-primary">
                Read Article
              </Button>
            </div>
            
            <div className="fitness-card p-5 flex flex-col">
              <div className="h-40 rounded-lg overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&h=400" 
                  alt="Mindful Eating" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium mb-1">Mindful Eating Practices</h3>
              <p className="text-sm text-gray-400 mb-3">How to develop a healthier relationship with food through mindfulness.</p>
              <Button variant="link" className="mt-auto p-0 justify-start text-fitness-primary">
                Read Article
              </Button>
            </div>
            
            <div className="fitness-card p-5 flex flex-col">
              <div className="h-40 rounded-lg overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1576673442511-7e39b6545c87?auto=format&fit=crop&w=800&h=400" 
                  alt="Blood Sugar" 
                  className="w-full h-full object-cover"
                />
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
