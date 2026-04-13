import React from 'react';
import { Bell, Search, Activity, BarChart2, Users, LogOut, Stethoscope, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const patientTabs = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "AI Prediction", path: "/prediction" },
  { name: "AI Assistant", path: "/assistant" },
  { name: "My Insights", path: "/my-insights", icon: BarChart2 },
  { name: "Track Workout", path: "/track-workout", icon: Activity },
  { name: "Medications", path: "/medications", icon: Pill },
  { name: "Progress", path: "/progress" },
  { name: "Nutrition Tips", path: "/nutrition-tips" },
  { name: "Settings", path: "/settings" },
];

const doctorTabs = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "My Patients", path: "/doctor/patients", icon: Users },
  { name: "Settings", path: "/settings" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, loading, signOut } = useAuth();

  const tabs = profile?.role === 'doctor' ? doctorTabs : patientTabs;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full px-4 py-2 flex items-center justify-between bg-fitness-secondary/50 backdrop-blur-md border-b border-fitness-border sticky top-0 z-50 h-14">
        <div className="flex items-center gap-8">
          <div className="font-bold text-xl">
            <span className="text-fitness-primary">Nutri</span>Care
          </div>
          <div className="hidden md:flex gap-2">
            {[80, 100, 72, 88, 96].map(w => (
              <div key={w} className={`h-7 w-${w === 80 ? '20' : w === 100 ? '24' : w === 72 ? '16' : w === 88 ? '24' : '28'} bg-white/10 rounded-lg animate-pulse`} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-7 bg-white/10 rounded-lg animate-pulse hidden md:block" />
          <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-2 flex items-center justify-between bg-fitness-secondary/50 backdrop-blur-md border-b border-fitness-border sticky top-0 z-50">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <div className="font-bold text-xl mr-8">
          <span className="text-fitness-primary">Nutri</span>Care
        </div>

        {/* Navigation tabs */}
        <div className="hidden md:flex items-center space-x-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;

            return (
              <Button
                key={tab.name}
                variant={isActive ? "default" : "ghost"}
                className={`rounded-lg px-3 py-1 text-sm ${
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

      {/* Right side */}
      <div className="flex items-center space-x-3">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-fitness-muted/70 border border-fitness-border rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-fitness-primary w-48"
          />
        </div>

        <Button variant="ghost" className="relative p-2 rounded-full hover:bg-fitness-muted">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-2">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">{profile?.full_name || 'Loading...'}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
              {profile?.role === 'doctor' ? (
                <><Stethoscope className="w-3 h-3" /> Doctor</>
              ) : (
                <><Activity className="w-3 h-3" /> Patient</>
              )}
            </p>
          </div>
          <Link to="/settings">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-fitness-primary/30 text-fitness-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-900/20"
            onClick={handleSignOut}
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
