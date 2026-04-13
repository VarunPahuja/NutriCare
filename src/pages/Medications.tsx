import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { MedicationLog } from '@/types/database';
import { Pill, Trash2, Loader2, Plus, Clock3, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FREQUENCY_OPTIONS = ['Once daily', 'Twice daily', 'Three times daily', 'As needed'];
const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Night'];

const defaultForm = {
  name: '',
  dosage: '',
  frequency: 'Once daily',
  time_of_day: 'Morning',
  start_date: '',
  purpose: '',
  additional_notes: '',
};

export default function Medications() {
  const { profile } = useAuth();
  const [meds, setMeds] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(defaultForm);

  const fetchMeds = async () => {
    if (!profile) {
      setMeds([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('patient_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setMeds([]);
    } else {
      setMeds(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchMeds();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setError('');
    setSubmitting(true);

    const noteParts = [
      form.purpose.trim() ? `Purpose: ${form.purpose.trim()}` : '',
      form.additional_notes.trim() ? `Notes: ${form.additional_notes.trim()}` : '',
    ].filter(Boolean);
    const combinedNotes = noteParts.length ? noteParts.join('\n') : null;

    let insertError: { message: string } | null = null;
    const withStartDate = await supabase.from('medication_logs').insert({
      patient_id: profile.id,
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency,
      time_of_day: form.time_of_day,
      start_date: form.start_date || null,
      notes: combinedNotes,
    });

    if (withStartDate.error && withStartDate.error.message.toLowerCase().includes('start_date')) {
      const fallbackInsert = await supabase.from('medication_logs').insert({
        patient_id: profile.id,
        name: form.name.trim(),
        dosage: form.dosage.trim(),
        frequency: form.frequency,
        time_of_day: form.time_of_day,
        notes: combinedNotes,
      });
      insertError = fallbackInsert.error;
    } else {
      insertError = withStartDate.error;
    }

    if (insertError) {
      setError(insertError.message);
    } else {
      setForm(defaultForm);
      await fetchMeds();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setError('');
    const { error: deleteError } = await supabase.from('medication_logs').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    await fetchMeds();
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 pointer-events-none" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 pointer-events-none" />

      <Navbar />

      <main className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">My Medications</h1>
          <p className="text-gray-400 mt-1">Track your medications and share with your doctor.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
              <Pill className="w-5 h-5 text-fitness-primary" />
              Add Medication
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Metformin, Vitamin D"
                  className="bg-gray-900 border-white/10"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 500mg, 1000IU"
                  className="bg-gray-900 border-white/10"
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="frequency">Frequency</Label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={form.frequency}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-white/10 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fitness-primary/50"
                    disabled={submitting}
                  >
                    {FREQUENCY_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="time_of_day" className="flex items-center gap-1.5">
                    <Clock3 className="w-4 h-4 text-gray-400" />
                    Time of Day
                  </Label>
                  <select
                    id="time_of_day"
                    name="time_of_day"
                    value={form.time_of_day}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-white/10 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fitness-primary/50"
                    disabled={submitting}
                  >
                    {TIME_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="bg-gray-900 border-white/10"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="purpose">Purpose/Condition</Label>
                <Input
                  id="purpose"
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  placeholder="e.g. Blood sugar control, Vitamin deficiency"
                  className="bg-gray-900 border-white/10"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="additional_notes">Additional Notes</Label>
                <textarea
                  id="additional_notes"
                  name="additional_notes"
                  value={form.additional_notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-gray-900 border border-white/10 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fitness-primary/50 resize-none"
                  disabled={submitting}
                />
              </div>

              <Button type="submit" className="w-full bg-fitness-primary hover:bg-fitness-primary/90" disabled={submitting || loading}>
                {submitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</>
                ) : (
                  <><Plus className="w-4 h-4 mr-2" />Add Medication</>
                )}
              </Button>
            </form>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Current Medications</h2>
              <span className="rounded-full bg-fitness-primary/20 px-3 py-1 text-xs text-fitness-primary font-semibold">
                {meds.length}
              </span>
            </div>

            {meds.length > 0 && (
              <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 text-fitness-primary" />
                <p>Your doctor can view your medications when they review your profile.</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
              </div>
            ) : meds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 border border-white/10 rounded-2xl">
                <Pill className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-white font-semibold mb-1">No medications logged</p>
                <p className="text-gray-400 text-sm">Add your medications above to share them with your doctor</p>
              </div>
            ) : (
              <div>
                {meds.map((medication) => (
                  <div key={medication.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Pill className="w-5 h-5 text-fitness-primary" />
                        <h3 className="text-lg font-bold">{medication.name}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(medication.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete medication"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">💊 Dosage:</span> <span className="text-gray-200">{medication.dosage}</span></div>
                      <div><span className="text-gray-500">🔄 Frequency:</span> <span className="text-gray-200">{medication.frequency}</span></div>
                      <div><span className="text-gray-500">⏰ Time:</span> <span className="text-gray-200">{medication.time_of_day}</span></div>
                      <div><span className="text-gray-500">📅 Added:</span> <span className="text-gray-200">{formatDate(medication.start_date || medication.created_at)}</span></div>
                    </div>

                    {medication.notes && (
                      <p className="text-sm text-gray-400 italic mt-3 border-l-2 border-white/10 pl-3">"{medication.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
