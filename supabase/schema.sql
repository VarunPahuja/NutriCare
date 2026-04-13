-- profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('patient', 'doctor')) not null,
  full_name text not null,
  email text not null,
  specialty text,
  bio text,
  created_at timestamp with time zone default now()
);

-- workout_logs
create table workout_logs (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references profiles(id) on delete cascade not null,
  type text not null,
  duration_minutes integer not null,
  intensity text check (intensity in ('low', 'medium', 'high')) not null,
  notes text,
  date date not null,
  created_at timestamp with time zone default now()
);

-- prediction_history
create table prediction_history (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references profiles(id) on delete cascade not null,
  inputs jsonb not null,
  result jsonb not null,
  created_at timestamp with time zone default now()
);

-- doctor_patient
create table doctor_patient (
  id uuid default gen_random_uuid() primary key,
  doctor_id uuid references profiles(id) on delete cascade not null,
  patient_id uuid references profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default now(),
  unique(doctor_id, patient_id)
);

-- doctor_notes
create table doctor_notes (
  id uuid default gen_random_uuid() primary key,
  doctor_id uuid references profiles(id) on delete cascade not null,
  patient_id uuid references profiles(id) on delete cascade not null,
  note text not null,
  created_at timestamp with time zone default now()
);

-- RLS policies
alter table profiles enable row level security;
alter table workout_logs enable row level security;
alter table prediction_history enable row level security;
alter table doctor_patient enable row level security;
alter table doctor_notes enable row level security;

-- profiles: users can read their own, doctors can read their patients' profiles
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Doctors can read patient profiles" on profiles for select using (
  exists (
    select 1 from doctor_patient
    where doctor_id = auth.uid() and patient_id = profiles.id and status = 'accepted'
  )
);

-- workout_logs: patients own their logs, doctors can read accepted patients' logs
create policy "Patients can manage own workout logs" on workout_logs for all using (auth.uid() = patient_id);
create policy "Doctors can read patient workout logs" on workout_logs for select using (
  exists (
    select 1 from doctor_patient
    where doctor_id = auth.uid() and patient_id = workout_logs.patient_id and status = 'accepted'
  )
);

-- prediction_history: same pattern
create policy "Patients can manage own predictions" on prediction_history for all using (auth.uid() = patient_id);
create policy "Doctors can read patient predictions" on prediction_history for select using (
  exists (
    select 1 from doctor_patient
    where doctor_id = auth.uid() and patient_id = prediction_history.patient_id and status = 'accepted'
  )
);

-- doctor_patient: doctors and patients can read their own relationships
create policy "Doctors can manage their patient requests" on doctor_patient for all using (auth.uid() = doctor_id);
create policy "Patients can read and create requests" on doctor_patient for select using (auth.uid() = patient_id);
create policy "Patients can create requests" on doctor_patient for insert with check (auth.uid() = patient_id);

-- doctor_notes: doctors write, patients can read notes about themselves
create policy "Doctors can manage their notes" on doctor_notes for all using (auth.uid() = doctor_id);
create policy "Patients can read their notes" on doctor_notes for select using (auth.uid() = patient_id);

-- workout_feedback: doctors comment on workout logs, patients can read feedback on their workouts
create table if not exists workout_feedback (
  id uuid default gen_random_uuid() primary key,
  workout_id uuid references workout_logs(id) on delete cascade not null,
  doctor_id uuid references profiles(id) on delete cascade not null,
  patient_id uuid references profiles(id) on delete cascade not null,
  comment text not null,
  created_at timestamp with time zone default now()
);
alter table workout_feedback enable row level security;
create policy "Doctors can manage their feedback" on workout_feedback
  for all using (auth.uid() = doctor_id) with check (auth.uid() = doctor_id);
create policy "Patients can read their workout feedback" on workout_feedback
  for select using (auth.uid() = patient_id);

-- medication_logs: support prescribed medications from doctors
alter table medication_logs
  add column if not exists prescribed_by uuid references profiles(id),
  add column if not exists prescribed_by_name text,
  add column if not exists is_prescribed boolean default false;

alter table medication_logs enable row level security;
create policy "Patients can manage their own medication logs" on medication_logs
  for all using (auth.uid() = patient_id and coalesce(is_prescribed, false) = false)
  with check (auth.uid() = patient_id and coalesce(is_prescribed, false) = false);
create policy "Doctors can prescribe medications to their patients" on medication_logs
  for insert with check (
    auth.uid() = prescribed_by
    and coalesce(is_prescribed, false) = true
    and exists (
      select 1 from doctor_patient
      where doctor_id = auth.uid()
        and patient_id = medication_logs.patient_id
        and status = 'accepted'
    )
  );
create policy "Doctors can read patient medications" on medication_logs
  for select using (
    exists (
      select 1 from doctor_patient
      where doctor_id = auth.uid()
        and patient_id = medication_logs.patient_id
        and status = 'accepted'
    )
  );

-- async messages between doctors and patients
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);
alter table messages enable row level security;
create policy "Users can send messages" on messages
  for insert with check (auth.uid() = sender_id);
create policy "Users can read their messages" on messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can update message read state" on messages
  for update using (auth.uid() = sender_id or auth.uid() = receiver_id)
  with check (auth.uid() = sender_id or auth.uid() = receiver_id);
