
import React from 'react';
import { PlusCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const FloatingAction = () => {
  const { toast } = useToast();

  const handleCreatePlan = () => {
    toast({
      title: "Creating new meal plan",
      description: "Your new nutrition plan is being prepared...",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading report",
      description: "Your nutrition summary report is downloading...",
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col space-y-3">
      <Button 
        variant="outline" 
        onClick={handleDownload}
        className="rounded-full w-10 h-10 p-0 bg-fitness-muted border border-fitness-border shadow-lg hover:shadow-fitness-primary/20 hover:border-fitness-primary/50 transition-all"
      >
        <Download size={20} className="text-gray-300" />
      </Button>
      
      <Button 
        onClick={handleCreatePlan}
        className="rounded-full shadow-lg bg-gradient-to-r from-fitness-primary to-[#FF4757] hover:shadow-fitness-primary/50 transition-all"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create New Meal Plan
      </Button>
    </div>
  );
};

export default FloatingAction;
