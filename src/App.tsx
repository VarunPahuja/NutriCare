
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import MealPlans from "./pages/MealPlans";
import Progress from "./pages/Progress";
import NutritionTips from "./pages/NutritionTips";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import MyInsights from "./pages/MyInsights";
import TrackWorkout from "./pages/TrackWorkout";
import WellnessCrew from "./pages/WellnessCrew";
import NutritionPredictionPage from "./pages/NutritionPrediction";
import AssistantPage from "./pages/Assistant";
// Auth pages
import ChooseRole from "./pages/auth/ChooseRole";
import PatientSignup from "./pages/auth/PatientSignup";
import DoctorSignup from "./pages/auth/DoctorSignup";
import PatientLogin from "./pages/auth/PatientLogin";
import DoctorLogin from "./pages/auth/DoctorLogin";
// import { useEffect, useState } from "react";
// Supabase removed - no authentication currently
// import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  // Supabase authentication removed
  // const [session, setSession] = useState<any>(null);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Check for existing session
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //     setLoading(false);
  //   });

  //   // Set up auth state listener
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange(
  //     (_event, session) => {
  //       setSession(session);
  //       setLoading(false);
  //     }
  //   );

  //   return () => subscription.unsubscribe();
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/" element={<ChooseRole />} />
            <Route path="/signup/patient" element={<PatientSignup />} />
            <Route path="/signup/doctor" element={<DoctorSignup />} />
            <Route path="/login/patient" element={<PatientLogin />} />
            <Route path="/login/doctor" element={<DoctorLogin />} />
            <Route path="/signin" element={<SignIn />} />
            
            {/* App Routes */}
            <Route path="/dashboard" element={<Index />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/nutrition-tips" element={<NutritionTips />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/my-insights" element={<MyInsights />} />
            <Route path="/track-workout" element={<TrackWorkout />} />
            <Route path="/wellness-crew" element={<WellnessCrew />} />
            <Route path="/prediction" element={<NutritionPredictionPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
