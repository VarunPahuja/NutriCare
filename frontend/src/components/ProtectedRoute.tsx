import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { Role } from '@/types/database';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired?: Role;
}

const ProtectedRoute = ({ children, roleRequired }: ProtectedRouteProps) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-fitness-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-fitness-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/signin" replace />;
  }

  if (roleRequired && profile.role !== roleRequired) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
