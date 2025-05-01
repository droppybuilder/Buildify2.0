
import { useState } from 'react';
import { 
  SquareTerminal, 
  Plus, 
  Layers, 
  SquareStack, 
  MousePointer, 
  LayoutGrid, 
  FileCode, 
  Cpu,
  Square,
  CheckSquare,
  BarChart3,
  Book,
  List,
  Text,
  Image,
  PenLine,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CustomTkinterGuide from '@/components/CustomTkinterGuide';

export function Sidebar() {
  const [showHelp, setShowHelp] = useState(false);

  const handleComponentDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="pb-12 w-16 flex flex-col items-center justify-between border-r border-border">
      <div className="space-y-4 py-4 flex flex-col items-center w-full">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight sr-only">
            Components
          </h2>
          <div className="space-y-1">
            <TooltipProvider>
              <div className="flex flex-col items-center gap-3">
                {/* Typography Components */}
                <div className="space-y-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'label')}
                      >
                        <Text size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Label</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'paragraph')}
                      >
                        <PenLine size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Paragraph</TooltipContent>
                  </Tooltip>
                </div>

                <Separator className="w-10" />
                
                {/* Interactive Components */}
                <div className="space-y-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'button')}
                      >
                        <Square size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Button</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'entry')}
                      >
                        <SquareTerminal size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Entry (Textbox)</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'checkbox')}
                      >
                        <CheckSquare size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Checkbox</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'slider')}
                      >
                        <BarChart3 size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Slider</TooltipContent>
                  </Tooltip>
                </div>

                <Separator className="w-10" />

                {/* Container Components */}
                <div className="space-y-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'frame')}
                      >
                        <LayoutGrid size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Frame</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'notebook')}
                      >
                        <Book size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Notebook (Tabs)</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'listbox')}
                      >
                        <List size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Listbox</TooltipContent>
                  </Tooltip>
                </div>

                <Separator className="w-10" />

                {/* Media Components */}
                <div className="space-y-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'image')}
                      >
                        <Image size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Image</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'canvas')}
                      >
                        <MousePointer size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Canvas</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'progressbar')}
                      >
                        <SquareStack size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">Progressbar</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-grab"
                        draggable
                        onDragStart={(e) => handleComponentDragStart(e, 'datepicker')}
                      >
                        <Cpu size={16} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">DatePicker</TooltipContent>
                  </Tooltip>
                </div>
                
                <Separator className="w-10" />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => setShowHelp(true)}
                      className="h-10 w-10 flex items-center justify-center rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                      <FileCode size={16} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">CustomTkinter Guide</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
        
      </div>

      {showHelp && (
        <CustomTkinterGuide onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}
