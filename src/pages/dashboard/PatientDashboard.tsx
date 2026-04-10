import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { WorkoutLog, DoctorPatient, Profile, PredictionHistory } from '@/types/database';
import { Activity, Brain, Dumbbell, Stethoscope, ArrowRight, Loader2 } from 'lucide-react';

type DoctorRelationship = DoctorPatient & { doctor?: Profile };

const PatientDashboard = () => {
  const { profile } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([]);
  const [lastPrediction, setLastPrediction] = useState<PredictionHistory | null>(null);
  const [doctorRelationship, setDoctorRelationship] = useState<DoctorRelationship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    async function fetchData() {
      setLoading(true);

      const [workoutsRes, predictionRes, doctorRes] = await Promise.all([
        supabase
          .from('workout_logs')
          .select('*')
          .eq('patient_id', profile!.id)
          .order('date', { ascending: false })
          .limit(3),
        supabase
          .from('prediction_history')
          .select('*')
          .eq('patient_id', profile!.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('doctor_patient')
          .select('*, doctor:profiles!doctor_patient_doctor_id_fkey(*)')
          .eq('patient_id', profile!.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      setRecentWorkouts(workoutsRes.data || []);
      setLastPrediction(predictionRes.data || null);
      setDoctorRelationship(doctorRes.data as DoctorRelationship | null);
      setLoading(false);
    }

    fetchData();
  }, [profile]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  });

  const firstNameOnly = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10" />
      <Navbar />

      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            Welcome back, {firstNameOnly}!
          </h1>
          <p className="text-gray-400 mt-1">Here's your health overview.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Doctor Status */}
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Stethoscope className="w-5 h-5 text-fitness-accent" />
                  Doctor Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!doctorRelationship ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">No doctor connected yet.</p>
                    <Button asChild size="sm" className="bg-fitness-accent hover:bg-fitness-accent/80 w-full">
                      <Link to="/onboarding/choose-doctor">Choose a Doctor</Link>
                    </Button>
                  </div>
                ) : doctorRelationship.status === 'pending' ? (
                  <div>
                    <div className="text-amber-400 text-sm font-medium mb-1">Pending Approval</div>
                    <p className="text-sm text-gray-400">
                      Waiting for {(doctorRelationship.doctor as Profile)?.full_name || 'your doctor'} to accept your request.
                    </p>
                  </div>
                ) : doctorRelationship.status === 'accepted' ? (
                  <div>
                    <div className="text-green-400 text-sm font-medium mb-1">Connected</div>
                    <p className="text-sm text-gray-300">
                      {(doctorRelationship.doctor as Profile)?.full_name}
                    </p>
                    {(doctorRelationship.doctor as Profile)?.specialty && (
                      <p className="text-xs text-gray-400">{(doctorRelationship.doctor as Profile).specialty}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-red-400 text-sm font-medium mb-1">Request Declined</div>
                    <Button asChild size="sm" variant="outline" className="mt-2 w-full">
                      <Link to="/onboarding/choose-doctor">Choose Another Doctor</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Workouts */}
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Dumbbell className="w-5 h-5 text-fitness-primary" />
                  Recent Workouts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentWorkouts.length === 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">No workouts logged yet.</p>
                    <Button asChild size="sm" variant="outline" className="border-fitness-primary text-fitness-primary w-full">
                      <Link to="/track-workout">Log a Workout</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentWorkouts.map(log => (
                      <div key={log.id} className="flex items-center justify-between py-1.5 border-b border-fitness-border last:border-0">
                        <div>
                          <p className="text-sm font-medium capitalize">{log.type}</p>
                          <p className="text-xs text-gray-400">{formatDate(log.date)} · {log.duration_minutes}min · {log.intensity}</p>
                        </div>
                      </div>
                    ))}
                    <Button asChild size="sm" variant="ghost" className="text-fitness-primary mt-1 px-0">
                      <Link to="/track-workout">
                        View all <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Last Prediction */}
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Last Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!lastPrediction ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">No predictions yet.</p>
                    <Button asChild size="sm" variant="outline" className="border-purple-400 text-purple-400 w-full">
                      <Link to="/prediction">Run a Prediction</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 mb-2">{formatDate(lastPrediction.created_at)}</p>
                    {lastPrediction.result && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(lastPrediction.result).map(([key, val]) => (
                          typeof val === 'number' && (
                            <div key={key} className="bg-fitness-muted/50 rounded p-2 text-center">
                              <p className="text-xs text-gray-400 capitalize">{key}</p>
                              <p className="font-semibold">{Number(val).toFixed(1)}{key === 'calories' ? ' kcal' : 'g'}</p>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    <Button asChild size="sm" variant="ghost" className="text-purple-400 mt-1 px-0">
                      <Link to="/prediction">
                        New prediction <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'AI Prediction', path: '/prediction', icon: Brain, color: 'text-purple-400' },
            { label: 'AI Assistant', path: '/assistant', icon: Activity, color: 'text-blue-400' },
            { label: 'Track Workout', path: '/track-workout', icon: Dumbbell, color: 'text-fitness-primary' },
            { label: 'My Insights', path: '/my-insights', icon: Activity, color: 'text-green-400' },
          ].map(link => (
            <Link key={link.path} to={link.path}>
              <Card className="fitness-card hover:border-fitness-primary/30 transition-all cursor-pointer h-full">
                <CardContent className="pt-4 flex flex-col items-center text-center gap-2">
                  <link.icon className={`w-6 h-6 ${link.color}`} />
                  <span className="text-sm font-medium">{link.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
