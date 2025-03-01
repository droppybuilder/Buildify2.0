
import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Canvas } from '@/components/Canvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { CodePreview } from '@/components/CodePreview';
import { Toolbar } from '@/components/Toolbar';
import { toast } from 'sonner';

const Index = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [components, setComponents] = useState([]);
  const [isTkinter, setIsTkinter] = useState(true);
  const [history, setHistory] = useState<any[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedComponents = localStorage.getItem('guiBuilderComponents');
      if (savedComponents) {
        const parsedComponents = JSON.parse(savedComponents);
        setComponents(parsedComponents);
        addToHistory(parsedComponents);
      }
    } catch (error) {
      console.error('Failed to load saved components:', error);
    }
  }, []);
  
  // Save to localStorage when components change
  useEffect(() => {
    try {
      localStorage.setItem('guiBuilderComponents', JSON.stringify(components));
    } catch (error) {
      console.error('Failed to save components:', error);
    }
  }, [components]);
  
  const addToHistory = useCallback((newComponents: any[]) => {
    // Only add to history if the components have actually changed
    if (JSON.stringify(newComponents) !== JSON.stringify(history[historyIndex])) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...newComponents]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex]);

  const handleComponentsChange = useCallback((newComponents: any[]) => {
    setComponents([...newComponents]);
    addToHistory([...newComponents]);
  }, [addToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      toast.info("Undo successful");
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      toast.info("Redo successful");
    }
  }, [history, historyIndex]);

  const handleComponentUpdate = useCallback((updatedComponent: any) => {
    const newComponents = components.map(c => 
      c.id === updatedComponent.id ? { ...updatedComponent } : c
    );
    handleComponentsChange(newComponents);
  }, [components, handleComponentsChange]);
  
  const handleDeleteComponent = useCallback((component: any) => {
    // Check if there are multiple selected components
    if (selectedComponents.length > 1) {
      const newComponents = components.filter(c => !selectedComponents.includes(c.id));
      handleComponentsChange(newComponents);
      setSelectedComponents([]);
      setSelectedComponent(null);
      toast.info("Multiple components deleted");
    } else if (component) {
      // Delete single component
      const newComponents = components.filter(c => c.id !== component.id);
      handleComponentsChange(newComponents);
      toast.info("Component deleted");
    }
  }, [components, handleComponentsChange, selectedComponents]);
  
  // Keyboard shortcut to delete selected component
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if an input field is focused
      if (inputFocused) {
        return;
      }
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && 
          // Only process delete if not in an input field
          !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        
        if (selectedComponents.length > 1) {
          // Delete multiple selected components
          const newComponents = components.filter(c => !selectedComponents.includes(c.id));
          handleComponentsChange(newComponents);
          setSelectedComponents([]);
          setSelectedComponent(null);
          toast.info("Multiple components deleted");
        } else if (selectedComponent) {
          // Delete single selected component
          handleDeleteComponent(selectedComponent);
          setSelectedComponent(null);
        }
      }
      
      // Handle Undo/Redo shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (!e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent, selectedComponents, handleDeleteComponent, handleUndo, handleRedo, inputFocused, components, handleComponentsChange]);
  
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Toolbar
          isTkinter={isTkinter}
          setIsTkinter={setIsTkinter}
          components={components}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Canvas
              components={components}
              setComponents={handleComponentsChange}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              onDeleteComponent={handleDeleteComponent}
            />
          </div>
          
          <div className="w-80 border-l flex flex-col overflow-hidden">
            <PropertyPanel
              selectedComponent={selectedComponent}
              onUpdate={handleComponentUpdate}
              setInputFocused={setInputFocused}
              inputFocused={inputFocused}
            />
            <CodePreview
              components={components}
              isTkinter={isTkinter}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
