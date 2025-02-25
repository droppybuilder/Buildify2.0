
import { useState, useRef } from 'react';
import { useUndo } from 'react-use';
import { toast } from "sonner";

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
        return { text: 'Button', command: '' };
      case 'label':
        return { text: 'Label', font: 'Default' };
      case 'entry':
        return { placeholder: 'Enter text...' };
      case 'checkbox':
        return { text: 'Checkbox', value: false };
      case 'slider':
        return { from: 0, to: 100, value: 50 };
      case 'frame':
        return { background: 'transparent' };
      default:
        return {};
    }
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full canvas-grid relative"
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
  );
};

const ComponentPreview = ({ component }: { component: Component }) => {
  switch (component.type) {
    case 'button':
      return (
        <button className="w-full h-full bg-white border rounded-lg shadow-sm hover:bg-gray-50">
          {component.props.text}
        </button>
      );
    case 'label':
      return <div className="w-full h-full flex items-center">{component.props.text}</div>;
    case 'entry':
      return (
        <input
          type="text"
          className="w-full h-full px-3 border rounded-lg"
          placeholder={component.props.placeholder}
          readOnly
        />
      );
    case 'checkbox':
      return (
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
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
          readOnly
        />
      );
    case 'frame':
      return (
        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg" />
      );
    default:
      return null;
  }
};
