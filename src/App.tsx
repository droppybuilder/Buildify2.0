
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "./App.css";

// Create a context for dark mode
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

const queryClient = new QueryClient();

const App = () => {
  // Check if the user has a preferred color scheme
  const prefersDarkMode = window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Check if there's a saved theme preference in localStorage
  const savedTheme = localStorage.getItem('theme');
  
  // Set the initial dark mode state
  const [isDarkMode, setIsDarkMode] = useState(
    savedTheme ? savedTheme === 'dark' : prefersDarkMode
  );

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Update the document class and localStorage when dark mode changes
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Set initial class on first load
  useEffect(() => {
    document.documentElement.classList.add(isDarkMode ? 'dark' : 'light');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
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
