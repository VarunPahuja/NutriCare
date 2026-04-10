import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// NOTE: If testing locally, disable email confirmation in Supabase Dashboard:
// Authentication → Settings → Email Auth → disable "Confirm email"

const PatientSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Retry profile insert to handle auth.users propagation delay
  const insertProfile = async (userId: string, retries = 3): Promise<boolean> => {
    for (let i = 0; i < retries; i++) {
      const { error } = await supabase.from('profiles').insert({
        id: userId,
        role: 'patient',
        full_name: formData.name,
        email: formData.email,
      });
      if (!error) return true;
      await new Promise(r => setTimeout(r, 1000));
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('No user returned from sign up');

      const inserted = await insertProfile(data.user.id);
      if (!inserted) throw new Error('Profile creation failed. Please try again.');

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full bg-fitness-background text-white flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 rounded-full mix-blend-overlay blur-3xl" />
          <div className="absolute w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 rounded-full mix-blend-overlay blur-3xl" />
        </div>
        <Card className="w-full max-w-md bg-fitness-background/80 border border-fitness-primary/20 relative z-10">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Account Created!</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Please check your email to confirm your account, then sign in.
            </p>
            <Button asChild className="w-full bg-fitness-primary hover:bg-fitness-primary/80 mt-2">
              <Link to="/login/patient">Go to Patient Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 rounded-full mix-blend-overlay blur-3xl" />
        <div className="absolute w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 rounded-full mix-blend-overlay blur-3xl" />
      </div>
      <Card className="w-full max-w-md bg-fitness-background/80 border border-fitness-primary/20 relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-fitness-primary">Patient Sign Up</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Create your account to start tracking your nutrition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name}
                  onChange={handleChange} required className="pl-10 bg-gray-900 border-fitness-primary/30" disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" name="email" type="email" placeholder="patient@example.com" value={formData.email}
                  onChange={handleChange} required className="pl-10 bg-gray-900 border-fitness-primary/30" disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password}
                  onChange={handleChange} required minLength={6} className="pl-10 bg-gray-900 border-fitness-primary/30" disabled={loading} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-fitness-primary hover:bg-fitness-primary/80" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</> : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login/patient" className="text-fitness-primary hover:underline">Login here</Link>
          </div>
          <div className="text-sm text-center text-gray-400">
            Are you a doctor?{' '}
            <Link to="/signup/doctor" className="text-fitness-accent hover:underline">Doctor Signup</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientSignup;
