import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Brain, Stethoscope, Dumbbell, MessageSquare, BarChart2, Sparkles,
  ArrowRight, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Brain,
    title: 'AI Nutrition Prediction',
    description: 'Get personalized nutrition recommendations powered by machine learning trained on real health data.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Stethoscope,
    title: 'Doctor Consultations',
    description: 'Connect with certified nutritionists and doctors who review your progress and guide your journey.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Dumbbell,
    title: 'Workout Tracking',
    description: 'Log and analyze your workouts with detailed insights on duration, intensity, and consistency.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    description: '24/7 AI-powered nutrition assistant for instant, personalized answers to all your health questions.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: BarChart2,
    title: 'Progress Analytics',
    description: 'Visualize your health journey with detailed charts, trends, and actionable insights over time.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Sparkles,
    title: 'Personalized Plans',
    description: 'Receive tailored nutrition guidance based on your unique health profile, goals, and medical history.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
];

const steps = [
  {
    number: '01',
    icon: CheckCircle,
    title: 'Create Your Profile',
    description: 'Sign up and tell us about your health goals, medical history, and lifestyle.',
  },
  {
    number: '02',
    icon: Stethoscope,
    title: 'Connect with a Doctor',
    description: 'Choose a nutritionist or doctor who fits your needs and get approved.',
  },
  {
    number: '03',
    icon: Brain,
    title: 'Get Personalized Insights',
    description: 'Receive AI-powered nutrition recommendations and track your progress over time.',
  },
];

const LandingNavbar = () => {
  const { profile, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[#0a0b0f]/80 backdrop-blur-md border-b border-white/5">
      <div className="font-bold text-xl">
        <span className="text-fitness-primary">Nutri</span>Care
      </div>
      <div className="flex items-center gap-3">
        {!loading && profile ? (
          <Button asChild className="bg-fitness-primary hover:bg-fitness-primary/80">
            <Link to="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-fitness-primary hover:bg-fitness-primary/80">
              <Link to="/signup">Sign Up Free</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white overflow-x-hidden">
      <LandingNavbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-24 px-6">
        {/* Background geometric blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[700px] h-[700px] rounded-full bg-fitness-primary/8 blur-[120px] -top-48 -left-48" />
          <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/8 blur-[120px] top-1/3 -right-48" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-emerald-600/6 blur-[100px] bottom-0 left-1/3" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-fitness-primary" />
            AI-Powered Health Platform
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Your Personal{' '}
            <span className="bg-gradient-to-r from-fitness-primary via-orange-400 to-fitness-accent bg-clip-text text-transparent">
              Nutrition & Wellness
            </span>{' '}
            Platform
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered nutrition predictions, doctor consultations, and workout tracking — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-fitness-primary hover:bg-fitness-primary/80 text-white text-base px-8 h-12"
            >
              <Link to="/signup">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5 text-base px-8 h-12"
            >
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-14 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {['AI-Powered Predictions', 'Doctor-Reviewed Plans', 'Secure & Private', 'Free to Start'].map(badge => (
              <div key={badge} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-fitness-primary" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="text-fitness-primary text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Everything you need to stay healthy
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              A complete health companion from prediction to consultation to real-time tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 group"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-fitness-primary text-sm font-semibold uppercase tracking-widest mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">How NutriCare Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {steps.map((step, idx) => (
              <div key={step.number} className="relative text-center">
                {/* Connector arrow between steps */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 z-10">
                    <ArrowRight className="w-5 h-5 text-white/20" />
                  </div>
                )}
                <div className="w-16 h-16 bg-fitness-primary/10 border border-fitness-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 relative">
                  <step.icon className="w-7 h-7 text-fitness-primary" />
                  <span className="absolute -top-2 -right-2 bg-fitness-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed px-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-fitness-primary/20 via-fitness-primary/10 to-purple-600/10 border border-fitness-primary/20 rounded-3xl p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-fitness-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to transform your health?
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join thousands of users getting personalized nutrition guidance every day.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-fitness-primary hover:bg-fitness-primary/80 text-white text-base px-10 h-12"
              >
                <Link to="/signup">
                  Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="font-bold text-base text-white">
            <span className="text-fitness-primary">Nutri</span>Care
          </div>
          <p>© {new Date().getFullYear()} NutriCare. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <Link to="/signin" className="hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
