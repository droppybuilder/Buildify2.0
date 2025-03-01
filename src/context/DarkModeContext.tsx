
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  // Try to get the user's preference from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });

  // Apply dark mode class when the component mounts or when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
    
    // Save the preference to localStorage
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
