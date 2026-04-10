import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';

const Dashboard = () => {
  const { profile } = useAuth();

  if (profile?.role === 'doctor') {
    return <DoctorDashboard />;
  }
  return <PatientDashboard />;
};

export default Dashboard;
