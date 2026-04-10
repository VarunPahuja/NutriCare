import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Stethoscope, Mail, Lock, User, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// NOTE: If testing locally, disable email confirmation in Supabase Dashboard:
// Authentication → Settings → Email Auth → disable "Confirm email"

const DoctorSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', specialty: '', bio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Retry profile insert to handle auth.users propagation delay
  const insertProfile = async (userId: string, retries = 3): Promise<boolean> => {
    for (let i = 0; i < retries; i++) {
      const { error } = await supabase.from('profiles').insert({
        id: userId,
        role: 'doctor',
        full_name: formData.name,
        email: formData.email,
        specialty: formData.specialty || null,
        bio: formData.bio || null,
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
          <div className="absolute w-[500px] h-[500px] -top-64 -left-64 bg-fitness-accent/10 rounded-full mix-blend-overlay blur-3xl" />
          <div className="absolute w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-primary/10 rounded-full mix-blend-overlay blur-3xl" />
        </div>
        <Card className="w-full max-w-md bg-fitness-background/80 border-fitness-accent/20 relative z-10">
          <CardContent className="pt-10 pb-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Account Created!</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Please check your email to confirm your account, then sign in.
            </p>
            <Button asChild className="w-full bg-fitness-accent hover:bg-fitness-accent/80 mt-2">
              <Link to="/login/doctor">Go to Doctor Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] -top-64 -left-64 bg-fitness-accent/10 rounded-full mix-blend-overlay blur-3xl" />
        <div className="absolute w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-primary/10 rounded-full mix-blend-overlay blur-3xl" />
      </div>

      <Card className="w-full max-w-md bg-fitness-background/80 border-fitness-accent/20 relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-fitness-accent/20 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-fitness-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center gradient-text">Doctor Sign Up</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Create your NutriCare doctor account
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
                <Input id="name" type="text" name="name" placeholder="Dr. Jane Smith" value={formData.name}
                  onChange={handleChange} required className="pl-10 bg-gray-900 border-fitness-accent/30 text-white" disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" name="email" placeholder="doctor@example.com" value={formData.email}
                  onChange={handleChange} required className="pl-10 bg-gray-900 border-fitness-accent/30 text-white" disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="password" type="password" name="password" placeholder="••••••••" value={formData.password}
                  onChange={handleChange} required minLength={6} className="pl-10 bg-gray-900 border-fitness-accent/30 text-white" disabled={loading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input id="specialty" type="text" name="specialty" placeholder="e.g., Nutritionist, Endocrinologist"
                value={formData.specialty} onChange={handleChange} className="bg-gray-900 border-fitness-accent/30 text-white" disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea id="bio" name="bio" placeholder="Brief description of your background..."
                value={formData.bio} onChange={handleChange} rows={3}
                className="w-full bg-gray-900 border border-fitness-accent/30 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fitness-accent/50 resize-none"
                disabled={loading} />
            </div>
            <Button type="submit" className="w-full bg-fitness-accent hover:bg-fitness-accent/80" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</> : 'Sign Up as Doctor'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link to="/login/doctor" className="text-fitness-accent hover:underline">Sign in</Link>
          </div>
          <div className="mt-2 text-center text-sm">
            <span className="text-gray-400">Are you a patient? </span>
            <Link to="/signup/patient" className="text-fitness-primary hover:underline">Sign up as patient</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorSignup;
