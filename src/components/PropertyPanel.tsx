
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { GripVertical } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorInput } from "@/components/ColorInput";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface PropertyPanelProps {
  selectedComponent: any;
  onUpdate: (component: any) => void;
  setInputFocused: Dispatch<SetStateAction<boolean>>;
  inputFocused?: boolean;
}

export const PropertyPanel = ({ 
  selectedComponent, 
  onUpdate, 
  setInputFocused, 
  inputFocused = false
}: PropertyPanelProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Form hook to manage all property values
  const form = useForm({
    defaultValues: selectedComponent?.props || {}
  });

  // Reset form when selected component changes
  useEffect(() => {
    if (selectedComponent && selectedComponent.props) {
      // Reset form with new values 
      const defaultValues = { ...selectedComponent.props };
      
      // Update form values without triggering validation
      Object.keys(defaultValues).forEach(key => {
        form.setValue(key, defaultValues[key]);
      });
    }
  }, [selectedComponent, form]);

  // Draggable panel functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!panelRef.current) return;
    setIsDragging(true);
    
    const startY = e.clientY;
    const startScroll = panelRef.current.scrollTop;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !panelRef.current) return;
      const deltaY = e.clientY - startY;
      panelRef.current.scrollTop = startScroll - deltaY;
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Stop propagation of delete/backspace events when input is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inputFocused && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.stopPropagation();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [inputFocused]);

  // Handle positional changes
  const updatePosition = (axis: 'x' | 'y', value: number) => {
    const updatedComponent = {
      ...selectedComponent,
      position: {
        ...selectedComponent.position,
        [axis]: value
      }
    };
    onUpdate(updatedComponent);
  };

  // Handle size changes
  const updateSize = (dimension: 'width' | 'height', value: number) => {
    const updatedComponent = {
      ...selectedComponent,
      size: {
        ...selectedComponent.size,
        [dimension]: value
      }
    };
    onUpdate(updatedComponent);
  };

  // Handle property changes
  const updateProperty = (key: string, value: any) => {
    const updatedComponent = {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [key]: value
      }
    };
    onUpdate(updatedComponent);
  };

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      updateProperty('src', objectUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    }
  };

  if (!selectedComponent) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Select a component to edit its properties
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div 
        className="h-10 bg-secondary flex items-center px-4 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        <GripVertical size={16} className="mr-2 text-muted-foreground" />
        <span className="text-sm font-medium">Properties: {selectedComponent.type}</span>
      </div>

      <div 
        ref={panelRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {/* Position & Size */}
        <div>
          <h3 className="font-semibold mb-4">Position & Size</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>X Position</Label>
              <Input
                type="number"
                value={Math.round(selectedComponent.position.x)}
                onChange={(e) => updatePosition('x', parseInt(e.target.value) || 0)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Y Position</Label>
              <Input
                type="number"
                value={Math.round(selectedComponent.position.y)}
                onChange={(e) => updatePosition('y', parseInt(e.target.value) || 0)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Width</Label>
              <Input
                type="number"
                value={Math.round(selectedComponent.size.width)}
                onChange={(e) => updateSize('width', parseInt(e.target.value) || 0)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Height</Label>
              <Input
                type="number"
                value={Math.round(selectedComponent.size.height)}
                onChange={(e) => updateSize('height', parseInt(e.target.value) || 0)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Component Properties */}
        <div>
          <h3 className="font-semibold mb-4">Properties</h3>
          
          {/* Text-based components */}
          {['button', 'label', 'checkbox'].includes(selectedComponent.type) && (
            <div className="space-y-4">
              <div>
                <Label>Text</Label>
                <Input
                  type="text"
                  value={selectedComponent.props.text || ''}
                  onChange={(e) => updateProperty('text', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <ColorInput
                  value={selectedComponent.props.fgColor || '#000000'}
                  onChange={(color) => updateProperty('fgColor', color)}
                />
              </div>
            </div>
          )}

          {/* Components with background color */}
          {['button', 'entry', 'frame', 'datepicker', 'listbox', 'notebook', 'canvas', 'textbox', 'textarea', 'progressbar', 'slider'].includes(selectedComponent.type) && (
            <div className="space-y-4">
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={selectedComponent.props.bgColor || '#ffffff'}
                  onChange={(color) => updateProperty('bgColor', color)}
                />
              </div>
              <div>
                <Label>Corner Radius</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.cornerRadius ?? 8}
                  onChange={(e) => updateProperty('cornerRadius', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  min="0"
                  className="mt-1"
                />
              </div>
              {/* Skip border properties for image component */}
              {selectedComponent.type !== 'image' && (
                <>
                  <div>
                    <Label>Border Color</Label>
                    <ColorInput
                      value={selectedComponent.props.borderColor || '#e2e8f0'}
                      onChange={(color) => updateProperty('borderColor', color)}
                    />
                  </div>
                  <div>
                    <Label>Border Width</Label>
                    <Input
                      type="number"
                      value={selectedComponent.props.borderWidth ?? 1}
                      onChange={(e) => updateProperty('borderWidth', parseInt(e.target.value) || 0)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      min="0"
                      max="10"
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Button specific props */}
          {selectedComponent.type === 'button' && (
            <div className="space-y-4">
              <div>
                <Label>Hover Color</Label>
                <ColorInput
                  value={selectedComponent.props.hoverColor || '#f0f0f0'}
                  onChange={(color) => updateProperty('hoverColor', color)}
                />
              </div>
            </div>
          )}

          {/* Entry specific props */}
          {selectedComponent.type === 'entry' && (
            <div>
              <Label>Placeholder</Label>
              <Input
                type="text"
                value={selectedComponent.props.placeholder || ''}
                onChange={(e) => updateProperty('placeholder', e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="mt-1"
              />
            </div>
          )}

          {/* Image specific props */}
          {selectedComponent.type === 'image' && (
            <div className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Image Source URL</Label>
                <Input
                  type="text"
                  value={selectedComponent.props.src || '/placeholder.svg'}
                  onChange={(e) => updateProperty('src', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div className="mt-3">
                <Label>Fit</Label>
                <Select
                  value={selectedComponent.props.fit || 'contain'}
                  onValueChange={(value) => updateProperty('fit', value)}
                  onOpenChange={(open) => setInputFocused(open)}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select fit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="fill">Fill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Corner Radius</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.cornerRadius ?? 8}
                  onChange={(e) => updateProperty('cornerRadius', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  min="0"
                  className="mt-1"
                />
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
                <p>Note: Border width and color are not supported for image components in CustomTkinter.</p>
              </div>
            </div>
          )}

          {/* Slider specific props */}
          {selectedComponent.type === 'slider' && (
            <div className="space-y-4">
              <div>
                <Label>Minimum Value</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.from ?? 0}
                  onChange={(e) => updateProperty('from', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Maximum Value</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.to ?? 100}
                  onChange={(e) => updateProperty('to', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Current Value</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.value ?? 50}
                  onChange={(e) => updateProperty('value', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div className="mt-3">
                <Label>Orientation</Label>
                <Select
                  value={selectedComponent.props.orient || 'horizontal'}
                  onValueChange={(value) => updateProperty('orient', value)}
                  onOpenChange={(open) => setInputFocused(open)}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="vertical">Vertical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Progress Color</Label>
                <ColorInput
                  value={selectedComponent.props.progressColor || '#3b82f6'}
                  onChange={(color) => updateProperty('progressColor', color)}
                />
              </div>
            </div>
          )}

          {/* Frame specific props */}
          {selectedComponent.type === 'frame' && (
            <div className="space-y-4">
              <div className="mt-3">
                <Label>Border Style</Label>
                <Select
                  value={selectedComponent.props.relief || 'flat'}
                  onValueChange={(value) => updateProperty('relief', value)}
                  onOpenChange={(open) => setInputFocused(open)}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Select border style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="groove">Groove</SelectItem>
                    <SelectItem value="ridge">Ridge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Checkbox specific props */}
          {selectedComponent.type === 'checkbox' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="checked-status"
                  checked={selectedComponent.props.checked || false}
                  onCheckedChange={(checked) => updateProperty('checked', checked)}
                />
                <Label htmlFor="checked-status">Checked</Label>
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorInput
                  value={selectedComponent.props.borderColor || '#e2e8f0'}
                  onChange={(color) => updateProperty('borderColor', color)}
                />
              </div>
              <div>
                <Label>Checked Color</Label>
                <ColorInput
                  value={selectedComponent.props.checkedColor || '#3b82f6'}
                  onChange={(color) => updateProperty('checkedColor', color)}
                />
              </div>
            </div>
          )}

          {/* DatePicker specific props */}
          {selectedComponent.type === 'datepicker' && (
            <div className="space-y-4">
              <div>
                <Label>Date Format</Label>
                <Input
                  type="text"
                  value={selectedComponent.props.format || 'yyyy-mm-dd'}
                  onChange={(e) => updateProperty('format', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* ProgressBar specific props */}
          {selectedComponent.type === 'progressbar' && (
            <div className="space-y-4">
              <div>
                <Label>Current Value</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.value ?? 50}
                  onChange={(e) => updateProperty('value', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  min="0"
                  max={selectedComponent.props.maxValue || 100}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Maximum Value</Label>
                <Input
                  type="number"
                  value={selectedComponent.props.maxValue ?? 100}
                  onChange={(e) => updateProperty('maxValue', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Progress Color</Label>
                <ColorInput
                  value={selectedComponent.props.progressColor || '#3b82f6'}
                  onChange={(color) => updateProperty('progressColor', color)}
                />
              </div>
            </div>
          )}

          {/* Notebook specific props */}
          {selectedComponent.type === 'notebook' && (
            <div className="space-y-4">
              <div>
                <Label>Tabs (comma separated)</Label>
                <Input
                  type="text"
                  value={selectedComponent.props.tabs || 'Tab 1,Tab 2,Tab 3'}
                  onChange={(e) => updateProperty('tabs', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Selected Tab</Label>
                <Input
                  type="text"
                  value={selectedComponent.props.selectedTab || 'Tab 1'}
                  onChange={(e) => updateProperty('selectedTab', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Active Tab Color</Label>
                <ColorInput
                  value={selectedComponent.props.activeTabColor || '#3b82f6'}
                  onChange={(color) => updateProperty('activeTabColor', color)}
                />
              </div>
            </div>
          )}

          {/* Listbox specific props */}
          {selectedComponent.type === 'listbox' && (
            <div className="space-y-4">
              <div>
                <Label>Items (comma separated)</Label>
                <Input
                  type="text"
                  value={selectedComponent.props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5'}
                  onChange={(e) => updateProperty('items', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Selected Item Color</Label>
                <ColorInput
                  value={selectedComponent.props.selectedColor || '#3b82f6'}
                  onChange={(color) => updateProperty('selectedColor', color)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
