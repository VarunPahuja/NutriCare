import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { DoctorPatient, Profile } from '@/types/database';
import { Users, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

type PatientRequest = DoctorPatient & { patient?: Profile };

const DoctorDashboard = () => {
  const { profile } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<PatientRequest[]>([]);
  const [acceptedPatients, setAcceptedPatients] = useState<PatientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const firstNameOnly = profile?.full_name?.split(' ')[0] || 'Doctor';

  async function fetchData() {
    if (!profile) return;
    setLoading(true);

    const { data } = await supabase
      .from('doctor_patient')
      .select('*, patient:profiles!doctor_patient_patient_id_fkey(*)')
      .eq('doctor_id', profile.id)
      .order('created_at', { ascending: false });

    const all = (data || []) as PatientRequest[];
    setPendingRequests(all.filter(r => r.status === 'pending'));
    setAcceptedPatients(all.filter(r => r.status === 'accepted'));
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleStatusUpdate = async (requestId: string, status: 'accepted' | 'rejected') => {
    setActionLoading(requestId);
    await supabase.from('doctor_patient').update({ status }).eq('id', requestId);
    await fetchData();
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-accent/10" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-primary/10" />
      <Navbar />

      <main className="container mx-auto px-4 py-6 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            Welcome, Dr. {firstNameOnly}
          </h1>
          <p className="text-gray-400 mt-1">Manage your patients and requests.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-fitness-accent" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pending Requests */}
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  Pending Requests ({pendingRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <p className="text-sm text-gray-400">No pending patient requests.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map(req => {
                      const patient = req.patient as Profile;
                      return (
                        <div key={req.id} className="flex items-center justify-between p-3 bg-fitness-muted/30 rounded-lg border border-fitness-border">
                          <div>
                            <p className="font-medium text-sm">{patient?.full_name}</p>
                            <p className="text-xs text-gray-400">{patient?.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 h-8"
                              onClick={() => handleStatusUpdate(req.id, 'accepted')}
                              disabled={actionLoading === req.id}
                            >
                              {actionLoading === req.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-400 hover:bg-red-900/20 h-8"
                              onClick={() => handleStatusUpdate(req.id, 'rejected')}
                              disabled={actionLoading === req.id}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Accepted Patients */}
            <Card className="fitness-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    My Patients ({acceptedPatients.length})
                  </CardTitle>
                  {acceptedPatients.length > 0 && (
                    <Button asChild size="sm" variant="outline" className="border-fitness-border">
                      <Link to="/doctor/patients">
                        View All <ArrowRight className="ml-1 w-3 h-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {acceptedPatients.length === 0 ? (
                  <p className="text-sm text-gray-400">No accepted patients yet.</p>
                ) : (
                  <div className="space-y-2">
                    {acceptedPatients.slice(0, 5).map(req => {
                      const patient = req.patient as Profile;
                      return (
                        <Link key={req.id} to={`/doctor/patient/${patient?.id}`} className="block">
                          <div className="flex items-center justify-between p-3 bg-fitness-muted/30 rounded-lg border border-fitness-border hover:border-fitness-primary/40 transition-all">
                            <div>
                              <p className="font-medium text-sm">{patient?.full_name}</p>
                              <p className="text-xs text-gray-400">{patient?.email}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;
