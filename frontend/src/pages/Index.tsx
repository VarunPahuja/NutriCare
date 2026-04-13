import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Stethoscope, Dumbbell, MessageSquare, Pill, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: Brain,
    title: 'AI Nutrition Prediction',
    description: 'Get personalized macro and calorie recommendations powered by machine learning',
  },
  {
    icon: Stethoscope,
    title: 'Doctor Consultations',
    description: 'Connect with certified nutritionists who review your progress and guide your journey',
  },
  {
    icon: Dumbbell,
    title: 'Workout Tracking',
    description: 'Log workouts and visualize performance trends over time',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    description: 'Ask nutrition questions and get instant, evidence-based answers',
  },
  {
    icon: Pill,
    title: 'Medication Tracking',
    description: 'Log medications and share your complete health picture with your doctor',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Visualize your health journey with detailed charts and insights',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create Account',
    description: 'Choose your role as patient or doctor',
  },
  {
    number: '02',
    title: 'Connect',
    description: 'Patients request doctors, doctors accept and review',
  },
  {
    number: '03',
    title: 'Get Insights',
    description: 'AI predictions, tracking, and personalized guidance',
  },
];

const Index = () => {
  const { profile, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-fitness-background text-white relative overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,107,0,0.12),transparent_45%)]" />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-fitness-background/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-fitness-primary to-orange-300 bg-clip-text text-transparent">
            NutriCare
          </Link>
          <div className="flex items-center gap-3">
            {profile ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center rounded-lg bg-fitness-primary px-4 py-2 text-sm font-medium text-white hover:bg-fitness-primary/90 transition"
              >
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-fitness-primary px-4 py-2 text-sm font-medium text-white hover:bg-fitness-primary/90 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-20">
        <section className="min-h-screen flex items-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Your Health,
              <br />
              Intelligently Managed
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
              AI-powered nutrition predictions, doctor consultations, medication tracking, and workout insights — all in one platform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              <Link to="/signup" className="rounded-lg bg-fitness-primary px-6 py-3 font-semibold text-white hover:bg-fitness-primary/90 transition">
                Get Started Free
              </Link>
              <Link to="/signin" className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition">
                Sign In
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {['AI-Powered Predictions', 'Doctor Consultations', 'Real-time Insights'].map((badge) => (
                <span key={badge} className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-300">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
                  <feature.icon size={32} className="text-fitness-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="hidden md:block absolute left-1/4 right-1/4 top-12 h-px bg-white/10" />
              {steps.map((step) => (
                <div key={step.number} className="text-center relative">
                  <div className="text-6xl font-bold opacity-20 mb-3">{step.number}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to take control of your health?</h2>
              <Link to="/signup" className="inline-flex rounded-lg bg-fitness-primary px-6 py-3 font-semibold text-white hover:bg-fitness-primary/90 transition">
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
