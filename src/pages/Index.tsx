
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
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newComponents);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleComponentsChange = (newComponents: any[]) => {
    setComponents(newComponents);
    addToHistory(newComponents);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents(history[historyIndex + 1]);
    }
  };
  
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
              onUpdate={(updatedComponent) => {
                const newComponents = components.map(c => 
                  c.id === updatedComponent.id ? updatedComponent : c
                );
                handleComponentsChange(newComponents);
              }}
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
