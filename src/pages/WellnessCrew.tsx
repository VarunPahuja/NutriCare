
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, PhoneCall, Calendar, Star } from 'lucide-react';

const WellnessCrew = () => {
  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10"></div>
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10"></div>
      
      {/* Navigation */}
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 relative z-10">
        <h1 className="text-3xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-fitness-primary to-[#FF4757]">
            My Wellness Crew
          </span>
        </h1>
        
        <Tabs defaultValue="coaches" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-fitness-card/30 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="coaches" className="text-sm">My Coaches</TabsTrigger>
            <TabsTrigger value="healthcare" className="text-sm">Healthcare Practitioners</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coaches" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Nutrition Coach */}
              <Card className="bg-fitness-card/80 border-fitness-border overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-fitness-primary/30 to-[#FF4757]/30"></div>
                <div className="-mt-10 flex justify-center">
                  <Avatar className="h-20 w-20 border-4 border-fitness-card">
                    <AvatarFallback className="text-lg">NP</AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="text-center pt-2">
                  <CardTitle>Neha Pandey</CardTitle>
                  <CardDescription>
                    <Badge className="bg-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/30">
                      Nutrition Coach
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Specialized in diabetes nutrition management. Working with you since June 2024.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 border-fitness-border">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 border-fitness-border">
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Fitness Coach */}
              <Card className="bg-fitness-card/80 border-fitness-border overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-fitness-primary/30 to-[#FF4757]/30"></div>
                <div className="-mt-10 flex justify-center">
                  <Avatar className="h-20 w-20 border-4 border-fitness-card">
                    <AvatarFallback className="text-lg">SC</AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="text-center pt-2">
                  <CardTitle>Saurash Chauan</CardTitle>
                  <CardDescription>
                    <Badge className="bg-fitness-primary/20 text-fitness-primary hover:bg-fitness-primary/30">
                      Fitness Coach
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Expert in low-impact exercise for diabetes management. Working with you since July 2024.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 border-fitness-border">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 border-fitness-border">
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="healthcare" className="space-y-6">
            <h2 className="text-xl font-medium mb-4">Diabetes Management Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Endocrinologist */}
              <Card className="bg-fitness-card/80 border-fitness-border overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-[#3EADCF]/30 to-[#ABE9CD]/30"></div>
                <div className="-mt-10 flex justify-center">
                  <Avatar className="h-20 w-20 border-4 border-fitness-card">
                    <AvatarFallback className="text-lg">PG</AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="text-center pt-2">
                  <CardTitle>Dr. Priya Gupta</CardTitle>
                  <CardDescription>
                    <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                      Endocrinologist
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mb-4 text-center">
                    Managing your Type 2 Diabetes since 2023. Next appointment: May 2, 2025.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 border-fitness-border">
                      <PhoneCall className="w-4 h-4" />
                      Call Office
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 border-fitness-border">
                      <Calendar className="w-4 h-4" />
                      Appointments
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Dietitian */}
              <Card className="bg-fitness-card/80 border-fitness-border overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-[#3EADCF]/30 to-[#ABE9CD]/30"></div>
                <div className="-mt-10 flex justify-center">
                  <Avatar className="h-20 w-20 border-4 border-fitness-card">
                    <AvatarFallback className="text-lg">SK</AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader className="text-center pt-2">
                  <CardTitle>Salman Khan</CardTitle>
                  <CardDescription>
                    <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                      Clinical Dietitian
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mb-4 text-center">
                    Specialist in diabetic nutrition planning. Next review: April 28, 2025.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 border-fitness-border">
                      <PhoneCall className="w-4 h-4" />
                      Call Office
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 border-fitness-border">
                      <Calendar className="w-4 h-4" />
                      Appointments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WellnessCrew;
