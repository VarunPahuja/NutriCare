import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, Stethoscope } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error('Sign in failed');

      // Fetch profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      // If profile doesn't exist yet, create one
      if (!profile) {
        const email = data.user.email ?? formData.email;
        const fullName =
          (data.user.user_metadata?.full_name as string | undefined) ??
          (data.user.user_metadata?.name as string | undefined) ??
          email;

        const { error: insertError } = await supabase.from('profiles').insert({
          id: data.user.id,
          role: 'doctor',
          full_name: fullName,
          email,
        });

        if (insertError) throw insertError;
      }

      const profileRole = profile?.role ?? 'doctor';
      if (profileRole !== 'doctor') {
        await supabase.auth.signOut();
        setError('This is not a doctor account. Please use Patient Login.');
        return;
      }

      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
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
          <CardTitle className="text-2xl text-center gradient-text">Doctor Login</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Sign in to your doctor account
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
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="doctor@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-900 border-fitness-accent/30 text-white"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 bg-gray-900 border-fitness-accent/30 text-white"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-fitness-accent hover:bg-fitness-accent/80"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In as Doctor'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup/doctor" className="text-fitness-accent hover:underline">
              Sign up
            </Link>
          </div>
          <div className="text-sm text-center text-gray-400">
            Are you a patient?{' '}
            <Link to="/signin/patient" className="text-fitness-primary hover:underline">
              Patient Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DoctorLogin;
