
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Heart, ThumbsUp, Filter, Search } from 'lucide-react';

const nutritionTips = [
  {
    id: 1,
    title: "The Benefits of a Mediterranean Diet",
    description: "Discover how the Mediterranean diet can improve heart health and reduce inflammation.",
    category: "Diet Types",
    readTime: "5 min read",
    likes: 128,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&h=400",
    saved: true,
  },
  {
    id: 2,
    title: "Protein Timing for Optimal Muscle Recovery",
    description: "Learn the science behind protein consumption timing and how it affects muscle growth and recovery.",
    category: "Nutrition Science",
    readTime: "8 min read",
    likes: 94,
    image: "https://images.unsplash.com/photo-1588954394524-d9d0a9c9a710?auto=format&fit=crop&w=800&h=400",
    saved: false,
  },
  {
    id: 3,
    title: "Managing Blood Sugar Through Diet",
    description: "Practical tips for stabilizing blood sugar levels through smart food choices and meal timing.",
    category: "Health Management",
    readTime: "6 min read",
    likes: 156,
    image: "https://images.unsplash.com/photo-1576673442511-7e39b6545c87?auto=format&fit=crop&w=800&h=400",
    saved: false,
  },
  {
    id: 4,
    title: "Mindful Eating Practices",
    description: "How to develop a healthier relationship with food through mindful eating techniques.",
    category: "Wellness",
    readTime: "4 min read",
    likes: 89,
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&h=400",
    saved: true,
  }
];

const NutritionTips = () => {
  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10"></div>
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10"></div>
      
      {/* Navigation */}
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-3xl font-bold gradient-text mb-4 md:mb-0">
            Nutrition Tips & Articles
          </h1>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search articles..."
                className="bg-fitness-muted/70 border border-fitness-border rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-fitness-primary w-full md:w-64"
              />
            </div>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-fitness-muted/70 backdrop-blur-sm">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="diet">Diet Types</TabsTrigger>
            <TabsTrigger value="science">Nutrition Science</TabsTrigger>
            <TabsTrigger value="management">Health Management</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="saved">Saved Articles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {nutritionTips.map((tip) => (
                <Card key={tip.id} className="bg-fitness-card/90 border-fitness-border hover:border-fitness-primary/50 transition-all overflow-hidden h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={tip.image} 
                      alt={tip.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-fitness-muted px-2 py-1 rounded-md text-xs font-medium">
                        {tip.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {tip.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl hover:text-fitness-primary transition-colors">
                      {tip.title}
                    </CardTitle>
                    <CardDescription>{tip.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {/* Article content would go here */}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-fitness-border pt-4">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" className="flex items-center space-x-1 p-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{tip.likes}</span>
                      </Button>
                      <Button variant="ghost" className={`flex items-center space-x-1 p-1 ${tip.saved ? 'text-fitness-primary' : ''}`}>
                        <BookOpen className="h-4 w-4" />
                        <span>{tip.saved ? 'Saved' : 'Save'}</span>
                      </Button>
                    </div>
                    <Button variant="link" className="text-fitness-primary">Read more</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="diet">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {nutritionTips.filter(tip => tip.category === "Diet Types").map((tip) => (
                // Same card component as above
                <Card key={tip.id} className="bg-fitness-card/90 border-fitness-border hover:border-fitness-primary/50 transition-all overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={tip.image} 
                      alt={tip.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-fitness-muted px-2 py-1 rounded-md text-xs font-medium">
                        {tip.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {tip.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{tip.title}</CardTitle>
                    <CardDescription>{tip.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between border-t border-fitness-border pt-4">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" className="flex items-center space-x-1 p-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{tip.likes}</span>
                      </Button>
                      <Button variant="ghost" className={`flex items-center space-x-1 p-1 ${tip.saved ? 'text-fitness-primary' : ''}`}>
                        <BookOpen className="h-4 w-4" />
                        <span>{tip.saved ? 'Saved' : 'Save'}</span>
                      </Button>
                    </div>
                    <Button variant="link" className="text-fitness-primary">Read more</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Similar content for other tabs */}
          <TabsContent value="saved">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {nutritionTips.filter(tip => tip.saved).map((tip) => (
                // Same card component as above
                <Card key={tip.id} className="bg-fitness-card/90 border-fitness-border hover:border-fitness-primary/50 transition-all overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={tip.image} 
                      alt={tip.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-fitness-muted px-2 py-1 rounded-md text-xs font-medium">
                        {tip.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {tip.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{tip.title}</CardTitle>
                    <CardDescription>{tip.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between border-t border-fitness-border pt-4">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" className="flex items-center space-x-1 p-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{tip.likes}</span>
                      </Button>
                      <Button variant="ghost" className="flex items-center space-x-1 p-1 text-fitness-primary">
                        <BookOpen className="h-4 w-4" />
                        <span>Saved</span>
                      </Button>
                    </div>
                    <Button variant="link" className="text-fitness-primary">Read more</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10">
            Load More Articles
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NutritionTips;
