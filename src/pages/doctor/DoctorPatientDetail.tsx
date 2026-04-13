import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { Profile, WorkoutLog, PredictionHistory, DoctorNote, MedicationLog } from '@/types/database';
import { Loader2, FileText, Dumbbell, Brain, User, Pill } from 'lucide-react';

const DoctorPatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { profile: doctor } = useAuth();
  const [patient, setPatient] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [notes, setNotes] = useState<DoctorNote[]>([]);
  const [medications, setMedications] = useState<MedicationLog[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchData() {
      setLoading(true);
      const [patientRes, workoutsRes, predictionsRes, notesRes, medicationsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('workout_logs').select('*').eq('patient_id', id).order('date', { ascending: false }),
        supabase.from('prediction_history').select('*').eq('patient_id', id).order('created_at', { ascending: false }),
        supabase.from('doctor_notes').select('*').eq('patient_id', id).eq('doctor_id', doctor?.id).order('created_at', { ascending: false }),
        supabase.from('medication_logs').select('*').eq('patient_id', id).order('created_at', { ascending: false }),
      ]);
      setPatient(patientRes.data);
      setWorkouts(workoutsRes.data || []);
      setPredictions(predictionsRes.data || []);
      setNotes(notesRes.data || []);
      setMedications(medicationsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, [id, doctor]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !doctor || !id) return;
    setSubmittingNote(true);
    const { data } = await supabase.from('doctor_notes').insert({
      doctor_id: doctor.id,
      patient_id: id,
      note: newNote.trim(),
    }).select().single();
    if (data) {
      setNotes(prev => [data, ...prev]);
      setNewNote('');
    }
    setSubmittingNote(false);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-fitness-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fitness-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto px-4 py-6 relative z-10">
        {/* Patient Info */}
        <Card className="fitness-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-fitness-accent" />
              Patient Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{patient?.full_name}</p>
            <p className="text-sm text-gray-400">{patient?.email}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Workout Logs */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Dumbbell className="w-4 h-4 text-fitness-primary" />
                Workout Logs ({workouts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {workouts.length === 0 ? (
                <p className="text-sm text-gray-400">No workouts logged.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {workouts.map(w => (
                    <div key={w.id} className="text-sm border-b border-fitness-border pb-2 last:border-0">
                      <p className="font-medium capitalize">{w.type}</p>
                      <p className="text-xs text-gray-400">{formatDate(w.date)} · {w.duration_minutes}min · {w.intensity} intensity</p>
                      {w.notes && <p className="text-xs text-gray-500 mt-0.5">{w.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prediction History */}
          <Card className="fitness-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-4 h-4 text-purple-400" />
                Predictions ({predictions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {predictions.length === 0 ? (
                <p className="text-sm text-gray-400">No predictions yet.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {predictions.map(p => (
                    <div key={p.id} className="text-sm border-b border-fitness-border pb-2 last:border-0">
                      <p className="text-xs text-gray-400 mb-1">{formatDate(p.created_at)}</p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {Object.entries(p.result).map(([key, val]) =>
                          typeof val === 'number' ? (
                            <span key={key} className="text-gray-300">
                              <span className="text-gray-500 capitalize">{key}:</span> {Number(val).toFixed(1)}
                            </span>
                          ) : null
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Doctor Notes */}
        <Card className="fitness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Doctor Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Add a clinical note for this patient..."
                rows={3}
                className="w-full bg-fitness-muted border border-fitness-border text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fitness-accent/50 resize-none"
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim() || submittingNote}
                size="sm"
                className="bg-fitness-accent hover:bg-fitness-accent/80"
              >
                {submittingNote ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Note
              </Button>
            </div>

            {notes.length === 0 ? (
              <p className="text-sm text-gray-400">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map(note => (
                  <div key={note.id} className="bg-fitness-muted/30 rounded-lg p-3 border border-fitness-border">
                    <p className="text-sm text-gray-300">{note.note}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(note.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="fitness-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-fitness-primary" />
              Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {medications.length === 0 ? (
              <p className="text-sm text-gray-400">Patient has not logged any medications yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-fitness-border text-left text-gray-400">
                      <th className="py-2 pr-4 font-medium">Medication</th>
                      <th className="py-2 pr-4 font-medium">Dosage</th>
                      <th className="py-2 pr-4 font-medium">Frequency</th>
                      <th className="py-2 pr-4 font-medium">Time</th>
                      <th className="py-2 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map(med => (
                      <tr key={med.id} className="border-b border-white/5 last:border-0">
                        <td className="py-3 pr-4 font-medium text-white">{med.name}</td>
                        <td className="py-3 pr-4 text-gray-300">{med.dosage}</td>
                        <td className="py-3 pr-4 text-gray-300">{med.frequency}</td>
                        <td className="py-3 pr-4 text-gray-300">{med.time_of_day}</td>
                        <td className="py-3 text-gray-300">{med.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DoctorPatientDetail;
