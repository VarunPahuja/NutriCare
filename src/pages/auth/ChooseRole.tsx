import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Stethoscope, ArrowRight } from 'lucide-react';

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 rounded-full mix-blend-overlay blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 rounded-full mix-blend-overlay blur-3xl"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Welcome to NutriCare
          </h1>
          <p className="text-gray-400 text-lg">
            Choose how you want to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Patient Card */}
          <Card className="bg-fitness-background/80 border-fitness-primary/20 hover:border-fitness-primary/50 transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-fitness-primary/20 rounded-full flex items-center justify-center group-hover:bg-fitness-primary/30 transition-all">
                  <UserPlus className="w-10 h-10 text-fitness-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">I'm a Patient</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Track your nutrition, workouts, and get personalized meal plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-fitness-primary mt-0.5 flex-shrink-0" />
                  <span>AI-powered nutrition predictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-fitness-primary mt-0.5 flex-shrink-0" />
                  <span>Track your workouts and progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-fitness-primary mt-0.5 flex-shrink-0" />
                  <span>Personalized meal plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-fitness-primary mt-0.5 flex-shrink-0" />
                  <span>Health insights and analytics</span>
                </li>
              </ul>
              <Button
                onClick={() => navigate('/signup/patient')}
                className="w-full bg-fitness-primary hover:bg-fitness-primary/80"
              >
                Sign Up as Patient
              </Button>
              <p className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login/patient')}
                  className="text-fitness-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            </CardContent>
          </Card>

          {/* Doctor Card */}
          <Card className="bg-fitness-background/80 border-fitness-accent/20 hover:border-fitness-accent/50 transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-fitness-accent/20 rounded-full flex items-center justify-center group-hover:bg-fitness-accent/30 transition-all">
                  <Stethoscope className="w-10 h-10 text-fitness-accent" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">I'm a Doctor</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Manage patients and create personalized nutrition plans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-fitness-accent mt-0.5 flex-shrink-0" />
                  <span>Manage multiple patients</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-fitness-accent mt-0.5 flex-shrink-0" />
                  <span>Create custom diet plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-fitness-accent mt-0.5 flex-shrink-0" />
                  <span>Monitor patient progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-fitness-accent mt-0.5 flex-shrink-0" />
                  <span>AI-assisted recommendations</span>
                </li>
              </ul>
              <Button
                onClick={() => navigate('/signup/doctor')}
                className="w-full bg-fitness-accent hover:bg-fitness-accent/80"
              >
                Sign Up as Doctor
              </Button>
              <p className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login/doctor')}
                  className="text-fitness-accent hover:underline"
                >
                  Sign in
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;
