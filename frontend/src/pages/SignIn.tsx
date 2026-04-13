
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const SignIn = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-fitness-background text-white relative overflow-hidden px-4">
      {/* Background decorations */}
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10"></div>
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-fitness-primary">Nutri</span>Care
          </h1>
          <p className="text-gray-400">Choose how you want to sign in</p>
        </div>

        <Card className="bg-fitness-card/80 backdrop-blur-md border-fitness-border">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Select your role to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full bg-fitness-primary hover:bg-fitness-primary/80"
              onClick={() => navigate('/signin/patient')}
            >
              Sign in as Patient
            </Button>
            <Button
              className="w-full bg-fitness-accent hover:bg-fitness-accent/80"
              onClick={() => navigate('/signin/doctor')}
            >
              Sign in as Doctor
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-sm text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-fitness-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
