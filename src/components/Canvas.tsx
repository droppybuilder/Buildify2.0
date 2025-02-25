import { useState, useRef } from 'react';
import { toast } from "sonner";
import { Maximize2, Minimize2, X } from "lucide-react";

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

  return (
    <div className="w-full h-full p-8 bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
           style={{ width: windowSize.width, height: windowSize.height }}>
        {/* Window Title Bar */}
        <div className="h-8 bg-gray-100 border-b flex items-center px-3 select-none">
          <div className="flex items-center gap-2">
            <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600">
              <X size={8} className="m-auto text-red-800 opacity-0 hover:opacity-100" />
            </button>
            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600">
              <Minimize2 size={8} className="m-auto text-yellow-800 opacity-0 hover:opacity-100" />
            </button>
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600">
              <Maximize2 size={8} className="m-auto text-green-800 opacity-0 hover:opacity-100" />
            </button>
          </div>
          <div className="flex-1 text-center text-sm font-medium text-gray-600">
            {windowTitle}
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className="flex-1 canvas-grid relative overflow-auto"
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
                left: component.position.x,
                top: component.position.y,
                width: component.size.width,
                height: component.size.height,
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
            backgroundColor: component.props.bgColor,
            color: component.props.fgColor,
          }}
        >
          {component.props.text}
        </button>
      );
    case 'label':
      return (
        <div 
          className="w-full h-full flex items-center"
          style={{
            color: component.props.fgColor,
            fontSize: `${component.props.fontSize}px`,
            fontFamily: component.props.font,
          }}
        >
          {component.props.text}
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
            className="rounded" 
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
          className="w-full h-full"
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
          className="w-full h-full border-2 rounded-lg" 
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
