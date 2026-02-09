import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

const PatientLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // TODO: Connect to backend API later
      // For now, just create/update localStorage (no validation)
      const userData = {
        name: 'Patient',
        email: formData.email || 'patient@example.com',
        role: 'PATIENT',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('nutricare_user', JSON.stringify(userData));
      localStorage.setItem('nutricare_auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('nutricare_is_authenticated', 'true');
      
      toast.success('Welcome back!');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 rounded-full mix-blend-overlay blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 rounded-full mix-blend-overlay blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md bg-fitness-background/80 border-fitness-primary/20 relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-fitness-primary/20 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-fitness-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center gradient-text">Patient Login</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Sign in to your patient account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-gray-900 border-fitness-primary/30 text-white"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 bg-gray-900 border-fitness-primary/30 text-white"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-fitness-primary hover:bg-fitness-primary/80"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-gray-400">Don't have an account? </span>
            <Link to="/signup/patient" className="text-fitness-primary hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-2 text-center text-sm">
            <span className="text-gray-400">Are you a doctor? </span>
            <Link to="/login/doctor" className="text-fitness-accent hover:underline">
              Doctor login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientLogin;
