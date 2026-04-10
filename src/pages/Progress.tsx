import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dumbbell, HeartPulse, Target, BarChart2 } from 'lucide-react';

const placeholders = [
  {
    icon: BarChart2,
    title: 'Workout Progress',
    description: 'Log workouts to see your progress trends over time.',
    color: 'text-fitness-primary',
    bg: 'bg-fitness-primary/10',
  },
  {
    icon: HeartPulse,
    title: 'Health Metrics',
    description: 'Connect with your doctor to track health metrics like BMI and vitals.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Target,
    title: 'Goals',
    description: 'Set goals with your doctor to track achievement and milestones.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
];

const Progress = () => {
  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 pointer-events-none" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 pointer-events-none" />

      <Navbar />

      <main className="container mx-auto px-4 py-10 relative z-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold gradient-text">Your Progress</h1>
          <p className="text-gray-400 mt-1">Track your fitness journey over time.</p>
        </div>

        {/* Placeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {placeholders.map((p) => (
            <div
              key={p.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center"
            >
              <div className={`w-14 h-14 ${p.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <p.icon className={`w-7 h-7 ${p.color}`} />
              </div>
              <h3 className="text-white font-semibold text-base mb-1">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        {/* Central CTA */}
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-fitness-primary/10 rounded-2xl flex items-center justify-center mb-5">
            <Dumbbell className="w-8 h-8 text-fitness-primary" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No data yet</h2>
          <p className="text-gray-400 text-sm mb-6">
            Start by logging your first workout to begin tracking progress.
          </p>
          <Button asChild className="bg-fitness-primary hover:bg-fitness-primary/80">
            <Link to="/track-workout">Log a Workout</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Progress;
