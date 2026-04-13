import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Profile } from '@/types/database';
import { Loader2, UserX } from 'lucide-react';

type RequestStatus = 'pending' | 'accepted' | 'rejected';
type DoctorRequest = { doctor_id: string; status: RequestStatus };

const ChooseDoctor = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [doctors, setDoctors] = useState<Profile[]>([]);
  const [requests, setRequests] = useState<DoctorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingDoctorId, setSubmittingDoctorId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;

      setLoading(true);
      const [doctorRes, requestRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('role', 'doctor'),
        supabase
          .from('doctor_patient')
          .select('*')
          .eq('patient_id', profile.id),
      ]);

      setDoctors((doctorRes.data || []) as Profile[]);
      setRequests((requestRes.data || []) as DoctorRequest[]);
      setLoading(false);
    };

    fetchData();
  }, [profile]);

  const requestMap = useMemo(() => {
    const map = new Map<string, RequestStatus>();
    requests.forEach((request) => {
      map.set(request.doctor_id, request.status);
    });
    return map;
  }, [requests]);

  const handleSendRequest = async (doctor: Profile) => {
    if (!profile) return;
    setSubmittingDoctorId(doctor.id);
    setNotice('');

    const { error } = await supabase.from('doctor_patient').upsert(
      {
        doctor_id: doctor.id,
        patient_id: profile.id,
        status: 'pending',
      },
      { onConflict: 'doctor_id,patient_id' }
    );

    if (!error) {
      setRequests((prev) => {
        const others = prev.filter((item) => item.doctor_id !== doctor.id);
        return [...others, { doctor_id: doctor.id, status: 'pending' }];
      });
      setNotice(`Request sent to Dr. ${doctor.full_name}`);
    } else {
      setNotice(error.message);
    }

    setSubmittingDoctorId(null);
  };

  const renderStatusAction = (doctor: Profile) => {
    const status = requestMap.get(doctor.id);

    if (!status) {
      return (
        <button
          onClick={() => handleSendRequest(doctor)}
          className="w-full mt-4 rounded-lg bg-fitness-primary px-4 py-2 text-sm font-semibold text-white hover:bg-fitness-primary/90 transition"
          disabled={submittingDoctorId === doctor.id}
        >
          {submittingDoctorId === doctor.id ? 'Sending...' : 'Send Request'}
        </button>
      );
    }

    if (status === 'pending') {
      return (
        <div className="w-full mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm text-gray-300 text-center">
          Request Sent
        </div>
      );
    }

    if (status === 'accepted') {
      return (
        <div className="w-full mt-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-4 py-2 text-sm text-emerald-300 text-center">
          Your Doctor ✓
        </div>
      );
    }

    return (
      <button
        onClick={() => handleSendRequest(doctor)}
        className="w-full mt-4 rounded-lg bg-fitness-primary px-4 py-2 text-sm font-semibold text-white hover:bg-fitness-primary/90 transition"
        disabled={submittingDoctorId === doctor.id}
      >
        {submittingDoctorId === doctor.id ? 'Sending...' : 'Request Again'}
      </button>
    );
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
                    {renderStatusAction(doctor)}
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
