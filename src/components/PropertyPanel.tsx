
import React, { useState, useEffect } from 'react';
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
import { ChevronDown, ChevronUp, Bold, Italic } from "lucide-react";

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
  const [fontSettingsOpen, setFontSettingsOpen] = useState(true);
  
  // Local state for input values to ensure controlled components work properly
  const [localInputValues, setLocalInputValues] = useState<Record<string, any>>({});

  // Initialize local values when component changes
  // This useEffect must always be called, not conditionally
  useEffect(() => {
    if (selectedComponent) {
      try {
        const initialValues: Record<string, any> = {};
        
        // Size and position
        if (selectedComponent.size) {
          initialValues.width = selectedComponent.size.width;
          initialValues.height = selectedComponent.size.height;
        }
        if (selectedComponent.position) {
          initialValues.x = selectedComponent.position.x;
          initialValues.y = selectedComponent.position.y;
        }
        
        // Props
        if (selectedComponent.props) {
          Object.keys(selectedComponent.props).forEach(key => {
            initialValues[key] = selectedComponent.props[key];
          });
        }
        
        setLocalInputValues(initialValues);
      } catch (error) {
        console.error("Error initializing property values:", error);
      }
    } else {
      // Reset local values when no component is selected
      setLocalInputValues({});
    }
  }, [selectedComponent]);
  
  // Update component dimensions
  const updateDimension = (field: string, subfield: string, value: number) => {
    try {
      // Update local state
      setLocalInputValues(prev => ({
        ...prev,
        [subfield]: value
      }));
      
      // Update component
      const updatedComponent = {
        ...selectedComponent,
        [field]: {
          ...selectedComponent[field],
          [subfield]: value
        }
      };
      onUpdate(updatedComponent);
    } catch (error) {
      console.error("Error updating dimension:", error);
      toast.error("Failed to update property");
    }
  };
  
  // Update component property
  const updateProperty = (propertyName: string, value: any) => {
    try {
      // Update local state
      setLocalInputValues(prev => ({
        ...prev,
        [propertyName]: value
      }));
      
      // Clone the component to avoid reference issues
      const updatedComponent = {
        ...selectedComponent,
        props: {
          ...selectedComponent.props || {},
          [propertyName]: value
        }
      };
      onUpdate(updatedComponent);
    } catch (error) {
      console.error("Error updating property:", error, propertyName, value);
      toast.error("Failed to update property");
    }
  };
  
  // Handle numeric input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, subfield?: string) => {
    try {
      const value = Number(e.target.value);
      
      if (subfield) {
        updateDimension(field, subfield, value);
      } else {
        updateProperty(field, value);
      }
    } catch (error) {
      console.error("Error handling number change:", error);
    }
  };

  // Handle text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    try {
      const value = e.target.value;
      updateProperty(field, value);
    } catch (error) {
      console.error("Error handling text change:", error);
    }
  };
  
  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const imageDataUrl = reader.result as string;
        updateProperty('src', imageDataUrl);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process image");
      }
    };
    
    reader.onerror = () => {
      toast.error("Failed to upload image");
    };
    
    reader.readAsDataURL(file);
  };

  // Toggle font weight between normal and bold
  const toggleFontWeight = () => {
    const currentWeight = selectedComponent.props?.fontWeight;
    updateProperty('fontWeight', currentWeight === 'bold' ? 'normal' : 'bold');
  };
  
  // Toggle font style between normal and italic
  const toggleFontStyle = () => {
    const currentStyle = selectedComponent.props?.fontStyle;
    updateProperty('fontStyle', currentStyle === 'italic' ? 'normal' : 'italic');
  };
  
  // Helper function to get local value with fallback to component value
  const getValue = (field: string, defaultValue: any = '') => {
    return localInputValues[field] !== undefined ? localInputValues[field] : defaultValue;
  };

  // Gets whether a button should appear active based on the property value
  const isActive = (property: string, value: string) => {
    return selectedComponent.props?.[property] === value;
  };
    // Return empty panel if no component is selected
  if (!selectedComponent) {
    return (
      <div className="p-6 flex flex-col h-full justify-center items-center text-center">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
          </svg>
        </div>
        <h3 className="font-semibold text-slate-700 mb-2">No Component Selected</h3>
        <p className="text-sm text-slate-500 max-w-48">Select a component from the canvas to view and edit its properties</p>
      </div>
    );
  }

  // Safety check - ensure selectedComponent has the required fields
  if (!selectedComponent.type || !selectedComponent.id) {
    console.error("Invalid component structure:", selectedComponent);
    return (
      <div className="p-4 flex flex-col h-full justify-center items-center text-center text-muted-foreground">
        <p>Invalid component structure</p>
      </div>
    );
  }
  
  // Initialize props if needed
  const props = selectedComponent.props || {};
  
  // Determine if the component type should show font settings
  const showFontSettings = [
    'button', 
    'label', 
    'entry', 
    'textbox', 
    'checkbox', 
    'paragraph',
    'listbox'
  ].includes(selectedComponent.type);
    return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border border-blue-100">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Properties</h2>
            <p className="text-xs text-slate-500">
              {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} • {selectedComponent.id}
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Dimensions & Position section */}
          <Collapsible 
            open={dimensionsOpen} 
            onOpenChange={setDimensionsOpen}
            className="bg-slate-50 rounded-xl border border-slate-200/60 overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-slate-100/50 transition-colors">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <h3 className="text-sm font-semibold text-slate-700">Dimensions & Position</h3>
              </div>
              {dimensionsOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="width" className="text-xs font-medium text-slate-600 mb-1.5 block">Width</Label>
                  <Input
                    id="width"
                    type="number"
                  value={getValue('width', selectedComponent.size?.width || 0)}
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
                  value={getValue('height', selectedComponent.size?.height || 0)}
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
                  value={getValue('x', selectedComponent.position?.x || 0)}
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
                  value={getValue('y', selectedComponent.position?.y || 0)}
                  onChange={(e) => handleNumberChange(e, 'position', 'y')}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className="h-8"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Font settings section */}
        {showFontSettings && (
          <Collapsible 
            open={fontSettingsOpen} 
            onOpenChange={setFontSettingsOpen}
            className="border rounded-md overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full bg-muted px-3 py-2">
              <h3 className="text-sm font-medium">Font Settings</h3>
              {fontSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-3">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="font">Font Family</Label>
                  <Select
                    value={getValue('font', props.font || 'Arial')}
                    onValueChange={(value) => updateProperty('font', value)}
                  >
                    <SelectTrigger id="font" className="w-full">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Tahoma">Tahoma</SelectItem>
                      <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    value={getValue('fontSize', props.fontSize || 12)}
                    onChange={(e) => handleNumberChange(e, 'fontSize')}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                </div>
                
                <div>
                  <Label>Font Style</Label>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={isActive('fontWeight', 'bold') ? "default" : "outline"}
                      onClick={toggleFontWeight}
                      className="flex items-center gap-1"
                    >
                      <Bold size={16} />
                      <span>Bold</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={isActive('fontStyle', 'italic') ? "default" : "outline"}
                      onClick={toggleFontStyle}
                      className="flex items-center gap-1"
                    >
                      <Italic size={16} />
                      <span>Italic</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Component type specific properties - Only render relevant section */}
        {selectedComponent.type === 'button' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={getValue('text', props.text || 'Button')}
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
                value={getValue('cornerRadius', props.cornerRadius || 10)}
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
                value={getValue('borderWidth', props.borderWidth || 0)}
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

        {selectedComponent.type === 'label' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="labelText">Label Text</Label>
              <Input
                id="labelText"
                value={getValue('text', props.text || 'Label')}
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
                value={getValue('cornerRadius', props.cornerRadius || 0)}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
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
                value={getValue('placeholder', props.placeholder || '')}
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
                value={getValue('borderWidth', props.borderWidth || 1)}
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
                value={getValue('cornerRadius', props.cornerRadius || 6)}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
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
                value={getValue('text', props.text || 'Checkbox')}
                onChange={(e) => handleTextChange(e, 'text')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>            <div className="flex items-center gap-2">
              <Switch 
                checked={getValue('checked', props.checked || false)}
                onCheckedChange={(checked) => updateProperty('checked', checked)}
              />
              <Label>Default Checked</Label>
            </div><div>
              <Label>Label Text Color</Label>
              <ColorInput
                value={props.fgColor || '#000000'}
                onChange={(value) => updateProperty('fgColor', value)}
              />
            </div>
            <div>
              <Label>Checkbox Color (when checked)</Label>
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
                value={getValue('borderWidth', props.borderWidth || 1)}
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

        {selectedComponent.type === 'dropdown' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="options">Options (comma separated)</Label>
              <Textarea
                id="options"
                value={getValue('options', Array.isArray(props.options) ? props.options.join(', ') : (props.options || 'Option 1, Option 2, Option 3'))}
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
                value={getValue('defaultValue', props.defaultValue || '')}
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
                value={getValue('borderWidth', props.borderWidth || 1)}
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
                value={getValue('cornerRadius', props.cornerRadius || 0)}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
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
                value={getValue('from', props.from || 0)}
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
                value={getValue('to', props.to || 100)}
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
                value={getValue('value', props.value || 50)}
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
                value={getValue('borderWidth', props.borderWidth || 0)}
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
                value={getValue('borderWidth', props.borderWidth || 1)}
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
                value={getValue('cornerRadius', props.cornerRadius || 6)}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
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
                value={getValue('value', props.value || 50)}
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
                value={getValue('maxValue', props.maxValue || 100)}
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
                value={getValue('cornerRadius', props.cornerRadius || 3)}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        )}

        {selectedComponent.type === 'paragraph' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="paragraphText">Paragraph Text</Label>
              <Textarea
                id="paragraphText"
                value={getValue('text', props.text || 'Paragraph text')}
                onChange={(e) => handleTextChange(e, 'text')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className="min-h-[100px]"
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
              <Label htmlFor="borderWidth">Border Width</Label>
              <Input
                id="borderWidth"
                type="number"
                value={getValue('borderWidth', props.borderWidth || 0)}
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
                value={getValue('cornerRadius', props.cornerRadius || 0)}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
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
              <Textarea
                id="items"
                value={getValue('items', Array.isArray(props.items) ? props.items.join(', ') : (props.items || 'Item 1, Item 2, Item 3'))}
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
                value={getValue('borderWidth', props.borderWidth || 1)}
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
                value={getValue('cornerRadius', props.cornerRadius || 6)}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
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
              <Textarea
                id="tabs"
                value={getValue('tabs', Array.isArray(props.tabs) ? props.tabs.join(', ') : (props.tabs || 'Tab 1, Tab 2, Tab 3'))}
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
                value={getValue('selectedTab', props.selectedTab || '')}
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
                value={getValue('borderWidth', props.borderWidth || 1)}
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
                value={getValue('cornerRadius', props.cornerRadius || 6)}
                onChange={(e) => handleNumberChange(e, 'cornerRadius')}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>          </div>
        )}
      </div>
      </ScrollArea>
    </div>
  );
};
