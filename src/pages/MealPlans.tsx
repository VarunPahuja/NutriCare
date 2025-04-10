
import React from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FloatingAction from '@/components/FloatingAction';
import { Calendar, Clock, Utensils, Apple, Fire } from 'lucide-react';

const mealPlans = [
  {
    id: 1,
    name: "Weight Management Plan",
    description: "Balanced nutrition plan for healthy weight maintenance",
    calories: 1800,
    meals: 5,
    duration: "4 weeks",
    tags: ["Low Sugar", "High Protein", "Balanced"],
    recommended: true,
  },
  {
    id: 2,
    name: "Diabetes Friendly Plan",
    description: "Specially designed for Type 2 diabetes management",
    calories: 1600,
    meals: 6,
    duration: "Ongoing",
    tags: ["Low Carb", "Low GI", "Heart Healthy"],
    recommended: false,
  },
  {
    id: 3,
    name: "Mediterranean Diet",
    description: "Heart-healthy plan based on Mediterranean cuisine",
    calories: 2000,
    meals: 4,
    duration: "8 weeks",
    tags: ["Heart Healthy", "Anti-inflammatory", "Rich in Omega-3"],
    recommended: false,
  }
];

const MealPlans = () => {
  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10"></div>
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10"></div>
      
      {/* Navigation */}
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <h1 className="text-3xl font-bold mb-6 gradient-text">
          Your Meal Plans
        </h1>
        
        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="bg-fitness-muted/70 backdrop-blur-sm">
            <TabsTrigger value="active">Active Plans</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="custom">Custom Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans.map((plan) => (
                <Card key={plan.id} className="bg-fitness-card/90 border-fitness-border hover:border-fitness-primary/50 transition-all overflow-hidden group">
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-fitness-primary text-white px-3 py-1 text-xs font-medium">
                      Recommended
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-fitness-primary transition-colors">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Fire className="h-4 w-4 text-fitness-primary" />
                          <span>{plan.calories} calories</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Utensils className="h-4 w-4 text-fitness-primary" />
                          <span>{plan.meals} meals/day</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-fitness-primary" />
                          <span>{plan.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-fitness-primary" />
                          <span>Active</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {plan.tags.map((tag, idx) => (
                          <span key={idx} className="bg-fitness-muted px-2 py-1 rounded-md text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Button variant="link" className="mt-2 text-fitness-primary p-0 justify-start">
                        View full plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed">
            <div className="text-center py-12 text-gray-400">
              <Apple className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No completed plans yet</h3>
              <p className="mt-2">When you complete a nutrition plan, it will appear here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="recommended">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mealPlans.filter(plan => plan.recommended).map((plan) => (
                <Card key={plan.id} className="bg-fitness-card/90 border-fitness-border hover:border-fitness-primary/50 transition-all overflow-hidden">
                  <div className="absolute top-0 right-0 bg-fitness-primary text-white px-3 py-1 text-xs font-medium">
                    Recommended
                  </div>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Fire className="h-4 w-4 text-fitness-primary" />
                          <span>{plan.calories} calories</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Utensils className="h-4 w-4 text-fitness-primary" />
                          <span>{plan.meals} meals/day</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="text-center py-12 text-gray-400">
              <Button className="bg-gradient-to-r from-fitness-primary to-[#FF4757]">
                Create Custom Plan
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <FloatingAction />
    </div>
  );
};

export default MealPlans;
