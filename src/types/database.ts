export type Role = 'patient' | 'doctor'
export type RequestStatus = 'pending' | 'accepted' | 'rejected'

export interface Profile {
  id: string
  role: Role
  full_name: string
  email: string
  specialty?: string // doctors only
  bio?: string // doctors only
  created_at: string
}

export interface WorkoutLog {
  id: string
  patient_id: string
  type: string
  duration_minutes: number
  intensity: 'low' | 'medium' | 'high'
  notes?: string
  date: string
  created_at: string
}

export interface PredictionHistory {
  id: string
  patient_id: string
  inputs: Record<string, unknown>
  result: Record<string, unknown>
  created_at: string
}

export interface DoctorPatient {
  id: string
  doctor_id: string
  patient_id: string
  status: RequestStatus
  created_at: string
}

export interface DoctorNote {
  id: string
  doctor_id: string
  patient_id: string
  note: string
  created_at: string
}

export interface MedicationLog {
  id: string
  patient_id: string
  name: string
  dosage: string
  frequency: string
  time_of_day: string
  start_date?: string
  notes?: string
  created_at: string
}

