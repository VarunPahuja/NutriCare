
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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={
              session ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />
            } />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/meal-plans" element={<MealPlans />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/nutrition-tips" element={<NutritionTips />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/my-insights" element={<MyInsights />} />
            <Route path="/track-workout" element={<TrackWorkout />} />
            <Route path="/wellness-crew" element={<WellnessCrew />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
