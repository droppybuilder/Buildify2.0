import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import Canvas from '@/components/Canvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { CodePreview } from '@/components/CodePreview';
import { Toolbar } from '@/components/Toolbar';
import { Layers } from '@/components/Layers';
import { WindowProperties } from '@/components/WindowProperties';
import { toast } from 'sonner';

const Index = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [components, setComponents] = useState([]);
  const [history, setHistory] = useState<any[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showWindowProperties, setShowWindowProperties] = useState(false);
  
  const [windowTitle, setWindowTitle] = useState("My CustomTkinter Application");
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [windowBgColor, setWindowBgColor] = useState("#f0f0f0");
  
  useEffect(() => {
    try {
      const savedComponents = localStorage.getItem('guiBuilderComponents');
      if (savedComponents) {
        const parsedComponents = JSON.parse(savedComponents);
        setComponents(parsedComponents);
        addToHistory(parsedComponents);
      }
      
      const savedWindowTitle = localStorage.getItem('guiBuilderWindowTitle');
      const savedWindowSize = localStorage.getItem('guiBuilderWindowSize');
      const savedWindowBgColor = localStorage.getItem('guiBuilderWindowBgColor');
      
      if (savedWindowTitle) setWindowTitle(savedWindowTitle);
      if (savedWindowSize) setWindowSize(JSON.parse(savedWindowSize));
      if (savedWindowBgColor) setWindowBgColor(savedWindowBgColor);
    } catch (error) {
      console.error('Failed to load saved components:', error);
    }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem('guiBuilderComponents', JSON.stringify(components));
    } catch (error) {
      console.error('Failed to save components:', error);
    }
  }, [components]);
  
  useEffect(() => {
    try {
      localStorage.setItem('guiBuilderWindowTitle', windowTitle);
      localStorage.setItem('guiBuilderWindowSize', JSON.stringify(windowSize));
      localStorage.setItem('guiBuilderWindowBgColor', windowBgColor);
    } catch (error) {
      console.error('Failed to save window properties:', error);
    }
  }, [windowTitle, windowSize, windowBgColor]);
  
  const addToHistory = useCallback((newComponents: any[]) => {
    if (JSON.stringify(newComponents) !== JSON.stringify(history[historyIndex])) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push([...newComponents]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex]);

  const handleComponentsChange = useCallback((newComponents: any[]) => {
    console.log("Index - Components changed, count:", newComponents.length);
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
    if (selectedComponents.length > 1) {
      const newComponents = components.filter(c => !selectedComponents.includes(c.id));
      handleComponentsChange(newComponents);
      setSelectedComponents([]);
      setSelectedComponent(null);
      toast.info("Multiple components deleted");
    } else if (component) {
      const newComponents = components.filter(c => c.id !== component.id);
      handleComponentsChange(newComponents);
      toast.info("Component deleted");
    }
  }, [components, handleComponentsChange, selectedComponents]);
  
  const toggleCodePreview = useCallback(() => {
    setShowCodePreview(prev => !prev);
    setShowLayers(false);
    setShowWindowProperties(false);
  }, []);
  
  const toggleLayers = useCallback(() => {
    setShowLayers(prev => !prev);
    setShowCodePreview(false);
    setShowWindowProperties(false);
  }, []);
  
  const toggleWindowProperties = useCallback(() => {
    setShowWindowProperties(prev => !prev);
    setShowLayers(false);
    setShowCodePreview(false);
  }, []);
  
  const handleComponentLayerOrderChange = useCallback((fromIndex: number, toIndex: number) => {
    const result = Array.from(components);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    
    handleComponentsChange(result);
  }, [components, handleComponentsChange]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inputFocused) {
        return;
      }
      
      if ((e.key === 'Delete' || e.key === 'Backspace') && 
          !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        
        if (selectedComponents.length > 1) {
          const newComponents = components.filter(c => !selectedComponents.includes(c.id));
          handleComponentsChange(newComponents);
          setSelectedComponents([]);
          setSelectedComponent(null);
          toast.info("Multiple components deleted");
        } else if (selectedComponent) {
          handleDeleteComponent(selectedComponent);
          setSelectedComponent(null);
        }
      }
      
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
    <div className="h-screen flex overflow-hidden bg-white">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Toolbar
          components={components}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onToggleCodePreview={toggleCodePreview}
          onToggleLayers={toggleLayers}
          onToggleWindowProperties={toggleWindowProperties}
          showCodePreview={showCodePreview}
          showLayers={showLayers}
          showWindowProperties={showWindowProperties}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {showCodePreview ? (
            <CodePreview 
              components={components} 
              visible={showCodePreview}
            />
          ) : showLayers ? (
            <Layers 
              components={components}
              onComponentsChange={handleComponentsChange}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              onOrderChange={handleComponentLayerOrderChange}
              visible={showLayers}
            />
          ) : showWindowProperties ? (
            <WindowProperties
              visible={showWindowProperties}
              title={windowTitle}
              setTitle={setWindowTitle}
              size={windowSize}
              setSize={setWindowSize}
              bgColor={windowBgColor}
              setBgColor={setWindowBgColor}
            />
          ) : (
            <div className="flex-1 overflow-auto bg-background p-6">
              <Canvas
                components={components}
                setComponents={handleComponentsChange}
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                onDeleteComponent={handleDeleteComponent}
                selectedComponents={selectedComponents}
                setSelectedComponents={setSelectedComponents}
                windowTitle={windowTitle}
                windowSize={windowSize}
                windowBgColor={windowBgColor}
              />
            </div>
          )}
          
          <div className="w-80 border-l flex flex-col overflow-hidden border-border bg-gray-50">
            <PropertyPanel
              selectedComponent={selectedComponent}
              onUpdate={handleComponentUpdate}
              setInputFocused={setInputFocused}
              inputFocused={inputFocused}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
