import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface CanvasProps {
  components: any[];
  onAddComponent: (componentType: string, position: { x: number; y: number }) => void;
  onUpdateComponent: (id: string, x: number, y: number, width: number, height: number) => void;
  onDeleteComponent: (id: string) => void;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
}

const Canvas = ({ 
  components, 
  onAddComponent,
  onUpdateComponent,
  onDeleteComponent,
  selectedComponentId,
  onSelectComponent
}: CanvasProps) => {
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
      onAddComponent(componentType, { x, y });
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
    onSelectComponent(id);
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
    onUpdateComponent(draggedComponentId, newX, newY, component.size.width, component.size.height);

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
    onSelectComponent(null);
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-gray-100 border rounded-md cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
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
            border: selectedComponentId === component.id ? '2px solid blue' : '1px solid transparent',
            boxSizing: 'border-box',
            pointerEvents: 'auto',
          }}
          onMouseDown={(e) => handleMouseDown(e, component.id)}
        >
          {component.type === 'button' && (
            <Button>{component.props.text || 'Button'}</Button>
          )}
          {component.type === 'label' && (
            <div style={{ width: '100%', height: '100%', overflow: 'hidden', wordWrap: 'break-word' }}>
              {component.props.text || 'Label'}
            </div>
          )}
          {component.type === 'entry' && (
            <input type="text" style={{ width: '100%', height: '100%' }} />
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
