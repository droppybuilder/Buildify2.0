import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export const Sidebar = () => {
  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
  };

  return (
    <div className="w-64 border-r bg-gray-50/90 backdrop-blur-xl flex flex-col">
      <div className="h-14 border-b flex items-center px-4 bg-white">
        <span className="font-semibold">Widgets</span>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <Label>Basic</Label>
          <div className="grid grid-cols-2 gap-2">
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'button')}
              className="aspect-[4/1] rounded-lg border bg-white p-2 text-center flex items-center justify-center text-sm hover:border-primary cursor-move"
            >
              Button
            </div>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'label')}
              className="aspect-[4/1] rounded-lg border bg-white p-2 text-center flex items-center justify-center text-sm hover:border-primary cursor-move"
            >
              Label
            </div>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'entry')}
              className="aspect-[4/1] rounded-lg border bg-white p-2 text-center flex items-center justify-center text-sm hover:border-primary cursor-move"
            >
              Entry
            </div>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'image')}
              className="aspect-[4/1] rounded-lg border bg-white p-2 text-center flex items-center justify-center text-sm hover:border-primary cursor-move"
            >
              Image
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <Label>Advanced</Label>
          <div className="grid grid-cols-2 gap-2">
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'checkbox')}
              className="aspect-[4/1] rounded-lg border bg-white p-2 text-center flex items-center justify-center text-sm hover:border-primary cursor-move"
            >
              Checkbox
            </div>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'slider')}
              className="aspect-[4/1] rounded-lg border bg-white p-2 text-center flex items-center justify-center text-sm hover:border-primary cursor-move"
            >
              Slider
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-1">
          <Label>Layout</Label>
          <div className="grid grid-cols-2 gap-2">
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, 'frame')}
              className="aspect-[4/1] rounded-lg border bg-white p-2 text-center flex items-center justify-center text-sm hover:border-primary cursor-move"
            >
              Frame
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
