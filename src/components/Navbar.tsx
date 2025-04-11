
import React from 'react';
import { Bell, Search, User, Activity, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { name: "Overview", path: "/" },
  { name: "Meal Plans", path: "/meal-plans" },
  { name: "My Insights", path: "/my-insights", icon: BarChart2 },
  { name: "Track Workout", path: "/track-workout", icon: Activity },
  { name: "Progress", path: "/progress" },
  { name: "Nutrition Tips", path: "/nutrition-tips" },
  { name: "Settings", path: "/settings" },
];

const Navbar = () => {
  const location = useLocation();
  
  return (
    <div className="w-full px-4 py-2 flex items-center justify-between bg-fitness-secondary/50 backdrop-blur-md border-b border-fitness-border sticky top-0 z-50">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <div className="font-bold text-xl mr-8">
          <span className="text-fitness-primary">Nutri</span>Care
        </div>
        
        {/* Navigation tabs */}
        <div className="hidden md:flex items-center space-x-2">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || 
                           (location.pathname === '/' && tab.path === '/');
            const Icon = tab.icon;
            
            return (
              <Button
                key={tab.name}
                variant={isActive ? "default" : "ghost"}
                className={`rounded-lg px-3 py-1 ${
                  isActive 
                  ? "bg-fitness-primary text-white" 
                  : "text-gray-300 hover:text-white hover:bg-fitness-muted"
                }`}
                asChild
              >
                <Link to={tab.path} className="flex items-center gap-1">
                  {Icon && <Icon className="h-4 w-4" />}
                  {tab.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Right side - Search, notifications, profile */}
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search meals or nutrients..."
            className="bg-fitness-muted/70 border border-fitness-border rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-fitness-primary w-64"
          />
        </div>
        
        <Button variant="ghost" className="relative p-2 rounded-full hover:bg-fitness-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-fitness-primary rounded-full"></span>
        </Button>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">Hi, Anna Green</p>
            <p className="text-xs text-gray-400">Premium Plan</p>
          </div>
          <Link to="/settings">
            <Avatar className="h-8 w-8 animate-pulse-glow">
              <AvatarImage src="https://i.pravatar.cc/100?img=36" alt="Anna Green" />
              <AvatarFallback>AG</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
