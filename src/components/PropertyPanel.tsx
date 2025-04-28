
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorInput } from "@/components/ColorInput";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [dimensionsOpen, setDimensionsOpen] = useState(true);

  // Return empty panel if no component is selected
  if (!selectedComponent) {
    return (
      <div className="p-4 flex flex-col h-full justify-center items-center text-center text-muted-foreground">
        <p>Select a component to view and edit its properties</p>
      </div>
    );
  }
  
  // Update component dimensions
  const updateDimension = (field: string, subfield: string, value: number) => {
    const updatedComponent = {
      ...selectedComponent,
      [field]: {
        ...selectedComponent[field],
        [subfield]: value
      }
    };
    onUpdate(updatedComponent);
  };
  
  // Update component property
  const updateProperty = (propertyName: string, value: any) => {
    const updatedComponent = {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [propertyName]: value
      }
    };
    onUpdate(updatedComponent);
  };
  
  // Handle numeric input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, subfield?: string) => {
    const value = Number(e.target.value);
    if (subfield) {
      updateDimension(field, subfield, value);
    } else {
      updateProperty(field, value);
    }
  };

  // Handle text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    updateProperty(field, e.target.value);
  };
  
  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const imageDataUrl = reader.result as string;
      updateProperty('src', imageDataUrl);
      toast.success("Image uploaded successfully");
    };
    
    reader.onerror = () => {
      toast.error("Failed to upload image");
    };
    
    reader.readAsDataURL(file);
  };
  
  // Initialize props if needed
  const props = selectedComponent.props || {};
  
  return (
    <ScrollArea className="h-full px-4">
      <div className="py-4 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Properties</h2>
          <p className="text-sm text-muted-foreground">
            {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} - {selectedComponent.id}
          </p>
        </div>
        
        <Separator />
        
        {/* Dimensions & Position section */}
        <Collapsible 
          open={dimensionsOpen} 
          onOpenChange={setDimensionsOpen}
          className="border rounded-md overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full bg-muted px-3 py-2">
            <h3 className="text-sm font-medium">Dimensions & Position</h3>
            {dimensionsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="width" className="text-xs">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={selectedComponent.size?.width || 0}
                  onChange={(e) => handleNumberChange(e, 'size', 'width')}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={selectedComponent.size?.height || 0}
                  onChange={(e) => handleNumberChange(e, 'size', 'height')}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="xPos" className="text-xs">X Position</Label>
                <Input
                  id="xPos"
                  type="number"
                  value={selectedComponent.position?.x || 0}
                  onChange={(e) => handleNumberChange(e, 'position', 'x')}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="yPos" className="text-xs">Y Position</Label>
                <Input
                  id="yPos"
                  type="number"
                  value={selectedComponent.position?.y || 0}
                  onChange={(e) => handleNumberChange(e, 'position', 'y')}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="h-8"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Button properties */}
        {selectedComponent.type === 'button' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={props.text || 'Button'}
                onChange={(e) => handleTextChange(e, 'text')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <ColorInput
                value={props.bgColor || '#3b82f6'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <ColorInput
                value={props.fgColor || '#ffffff'}
                onChange={(value) => updateProperty('fgColor', value)}
              />
            </div>
            <div>
              <Label>Hover Color</Label>
              <ColorInput
                value={props.hoverColor || '#2563eb'}
                onChange={(value) => updateProperty('hoverColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="cornerRadius">Corner Radius</Label>
              <Input
                id="cornerRadius"
                type="number"
                value={props.cornerRadius || 10}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label htmlFor="borderWidth">Border Width</Label>
              <Input
                id="borderWidth"
                type="number"
                value={props.borderWidth || 0}
                onChange={(e) => handleNumberChange(e, 'borderWidth')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <ColorInput
                value={props.borderColor || '#d1d5db'}
                onChange={(value) => updateProperty('borderColor', value)}
              />
            </div>
          </div>
        )}

        {/* Label properties */}
        {selectedComponent.type === 'label' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="labelText">Label Text</Label>
              <Input
                id="labelText"
                value={props.text || 'Label'}
                onChange={(e) => handleTextChange(e, 'text')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <ColorInput
                value={props.fgColor || '#000000'}
                onChange={(value) => updateProperty('fgColor', value)}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <ColorInput
                value={props.bgColor || 'transparent'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="cornerRadius">Corner Radius</Label>
              <Input
                id="cornerRadius"
                type="number"
                value={props.cornerRadius || 0}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        )}

        {/* Entry/Textbox properties */}
        {(selectedComponent.type === 'entry' || selectedComponent.type === 'textbox') && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={props.placeholder || ''}
                onChange={(e) => handleTextChange(e, 'placeholder')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <ColorInput
                value={props.bgColor || '#ffffff'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <ColorInput
                value={props.fgColor || '#000000'}
                onChange={(value) => updateProperty('fgColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="borderWidth">Border Width</Label>
              <Input
                id="borderWidth"
                type="number"
                value={props.borderWidth || 1}
                onChange={(e) => handleNumberChange(e, 'borderWidth')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <ColorInput
                value={props.borderColor || '#d1d5db'}
                onChange={(value) => updateProperty('borderColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="cornerRadius">Corner Radius</Label>
              <Input
                id="cornerRadius"
                type="number"
                value={props.cornerRadius || 6}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        )}

        {/* Checkbox properties */}
        {selectedComponent.type === 'checkbox' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="checkboxText">Checkbox Text</Label>
              <Input
                id="checkboxText"
                value={props.text || 'Checkbox'}
                onChange={(e) => handleTextChange(e, 'text')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={props.checked || false}
                onCheckedChange={(checked) => updateProperty('checked', checked)}
              />
              <Label>Default Checked</Label>
            </div>
            <div>
              <Label>Text Color</Label>
              <ColorInput
                value={props.fgColor || '#000000'}
                onChange={(value) => updateProperty('fgColor', value)}
              />
            </div>
            <div>
              <Label>Checked Color</Label>
              <ColorInput
                value={props.checkedColor || '#3b82f6'}
                onChange={(value) => updateProperty('checkedColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="borderWidth">Border Width</Label>
              <Input
                id="borderWidth"
                type="number"
                value={props.borderWidth || 1}
                onChange={(e) => handleNumberChange(e, 'borderWidth')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <ColorInput
                value={props.borderColor || '#d1d5db'}
                onChange={(value) => updateProperty('borderColor', value)}
              />
            </div>
          </div>
        )}

        {/* Dropdown properties */}
        {selectedComponent.type === 'dropdown' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="options">Options (comma separated)</Label>
              <Textarea
                id="options"
                value={Array.isArray(props.options) ? props.options.join(', ') : (props.options || 'Option 1, Option 2, Option 3')}
                onChange={(e) => {
                  const optionsArray = e.target.value.split(',').map((opt: string) => opt.trim());
                  updateProperty('options', optionsArray);
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input
                id="defaultValue"
                value={props.defaultValue || ''}
                onChange={(e) => handleTextChange(e, 'defaultValue')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <ColorInput
                value={props.bgColor || '#ffffff'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <ColorInput
                value={props.fgColor || '#000000'}
                onChange={(value) => updateProperty('fgColor', value)}
              />
            </div>
            <div>
              <Label>Button Color</Label>
              <ColorInput
                value={props.buttonColor || '#e5e7eb'}
                onChange={(value) => updateProperty('buttonColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="borderWidth">Border Width</Label>
              <Input
                id="borderWidth"
                type="number"
                value={props.borderWidth || 1}
                onChange={(e) => handleNumberChange(e, 'borderWidth')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <ColorInput
                value={props.borderColor || '#d1d5db'}
                onChange={(value) => updateProperty('borderColor', value)}
              />
            </div>
          </div>
        )}

        {/* Image properties */}
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
              {props.src && (
                <div className="mt-2 border rounded p-2">
                  <img 
                    src={props.src} 
                    alt="Preview" 
                    className="max-h-40 max-w-full mx-auto"
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Background Color</Label>
              <ColorInput
                value={props.bgColor || 'transparent'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="cornerRadius">Corner Radius</Label>
              <Input
                id="cornerRadius"
                type="number"
                value={props.cornerRadius || 0}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        )}

        {/* Slider properties */}
        {selectedComponent.type === 'slider' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="minValue">Min Value</Label>
              <Input
                id="minValue"
                type="number"
                value={props.from || 0}
                onChange={(e) => handleNumberChange(e, 'from')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label htmlFor="maxValue">Max Value</Label>
              <Input
                id="maxValue"
                type="number"
                value={props.to || 100}
                onChange={(e) => handleNumberChange(e, 'to')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label htmlFor="currentValue">Current Value</Label>
              <Input
                id="currentValue"
                type="number"
                value={props.value || 50}
                onChange={(e) => handleNumberChange(e, 'value')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Orientation</Label>
              <Select 
                value={props.orient || 'horizontal'} 
                onValueChange={(value) => updateProperty('orient', value)}
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
                value={props.bgColor || '#e5e7eb'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label>Progress Color</Label>
              <ColorInput
                value={props.progressColor || '#3b82f6'}
                onChange={(value) => updateProperty('progressColor', value)}
              />
            </div>
            <div>
              <Label>Button Color</Label>
              <ColorInput
                value={props.buttonColor || '#2563eb'}
                onChange={(value) => updateProperty('buttonColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="borderWidth">Border Width</Label>
              <Input
                id="borderWidth"
                type="number"
                value={props.borderWidth || 0}
                onChange={(e) => handleNumberChange(e, 'borderWidth')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <ColorInput
                value={props.borderColor || '#d1d5db'}
                onChange={(value) => updateProperty('borderColor', value)}
              />
            </div>
          </div>
        )}

        {/* Frame properties */}
        {selectedComponent.type === 'frame' && (
          <div className="space-y-4">
            <div>
              <Label>Background Color</Label>
              <ColorInput
                value={props.bgColor || '#f9fafb'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="borderWidth">Border Width</Label>
              <Input
                id="borderWidth"
                type="number"
                value={props.borderWidth || 1}
                onChange={(e) => handleNumberChange(e, 'borderWidth')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <ColorInput
                value={props.borderColor || '#d1d5db'}
                onChange={(value) => updateProperty('borderColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="cornerRadius">Corner Radius</Label>
              <Input
                id="cornerRadius"
                type="number"
                value={props.cornerRadius || 6}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        )}

        {/* Progressbar properties */}
        {selectedComponent.type === 'progressbar' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="value">Value (%)</Label>
              <Input
                id="value"
                type="number"
                min="0"
                max="100"
                value={props.value || 50}
                onChange={(e) => handleNumberChange(e, 'value')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label htmlFor="maxValue">Max Value</Label>
              <Input
                id="maxValue"
                type="number"
                value={props.maxValue || 100}
                onChange={(e) => handleNumberChange(e, 'maxValue')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <ColorInput
                value={props.bgColor || '#e5e7eb'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label>Progress Color</Label>
              <ColorInput
                value={props.progressColor || '#3b82f6'}
                onChange={(value) => updateProperty('progressColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="cornerRadius">Corner Radius</Label>
              <Input
                id="cornerRadius"
                type="number"
                value={props.cornerRadius || 3}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        )}

        {/* Listbox properties */}
        {selectedComponent.type === 'listbox' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="items">Items (comma separated)</Label>
              <Textarea
                id="items"
                value={Array.isArray(props.items) ? props.items.join(', ') : (props.items || 'Item 1, Item 2, Item 3')}
                onChange={(e) => {
                  const itemsArray = e.target.value.split(',').map((item: string) => item.trim());
                  updateProperty('items', itemsArray);
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <ColorInput
                value={props.bgColor || '#ffffff'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <ColorInput
                value={props.fgColor || '#000000'}
                onChange={(value) => updateProperty('fgColor', value)}
              />
            </div>
            <div>
              <Label>Selected Item Color</Label>
              <ColorInput
                value={props.selectedColor || '#e5e7eb'}
                onChange={(value) => updateProperty('selectedColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="borderWidth">Border Width</Label>
              <Input
                id="borderWidth"
                type="number"
                value={props.borderWidth || 1}
                onChange={(e) => handleNumberChange(e, 'borderWidth')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <ColorInput
                value={props.borderColor || '#d1d5db'}
                onChange={(value) => updateProperty('borderColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="cornerRadius">Corner Radius</Label>
              <Input
                id="cornerRadius"
                type="number"
                value={props.cornerRadius || 6}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        )}

        {/* Notebook properties */}
        {selectedComponent.type === 'notebook' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tabs">Tabs (comma separated)</Label>
              <Textarea
                id="tabs"
                value={Array.isArray(props.tabs) ? props.tabs.join(', ') : (props.tabs || 'Tab 1, Tab 2, Tab 3')}
                onChange={(e) => {
                  const tabsArray = e.target.value.split(',').map((tab: string) => tab.trim());
                  updateProperty('tabs', tabsArray);
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label htmlFor="selectedTab">Selected Tab</Label>
              <Input
                id="selectedTab"
                value={props.selectedTab || ''}
                onChange={(e) => handleTextChange(e, 'selectedTab')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <ColorInput
                value={props.bgColor || '#ffffff'}
                onChange={(value) => updateProperty('bgColor', value)}
              />
            </div>
            <div>
              <Label>Tab Color</Label>
              <ColorInput
                value={props.tabColor || '#f3f4f6'}
                onChange={(value) => updateProperty('tabColor', value)}
              />
            </div>
            <div>
              <Label>Active Tab Color</Label>
              <ColorInput
                value={props.activeTabColor || '#60a5fa'}
                onChange={(value) => updateProperty('activeTabColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="borderWidth">Border Width</Label>
              <Input
                id="borderWidth"
                type="number"
                value={props.borderWidth || 1}
                onChange={(e) => handleNumberChange(e, 'borderWidth')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <ColorInput
                value={props.borderColor || '#d1d5db'}
                onChange={(value) => updateProperty('borderColor', value)}
              />
            </div>
            <div>
              <Label htmlFor="cornerRadius">Corner Radius</Label>
              <Input
                id="cornerRadius"
                type="number"
                value={props.cornerRadius || 6}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
