
import { useState, useRef, useEffect } from 'react';
import { toast } from "sonner";
import { Maximize2, Minimize2, X, Copy, Scissors, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
  onDeleteComponent?: (component: Component) => void;
}

export const Canvas = ({
  components,
  setComponents,
  selectedComponent,
  setSelectedComponent,
  onDeleteComponent,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [windowTitle, setWindowTitle] = useState("Untitled Window");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const [clipboard, setClipboard] = useState<Component | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{x: number, y: number} | null>(null);
  
  // Click and drag to select functionality
  const [selectionBox, setSelectionBox] = useState<{start: {x: number, y: number}, end: {x: number, y: number}} | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  
  // Pre-cache images for smoother drag
  useEffect(() => {
    const imageComponents = components.filter(c => c.type === 'image');
    
    imageComponents.forEach(comp => {
      if (comp.props.src && !imageCache[comp.props.src]) {
        const img = new Image();
        img.src = comp.props.src;
        img.onload = () => {
          setImageCache(prev => ({
            ...prev,
            [comp.props.src]: comp.props.src
          }));
        };
      }
    });
  }, [components, imageCache]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedComponent(null);
      setSelectedComponents([]);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only start selection if clicking directly on the canvas
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      setIsSelecting(true);
      setSelectionBox({
        start: { x: e.clientX - rect.left, y: e.clientY - rect.top },
        end: { x: e.clientX - rect.left, y: e.clientY - rect.top }
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isSelecting && selectionBox && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setSelectionBox({
        ...selectionBox,
        end: { x: e.clientX - rect.left, y: e.clientY - rect.top }
      });
    }
    
    // Continue with normal mouse move handling
    handleMouseMove(e);
  };

  const handleCanvasMouseUp = () => {
    if (isSelecting && selectionBox) {
      // Calculate the selection box bounds
      const x1 = Math.min(selectionBox.start.x, selectionBox.end.x);
      const y1 = Math.min(selectionBox.start.y, selectionBox.end.y);
      const x2 = Math.max(selectionBox.start.x, selectionBox.end.x);
      const y2 = Math.max(selectionBox.start.y, selectionBox.end.y);
      
      // Find components that intersect with the selection box
      const selected = components.filter(component => {
        const cx1 = component.position.x;
        const cy1 = component.position.y;
        const cx2 = cx1 + component.size.width;
        const cy2 = cy1 + component.size.height;
        
        // Check for intersection
        return !(cx2 < x1 || cx1 > x2 || cy2 < y1 || cy1 > y2);
      });
      
      // Update selected components
      if (selected.length > 0) {
        setSelectedComponents(selected.map(c => c.id));
        if (selected.length === 1) {
          setSelectedComponent(selected[0]);
        } else if (selected.length > 1) {
          // Clear single selection when multiple components are selected
          setSelectedComponent(null);
        }
      }
    }
    
    setIsSelecting(false);
    setSelectionBox(null);
    handleMouseUp();
  };

  const handleContextMenu = (e: React.MouseEvent, component: Component) => {
    e.preventDefault();
    setSelectedComponent(component);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseDown = (e: React.MouseEvent, component: Component) => {
    e.stopPropagation();
    
    setSelectedComponent(component);
    setSelectedComponents([component.id]);
    
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
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return comp;
          
          // Calculate new position ensuring it stays within canvas
          let newX = e.clientX - dragStart.x;
          let newY = e.clientY - dragStart.y;
          
          // Prevent component from being dragged out of bounds
          newX = Math.max(0, Math.min(newX, rect.width - comp.size.width));
          newY = Math.max(0, Math.min(newY, rect.height - comp.size.height));
          
          return {
            ...comp,
            position: {
              x: newX,
              y: newY
            }
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
      size: getDefaultSize(type),
      props: getDefaultProps(type),
    };

    setComponents([...components, newComponent]);
    toast.success("Component added to canvas");
  };

  const handleCopyComponent = () => {
    if (selectedComponent) {
      setClipboard({...selectedComponent});
      toast.success("Component copied to clipboard");
    }
  };

  const handleCutComponent = () => {
    if (selectedComponent) {
      setClipboard({...selectedComponent});
      handleDeleteComponent();
      toast.success("Component cut to clipboard");
    }
  };

  const handlePasteComponent = (e: React.MouseEvent) => {
    if (clipboard) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Use mouse position if available, otherwise offset from original
      let x, y;
      if (e) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else {
        x = clipboard.position.x + 20;
        y = clipboard.position.y + 20;
      }

      const newComponent: Component = {
        ...clipboard,
        id: `${clipboard.type}-${Date.now()}`,
        position: { x, y }
      };

      setComponents([...components, newComponent]);
      toast.success("Component pasted from clipboard");
    }
  };

  const handleDeleteComponent = () => {
    if (selectedComponents.length > 1) {
      // Delete multiple selected components
      const newComponents = components.filter(comp => !selectedComponents.includes(comp.id));
      setComponents(newComponents);
      setSelectedComponents([]);
      setSelectedComponent(null);
      toast.success("Components deleted");
    } else if (selectedComponent) {
      // Delete single selected component
      const newComponents = components.filter(comp => comp.id !== selectedComponent.id);
      setComponents(newComponents);
      setSelectedComponent(null);
      if (onDeleteComponent) {
        onDeleteComponent(selectedComponent);
      }
      toast.success("Component deleted");
    }
  };

  const getDefaultSize = (type: string) => {
    switch (type) {
      case 'button':
        return { width: 120, height: 40 };
      case 'label':
        return { width: 200, height: 30 };
      case 'entry':
        return { width: 200, height: 40 };
      case 'image':
        return { width: 200, height: 200 };
      case 'slider':
        return { width: 200, height: 30 };
      case 'frame':
        return { width: 300, height: 200 };
      case 'checkbox':
        return { width: 120, height: 30 };
      case 'datepicker':
        return { width: 200, height: 40 };
      case 'progressbar':
        return { width: 200, height: 30 };
      case 'notebook':
        return { width: 400, height: 300 };
      case 'listbox':
        return { width: 200, height: 200 };
      case 'canvas':
        return { width: 300, height: 200 };
      default:
        return { width: 120, height: 40 };
    }
  };

  const getDefaultProps = (type: string) => {
    switch (type) {
      case 'button':
        return { text: 'Button', bgColor: '#ffffff', fgColor: '#000000', hoverColor: '#f0f0f0', cornerRadius: 8, borderColor: '#e2e8f0' };
      case 'label':
        return { text: 'Label', font: 'Default', fontSize: 12, fgColor: '#000000' };
      case 'entry':
        return { placeholder: 'Enter text...', bgColor: '#ffffff', cornerRadius: 8, borderColor: '#e2e8f0' };
      case 'image':
        return { src: '/placeholder.svg', fit: 'contain', cornerRadius: 8, borderColor: '#e2e8f0' };
      case 'slider':
        return { from: 0, to: 100, value: 50, orient: 'horizontal', bgColor: '#e2e8f0', troughColor: '#3b82f6' };
      case 'frame':
        return { relief: 'flat', borderwidth: 1, bgColor: '#ffffff', borderColor: '#e2e8f0', cornerRadius: 4 };
      case 'checkbox':
        return { text: 'Checkbox', checked: false, fgColor: '#000000' };
      case 'datepicker':
        return { format: 'yyyy-mm-dd', bgColor: '#ffffff', fgColor: '#000000', cornerRadius: 8, borderColor: '#e2e8f0' };
      case 'progressbar':
        return { value: 50, maxValue: 100, progressColor: '#3b82f6', bgColor: '#e2e8f0', cornerRadius: 4 };
      case 'notebook':
        return { tabs: 'Tab 1,Tab 2,Tab 3', selectedTab: 'Tab 1', bgColor: '#ffffff', fgColor: '#000000' };
      case 'listbox':
        return { items: 'Item 1,Item 2,Item 3,Item 4,Item 5', bgColor: '#ffffff', fgColor: '#000000', borderColor: '#e2e8f0' };
      case 'canvas':
        return { bgColor: '#ffffff', borderwidth: 1, borderColor: '#e2e8f0', cornerRadius: 4 };
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

  // Handle keyboard shortcuts for delete and copy/paste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedComponent || selectedComponents.length > 0) {
        // Delete component(s)
        if (e.key === 'Delete' || e.key === 'Backspace') {
          handleDeleteComponent();
        }
        
        // Copy component
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
          handleCopyComponent();
          e.preventDefault();
        }
        
        // Cut component
        if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
          handleCutComponent();
          e.preventDefault();
        }
        
        // Paste component
        if ((e.ctrlKey || e.metaKey) && e.key === 'v' && clipboard) {
          handlePasteComponent(null as any);
          e.preventDefault();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent, selectedComponents, clipboard, components]);

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
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onClick={handleCanvasClick}
          onContextMenu={(e) => {
            e.preventDefault();
            if (e.target === canvasRef.current) {
              // Allow pasting on canvas background
              if (clipboard) {
                handlePasteComponent(e);
              }
            }
          }}
        >
          {/* Selection box for click and drag to select */}
          {isSelecting && selectionBox && (
            <div 
              className="absolute border border-primary bg-primary/10 pointer-events-none"
              style={{
                left: Math.min(selectionBox.start.x, selectionBox.end.x),
                top: Math.min(selectionBox.start.y, selectionBox.end.y),
                width: Math.abs(selectionBox.end.x - selectionBox.start.x),
                height: Math.abs(selectionBox.end.y - selectionBox.start.y),
              }}
            />
          )}
          
          {components.map((component) => (
            <ContextMenu key={component.id}>
              <ContextMenuTrigger>
                <div
                  className={`absolute component-preview cursor-move ${
                    selectedComponent?.id === component.id ? 'ring-2 ring-primary ring-offset-2' : 
                    selectedComponents.includes(component.id) ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                  }`}
                  style={{
                    left: `${component.position.x}px`,
                    top: `${component.position.y}px`,
                    width: `${component.size.width}px`,
                    height: `${component.size.height}px`,
                    transform: 'translate(0, 0)',
                    transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
                    willChange: 'transform, left, top, width, height',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, component)}
                  onContextMenu={(e) => handleContextMenu(e, component)}
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
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={handleCopyComponent}>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCutComponent}>
                  <Scissors className="mr-2 h-4 w-4" />
                  <span>Cut</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={handleDeleteComponent}>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
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
          className="w-full h-full border shadow-sm hover:bg-gray-50 transition-colors"
          style={{
            backgroundColor: component.props.bgColor || '#ffffff',
            color: component.props.fgColor || '#000000',
            borderRadius: `${component.props.cornerRadius || 8}px`,
            borderColor: component.props.borderColor || '#e2e8f0'
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
            borderColor: component.props.borderColor || '#e2e8f0'
          }}
          readOnly
        />
      );
    case 'image':
      return (
        <div 
          className="w-full h-full border overflow-hidden"
          style={{
            borderRadius: `${component.props.cornerRadius || 8}px`,
            borderColor: component.props.borderColor || '#e2e8f0'
          }}
        >
          <img 
            src={component.props.src || '/placeholder.svg'}
            alt="Widget"
            className="w-full h-full"
            style={{
              objectFit: component.props.fit || 'contain',
              imageRendering: 'auto'
            }}
            loading="eager"
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
      );
    case 'slider':
      return (
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            borderRadius: `${component.props.cornerRadius || 8}px`,
          }}
        >
          <div 
            className="relative"
            style={{
              width: component.props.orient === 'vertical' ? '8px' : '100%',
              height: component.props.orient === 'vertical' ? '100%' : '8px',
              backgroundColor: component.props.bgColor || '#e2e8f0',
              borderRadius: '4px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                backgroundColor: component.props.troughColor || '#3b82f6',
                borderRadius: '4px',
                ...(component.props.orient === 'vertical' 
                  ? {
                      width: '100%',
                      bottom: 0,
                      height: `${((component.props.value - component.props.from) / (component.props.to - component.props.from)) * 100}%`
                    }
                  : {
                      height: '100%',
                      width: `${((component.props.value - component.props.from) / (component.props.to - component.props.from)) * 100}%`
                    }
                )
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '16px',
                height: '16px',
                backgroundColor: 'white',
                borderRadius: '50%',
                border: '1px solid #d1d5db',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                ...(component.props.orient === 'vertical'
                  ? {
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bottom: `calc(${((component.props.value - component.props.from) / (component.props.to - component.props.from)) * 100}% - 8px)`
                    }
                  : {
                      top: '50%',
                      transform: 'translateY(-50%)',
                      left: `calc(${((component.props.value - component.props.from) / (component.props.to - component.props.from)) * 100}% - 8px)`
                    }
                )
              }}
            />
          </div>
        </div>
      );
    case 'frame':
      return (
        <div 
          className="w-full h-full"
          style={{
            backgroundColor: component.props.bgColor || '#ffffff',
            borderWidth: `${component.props.borderwidth || 1}px`,
            borderColor: component.props.borderColor || '#e2e8f0',
            borderStyle: 
              component.props.relief === 'flat' ? 'solid' :
              component.props.relief === 'groove' ? 'groove' :
              component.props.relief === 'ridge' ? 'ridge' : 'solid',
            borderRadius: `${component.props.cornerRadius || 4}px`,
          }}
        />
      );
    case 'checkbox':
      return (
        <label className="flex items-center gap-2 h-full cursor-default">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-gray-300"
            defaultChecked={component.props.checked}
            readOnly
          />
          <span style={{ color: component.props.fgColor || '#000000' }}>
            {component.props.text || 'Checkbox'}
          </span>
        </label>
      );
    case 'datepicker':
      return (
        <div 
          className="w-full h-full flex items-center border px-3"
          style={{
            backgroundColor: component.props.bgColor || '#ffffff',
            borderRadius: `${component.props.cornerRadius || 8}px`,
            borderColor: component.props.borderColor || '#e2e8f0',
            color: component.props.fgColor || '#000000',
          }}
        >
          <div className="flex justify-between w-full items-center">
            <span>{component.props.format || 'yyyy-mm-dd'}</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
              <path d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </div>
        </div>
      );
    case 'progressbar':
      return (
        <div 
          className="w-full h-full flex items-center"
        >
          <div 
            className="w-full h-3 rounded-full overflow-hidden"
            style={{
              backgroundColor: component.props.bgColor || '#e2e8f0',
              borderRadius: `${component.props.cornerRadius || 4}px`,
            }}
          >
            <div 
              className="h-full"
              style={{
                width: `${(component.props.value / component.props.maxValue) * 100}%`,
                backgroundColor: component.props.progressColor || '#3b82f6',
                transition: 'width 0.3s ease-in-out'
              }}
            />
          </div>
        </div>
      );
    case 'notebook':
      return (
        <div 
          className="w-full h-full flex flex-col border"
          style={{
            backgroundColor: component.props.bgColor || '#ffffff',
            color: component.props.fgColor || '#000000',
            borderColor: '#e2e8f0',
          }}
        >
          <div className="flex border-b">
            {(component.props.tabs || 'Tab 1,Tab 2,Tab 3')
              .split(',')
              .map((tab: string, i: number) => (
                <div
                  key={i}
                  className={`px-4 py-2 cursor-default ${
                    tab.trim() === (component.props.selectedTab || 'Tab 1')
                      ? 'border-b-2 border-primary font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {tab.trim()}
                </div>
              ))}
          </div>
          <div className="flex-1 p-4">
            {/* Tab content placeholder */}
            <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
              Content for {component.props.selectedTab || 'Tab 1'}
            </div>
          </div>
        </div>
      );
    case 'listbox':
      return (
        <div 
          className="w-full h-full border overflow-y-auto"
          style={{
            backgroundColor: component.props.bgColor || '#ffffff',
            color: component.props.fgColor || '#000000',
            borderColor: component.props.borderColor || '#e2e8f0',
          }}
        >
          {(component.props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5')
            .split(',')
            .map((item: string, i: number) => (
              <div
                key={i}
                className={`px-3 py-1 cursor-default ${i === 0 ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
              >
                {item.trim()}
              </div>
            ))}
        </div>
      );
    case 'canvas':
      return (
        <div 
          className="w-full h-full"
          style={{
            backgroundColor: component.props.bgColor || '#ffffff',
            borderWidth: `${component.props.borderwidth || 1}px`,
            borderColor: component.props.borderColor || '#e2e8f0',
            borderStyle: 'solid',
            borderRadius: `${component.props.cornerRadius || 4}px`,
          }}
        >
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            Canvas Area
          </div>
        </div>
      );
    default:
      return null;
  }
};
