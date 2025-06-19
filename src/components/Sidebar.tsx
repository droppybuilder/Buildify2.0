
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Image as ImageIcon, 
  Type, 
  Square, 
  TextCursor, 
  SlidersHorizontal, 
  Frame, 
  CheckSquare, 
  Calendar, 
  LayoutGrid, 
  Gauge, 
  Layout, 
  List,
  Text,
  Component,
  Layers3
} from "lucide-react";

export const Sidebar = () => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
  };

  const basicElements = [
    { type: 'button', icon: Square, label: 'Button', description: 'Interactive button element' },
    { type: 'label', icon: Type, label: 'Label', description: 'Text display label' },
    { type: 'entry', icon: TextCursor, label: 'Entry', description: 'Text input field' },
    { type: 'image', icon: ImageIcon, label: 'Image', description: 'Image display' },
    { type: 'paragraph', icon: Text, label: 'Paragraph', description: 'Multi-line text' }
  ];

  const inputControls = [
    { type: 'slider', icon: SlidersHorizontal, label: 'Slider', description: 'Range input slider' },
    { type: 'checkbox', icon: CheckSquare, label: 'Checkbox', description: 'Boolean checkbox' },
    { type: 'datepicker', icon: Calendar, label: 'DatePicker', description: 'Date selection' },
    { type: 'progressbar', icon: Gauge, label: 'ProgressBar', description: 'Progress indicator' }
  ];

  const layoutElements = [
    { type: 'frame', icon: Frame, label: 'Frame', description: 'Container frame' },
    { type: 'notebook', icon: Layout, label: 'Notebook', description: 'Tabbed container' },
    { type: 'listbox', icon: List, label: 'Listbox', description: 'Selectable list' },
    { type: 'canvas', icon: LayoutGrid, label: 'Canvas', description: 'Drawing canvas' }
  ];
  const ComponentCard = ({ item }: { item: any }) => (    <div
      draggable
      onDragStart={(e) => handleDragStart(e, item.type)}
      className="group relative bg-white rounded-lg border border-slate-200/60 p-2.5 cursor-move transition-all duration-200 hover:border-purple-300 hover:shadow-md hover:shadow-purple-50 hover:-translate-y-0.5"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="p-2 rounded-md bg-gradient-to-br from-purple-50 to-pink-50 group-hover:from-purple-100 group-hover:to-pink-100 transition-colors">
          <item.icon size={16} className="text-purple-600" />
        </div>
        <div className="text-center">
          <div className="font-medium text-slate-700 text-xs">{item.label}</div>
        </div>
      </div>
      <div className="absolute inset-0 rounded-lg ring-2 ring-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
    </div>
  );
  return (
    <div className="w-64 bg-white border-r border-slate-200/50 flex flex-col shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <Component className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 text-sm">Components</h2>
            <p className="text-xs text-slate-500">Drag to canvas</p>
          </div>
        </div>
      </div>
        {/* Content */}
      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="space-y-5">
          {/* Basic Elements */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Layers3 size={14} className="text-slate-600" />
              <Label className="text-xs font-semibold text-slate-700">Basic</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {basicElements.map((item) => (
                <ComponentCard key={item.type} item={item} />
              ))}
            </div>
          </div>

          <Separator className="bg-slate-200/60" />

          {/* Input Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-slate-600" />
              <Label className="text-xs font-semibold text-slate-700">Controls</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {inputControls.map((item) => (
                <ComponentCard key={item.type} item={item} />
              ))}
            </div>
          </div>

          <Separator className="bg-slate-200/60" />

          {/* Layout */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Layout size={14} className="text-slate-600" />
              <Label className="text-xs font-semibold text-slate-700">Layout</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {layoutElements.map((item) => (
                <ComponentCard key={item.type} item={item} />
              ))}
            </div>
          </div>          
        </div>
      </div>
    </div>
  );
};
