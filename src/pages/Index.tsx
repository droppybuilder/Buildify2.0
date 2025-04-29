
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
  
  // Safe setter for selected component that includes validation
  const safeSetSelectedComponent = useCallback((component: any) => {
    // If component is null, just clear the selection
    if (!component) {
      setSelectedComponent(null);
      return;
    }
    
    // Validate the component has an id
    if (!component.id) {
      console.warn("Attempted to select an invalid component without id:", component);
      return;
    }
    
    // Verify the component exists in our components array
    const componentExists = components.some(c => c.id === component.id);
    if (!componentExists) {
      console.warn("Attempted to select a non-existent component:", component.id);
      return;
    }
    
    // Find the component in the array to ensure we have the current version
    const currentComponent = components.find(c => c.id === component.id);
    setSelectedComponent(currentComponent);
  }, [components]);
  
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
    // Check if this is truly a new state to avoid unnecessary history entries
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
      
      // Reset selected component to prevent issues
      setSelectedComponent(null);
      setSelectedComponents([]);
      
      toast.info("Undo successful");
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setComponents([...history[newIndex]]);
      
      // Reset selected component to prevent issues
      setSelectedComponent(null);
      setSelectedComponents([]);
      
      toast.info("Redo successful");
    }
  }, [history, historyIndex]);

  const handleComponentUpdate = useCallback((updatedComponent: any) => {
    try {
      // Enhanced validation before update
      if (!updatedComponent) {
        console.warn("Attempted to update an undefined component");
        return;
      }
      
      if (!updatedComponent.id) {
        console.warn("Attempted to update a component without ID", updatedComponent);
        return;
      }
      
      // Check if component exists in our array
      const componentExists = components.some(c => c.id === updatedComponent.id);
      if (!componentExists) {
        console.warn("Attempted to update a non-existent component:", updatedComponent.id);
        return;
      }
      
      // Create new components array with the updated component
      const newComponents = components.map(c => 
        c.id === updatedComponent.id ? { ...updatedComponent } : c
      );
      
      handleComponentsChange(newComponents);
    } catch (error) {
      console.error("Error updating component:", error);
      toast.error("Failed to update component");
    }
  }, [components, handleComponentsChange]);
  
  const handleComponentSelect = useCallback((component: any) => {
    try {
      // Use our safe setter function
      safeSetSelectedComponent(component);
    } catch (error) {
      console.error("Error selecting component:", error);
      setSelectedComponent(null);
    }
  }, [safeSetSelectedComponent]);
  
  const handleDeleteComponent = useCallback((component: any) => {
    try {
      if (selectedComponents.length > 1) {
        // Validate all components exist before deletion
        const validComponentIds = selectedComponents.filter(id => 
          components.some(c => c.id === id)
        );
        
        if (validComponentIds.length !== selectedComponents.length) {
          console.warn("Some selected components don't exist", 
            selectedComponents.filter(id => !validComponentIds.includes(id))
          );
        }
        
        const newComponents = components.filter(c => !validComponentIds.includes(c.id));
        handleComponentsChange(newComponents);
        setSelectedComponents([]);
        setSelectedComponent(null);
        toast.info("Multiple components deleted");
      } else if (component) {
        // Validate component exists
        if (!components.some(c => c.id === component.id)) {
          console.warn("Attempted to delete a non-existent component:", component.id);
          setSelectedComponent(null);
          return;
        }
        
        const newComponents = components.filter(c => c.id !== component.id);
        handleComponentsChange(newComponents);
        setSelectedComponent(null);
        toast.info("Component deleted");
      }
    } catch (error) {
      console.error("Error deleting component:", error);
      toast.error("Failed to delete component");
      // Reset selections to be safe
      setSelectedComponent(null);
      setSelectedComponents([]);
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
      if (inputFocused || ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        
        if (selectedComponents.length > 1) {
          // Validate all components exist
          const validComponentIds = selectedComponents.filter(id => 
            components.some(c => c.id === id)
          );
          
          const newComponents = components.filter(c => !validComponentIds.includes(c.id));
          handleComponentsChange(newComponents);
          setSelectedComponents([]);
          setSelectedComponent(null);
          toast.info("Multiple components deleted");
        } else if (selectedComponent) {
          // Validate component exists
          if (!components.some(c => c.id === selectedComponent.id)) {
            console.warn("Attempted to delete a non-existent component", selectedComponent);
            setSelectedComponent(null);
            return;
          }
          
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
              setSelectedComponent={handleComponentSelect}
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
                setSelectedComponent={handleComponentSelect}
                onDeleteComponent={handleDeleteComponent}
                selectedComponents={selectedComponents}
                setSelectedComponents={setSelectedComponents}
                windowTitle={windowTitle}
                windowSize={windowSize}
                windowBgColor={windowBgColor}
                setWindowTitle={setWindowTitle}
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
