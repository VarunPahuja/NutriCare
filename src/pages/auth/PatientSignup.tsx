import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PatientSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // TODO: Connect to backend API later
      // For now, just store in localStorage (no validation)
      const userData = {
        name: formData.name || 'Patient',
        email: formData.email || 'patient@example.com',
        role: 'PATIENT', // Automatically assigned
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('nutricare_user', JSON.stringify(userData));
      localStorage.setItem('nutricare_auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('nutricare_is_authenticated', 'true');
      
      toast.success('Account created successfully!');
      
      // Redirect directly to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-fitness-background/80 border border-fitness-primary/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-fitness-primary">
            Patient Signup
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Create your account to start tracking your nutrition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 bg-gray-900 border-fitness-primary/30"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-gray-900 border-fitness-primary/30"
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
                  className="pl-10 bg-gray-900 border-fitness-primary/30"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 bg-gray-900 border-fitness-primary/30"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-fitness-primary hover:bg-fitness-primary/80"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login/patient" className="text-fitness-primary hover:underline">
              Login here
            </Link>
          </div>
          <div className="text-sm text-center text-gray-400">
            Are you a doctor?{' '}
            <Link to="/signup/doctor" className="text-fitness-accent hover:underline">
              Doctor Signup
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientSignup;
