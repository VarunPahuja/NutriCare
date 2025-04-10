
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const tabs = [
  { name: "Overview", active: false },
  { name: "Meal Plans", active: true },
  { name: "Progress", active: false },
  { name: "Nutrition Tips", active: false },
  { name: "Settings", active: false },
];

const Navbar = () => {
  return (
    <div className="w-full px-4 py-2 flex items-center justify-between bg-fitness-secondary/50 backdrop-blur-md border-b border-fitness-border sticky top-0 z-50">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <div className="font-bold text-xl mr-8">
          <span className="text-fitness-primary">Fit</span>Flow
        </div>
        
        {/* Navigation tabs */}
        <div className="hidden md:flex items-center space-x-2">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              variant={tab.active ? "default" : "ghost"}
              className={`rounded-lg px-3 py-1 ${
                tab.active 
                ? "bg-fitness-primary text-white" 
                : "text-gray-300 hover:text-white hover:bg-fitness-muted"
              }`}
            >
              {tab.name}
            </Button>
          ))}
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
          <Avatar className="h-8 w-8 animate-pulse-glow">
            <AvatarImage src="https://i.pravatar.cc/100?img=36" alt="Anna Green" />
            <AvatarFallback>AG</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
