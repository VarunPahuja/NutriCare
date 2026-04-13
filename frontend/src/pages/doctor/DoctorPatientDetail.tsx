import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { Profile, WorkoutLog, PredictionHistory, DoctorNote, MedicationLog, WorkoutFeedback } from '@/types/database';
import { Loader2, FileText, Dumbbell, Brain, User, Pill, CalendarDays, Plus } from 'lucide-react';

type WorkoutFeedbackRow = WorkoutFeedback & {
  doctor?: Pick<Profile, 'full_name'> | null;
};

const medicationDefaults = {
  name: '',
  dosage: '',
  frequency: 'Once daily',
  time_of_day: 'Morning',
  notes: '',
};

const DoctorPatientDetail = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const { profile: doctor } = useAuth();
  const [patient, setPatient] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);
  const [notes, setNotes] = useState<DoctorNote[]>([]);
  const [medications, setMedications] = useState<MedicationLog[]>([]);
  const [workoutFeedbackByWorkout, setWorkoutFeedbackByWorkout] = useState<Record<string, WorkoutFeedbackRow[]>>({});
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingNote, setSubmittingNote] = useState(false);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [postingFeedbackId, setPostingFeedbackId] = useState<string | null>(null);
  const [medicationForm, setMedicationForm] = useState(medicationDefaults);
  const [prescribing, setPrescribing] = useState(false);

  const formatDate = (value: string) => new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const fetchWorkoutFeedback = async (workoutRows: WorkoutLog[]) => {
    if (workoutRows.length === 0) {
      setWorkoutFeedbackByWorkout({});
      return;
    }

    const feedbackEntries = await Promise.all(
      workoutRows.map(async (workout) => {
        const { data } = await supabase
          .from('workout_feedback')
          .select('*, doctor:profiles!doctor_id(full_name)')
          .eq('workout_id', workout.id)
          .order('created_at', { ascending: true });

        return [workout.id, (data || []) as WorkoutFeedbackRow[]] as const;
      })
    );

    setWorkoutFeedbackByWorkout(Object.fromEntries(feedbackEntries));
  };

  const fetchAll = useCallback(async () => {
    if (!patientId || !doctor?.id) return;

    setLoading(true);

    const [profileRes, workoutsRes, predictionsRes, medsRes, notesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', patientId).single(),
      supabase.from('workout_logs').select('*').eq('patient_id', patientId).order('date', { ascending: false }).limit(10),
      supabase.from('prediction_history').select('*').eq('patient_id', patientId).order('created_at', { ascending: false }).limit(5),
      supabase.from('medication_logs').select('*').eq('patient_id', patientId).order('created_at', { ascending: false }),
      supabase.from('doctor_notes').select('*').eq('patient_id', patientId).eq('doctor_id', doctor.id).order('created_at', { ascending: false }),
    ]);

    const workoutRows = (workoutsRes.data || []) as WorkoutLog[];

    setPatient(profileRes.data);
    setWorkouts(workoutRows);
    setPredictions(predictionsRes.data || []);
    setMedications(medsRes.data || []);
    setNotes(notesRes.data || []);
    await fetchWorkoutFeedback(workoutRows);
    setLoading(false);
  }, [doctor?.id, patientId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !doctor?.id || !patientId) return;

    setSubmittingNote(true);
    const { error } = await supabase.from('doctor_notes').insert({
      doctor_id: doctor.id,
      patient_id: patientId,
      note: newNote.trim(),
    });

    if (!error) {
      setNewNote('');
      await fetchAll();
    }

    setSubmittingNote(false);
  };

  const handlePostFeedback = async (workoutId: string) => {
    if (!doctor?.id || !patientId) return;

    const feedbackText = feedbackDrafts[workoutId]?.trim();
    if (!feedbackText) return;

    setPostingFeedbackId(workoutId);
    const { error } = await supabase.from('workout_feedback').insert({
      workout_id: workoutId,
      doctor_id: doctor.id,
      patient_id: patientId,
      comment: feedbackText,
    });

    if (!error) {
      const optimisticRow: WorkoutFeedbackRow = {
        id: crypto.randomUUID(),
        workout_id: workoutId,
        doctor_id: doctor.id,
        patient_id: patientId,
        comment: feedbackText,
        created_at: new Date().toISOString(),
        doctor: { full_name: doctor.full_name },
      };

      setWorkoutFeedbackByWorkout((previous) => ({
        ...previous,
        [workoutId]: [...(previous[workoutId] || []), optimisticRow],
      }));
      setFeedbackDrafts((previous) => ({ ...previous, [workoutId]: '' }));
      setExpandedWorkoutId(null);
    }

    setPostingFeedbackId(null);
  };

  const handleMedicationFieldChange = (field: keyof typeof medicationDefaults, value: string) => {
    setMedicationForm((previous) => ({ ...previous, [field]: value }));
  };

  const handlePrescribeMedication = async () => {
    if (!doctor?.id || !patientId) return;
    if (!medicationForm.name.trim() || !medicationForm.dosage.trim()) return;

    setPrescribing(true);
    const { error } = await supabase.from('medication_logs').insert({
      patient_id: patientId,
      name: medicationForm.name.trim(),
      dosage: medicationForm.dosage.trim(),
      frequency: medicationForm.frequency,
      time_of_day: medicationForm.time_of_day,
      notes: medicationForm.notes.trim() || null,
      is_prescribed: true,
      prescribed_by: doctor.id,
      prescribed_by_name: doctor.full_name,
    });

    if (!error) {
      setMedicationForm(medicationDefaults);
      await fetchAll();
    }

    setPrescribing(false);
  };

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
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              Joined {patient?.created_at ? formatDate(patient.created_at) : '—'}
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="bg-white/5 border border-white/10 mb-4 flex flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="fitness-card">
                <CardContent className="pt-6">
                  <p className="text-xs text-gray-400">Workout Logs</p>
                  <p className="text-3xl font-bold mt-1">{workouts.length}</p>
                </CardContent>
              </Card>
              <Card className="fitness-card">
                <CardContent className="pt-6">
                  <p className="text-xs text-gray-400">Predictions</p>
                  <p className="text-3xl font-bold mt-1">{predictions.length}</p>
                </CardContent>
              </Card>
              <Card className="fitness-card">
                <CardContent className="pt-6">
                  <p className="text-xs text-gray-400">Medications</p>
                  <p className="text-3xl font-bold mt-1">{medications.length}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4 text-fitness-accent" />
                  Patient Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300">{patient?.email}</p>
                <p className="text-xs text-gray-500 mt-1">Joined {patient?.created_at ? formatDate(patient.created_at) : '—'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Dumbbell className="w-4 h-4 text-fitness-primary" />
                  Workout Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workouts.length === 0 ? (
                  <p className="text-sm text-gray-400">No workouts logged.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Intensity</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="w-36">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workouts.map((workout) => {
                        const workoutId = String(workout.id);
                        const feedbackItems = workoutFeedbackByWorkout[workoutId] || [];
                        const isExpanded = expandedWorkoutId === workoutId;

                        return (
                          <React.Fragment key={workoutId}>
                            <TableRow>
                              <TableCell>{formatDate(workout.date)}</TableCell>
                              <TableCell className="capitalize">{workout.type}</TableCell>
                              <TableCell>{workout.duration_minutes} min</TableCell>
                              <TableCell className="capitalize">{workout.intensity}</TableCell>
                              <TableCell>{workout.notes || '—'}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-fitness-primary text-fitness-primary hover:bg-fitness-primary/10 h-8"
                                  onClick={() => setExpandedWorkoutId(isExpanded ? null : workoutId)}
                                >
                                  Add Feedback
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={6} className="bg-black/10">
                                <div className="space-y-4 py-2">
                                  {feedbackItems.length > 0 && (
                                    <div className="space-y-2">
                                      {feedbackItems.map((item) => (
                                        <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                                          <Avatar className="h-9 w-9 shrink-0">
                                            <AvatarFallback className="bg-fitness-primary/20 text-fitness-primary text-xs font-bold">
                                              {item.doctor?.full_name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'D'}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-fitness-primary">Dr. {item.doctor?.full_name || 'Doctor'}</p>
                                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{item.comment}</p>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(item.created_at)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {isExpanded && (
                                    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                                      <Textarea
                                        value={feedbackDrafts[workoutId] || ''}
                                        onChange={(event) => setFeedbackDrafts((previous) => ({
                                          ...previous,
                                          [workoutId]: event.target.value,
                                        }))}
                                        placeholder="Add feedback for this workout..."
                                        className="bg-gray-900 border-white/10 min-h-[96px]"
                                      />
                                      <div className="flex justify-end">
                                        <Button
                                          size="sm"
                                          className="bg-fitness-accent hover:bg-fitness-accent/80"
                                          onClick={() => handlePostFeedback(workoutId)}
                                          disabled={postingFeedbackId === workoutId || !(feedbackDrafts[workoutId] || '').trim()}
                                        >
                                          {postingFeedbackId === workoutId ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                          Post Feedback
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions">
            <Card className="fitness-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="w-4 h-4 text-purple-400" />
                  Prediction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictions.length === 0 ? (
                  <p className="text-sm text-gray-400">No predictions yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Calories</TableHead>
                        <TableHead>Protein</TableHead>
                        <TableHead>Carbs</TableHead>
                        <TableHead>Fat</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {predictions.map((prediction) => {
                        const result = prediction.result as Record<string, unknown>;
                        return (
                          <TableRow key={prediction.id}>
                            <TableCell>{formatDate(prediction.created_at)}</TableCell>
                            <TableCell>{Number(result.calories || 0).toFixed(1)}</TableCell>
                            <TableCell>{Number(result.protein || 0).toFixed(1)}</TableCell>
                            <TableCell>{Number(result.carbs || 0).toFixed(1)}</TableCell>
                            <TableCell>{Number(result.fat || 0).toFixed(1)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications">
            <div className="space-y-6">
              <Card className="fitness-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Pill className="w-4 h-4 text-fitness-primary" />
                    Prescribe Medication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Medication Name</label>
                      <input
                        value={medicationForm.name}
                        onChange={(event) => handleMedicationFieldChange('name', event.target.value)}
                        className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fitness-primary/50"
                        placeholder="e.g. Metformin"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Dosage</label>
                      <input
                        value={medicationForm.dosage}
                        onChange={(event) => handleMedicationFieldChange('dosage', event.target.value)}
                        className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fitness-primary/50"
                        placeholder="e.g. 500mg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Frequency</label>
                      <select
                        value={medicationForm.frequency}
                        onChange={(event) => handleMedicationFieldChange('frequency', event.target.value)}
                        className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fitness-primary/50"
                      >
                        <option>Once daily</option>
                        <option>Twice daily</option>
                        <option>Three times daily</option>
                        <option>As needed</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Time of Day</label>
                      <select
                        value={medicationForm.time_of_day}
                        onChange={(event) => handleMedicationFieldChange('time_of_day', event.target.value)}
                        className="w-full rounded-md border border-white/10 bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-fitness-primary/50"
                      >
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                        <option>Night</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <label className="text-sm text-gray-300">Notes / Instructions</label>
                    <Textarea
                      value={medicationForm.notes}
                      onChange={(event) => handleMedicationFieldChange('notes', event.target.value)}
                      className="bg-gray-900 border-white/10"
                      placeholder="Add any special instructions or notes"
                    />
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      className="bg-fitness-primary hover:bg-fitness-primary/90"
                      onClick={handlePrescribeMedication}
                      disabled={prescribing || !medicationForm.name.trim() || !medicationForm.dosage.trim()}
                    >
                      {prescribing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                      Prescribe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="fitness-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Pill className="w-4 h-4 text-fitness-primary" />
                    Medication Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {medications.length === 0 ? (
                    <p className="text-sm text-gray-400">Patient has not logged any medications yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Dosage</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {medications.map((medication) => (
                          <TableRow key={medication.id}>
                            <TableCell>{medication.name}</TableCell>
                            <TableCell>{medication.dosage}</TableCell>
                            <TableCell>{medication.frequency}</TableCell>
                            <TableCell>{medication.time_of_day}</TableCell>
                            <TableCell>{medication.notes || '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="fitness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Doctor Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <Textarea
                value={newNote}
                onChange={(event) => setNewNote(event.target.value)}
                placeholder="Add a clinical note for this patient..."
                rows={3}
                className="bg-gray-900 border-white/10"
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
                {notes.map((note) => (
                  <div key={note.id} className="bg-fitness-muted/30 rounded-lg p-3 border border-fitness-border">
                    <p className="text-sm text-gray-300">{note.note}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(note.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DoctorPatientDetail;
