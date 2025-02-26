
import { useState, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Canvas } from '@/components/Canvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { CodePreview } from '@/components/CodePreview';
import { Toolbar } from '@/components/Toolbar';

const Index = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [components, setComponents] = useState([]);
  const [isTkinter, setIsTkinter] = useState(true);
  const [history, setHistory] = useState<any[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
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
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
    }
  }, [history, historyIndex]);

  const handleComponentUpdate = useCallback((updatedComponent: any) => {
    const newComponents = components.map(c => 
      c.id === updatedComponent.id ? { ...updatedComponent } : c
    );
    handleComponentsChange(newComponents);
  }, [components, handleComponentsChange]);
  
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
            />
          </div>
          
          <div className="w-80 border-l flex flex-col overflow-hidden">
            <PropertyPanel
              selectedComponent={selectedComponent}
              onUpdate={handleComponentUpdate}
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
