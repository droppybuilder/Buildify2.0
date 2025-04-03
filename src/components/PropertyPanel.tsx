
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorInput } from "@/components/ColorInput";
import { toast } from "sonner";

interface PropertyPanelProps {
  selectedComponent: any;
  onUpdate: (updatedComponent: any) => void;
  setInputFocused: (focused: boolean) => void;
  inputFocused: boolean;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  onUpdate,
  setInputFocused,
  inputFocused
}) => {
  const [localProps, setLocalProps] = useState<any>({});
  
  // Initialize local state with selected component props
  useEffect(() => {
    if (selectedComponent) {
      // Ensure props exist
      const componentProps = selectedComponent.props || {};
      setLocalProps({...componentProps});
    } else {
      setLocalProps({});
    }
  }, [selectedComponent]);

  // Update component when a property changes
  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedComponent) return;
    
    // Update local state first
    const updatedProps = { ...localProps, [property]: value };
    setLocalProps(updatedProps);
    
    // Then update the component with all props
    const updatedComponent = {
      ...selectedComponent,
      props: updatedProps
    };
    
    console.log(`Updating property ${property} to:`, value);
    onUpdate(updatedComponent);
  };

  // Upload an image file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedComponent) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const imageDataUrl = reader.result as string;
      
      // Update the src property
      handlePropertyChange('src', imageDataUrl);
      toast.success("Image uploaded successfully");
    };
    
    reader.onerror = () => {
      toast.error("Failed to upload image");
    };
    
    reader.readAsDataURL(file);
  };

  // Return empty panel if no component is selected
  if (!selectedComponent) {
    return (
      <div className="p-4 flex flex-col h-full justify-center items-center text-center text-muted-foreground">
        <p>Select a component to view and edit its properties</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Properties</h2>
          <p className="text-sm text-muted-foreground">
            {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} - {selectedComponent.id}
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          {/* Common properties section */}
          <div>
            <h3 className="text-md font-medium mb-2">Dimensions & Position</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={selectedComponent.size?.width || 0}
                  onChange={(e) => {
                    const updatedComponent = {
                      ...selectedComponent,
                      size: {
                        ...selectedComponent.size,
                        width: Number(e.target.value)
                      }
                    };
                    onUpdate(updatedComponent);
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={selectedComponent.size?.height || 0}
                  onChange={(e) => {
                    const updatedComponent = {
                      ...selectedComponent,
                      size: {
                        ...selectedComponent.size,
                        height: Number(e.target.value)
                      }
                    };
                    onUpdate(updatedComponent);
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label htmlFor="xPos">X Position</Label>
                <Input
                  id="xPos"
                  type="number"
                  value={selectedComponent.position?.x || 0}
                  onChange={(e) => {
                    const updatedComponent = {
                      ...selectedComponent,
                      position: {
                        ...selectedComponent.position,
                        x: Number(e.target.value)
                      }
                    };
                    onUpdate(updatedComponent);
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label htmlFor="yPos">Y Position</Label>
                <Input
                  id="yPos"
                  type="number"
                  value={selectedComponent.position?.y || 0}
                  onChange={(e) => {
                    const updatedComponent = {
                      ...selectedComponent,
                      position: {
                        ...selectedComponent.position,
                        y: Number(e.target.value)
                      }
                    };
                    onUpdate(updatedComponent);
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
            </div>
          </div>
          
          <Separator />

          {/* Component-specific properties */}
          {selectedComponent.type === 'button' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={localProps.text || 'Button'}
                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || '#3b82f6'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <ColorInput
                  value={localProps.fgColor || '#ffffff'}
                  onChange={(value) => handlePropertyChange('fgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Hover Color</Label>
                <ColorInput
                  value={localProps.hoverColor || '#2563eb'}
                  onChange={(value) => handlePropertyChange('hoverColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="cornerRadius">Corner Radius</Label>
                <Input
                  id="cornerRadius"
                  type="number"
                  value={localProps.cornerRadius || 10}
                  onChange={(e) => handlePropertyChange('cornerRadius', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={localProps.borderWidth || 0}
                  onChange={(e) => handlePropertyChange('borderWidth', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorInput
                  value={localProps.borderColor || '#d1d5db'}
                  onChange={(value) => handlePropertyChange('borderColor', value)}
                  label=""
                />
              </div>
            </div>
          )}

          {selectedComponent.type === 'label' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="labelText">Label Text</Label>
                <Input
                  id="labelText"
                  value={localProps.text || 'Label'}
                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <ColorInput
                  value={localProps.fgColor || '#000000'}
                  onChange={(value) => handlePropertyChange('fgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || 'transparent'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="cornerRadius">Corner Radius</Label>
                <Input
                  id="cornerRadius"
                  type="number"
                  value={localProps.cornerRadius || 0}
                  onChange={(e) => handlePropertyChange('cornerRadius', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
            </div>
          )}

          {(selectedComponent.type === 'entry' || selectedComponent.type === 'textbox') && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={localProps.placeholder || ''}
                  onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || '#ffffff'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <ColorInput
                  value={localProps.fgColor || '#000000'}
                  onChange={(value) => handlePropertyChange('fgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={localProps.borderWidth || 1}
                  onChange={(e) => handlePropertyChange('borderWidth', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorInput
                  value={localProps.borderColor || '#d1d5db'}
                  onChange={(value) => handlePropertyChange('borderColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="cornerRadius">Corner Radius</Label>
                <Input
                  id="cornerRadius"
                  type="number"
                  value={localProps.cornerRadius || 6}
                  onChange={(e) => handlePropertyChange('cornerRadius', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
            </div>
          )}

          {selectedComponent.type === 'checkbox' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="checkboxText">Checkbox Text</Label>
                <Input
                  id="checkboxText"
                  value={localProps.text || 'Checkbox'}
                  onChange={(e) => handlePropertyChange('text', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={localProps.checked || false}
                  onCheckedChange={(checked) => handlePropertyChange('checked', checked)}
                />
                <Label>Default Checked</Label>
              </div>
              <div>
                <Label>Text Color</Label>
                <ColorInput
                  value={localProps.fgColor || '#000000'}
                  onChange={(value) => handlePropertyChange('fgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Checked Color</Label>
                <ColorInput
                  value={localProps.checkedColor || '#3b82f6'}
                  onChange={(value) => handlePropertyChange('checkedColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={localProps.borderWidth || 1}
                  onChange={(e) => handlePropertyChange('borderWidth', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorInput
                  value={localProps.borderColor || '#d1d5db'}
                  onChange={(value) => handlePropertyChange('borderColor', value)}
                  label=""
                />
              </div>
            </div>
          )}

          {selectedComponent.type === 'dropdown' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="options">Options (comma separated)</Label>
                <Input
                  id="options"
                  value={Array.isArray(localProps.options) ? localProps.options.join(', ') : (localProps.options || 'Option 1, Option 2, Option 3')}
                  onChange={(e) => {
                    const optionsArray = e.target.value.split(',').map((opt: string) => opt.trim());
                    handlePropertyChange('options', optionsArray);
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label htmlFor="defaultValue">Default Value</Label>
                <Input
                  id="defaultValue"
                  value={localProps.defaultValue || ''}
                  onChange={(e) => handlePropertyChange('defaultValue', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || '#ffffff'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <ColorInput
                  value={localProps.fgColor || '#000000'}
                  onChange={(value) => handlePropertyChange('fgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Button Color</Label>
                <ColorInput
                  value={localProps.buttonColor || '#e5e7eb'}
                  onChange={(value) => handlePropertyChange('buttonColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={localProps.borderWidth || 1}
                  onChange={(e) => handlePropertyChange('borderWidth', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorInput
                  value={localProps.borderColor || '#d1d5db'}
                  onChange={(value) => handlePropertyChange('borderColor', value)}
                  label=""
                />
              </div>
            </div>
          )}

          {selectedComponent.type === 'image' && (
            <div className="space-y-4">
              <div>
                <Label>Image</Label>
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => document.getElementById('imageUpload')?.click()}
                  >
                    Upload Image
                  </Button>
                  <input 
                    type="file"
                    id="imageUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                {localProps.src && (
                  <div className="mt-2 border rounded p-2">
                    <img 
                      src={localProps.src} 
                      alt="Preview" 
                      className="max-h-40 max-w-full mx-auto"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || 'transparent'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="cornerRadius">Corner Radius</Label>
                <Input
                  id="cornerRadius"
                  type="number"
                  value={localProps.cornerRadius || 0}
                  onChange={(e) => handlePropertyChange('cornerRadius', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
            </div>
          )}

          {selectedComponent.type === 'slider' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="minValue">Min Value</Label>
                <Input
                  id="minValue"
                  type="number"
                  value={localProps.from || 0}
                  onChange={(e) => handlePropertyChange('from', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label htmlFor="maxValue">Max Value</Label>
                <Input
                  id="maxValue"
                  type="number"
                  value={localProps.to || 100}
                  onChange={(e) => handlePropertyChange('to', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label htmlFor="currentValue">Current Value</Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={localProps.value || 50}
                  onChange={(e) => handlePropertyChange('value', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Orientation</Label>
                <Select 
                  value={localProps.orient || 'horizontal'} 
                  onValueChange={(value) => handlePropertyChange('orient', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="vertical">Vertical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || '#e5e7eb'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Progress Color</Label>
                <ColorInput
                  value={localProps.progressColor || '#3b82f6'}
                  onChange={(value) => handlePropertyChange('progressColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Button Color</Label>
                <ColorInput
                  value={localProps.buttonColor || '#2563eb'}
                  onChange={(value) => handlePropertyChange('buttonColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={localProps.borderWidth || 0}
                  onChange={(e) => handlePropertyChange('borderWidth', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorInput
                  value={localProps.borderColor || '#d1d5db'}
                  onChange={(value) => handlePropertyChange('borderColor', value)}
                  label=""
                />
              </div>
            </div>
          )}

          {selectedComponent.type === 'frame' && (
            <div className="space-y-4">
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || '#f9fafb'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={localProps.borderWidth || 1}
                  onChange={(e) => handlePropertyChange('borderWidth', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorInput
                  value={localProps.borderColor || '#d1d5db'}
                  onChange={(value) => handlePropertyChange('borderColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="cornerRadius">Corner Radius</Label>
                <Input
                  id="cornerRadius"
                  type="number"
                  value={localProps.cornerRadius || 6}
                  onChange={(e) => handlePropertyChange('cornerRadius', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
            </div>
          )}

          {selectedComponent.type === 'progressbar' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="value">Value (%)</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  max="100"
                  value={localProps.value || 50}
                  onChange={(e) => handlePropertyChange('value', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label htmlFor="maxValue">Max Value</Label>
                <Input
                  id="maxValue"
                  type="number"
                  value={localProps.maxValue || 100}
                  onChange={(e) => handlePropertyChange('maxValue', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || '#e5e7eb'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Progress Color</Label>
                <ColorInput
                  value={localProps.progressColor || '#3b82f6'}
                  onChange={(value) => handlePropertyChange('progressColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="cornerRadius">Corner Radius</Label>
                <Input
                  id="cornerRadius"
                  type="number"
                  value={localProps.cornerRadius || 3}
                  onChange={(e) => handlePropertyChange('cornerRadius', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
            </div>
          )}

          {selectedComponent.type === 'listbox' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="items">Items (comma separated)</Label>
                <Input
                  id="items"
                  value={Array.isArray(localProps.items) ? localProps.items.join(', ') : (localProps.items || 'Item 1, Item 2, Item 3')}
                  onChange={(e) => {
                    const itemsArray = e.target.value.split(',').map((item: string) => item.trim());
                    handlePropertyChange('items', itemsArray);
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || '#ffffff'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Text Color</Label>
                <ColorInput
                  value={localProps.fgColor || '#000000'}
                  onChange={(value) => handlePropertyChange('fgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Selected Item Color</Label>
                <ColorInput
                  value={localProps.selectedColor || '#e5e7eb'}
                  onChange={(value) => handlePropertyChange('selectedColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={localProps.borderWidth || 1}
                  onChange={(e) => handlePropertyChange('borderWidth', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorInput
                  value={localProps.borderColor || '#d1d5db'}
                  onChange={(value) => handlePropertyChange('borderColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="cornerRadius">Corner Radius</Label>
                <Input
                  id="cornerRadius"
                  type="number"
                  value={localProps.cornerRadius || 6}
                  onChange={(e) => handlePropertyChange('cornerRadius', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
            </div>
          )}

          {selectedComponent.type === 'notebook' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="tabs">Tabs (comma separated)</Label>
                <Input
                  id="tabs"
                  value={Array.isArray(localProps.tabs) ? localProps.tabs.join(', ') : (localProps.tabs || 'Tab 1, Tab 2, Tab 3')}
                  onChange={(e) => {
                    const tabsArray = e.target.value.split(',').map((tab: string) => tab.trim());
                    handlePropertyChange('tabs', tabsArray);
                  }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label htmlFor="selectedTab">Selected Tab</Label>
                <Input
                  id="selectedTab"
                  value={localProps.selectedTab || ''}
                  onChange={(e) => handlePropertyChange('selectedTab', e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Background Color</Label>
                <ColorInput
                  value={localProps.bgColor || '#ffffff'}
                  onChange={(value) => handlePropertyChange('bgColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Tab Color</Label>
                <ColorInput
                  value={localProps.tabColor || '#f3f4f6'}
                  onChange={(value) => handlePropertyChange('tabColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label>Active Tab Color</Label>
                <ColorInput
                  value={localProps.activeTabColor || '#60a5fa'}
                  onChange={(value) => handlePropertyChange('activeTabColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="borderWidth">Border Width</Label>
                <Input
                  id="borderWidth"
                  type="number"
                  value={localProps.borderWidth || 1}
                  onChange={(e) => handlePropertyChange('borderWidth', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
              <div>
                <Label>Border Color</Label>
                <ColorInput
                  value={localProps.borderColor || '#d1d5db'}
                  onChange={(value) => handlePropertyChange('borderColor', value)}
                  label=""
                />
              </div>
              <div>
                <Label htmlFor="cornerRadius">Corner Radius</Label>
                <Input
                  id="cornerRadius"
                  type="number"
                  value={localProps.cornerRadius || 6}
                  onChange={(e) => handlePropertyChange('cornerRadius', Number(e.target.value))}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
