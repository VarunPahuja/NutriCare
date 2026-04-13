import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { WorkoutLog, DoctorPatient, Profile, PredictionHistory } from '@/types/database';
import { Activity, Brain, Dumbbell, Stethoscope, ArrowRight, Loader2, MessageSquare } from 'lucide-react';

type DoctorRelationship = DoctorPatient & {
  doctor?: Pick<Profile, 'full_name' | 'specialty'> | null;
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([]);
  const [lastPrediction, setLastPrediction] = useState<PredictionHistory | null>(null);
  const [doctorRelations, setDoctorRelations] = useState<DoctorRelationship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    async function fetchData() {
      setLoading(true);

      const [workoutsRes, predictionsRes, doctorRes] = await Promise.all([
        supabase
          .from('workout_logs')
          .select('*')
          .eq('patient_id', profile.id)
          .order('date', { ascending: false })
          .limit(3),
        supabase
          .from('prediction_history')
          .select('*')
          .eq('patient_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('doctor_patient')
          .select('*, doctor:profiles!doctor_id(id, full_name, specialty, bio)')
          .eq('patient_id', profile.id)
          .order('created_at', { ascending: false })
      ]);

      setRecentWorkouts(workoutsRes.data || []);
      setLastPrediction(predictionsRes.data || null);
      setDoctorRelations((doctorRes.data || []) as DoctorRelationship[]);
      setLoading(false);
    }

    fetchData();
  }, [profile]);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const firstNameOnly = profile?.full_name?.split(' ')[0] || 'there';

  const requestDoctorAgain = async (doctorId: string) => {
    if (!profile) return;

    const { error } = await supabase.from('doctor_patient').upsert(
      {
        doctor_id: doctorId,
        patient_id: profile.id,
        status: 'pending',
      },
      { onConflict: 'doctor_id,patient_id' }
    );

    if (!error) {
      const { data } = await supabase
        .from('doctor_patient')
        .select('*, doctor:profiles!doctor_id(id, full_name, specialty, bio)')
        .eq('patient_id', profile.id)
        .order('created_at', { ascending: false });
      setDoctorRelations((data || []) as DoctorRelationship[]);
    }
  };

  const latestRelation = doctorRelations[0] ?? null;

  const renderDoctorConnections = () => (
    <Card className="fitness-card mb-6">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="w-5 h-5 text-fitness-accent" />
            My Doctor Connections
          </CardTitle>
          <Button asChild className="bg-fitness-primary hover:bg-fitness-primary/90">
            <Link to="/my-doctors">Add Another Doctor</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {doctorRelations.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-4 flex-col sm:flex-row">
            <div>
              <p className="font-semibold">No doctors yet</p>
              <p className="text-sm text-gray-400">Connect with a doctor to start sharing workout feedback and prescriptions.</p>
            </div>
            <Button asChild className="bg-fitness-accent hover:bg-fitness-accent/80">
              <Link to="/my-doctors">Find a Doctor</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {doctorRelations.map((relation) => {
              const doctor = relation.doctor;
              const toneClass = relation.status === 'accepted'
                ? 'bg-green-500/20 text-green-300 border-green-500/40'
                : relation.status === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                  : 'bg-red-500/20 text-red-300 border-red-500/40';

              return (
                <div key={relation.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold bg-fitness-primary/20 text-fitness-primary">
                      {doctor?.full_name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'D'}
                    </div>
                    <div>
                      <p className="font-semibold">{doctor?.full_name || 'Doctor'}</p>
                      <p className="text-sm text-gray-400">{doctor?.specialty || 'General Practice'}</p>
                      <Badge variant="outline" className={`mt-2 ${toneClass}`}>
                        {relation.status === 'accepted' ? 'Connected' : relation.status === 'pending' ? 'Request Pending' : 'Rejected'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {relation.status === 'accepted' && doctor?.id && (
                      <Button asChild size="sm" className="bg-fitness-primary hover:bg-fitness-primary/90">
                        <Link to={`/messages/${doctor.id}`}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Link>
                      </Button>
                    )}
                    {relation.status === 'rejected' && doctor?.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10"
                        onClick={() => requestDoctorAgain(doctor.id)}
                      >
                        Request Again
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDoctorCard = () => {
    if (!latestRelation) {
      return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-semibold">No Doctor Assigned</p>
            <p className="text-sm text-gray-400">Choose a doctor to get personalized guidance</p>
          </div>
          <button
            onClick={() => navigate('/onboarding/choose-doctor')}
            className="px-4 py-2 rounded-lg bg-fitness-primary text-white text-sm hover:bg-fitness-primary/90 transition"
          >
            Find a Doctor
          </button>
        </div>
      );
    }

    if (latestRelation.status === 'pending') {
      return (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
          <p className="font-semibold text-yellow-400">⏳ Request Pending</p>
          <p className="text-sm text-gray-400">
            Waiting for Dr. {latestRelation.doctor?.full_name} to accept your request
          </p>
        </div>
      );
    }

    if (latestRelation.status === 'accepted') {
      return (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
          <p className="font-semibold text-green-400">✓ Doctor Assigned</p>
          <p className="text-lg font-bold text-white">Dr. {latestRelation.doctor?.full_name}</p>
          <p className="text-sm text-gray-400">{latestRelation.doctor?.specialty}</p>
        </div>
      );
    }

    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
        <p className="font-semibold text-red-400">Request Declined</p>
        <p className="text-sm text-gray-400">Send a new request to connect with another doctor</p>
        <button
          onClick={() => navigate('/onboarding/choose-doctor')}
          className="mt-3 px-4 py-2 rounded-lg bg-fitness-primary text-white text-sm hover:bg-fitness-primary/90 transition"
        >
          Find a Doctor
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10" />
      <Navbar />

      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            Welcome back, {firstNameOnly}!
          </h1>
          <p className="text-gray-400 mt-1">Here's your health overview.</p>
        </div>

        {renderDoctorConnections()}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    {recentWorkouts.map((log) => (
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