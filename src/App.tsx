import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SkillsProvider } from "@/contexts/SkillsContext";
import { SkillProgressProvider } from "@/contexts/SkillProgressContext";
import { ExercisesProvider } from "@/contexts/ExercisesContext";
import { LessonsProvider } from "@/contexts/LessonsContext";
import { UnitsProvider } from "@/contexts/UnitsContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <UserProfileProvider>
        <SkillsProvider>
          <SkillProgressProvider>
            <ExercisesProvider>
            <LessonsProvider>
              <UnitsProvider>
                <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                </TooltipProvider>
              </UnitsProvider>
            </LessonsProvider>
            </ExercisesProvider>
          </SkillProgressProvider>
        </SkillsProvider>
      </UserProfileProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
