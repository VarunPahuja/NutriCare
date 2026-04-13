import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Heart, Target } from 'lucide-react';

const cards = [
  {
    icon: TrendingUp,
    title: 'Workout Trends',
    desc: 'Log workouts consistently to see your progress trends over time.',
    cta: 'Log a Workout',
    href: '/track-workout',
  },
  {
    icon: Heart,
    title: 'Health Metrics',
    desc: 'Your assigned doctor will update health metrics as you progress.',
    cta: null,
    href: null,
  },
  {
    icon: Target,
    title: 'Goals',
    desc: 'Connect with a doctor to set personalized nutrition and fitness goals.',
    cta: 'Choose a Doctor',
    href: '/onboarding/choose-doctor',
  },
];

export default function Progress() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-fitness-background text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-gray-400 mb-10">Track your fitness journey over time.</p>
        <div className="grid gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
              <card.icon className="text-fitness-primary mt-1 shrink-0" size={28} />
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
                <p className="text-gray-400 text-sm mb-3">{card.desc}</p>
                {card.cta && card.href && (
                  <button
                    onClick={() => navigate(card.href!)}
                    className="text-sm px-4 py-1.5 rounded-lg border border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10 transition"
                  >
                    {card.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
