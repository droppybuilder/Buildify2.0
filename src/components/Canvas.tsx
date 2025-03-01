
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/context/DarkModeContext";

interface CanvasProps {
  components: any[];
  setComponents: (newComponents: any[]) => void;
  selectedComponent: any;
  setSelectedComponent: (component: any) => void;
  onDeleteComponent: (component: any) => void;
}

const Canvas = ({ 
  components, 
  setComponents,
  selectedComponent,
  setSelectedComponent,
  onDeleteComponent
}: CanvasProps) => {
  const { isDarkMode } = useDarkMode();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(null);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Create a new component
      const newComponent = {
        id: Date.now().toString(),
        type: componentType,
        position: { x, y },
        size: { width: 150, height: 40 },
        props: { text: componentType === 'button' ? 'Button' : componentType === 'label' ? 'Label' : '' }
      };
      
      setComponents([...components, newComponent]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedComponentId(id);
    setInitialPosition({ x: e.clientX, y: e.clientY });
    setSelectedComponent(components.find(c => c.id === id) || null);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    setDraggedComponentId(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedComponentId || !canvasRef.current) {
      return;
    }

    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Calculate the delta from the initial position
    const deltaX = e.clientX - initialPosition.x;
    const deltaY = e.clientY - initialPosition.y;

    // Find the component being dragged
    const component = components.find(c => c.id === draggedComponentId);
    if (!component) return;

    // Calculate the new position
    const newX = component.position.x + deltaX;
    const newY = component.position.y + deltaY;

    // Update the component's position
    const updatedComponents = components.map(c => 
      c.id === draggedComponentId 
        ? { ...c, position: { x: newX, y: newY } } 
        : c
    );
    
    setComponents(updatedComponents);

    // Update the initial position for the next move
    setInitialPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDraggedComponentId(null);
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponent(null);
  };

  return (
    <div
      ref={canvasRef}
      className={`flex-1 relative border rounded-md cursor-pointer ${
        isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ minHeight: '400px' }}
    >
      {components.map(component => (
        <div
          key={component.id}
          style={{
            position: 'absolute',
            left: component.position.x,
            top: component.position.y,
            width: component.size.width,
            height: component.size.height,
            border: selectedComponent?.id === component.id ? '2px solid blue' : '1px solid transparent',
            boxSizing: 'border-box',
            pointerEvents: 'auto',
          }}
          onMouseDown={(e) => handleMouseDown(e, component.id)}
        >
          {component.type === 'button' && (
            <Button className={isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : ''}>
              {component.props.text || 'Button'}
            </Button>
          )}
          {component.type === 'label' && (
            <div className={`${isDarkMode ? 'text-white' : 'text-black'}`} style={{ width: '100%', height: '100%', overflow: 'hidden', wordWrap: 'break-word' }}>
              {component.props.text || 'Label'}
            </div>
          )}
          {component.type === 'entry' && (
            <input 
              type="text" 
              className={`border px-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}`}
              style={{ width: '100%', height: '100%' }} 
            />
          )}
          {component.type === 'image' && component.props.src && (
            <img src={component.props.src} alt="Component" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Canvas;
