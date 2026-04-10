import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";

// Auth pages
import ChooseRole from "./pages/auth/ChooseRole";
import PatientSignup from "./pages/auth/PatientSignup";
import DoctorSignup from "./pages/auth/DoctorSignup";
import PatientLogin from "./pages/auth/PatientLogin";
import DoctorLogin from "./pages/auth/DoctorLogin";

// Protected pages
import Dashboard from "./pages/dashboard/index";
import Progress from "./pages/Progress";
import NutritionTips from "./pages/NutritionTips";
import Settings from "./pages/Settings";
import MyInsights from "./pages/MyInsights";
import TrackWorkout from "./pages/TrackWorkout";
import NutritionPredictionPage from "./pages/NutritionPrediction";
import AssistantPage from "./pages/Assistant";

// Onboarding
import ChooseDoctor from "./pages/onboarding/ChooseDoctor";

// Doctor pages
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorPatientDetail from "./pages/doctor/DoctorPatientDetail";

// Route protection
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signin/patient" element={<PatientLogin />} />
            <Route path="/signin/doctor" element={<DoctorLogin />} />
            <Route path="/signup" element={<ChooseRole />} />
            <Route path="/signup/patient" element={<PatientSignup />} />
            <Route path="/signup/doctor" element={<DoctorSignup />} />
            <Route path="/login/patient" element={<PatientLogin />} />
            <Route path="/login/doctor" element={<DoctorLogin />} />

            {/* Protected: onboarding (patient only) */}
            <Route
              path="/onboarding/choose-doctor"
              element={
                <ProtectedRoute roleRequired="patient">
                  <ChooseDoctor />
                </ProtectedRoute>
              }
            />

            {/* Protected: dashboard (both roles — role-aware) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected: patient-only routes */}
            <Route
              path="/prediction"
              element={
                <ProtectedRoute roleRequired="patient">
                  <NutritionPredictionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assistant"
              element={
                <ProtectedRoute roleRequired="patient">
                  <AssistantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/track-workout"
              element={
                <ProtectedRoute roleRequired="patient">
                  <TrackWorkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-insights"
              element={
                <ProtectedRoute roleRequired="patient">
                  <MyInsights />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute roleRequired="patient">
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition-tips"
              element={
                <ProtectedRoute roleRequired="patient">
                  <NutritionTips />
                </ProtectedRoute>
              }
            />

            {/* Protected: both roles */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Protected: doctor-only routes */}
            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute roleRequired="doctor">
                  <DoctorPatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patient/:id"
              element={
                <ProtectedRoute roleRequired="doctor">
                  <DoctorPatientDetail />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
