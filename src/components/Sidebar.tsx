
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon, Type, Square, TextCursor, SlidersHorizontal, Frame, CheckSquare, Calendar, LayoutGrid, BarChart3, FileText, ListTodo } from "lucide-react";

export const Sidebar = () => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
  };

  return (
    <div className="w-64 border-r bg-white/95 backdrop-blur-xl flex flex-col shadow-sm">
      <div className="h-14 border-b flex items-center px-4 bg-white/95">
        <span className="font-semibold text-gray-800">Design Widgets</span>
      </div>
      
      <div className="p-4 overflow-auto flex-1">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Basic Elements</Label>
            <div className="grid grid-cols-2 gap-3">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'button')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <Square size={16} />
                <span>Button</span>
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'label')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <Type size={16} />
                <span>Label</span>
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'entry')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <TextCursor size={16} />
                <span>Entry</span>
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'image')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <ImageIcon size={16} />
                <span>Image</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Input Controls</Label>
            <div className="grid grid-cols-2 gap-3">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'slider')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <SlidersHorizontal size={16} />
                <span>Slider</span>
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'checkbox')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <CheckSquare size={16} />
                <span>Checkbox</span>
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'datepicker')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <Calendar size={16} />
                <span>Date Picker</span>
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'progressbar')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <BarChart3 size={16} />
                <span>Progress Bar</span>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Layout & Containers</Label>
            <div className="grid grid-cols-2 gap-3">
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'frame')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <Frame size={16} />
                <span>Frame</span>
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'notebook')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <FileText size={16} />
                <span>Notebook</span>
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'listbox')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <ListTodo size={16} />
                <span>Listbox</span>
              </div>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'canvas')}
                className="aspect-[4/1] rounded-lg border border-gray-200 bg-white p-2 text-center flex items-center justify-center gap-2 text-sm hover:border-primary hover:bg-gray-50/50 cursor-move transition-colors"
              >
                <LayoutGrid size={16} />
                <span>Grid</span>
              </div>
            </div>
          </div>
          
          <div className="h-6"></div>
        </div>
      </div>
    </div>
  );
};
