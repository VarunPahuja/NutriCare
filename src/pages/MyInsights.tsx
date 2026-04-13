import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { WorkoutLog } from '@/types/database';
import { Dumbbell, Clock, TrendingUp, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';

// Group workout logs by ISO week
function groupByWeek(logs: WorkoutLog[]) {
  const map: Record<string, number> = {};
  logs.forEach(log => {
    const d = new Date(log.date);
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - d.getDay());
    const key = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([week, count]) => ({ week, count }))
    .slice(-8); // last 8 weeks
}

function mostCommonType(logs: WorkoutLog[]) {
  if (!logs.length) return '—';
  const freq: Record<string, number> = {};
  logs.forEach(l => { freq[l.type] = (freq[l.type] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

const MyInsights = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('patient_id', profile.id)
        .order('date', { ascending: false });
      setLogs(data || []);
      setLoading(false);
    })();
  }, [profile]);

  const totalDuration = logs.reduce((sum, l) => sum + l.duration_minutes, 0);
  const weeklyData = groupByWeek(logs);
  const commonType = mostCommonType(logs);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="min-h-screen w-full bg-fitness-background text-white relative overflow-x-hidden">
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[500px] h-[500px] -top-64 -left-64 bg-fitness-primary/10 pointer-events-none" />
      <div className="absolute rounded-full mix-blend-overlay blur-3xl w-[600px] h-[600px] top-1/3 -right-96 bg-fitness-accent/10 pointer-events-none" />

      <Navbar />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">My Insights</h1>
          <p className="text-gray-400 mt-1">Your workout analytics and history.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-fitness-primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Dumbbell size={48} className="text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No workouts logged yet</h2>
            <p className="text-gray-400 text-sm mb-6">Start tracking your workouts to see insights here.</p>
            <button
              onClick={() => navigate('/track-workout')}
              className="px-6 py-2 rounded-lg bg-fitness-primary text-white hover:bg-fitness-primary/90 transition"
            >
              Log a Workout
            </button>
          </div>
        ) : (
          /* ── Dashboard ── */
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Dumbbell,
                  label: 'Total Workouts',
                  value: String(logs.length),
                  color: 'text-fitness-primary',
                  bg: 'bg-fitness-primary/10',
                },
                {
                  icon: Clock,
                  label: 'Total Duration',
                  value: `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`,
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/10',
                },
                {
                  icon: TrendingUp,
                  label: 'Top Workout Type',
                  value: commonType,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10',
                },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                    <p className="text-xl font-bold text-white capitalize">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <Card className="bg-white/5 border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-300">Workouts Per Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="week" stroke="#8E9196" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#8E9196" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: '#1D1E26', border: '1px solid #2E303E', borderRadius: 8 }}
                        labelStyle={{ color: 'white' }}
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                      />
                      <Bar dataKey="count" name="Workouts" fill="var(--fitness-primary, #FF6B00)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent workouts table */}
            <Card className="bg-white/5 border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-gray-300">Recent Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Type</TableHead>
                        <TableHead className="text-gray-400">Duration</TableHead>
                        <TableHead className="text-gray-400">Intensity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.slice(0, 10).map(log => (
                        <TableRow key={log.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="text-gray-300">{formatDate(log.date)}</TableCell>
                          <TableCell className="capitalize text-gray-300">{log.type}</TableCell>
                          <TableCell className="text-gray-300">{log.duration_minutes} min</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              log.intensity === 'high' ? 'bg-red-500/20 text-red-400' :
                              log.intensity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {log.intensity}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyInsights;
