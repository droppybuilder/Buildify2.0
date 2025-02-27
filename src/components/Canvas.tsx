import { useState, useRef } from 'react';
import { toast } from "sonner";
import { Maximize2, Minimize2, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Component {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  props: Record<string, any>;
}

interface CanvasProps {
  components: Component[];
  setComponents: (components: Component[]) => void;
  selectedComponent: Component | null;
  setSelectedComponent: (component: Component | null) => void;
}

export const Canvas = ({
  components,
  setComponents,
  selectedComponent,
  setSelectedComponent,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [windowTitle, setWindowTitle] = useState("Untitled Window");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedComponent(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, component: Component) => {
    e.stopPropagation();
    
    setSelectedComponent(component);
    
    const target = e.target as HTMLElement;
    if (target.classList.contains('resize-handle')) {
      setIsResizing(true);
      setResizeDirection(target.dataset.direction || null);
    } else {
      setIsDragging(true);
    }

    setDragStart({
      x: e.clientX - component.position.x,
      y: e.clientY - component.position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedComponent) return;

    if (isDragging) {
      const newComponents = components.map(comp => {
        if (comp.id === selectedComponent.id) {
          const newPosition = {
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
          };
          return {
            ...comp,
            position: newPosition
          };
        }
        return comp;
      });
      setComponents(newComponents);
    } else if (isResizing && resizeDirection) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const newComponents = components.map(comp => {
        if (comp.id === selectedComponent.id) {
          const newSize = { ...comp.size };
          const newPosition = { ...comp.position };

          if (resizeDirection.includes('e')) {
            newSize.width = Math.max(50, e.clientX - rect.left - comp.position.x);
          }
          if (resizeDirection.includes('s')) {
            newSize.height = Math.max(50, e.clientY - rect.top - comp.position.y);
          }
          if (resizeDirection.includes('w')) {
            const newWidth = Math.max(50, comp.size.width + (comp.position.x - (e.clientX - rect.left)));
            if (newWidth >= 50) {
              newPosition.x = e.clientX - rect.left;
              newSize.width = newWidth;
            }
          }
          if (resizeDirection.includes('n')) {
            const newHeight = Math.max(50, comp.size.height + (comp.position.y - (e.clientY - rect.top)));
            if (newHeight >= 50) {
              newPosition.y = e.clientY - rect.top;
              newSize.height = newHeight;
            }
          }

          return {
            ...comp,
            size: newSize,
            position: newPosition
          };
        }
        return comp;
      });
      setComponents(newComponents);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const type = e.dataTransfer.getData('componentType');
    const rect = canvasRef.current?.getBoundingClientRect();
    
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x, y },
      size: { width: 120, height: 40 },
      props: getDefaultProps(type),
    };

    setComponents([...components, newComponent]);
    toast.success("Component added to canvas");
  };

  const getDefaultProps = (type: string) => {
    switch (type) {
      case 'button':
        return { text: 'Button', command: '', bgColor: '#ffffff', fgColor: '#000000' };
      case 'label':
        return { text: 'Label', font: 'Default', fontSize: 12, fgColor: '#000000' };
      case 'entry':
        return { placeholder: 'Enter text...', bgColor: '#ffffff', width: 120 };
      case 'checkbox':
        return { text: 'Checkbox', value: false, font: 'Default' };
      case 'slider':
        return { from: 0, to: 100, value: 50, orient: 'horizontal' };
      case 'frame':
        return { background: 'transparent', relief: 'flat', borderwidth: 1 };
      default:
        return {};
    }
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWindowTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="w-full h-full p-8 bg-gray-100 flex items-center justify-center">
      <div 
        className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-200"
        style={{ 
          width: windowSize.width, 
          height: windowSize.height,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="h-10 bg-gray-50/90 border-b border-gray-200 flex items-center px-4 select-none backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 relative group">
              <X size={8} className="absolute inset-0 m-auto text-red-800 opacity-0 group-hover:opacity-100" />
            </button>
            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 relative group">
              <Minimize2 size={8} className="absolute inset-0 m-auto text-yellow-800 opacity-0 group-hover:opacity-100" />
            </button>
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 relative group">
              <Maximize2 size={8} className="absolute inset-0 m-auto text-green-800 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          <div className="flex-1 text-center">
            {isEditingTitle ? (
              <Input
                type="text"
                value={windowTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="w-48 mx-auto h-6 text-sm text-center bg-white/50"
                autoFocus
              />
            ) : (
              <div 
                className="text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-800"
                onClick={handleTitleClick}
              >
                {windowTitle}
              </div>
            )}
          </div>
        </div>

        <div
          ref={canvasRef}
          className="flex-1 canvas-grid relative overflow-auto bg-white/50"
          onDragOver={onDragOver}
          onDrop={onDrop}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        >
          {components.map((component) => (
            <div
              key={component.id}
              className={`absolute component-preview cursor-move ${
                selectedComponent?.id === component.id ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
              style={{
                left: `${component.position.x}px`,
                top: `${component.position.y}px`,
                width: `${component.size.width}px`,
                height: `${component.size.height}px`,
                transform: 'translate(0, 0)',
                transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
              }}
              onMouseDown={(e) => handleMouseDown(e, component)}
            >
              <ComponentPreview component={component} />
              {selectedComponent?.id === component.id && (
                <>
                  <div className="resize-handle absolute w-2 h-2 bg-primary rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize" data-direction="nw" />
                  <div className="resize-handle absolute w-2 h-2 bg-primary rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize" data-direction="ne" />
                  <div className="resize-handle absolute w-2 h-2 bg-primary rounded-full bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize" data-direction="sw" />
                  <div className="resize-handle absolute w-2 h-2 bg-primary rounded-full bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize" data-direction="se" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ComponentPreview = ({ component }: { component: Component }) => {
  switch (component.type) {
    case 'button':
      return (
        <button 
          className="w-full h-full border rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          style={{
            backgroundColor: component.props.bgColor || '#ffffff',
            color: component.props.fgColor || '#000000',
            borderRadius: `${component.props.cornerRadius || 8}px`,
          }}
        >
          {component.props.text || 'Button'}
        </button>
      );
    case 'label':
      return (
        <div 
          className="w-full h-full flex items-center"
          style={{
            color: component.props.fgColor || '#000000',
            fontSize: `${component.props.fontSize || 12}px`,
            fontFamily: component.props.font || 'system-ui',
          }}
        >
          {component.props.text || 'Label'}
        </div>
      );
    case 'entry':
      return (
        <input
          type="text"
          className="w-full h-full px-3 border"
          placeholder={component.props.placeholder || 'Enter text...'}
          style={{
            backgroundColor: component.props.bgColor || '#ffffff',
            borderRadius: `${component.props.cornerRadius || 8}px`,
          }}
          readOnly
        />
      );
    case 'checkbox':
      return (
        <label 
          className="flex items-center gap-2"
          style={{ 
            fontFamily: component.props.font || 'system-ui',
            color: component.props.fgColor || '#000000',
          }}
        >
          <input 
            type="checkbox" 
            className="rounded border-gray-300" 
            checked={component.props.value || false}
            readOnly 
          />
          <span>{component.props.text || 'Checkbox'}</span>
        </label>
      );
    case 'slider':
      return (
        <input
          type="range"
          className="w-full h-full accent-primary"
          min={component.props.from || 0}
          max={component.props.to || 100}
          value={component.props.value || 50}
          style={{
            transform: component.props.orient === 'vertical' ? 'rotate(90deg)' : 'none'
          }}
          readOnly
        />
      );
    case 'frame':
      return (
        <div 
          className="w-full h-full rounded-lg" 
          style={{
            backgroundColor: component.props.background || 'transparent',
            borderStyle: component.props.relief === 'flat' ? 'solid' : component.props.relief,
            borderWidth: `${component.props.borderwidth || 1}px`,
            borderRadius: `${component.props.cornerRadius || 8}px`,
          }}
        />
      );
    default:
      return null;
  }
};
