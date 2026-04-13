import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { DoctorPatient, Profile } from '@/types/database';
import { Loader2, UserX } from 'lucide-react';

type DoctorRequest = Pick<DoctorPatient, 'doctor_id' | 'status'>;

const ChooseDoctor = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [doctors, setDoctors] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<DoctorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingDoctorId, setSubmittingDoctorId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!profile) return;

    const fetchData = async () => {
      setLoading(true);

      const [doctorsRes, requestsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, specialty, bio, role')
          .eq('role', 'doctor'),
        supabase
          .from('doctor_patient')
          .select('*')
          .eq('patient_id', profile.id),
      ]);

      console.log('Doctors found:', doctorsRes.data, 'Error:', doctorsRes.error);
      console.log('Requests:', requestsRes.data, 'Error:', requestsRes.error);

      setDoctors((doctorsRes.data || []) as Profile[]);
      setRequests((requestsRes.data || []) as DoctorRequest[]);
      setLoading(false);
    };

    fetchData();
  }, [profile]);

  const getRequestStatus = (doctorId: string) => {
    const request = requests.find((item) => item.doctor_id === doctorId);
    return request?.status || null;
  };

  const sendRequest = async (doctorId: string) => {
    if (!profile) return;
    setSubmittingDoctorId(doctorId);
    setNotice('');
    setError('');

    const { error } = await supabase.from('doctor_patient').upsert(
      {
        doctor_id: doctorId,
        patient_id: profile.id,
        status: 'pending',
      },
      { onConflict: 'doctor_id,patient_id' }
    );

    if (error) {
      console.error('Request error:', error);
      setError('Failed to send request: ' + error.message);
      setSubmittingDoctorId(null);
      return;
    }

    const { data } = await supabase
      .from('doctor_patient')
      .select('*')
      .eq('patient_id', profile.id);

    setRequests((data || []) as DoctorRequest[]);
    setNotice('Request sent successfully.');
    setSubmittingDoctorId(null);
  };

  return (
    <div className="min-h-screen bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10" />

      <main className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Choose Your Doctor</h1>
          <p className="text-gray-400">Select a doctor to send a consultation request</p>
        </div>

        {notice && (
          <div className="mb-6 rounded-lg border border-fitness-primary/30 bg-fitness-primary/10 p-3 text-sm text-center text-gray-200">
            {notice}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-center text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-16">
            <UserX className="w-14 h-14 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No doctors registered yet</h2>
            <p className="text-gray-400 mb-8">Check back later as more doctors join NutriCare</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-lg border border-white/20 px-5 py-2 text-sm text-gray-300 hover:bg-white/10 transition"
            >
              Skip for now
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {doctors.map((doctor) => {
                const initial = doctor.full_name?.[0]?.toUpperCase() || 'D';
                return (
                  <div key={doctor.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-fitness-primary text-white font-bold flex items-center justify-center">
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold">{doctor.full_name}</h3>
                        {doctor.specialty && (
                          <span className="inline-flex mt-2 rounded-full bg-fitness-primary/20 px-3 py-1 text-xs text-fitness-primary">
                            {doctor.specialty}
                          </span>
                        )}
                        <p
                          className="text-sm text-gray-400 mt-3"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {doctor.bio || 'No bio provided yet.'}
                        </p>
                      </div>
                    </div>
                    {(() => {
                      const status = getRequestStatus(doctor.id);

                      if (status === 'accepted') {
                        return <span className="text-green-400 text-sm font-medium">✓ Your Doctor</span>;
                      }

                      if (status === 'pending') {
                        return <span className="text-gray-400 text-sm">Request Sent</span>;
                      }

                      if (status === 'rejected') {
                        return (
                          <button
                            onClick={() => sendRequest(doctor.id)}
                            className="w-full mt-4 rounded-lg bg-fitness-primary px-4 py-2 text-sm font-semibold text-white hover:bg-fitness-primary/90 transition"
                            disabled={submittingDoctorId === doctor.id}
                          >
                            {submittingDoctorId === doctor.id ? 'Sending...' : 'Request Again'}
                          </button>
                        );
                      }

                      return (
                        <button
                          onClick={() => sendRequest(doctor.id)}
                          className="w-full mt-4 rounded-lg bg-fitness-primary px-4 py-2 text-sm font-semibold text-white hover:bg-fitness-primary/90 transition"
                          disabled={submittingDoctorId === doctor.id}
                        >
                          {submittingDoctorId === doctor.id ? 'Sending...' : 'Send Request'}
                        </button>
                      );
                    })()}
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Skip for now, I'll choose later
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ChooseDoctor;
