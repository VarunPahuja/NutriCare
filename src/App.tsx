
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MealPlans from "./pages/MealPlans";
import Progress from "./pages/Progress";
import NutritionTips from "./pages/NutritionTips";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import MyInsights from "./pages/MyInsights";
import TrackWorkout from "./pages/TrackWorkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Index />} />
          <Route path="/meal-plans" element={<MealPlans />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/nutrition-tips" element={<NutritionTips />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/my-insights" element={<MyInsights />} />
          <Route path="/track-workout" element={<TrackWorkout />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
