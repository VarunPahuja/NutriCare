import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { DoctorPatient, Profile } from '@/types/database';
import { Bell, Users, ChevronRight, CheckCircle, XCircle, Loader2, ArrowRight, MessageSquare } from 'lucide-react';

type PatientRequest = DoctorPatient & {
  patient?: Pick<Profile, 'id' | 'full_name' | 'email'> | null;
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<PatientRequest[]>([]);
  const [acceptedPatients, setAcceptedPatients] = useState<PatientRequest[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const firstNameOnly = profile?.full_name?.split(' ')[0] || 'Doctor';

  const fetchData = useCallback(async () => {
    if (!profile) return;

    setLoading(true);

    const [pendingRes, acceptedRes, messagesRes] = await Promise.all([
      supabase
        .from('doctor_patient')
        .select('*, patient:profiles!patient_id(id, full_name, email)')
        .eq('doctor_id', profile.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
      supabase
        .from('doctor_patient')
        .select('*, patient:profiles!patient_id(id, full_name, email)')
        .eq('doctor_id', profile.id)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false }),
      supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', profile.id)
        .eq('read', false),
    ]);

    console.log('Pending:', pendingRes.data, pendingRes.error);
    console.log('Accepted:', acceptedRes.data, acceptedRes.error);

    setPendingRequests((pendingRes.data || []) as PatientRequest[]);
    setAcceptedPatients((acceptedRes.data || []) as PatientRequest[]);
    setUnreadMessages(messagesRes.count || 0);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAccept = async (requestId: string) => {
    setActionLoading(requestId);
    const { error } = await supabase.from('doctor_patient').update({ status: 'accepted' }).eq('id', requestId);
    if (!error) {
      await fetchData();
    }
    setActionLoading(null);
  };

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId);
    const { error } = await supabase.from('doctor_patient').update({ status: 'rejected' }).eq('id', requestId);
    if (!error) {
      await fetchData();
    }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="fitness-card">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Pending Requests</p>
                <p className="text-3xl font-bold mt-1">{pendingRequests.length}</p>
              </div>
              <Bell className="w-8 h-8 text-amber-400" />
            </CardContent>
          </Card>

          <Card className="fitness-card">
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Accepted Patients</p>
                <p className="text-3xl font-bold mt-1">{acceptedPatients.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </CardContent>
          </Card>

          <Card className="fitness-card cursor-pointer" onClick={() => navigate('/messages')}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Unread Messages</p>
                <p className="text-3xl font-bold mt-1">{unreadMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-fitness-primary" />
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-fitness-accent" />
          </div>
        ) : (
          <div className="space-y-8">
            {pendingRequests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell size={20} className="text-fitness-primary" />
                  Pending Requests
                  <span className="bg-fitness-primary text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {pendingRequests.length}
                  </span>
                </h2>
                <div className="grid gap-4">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{req.patient?.full_name}</p>
                        <p className="text-sm text-gray-400">{req.patient?.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Requested {new Date(req.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
                    <Users size={40} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No patients yet</p>
                    <p className="text-gray-500 text-sm">Accept patient requests to get started</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {acceptedPatients.map((rel) => (
                      <div
                        key={rel.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 transition cursor-pointer"
                        onClick={() => navigate(`/doctor/patient/${rel.patient?.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-fitness-primary/20 flex items-center justify-center text-fitness-primary font-bold">
                            {rel.patient?.full_name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{rel.patient?.full_name}</p>
                            <p className="text-sm text-gray-400">{rel.patient?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(`/messages/${rel.patient?.id}`);
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-1.5" />
                            Message
                          </Button>
                          <ChevronRight size={18} className="text-gray-500" />
                        </div>
                      </div>
                    ))}
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