import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Profile } from '@/types/database';
import { Stethoscope, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const ChooseDoctor = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [doctors, setDoctors] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestedDoctors, setRequestedDoctors] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    async function checkExistingRelationship() {
      if (!profile) return;
      const { data } = await supabase
        .from('doctor_patient')
        .select('status')
        .eq('patient_id', profile.id)
        .eq('status', 'accepted')
        .maybeSingle();
      if (data) {
        navigate('/dashboard');
      }
    }
    checkExistingRelationship();
  }, [profile, navigate]);

  useEffect(() => {
    async function fetchDoctors() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor');
      setDoctors(data || []);
      setLoading(false);
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    async function fetchExistingRequests() {
      if (!profile) return;
      const { data } = await supabase
        .from('doctor_patient')
        .select('doctor_id')
        .eq('patient_id', profile.id);
      if (data) {
        setRequestedDoctors(new Set(data.map(r => r.doctor_id)));
      }
    }
    fetchExistingRequests();
  }, [profile]);

  const handleRequest = async (doctorId: string) => {
    if (!profile) return;
    setSubmitting(doctorId);
    const { error } = await supabase.from('doctor_patient').insert({
      doctor_id: doctorId,
      patient_id: profile.id,
      status: 'pending',
    });
    if (!error) {
      setRequestedDoctors(prev => new Set([...prev, doctorId]));
    }
    setSubmitting(null);
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10" />

      <main className="container mx-auto px-4 py-12 relative z-10 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold gradient-text mb-3">Choose Your Doctor</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Connect with a doctor to get personalized nutrition plans and professional oversight. You can always change this later from your settings.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No doctors are available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {doctors.map(doctor => (
              <Card key={doctor.id} className="bg-fitness-background/80 border-fitness-border hover:border-fitness-primary/40 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-fitness-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Stethoscope className="w-6 h-6 text-fitness-accent" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{doctor.full_name}</CardTitle>
                        {doctor.specialty && (
                          <CardDescription className="text-fitness-accent text-xs mt-0.5">
                            {doctor.specialty}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {doctor.bio && (
                    <p className="text-sm text-gray-400 mb-4">{doctor.bio}</p>
                  )}
                  {requestedDoctors.has(doctor.id) ? (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Request sent — waiting for approval
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full bg-fitness-primary hover:bg-fitness-primary/80"
                      onClick={() => handleRequest(doctor.id)}
                      disabled={submitting === doctor.id}
                    >
                      {submitting === doctor.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Request to Connect
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {requestedDoctors.size > 0 && (
          <div className="bg-fitness-primary/10 border border-fitness-primary/30 rounded-lg p-4 text-sm text-center text-gray-300 mb-6">
            Request sent. You can continue using the app while waiting for approval.
          </div>
        )}

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-fitness-border text-gray-400 hover:text-white"
            onClick={() => navigate('/dashboard')}
          >
            I'll choose later
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ChooseDoctor;
