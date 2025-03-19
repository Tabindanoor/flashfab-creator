
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Create from "./pages/Create";
import StudySets from "./pages/StudySets";
import StudyFlashcards from "./pages/StudyFlashcards";
import StudyQuiz from "./pages/StudyQuiz";
import StudyMatch from "./pages/StudyMatch";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create" element={<Create />} />
          <Route path="/study-sets" element={<StudySets />} />
          <Route path="/study/:id/flashcards" element={<StudyFlashcards />} />
          <Route path="/study/:id/quiz" element={<StudyQuiz />} />
          <Route path="/study/:id/match" element={<StudyMatch />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
