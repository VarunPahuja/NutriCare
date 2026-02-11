import React from 'react';
import Navbar from '@/components/Navbar';
import NutritionPrediction from '@/components/NutritionPrediction';

const NutritionPredictionPage = () => {
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
              AI Nutrition Prediction
            </h1>
          </div>
          
          {/* Nutrition Prediction Component */}
          <NutritionPrediction />
        </div>
      </main>
    </div>
  );
};

export default NutritionPredictionPage;