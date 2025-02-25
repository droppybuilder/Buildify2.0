
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Square, 
  Type, 
  Input, 
  CheckSquare, 
  SlidersHorizontal, 
  Box
} from "lucide-react";

const componentTypes = [
  { id: 'button', icon: Square, label: 'Button' },
  { id: 'label', icon: Type, label: 'Label' },
  { id: 'entry', icon: Input, label: 'Entry' },
  { id: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
  { id: 'slider', icon: SlidersHorizontal, label: 'Slider' },
  { id: 'frame', icon: Box, label: 'Frame' },
];

export const Sidebar = () => {
  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-60 border-r bg-white flex flex-col overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Components</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {componentTypes.map(({ id, icon: Icon, label }) => (
          <div
            key={id}
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            className="sidebar-item draggable-item"
          >
            <Icon size={18} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <Separator />
      
      <div className="p-4">
        <Button variant="outline" className="w-full" size="sm">
          Clear Canvas
        </Button>
      </div>
    </div>
  );
};
