import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { DoctorPatient, Profile } from '@/types/database';
import { Loader2, MessageSquare, Stethoscope, UserX } from 'lucide-react';

type DoctorProfile = Pick<Profile, 'id' | 'full_name' | 'specialty' | 'bio'>;

type DoctorRelation = DoctorPatient & {
  doctor?: DoctorProfile | null;
};

const statusClasses: Record<DoctorPatient['status'], string> = {
  accepted: 'border-green-500/40 bg-green-500/10 text-green-300',
  pending: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
  rejected: 'border-red-500/40 bg-red-500/10 text-red-300',
};

const avatarInitials = (name?: string | null) => {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

export default function MyDoctors() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [relations, setRelations] = useState<DoctorRelation[]>([]);
  const [allDoctors, setAllDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingDoctorId, setSubmittingDoctorId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      setLoading(true);

      const [relationsRes, doctorsRes] = await Promise.all([
        supabase
          .from('doctor_patient')
          .select('*, doctor:profiles!doctor_id(id, full_name, specialty, bio)')
          .eq('patient_id', profile.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, full_name, specialty, bio')
          .eq('role', 'doctor')
          .order('full_name', { ascending: true }),
      ]);

      setRelations((relationsRes.data || []) as DoctorRelation[]);
      setAllDoctors((doctorsRes.data || []) as DoctorProfile[]);
      setLoading(false);
    };

    fetchData();
  }, [profile]);

  const relationDoctorIds = useMemo(() => new Set(relations.map((relation) => relation.doctor_id)), [relations]);
  const availableDoctors = useMemo(
    () => allDoctors.filter((doctor) => !relationDoctorIds.has(doctor.id)),
    [allDoctors, relationDoctorIds]
  );

  const sendRequest = async (doctorId: string) => {
    if (!profile) return;

    setSubmittingDoctorId(doctorId);
    setNotice('');
    setError('');

    const { error: requestError } = await supabase.from('doctor_patient').upsert(
      {
        doctor_id: doctorId,
        patient_id: profile.id,
        status: 'pending',
      },
      { onConflict: 'doctor_id,patient_id' }
    );

    if (requestError) {
      setError(requestError.message);
      setSubmittingDoctorId(null);
      return;
    }

    const { data } = await supabase
      .from('doctor_patient')
      .select('*, doctor:profiles!doctor_id(id, full_name, specialty, bio)')
      .eq('patient_id', profile.id)
      .order('created_at', { ascending: false });

    setRelations((data || []) as DoctorRelation[]);
    setNotice('Request sent successfully.');
    setSubmittingDoctorId(null);
  };

  const requestAgain = async (doctorId: string) => {
    await sendRequest(doctorId);
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 pointer-events-none" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 pointer-events-none" />

      <Navbar />

      <main className="container mx-auto px-4 py-6 relative z-10 max-w-6xl">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">My Doctors</h1>
            <p className="text-gray-400 mt-1">Manage your doctor connections and send new requests.</p>
          </div>
          <Button onClick={() => navigate('/onboarding/choose-doctor')} className="bg-fitness-primary hover:bg-fitness-primary/90">
            <Stethoscope className="w-4 h-4 mr-2" />
            Find Doctors
          </Button>
        </div>

        {notice && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
            {notice}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mb-10">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">My Doctor Connections</h2>
            <Button asChild variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
            </div>
          ) : relations.length === 0 ? (
            <Card className="fitness-card">
              <CardContent className="py-12 text-center">
                <UserX className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="font-semibold text-lg">No doctors yet</p>
                <p className="text-sm text-gray-400 mt-1">Use the button above to find a doctor and send a request.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {relations.map((relation) => {
                const doctor = relation.doctor;

                return (
                  <Card key={relation.id} className="fitness-card">
                    <CardContent className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <Avatar className="h-12 w-12 shrink-0">
                          <AvatarFallback className="bg-fitness-primary/20 text-fitness-primary font-bold">
                            {avatarInitials(doctor?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold truncate">{doctor?.full_name || 'Doctor'}</h3>
                            <Badge variant="outline" className={statusClasses[relation.status]}>
                              {relation.status === 'accepted' ? 'Connected' : relation.status === 'pending' ? 'Request Pending' : 'Rejected'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{doctor?.specialty || 'General Practice'}</p>
                          {doctor?.bio && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doctor.bio}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {relation.status === 'accepted' && doctor?.id && (
                          <Button asChild className="bg-fitness-primary hover:bg-fitness-primary/90">
                            <Link to={`/messages/${doctor.id}`}>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Message
                            </Link>
                          </Button>
                        )}

                        {relation.status === 'rejected' && doctor?.id && (
                          <Button
                            variant="outline"
                            className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10"
                            onClick={() => requestAgain(doctor.id)}
                            disabled={submittingDoctorId === doctor.id}
                          >
                            {submittingDoctorId === doctor.id ? 'Sending...' : 'Request Again'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold">Find More Doctors</h2>
          </div>

          {availableDoctors.length === 0 ? (
            <Card className="fitness-card">
              <CardContent className="py-12 text-center text-gray-400">
                You've connected with all available doctors.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {availableDoctors.map((doctor) => (
                <Card key={doctor.id} className="fitness-card">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarFallback className="bg-fitness-primary/20 text-fitness-primary font-bold">
                          {avatarInitials(doctor.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold truncate">{doctor.full_name}</h3>
                        <p className="text-sm text-gray-400">{doctor.specialty || 'General Practice'}</p>
                        {doctor.bio && <p className="text-sm text-gray-500 mt-1 line-clamp-3">{doctor.bio}</p>}
                      </div>
                    </div>

                    <Button
                      onClick={() => sendRequest(doctor.id)}
                      disabled={submittingDoctorId === doctor.id}
                      className="w-full mt-4 bg-fitness-primary hover:bg-fitness-primary/90"
                    >
                      {submittingDoctorId === doctor.id ? 'Sending...' : 'Send Request'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}