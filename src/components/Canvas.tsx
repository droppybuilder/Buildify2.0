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
  const [windowTitle, setWindowTitle] = useState("Untitled Window");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
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
        {/* Window Title Bar */}
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

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className="flex-1 canvas-grid relative overflow-auto bg-white/50"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {components.map((component) => (
            <div
              key={component.id}
              className={`absolute component-preview ${
                selectedComponent?.id === component.id ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
              style={{
                left: `${component.position.x}px`,
                top: `${component.position.y}px`,
                width: `${component.size.width}px`,
                height: `${component.size.height}px`,
                transform: 'translate(0, 0)',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setSelectedComponent(component)}
            >
              <ComponentPreview component={component} />
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
          className="w-full h-full px-3 border rounded-lg"
          placeholder={component.props.placeholder}
          style={{
            backgroundColor: component.props.bgColor,
          }}
          readOnly
        />
      );
    case 'checkbox':
      return (
        <label 
          className="flex items-center gap-2"
          style={{ fontFamily: component.props.font }}
        >
          <input 
            type="checkbox" 
            className="rounded border-gray-300" 
            checked={component.props.value}
            readOnly 
          />
          <span>{component.props.text}</span>
        </label>
      );
    case 'slider':
      return (
        <input
          type="range"
          className="w-full h-full accent-primary"
          min={component.props.from}
          max={component.props.to}
          value={component.props.value}
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
            backgroundColor: component.props.background,
            borderStyle: component.props.relief === 'flat' ? 'solid' : component.props.relief,
            borderWidth: `${component.props.borderwidth}px`,
          }}
        />
      );
    default:
      return null;
  }
};
