import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "./App.css";

// Create a context for dark mode with default value
export const ThemeContext = createContext({
  isDarkMode: true,  // Always dark mode
  toggleDarkMode: () => {},
});

const queryClient = new QueryClient();

const App = () => {
  // Set dark mode class on document
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ isDarkMode: true, toggleDarkMode: () => {} }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
