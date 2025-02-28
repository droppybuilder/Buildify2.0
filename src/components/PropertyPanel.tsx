
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { GripVertical } from "lucide-react";

interface PropertyPanelProps {
  selectedComponent: any;
  onUpdate: (component: any) => void;
}

export const PropertyPanel = ({ selectedComponent, onUpdate }: PropertyPanelProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [inputFocused, setInputFocused] = useState(false);

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

  if (!selectedComponent) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Select a component to edit its properties
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    const updatedProps = {
      ...selectedComponent.props,
      [key]: value
    };

    onUpdate({
      ...selectedComponent,
      props: updatedProps
    });
  };

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
      handlePropertyChange('src', objectUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    }
  };

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
        <div>
          <h3 className="font-semibold mb-4">Position & Size</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>X Position</Label>
              <Input
                type="number"
                defaultValue={Math.round(selectedComponent.position.x)}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  position: {
                    ...selectedComponent.position,
                    x: parseInt(e.target.value) || 0
                  }
                })}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Y Position</Label>
              <Input
                type="number"
                defaultValue={Math.round(selectedComponent.position.y)}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  position: {
                    ...selectedComponent.position,
                    y: parseInt(e.target.value) || 0
                  }
                })}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Width</Label>
              <Input
                type="number"
                defaultValue={Math.round(selectedComponent.size.width)}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  size: {
                    ...selectedComponent.size,
                    width: parseInt(e.target.value) || 0
                  }
                })}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Height</Label>
              <Input
                type="number"
                defaultValue={Math.round(selectedComponent.size.height)}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  size: {
                    ...selectedComponent.size,
                    height: parseInt(e.target.value) || 0
                  }
                })}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-4">Properties</h3>
          
          {/* Text-based components */}
          {['button', 'label', 'checkbox'].includes(selectedComponent.type) && (
            <div className="space-y-4">
              <div>
                <Label>Text</Label>
                <Input
                  type="text"
                  defaultValue={selectedComponent.props.text || ''}
                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    defaultValue={selectedComponent.props.fgColor || '#000000'}
                    onChange={(e) => handlePropertyChange('fgColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    defaultValue={selectedComponent.props.fgColor || '#000000'}
                    onChange={(e) => handlePropertyChange('fgColor', e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Components with background color */}
          {['button', 'entry', 'frame', 'datepicker', 'listbox', 'notebook', 'canvas'].includes(selectedComponent.type) && (
            <div className="space-y-4">
              <div>
                <Label>Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    defaultValue={selectedComponent.props.bgColor || '#ffffff'}
                    onChange={(e) => handlePropertyChange('bgColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    defaultValue={selectedComponent.props.bgColor || '#ffffff'}
                    onChange={(e) => handlePropertyChange('bgColor', e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Corner Radius</Label>
                <Input
                  type="number"
                  defaultValue={selectedComponent.props.cornerRadius || 8}
                  onChange={(e) => handlePropertyChange('cornerRadius', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  min="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    defaultValue={selectedComponent.props.borderColor || '#e2e8f0'}
                    onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    defaultValue={selectedComponent.props.borderColor || '#e2e8f0'}
                    onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Button specific props */}
          {selectedComponent.type === 'button' && (
            <div>
              <Label>Hover Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  defaultValue={selectedComponent.props.hoverColor || '#f0f0f0'}
                  onChange={(e) => handlePropertyChange('hoverColor', e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  defaultValue={selectedComponent.props.hoverColor || '#f0f0f0'}
                  onChange={(e) => handlePropertyChange('hoverColor', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="flex-1"
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
                defaultValue={selectedComponent.props.placeholder || ''}
                onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
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
                  defaultValue={selectedComponent.props.src || '/placeholder.svg'}
                  onChange={(e) => handlePropertyChange('src', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Fit</Label>
                <Select 
                  defaultValue={selectedComponent.props.fit || 'contain'}
                  onValueChange={(value) => handlePropertyChange('fit', value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                >
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                  <option value="fill">Fill</option>
                </Select>
              </div>
              <div>
                <Label>Border Radius</Label>
                <Input
                  type="number"
                  defaultValue={selectedComponent.props.cornerRadius || 8}
                  onChange={(e) => handlePropertyChange('cornerRadius', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  min="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    defaultValue={selectedComponent.props.borderColor || '#e2e8f0'}
                    onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    defaultValue={selectedComponent.props.borderColor || '#e2e8f0'}
                    onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="flex-1"
                  />
                </div>
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
                  defaultValue={selectedComponent.props.from || 0}
                  onChange={(e) => handlePropertyChange('from', parseInt(e.target.value) || 0)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Maximum Value</Label>
                <Input
                  type="number"
                  defaultValue={selectedComponent.props.to || 100}
                  onChange={(e) => handlePropertyChange('to', parseInt(e.target.value) || 100)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Current Value</Label>
                <Input
                  type="number"
                  defaultValue={selectedComponent.props.value || 50}
                  onChange={(e) => handlePropertyChange('value', parseInt(e.target.value) || 50)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Orientation</Label>
                <Select
                  defaultValue={selectedComponent.props.orient || 'horizontal'}
                  onValueChange={(value) => handlePropertyChange('orient', value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </Select>
              </div>
            </div>
          )}

          {/* Frame specific props */}
          {selectedComponent.type === 'frame' && (
            <div className="space-y-4">
              <div>
                <Label>Border Style</Label>
                <Select
                  defaultValue={selectedComponent.props.relief || 'flat'}
                  onValueChange={(value) => handlePropertyChange('relief', value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                >
                  <option value="flat">Flat</option>
                  <option value="solid">Solid</option>
                  <option value="groove">Groove</option>
                  <option value="ridge">Ridge</option>
                </Select>
              </div>
              <div>
                <Label>Border Width</Label>
                <Input
                  type="number"
                  defaultValue={selectedComponent.props.borderwidth || 1}
                  onChange={(e) => handlePropertyChange('borderwidth', parseInt(e.target.value) || 1)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  min="0"
                  max="10"
                  className="mt-1"
                />
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
                  onCheckedChange={(value) => handlePropertyChange('checked', value)}
                />
                <Label htmlFor="checked-status">Checked</Label>
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
                  defaultValue={selectedComponent.props.format || 'yyyy-mm-dd'}
                  onChange={(e) => handlePropertyChange('format', e.target.value)}
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
                  defaultValue={selectedComponent.props.value || 50}
                  onChange={(e) => handlePropertyChange('value', parseInt(e.target.value) || 0)}
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
                  defaultValue={selectedComponent.props.maxValue || 100}
                  onChange={(e) => handlePropertyChange('maxValue', parseInt(e.target.value) || 100)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  min="1"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Progress Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    defaultValue={selectedComponent.props.progressColor || '#3b82f6'}
                    onChange={(e) => handlePropertyChange('progressColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    defaultValue={selectedComponent.props.progressColor || '#3b82f6'}
                    onChange={(e) => handlePropertyChange('progressColor', e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="flex-1"
                  />
                </div>
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
                  defaultValue={selectedComponent.props.tabs || 'Tab 1,Tab 2,Tab 3'}
                  onChange={(e) => handlePropertyChange('tabs', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Selected Tab</Label>
                <Input
                  type="text"
                  defaultValue={selectedComponent.props.selectedTab || 'Tab 1'}
                  onChange={(e) => handlePropertyChange('selectedTab', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
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
                  defaultValue={selectedComponent.props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5'}
                  onChange={(e) => handlePropertyChange('items', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Canvas specific props */}
          {selectedComponent.type === 'canvas' && (
            <div className="space-y-4">
              <div>
                <Label>Border Width</Label>
                <Input
                  type="number"
                  defaultValue={selectedComponent.props.borderwidth || 1}
                  onChange={(e) => handlePropertyChange('borderwidth', parseInt(e.target.value) || 1)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  min="0"
                  max="10"
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
