import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { DoctorPatient, Profile } from '@/types/database';
import { Loader2, ArrowRight, Users } from 'lucide-react';

type PatientRow = DoctorPatient & { patient?: Profile };

const DoctorPatients = () => {
  const { profile } = useAuth();
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    async function fetchPatients() {
      const { data } = await supabase
        .from('doctor_patient')
        .select('*, patient:profiles!doctor_patient_patient_id_fkey(*)')
        .eq('doctor_id', profile!.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });
      setPatients((data || []) as PatientRow[]);
      setLoading(false);
    }
    fetchPatients();
  }, [profile]);

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-accent/10" />
      <Navbar />

      <main className="container mx-auto px-4 py-6 relative z-10">
        <h1 className="text-3xl font-bold gradient-text mb-6">My Patients</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-fitness-accent" />
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No accepted patients yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map(row => {
              const patient = row.patient as Profile;
              return (
                <Link key={row.id} to={`/doctor/patient/${patient?.id}`}>
                  <Card className="fitness-card hover:border-fitness-accent/40 transition-all cursor-pointer">
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium">{patient?.full_name}</p>
                        <p className="text-sm text-gray-400">{patient?.email}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Connected {new Date(row.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorPatients;
