import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorInput } from './ColorInput';

const commonFonts = [
  'Arial',
  'Helvetica', 
  'Verdana', 
  'Tahoma', 
  'Trebuchet MS', 
  'Georgia', 
  'Times New Roman', 
  'Courier New', 
  'Impact',
  'Comic Sans MS'
];

interface PropertyPanelProps {
  selectedComponent: any;
  onUpdate: (updatedComponent: any) => void;
  setInputFocused: (focused: boolean) => void;
  inputFocused: boolean;
}

export function PropertyPanel({
  selectedComponent,
  onUpdate,
  setInputFocused,
  inputFocused,
}: PropertyPanelProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    general: true,
    style: true,
    advanced: false,
    text: false,
  });

  // Reset expanded sections when component changes
  useEffect(() => {
    if (selectedComponent) {
      let newExpanded = { ...expanded };
      
      // For text components, expand text section by default
      if (['label', 'button', 'paragraph'].includes(selectedComponent?.type)) {
        newExpanded.text = true;
      } else {
        newExpanded.text = false;
      }
      
      setExpanded(newExpanded);
    }
  }, [selectedComponent?.id]);

  const handleChange = (property: string, value: any) => {
    if (!selectedComponent) return;
    
    const updatedProps = {
      ...selectedComponent.props,
      [property]: value,
    };
    
    const updatedComponent = {
      ...selectedComponent,
      props: updatedProps,
    };
    
    onUpdate(updatedComponent);
  };

  const toggleSection = (section: string) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section],
    });
  };

  // Don't show any properties if no component is selected
  if (!selectedComponent) {
    return (
      <div className="p-4 flex flex-col h-full overflow-hidden">
        <h3 className="font-medium text-lg">Properties</h3>
        <div className="mt-8 text-center text-muted-foreground">
          Select a component to edit its properties
        </div>
      </div>
    );
  }

  // Function to render common font properties for text components
  const renderFontProperties = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="font">Font Family</Label>
          <Select
            value={selectedComponent.props.font || 'Arial'}
            onValueChange={(value) => handleChange('font', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {commonFonts.map((font) => (
                <SelectItem key={font} value={font}>{font}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="fontSize">Font Size</Label>
          <Select
            value={String(selectedComponent.props.fontSize || 12)}
            onValueChange={(value) => handleChange('fontSize', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48, 54, 60, 72].map((size) => (
                <SelectItem key={size} value={String(size)}>{size}px</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Text Style</Label>
          <div className="flex gap-2 mt-2">
            <Button
              variant={selectedComponent.props.fontWeight === 'bold' ? "default" : "outline"} 
              size="icon"
              onClick={() => handleChange('fontWeight', selectedComponent.props.fontWeight === 'bold' ? 'normal' : 'bold')}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={selectedComponent.props.fontStyle === 'italic' ? "default" : "outline"}
              size="icon"
              onClick={() => handleChange('fontStyle', selectedComponent.props.fontStyle === 'italic' ? 'normal' : 'italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {selectedComponent.type === 'paragraph' && (
          <div>
            <Label>Line Height</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[selectedComponent.props.lineHeight || 1.5]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => handleChange('lineHeight', value[0])}
                className="flex-1"
              />
              <span className="text-sm w-8 text-right">
                {selectedComponent.props.lineHeight || 1.5}x
              </span>
            </div>
          </div>
        )}
        
        {selectedComponent.props.fgColor !== undefined && (
          <div>
            <Label htmlFor="fgColor">Text Color</Label>
            <ColorInput
              value={selectedComponent.props.fgColor}
              onChange={(value) => handleChange('fgColor', value)}
              id="fgColor"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-hidden">
      <h3 className="font-medium text-lg">Properties</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} ({selectedComponent.id})
      </p>

      <div className="overflow-y-auto flex-1">
        {/* Component General Properties */}
        <div className="property-group mb-3">
          <div 
            className="flex justify-between items-center cursor-pointer py-1"
            onClick={() => toggleSection('general')}
          >
            <h4 className="font-medium">General</h4>
            {expanded.general ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {expanded.general && (
            <div className="pt-2 pb-4 space-y-4">
              {/* Text Property */}
              {selectedComponent.props.text !== undefined && ['button', 'label', 'checkbox'].includes(selectedComponent.type) && (
                <div>
                  <Label htmlFor="text">Text</Label>
                  <Input
                    id="text"
                    value={selectedComponent.props.text || ''}
                    onChange={(e) => handleChange('text', e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                </div>
              )}
              
              {/* Paragraph Text */}
              {selectedComponent.type === 'paragraph' && (
                <div>
                  <Label htmlFor="text">Text</Label>
                  <textarea
                    id="text"
                    value={selectedComponent.props.text || ''}
                    onChange={(e) => handleChange('text', e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="w-full h-32 p-2 border rounded-md resize-none"
                  />
                </div>
              )}
              
              {/* Position and Size */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="pos-x">X</Label>
                  <Input
                    id="pos-x"
                    type="number"
                    value={selectedComponent.position.x}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        onUpdate({
                          ...selectedComponent,
                          position: {
                            ...selectedComponent.position,
                            x: value
                          }
                        });
                      }
                    }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                </div>
                <div>
                  <Label htmlFor="pos-y">Y</Label>
                  <Input
                    id="pos-y"
                    type="number"
                    value={selectedComponent.position.y}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        onUpdate({
                          ...selectedComponent,
                          position: {
                            ...selectedComponent.position,
                            y: value
                          }
                        });
                      }
                    }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                </div>
                <div>
                  <Label htmlFor="size-w">Width</Label>
                  <Input
                    id="size-w"
                    type="number"
                    value={selectedComponent.size.width}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        onUpdate({
                          ...selectedComponent,
                          size: {
                            ...selectedComponent.size,
                            width: value
                          }
                        });
                      }
                    }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                </div>
                <div>
                  <Label htmlFor="size-h">Height</Label>
                  <Input
                    id="size-h"
                    type="number"
                    value={selectedComponent.size.height}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        onUpdate({
                          ...selectedComponent,
                          size: {
                            ...selectedComponent.size,
                            height: value
                          }
                        });
                      }
                    }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                </div>
              </div>
              
              {/* Component specific properties */}
              {selectedComponent.type === 'image' && selectedComponent.props.fileName && (
                <div>
                  <Label>Image Source</Label>
                  <div className="mt-1 text-sm text-gray-500 overflow-hidden overflow-ellipsis">
                    {selectedComponent.props.fileName}
                  </div>
                  
                  <div className="mt-3">
                    <Label htmlFor="fit">Fit</Label>
                    <Select
                      value={selectedComponent.props.fit || 'contain'}
                      onValueChange={(value) => handleChange('fit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fit mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contain">Contain</SelectItem>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="fill">Fill</SelectItem>
                        <SelectItem value="scale-down">Scale Down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Other component-specific properties could be added here */}
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        {/* Text Properties */}
        {['button', 'label', 'entry', 'paragraph', 'checkbox', 'datepicker', 'notebook', 'listbox'].includes(selectedComponent.type) && (
          <>
            <div className="property-group mb-3">
              <div 
                className="flex justify-between items-center cursor-pointer py-1"
                onClick={() => toggleSection('text')}
              >
                <h4 className="font-medium">Font & Text</h4>
                {expanded.text ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              
              {expanded.text && (
                <div className="pt-2 pb-4">
                  {renderFontProperties()}
                </div>
              )}
            </div>
            <Separator className="my-4" />
          </>
        )}
        
        {/* Style Properties */}
        <div className="property-group mb-3">
          <div 
            className="flex justify-between items-center cursor-pointer py-1"
            onClick={() => toggleSection('style')}
          >
            <h4 className="font-medium">Style</h4>
            {expanded.style ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {expanded.style && (
            <div className="pt-2 pb-4 space-y-4">
              {/* Background Color */}
              {selectedComponent.props.bgColor !== undefined && (
                <div>
                  <Label htmlFor="bgColor">Background Color</Label>
                  <ColorInput
                    value={selectedComponent.props.bgColor}
                    onChange={(value) => handleChange('bgColor', value)}
                    id="bgColor"
                  />
                </div>
              )}
              
              {/* Border Properties */}
              {selectedComponent.props.borderColor !== undefined && (
                <div>
                  <Label htmlFor="borderColor">Border Color</Label>
                  <ColorInput
                    value={selectedComponent.props.borderColor}
                    onChange={(value) => handleChange('borderColor', value)}
                    id="borderColor"
                  />
                </div>
              )}
              
              {selectedComponent.props.borderWidth !== undefined && (
                <div>
                  <Label htmlFor="borderWidth">Border Width</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[selectedComponent.props.borderWidth]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => handleChange('borderWidth', value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm w-8 text-right">
                      {selectedComponent.props.borderWidth}px
                    </span>
                  </div>
                </div>
              )}
              
              {selectedComponent.props.cornerRadius !== undefined && (
                <div>
                  <Label htmlFor="cornerRadius">Corner Radius</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[selectedComponent.props.cornerRadius]}
                      min={0}
                      max={20}
                      step={1}
                      onValueChange={(value) => handleChange('cornerRadius', value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm w-8 text-right">
                      {selectedComponent.props.cornerRadius}px
                    </span>
                  </div>
                </div>
              )}
              
              {selectedComponent.type === 'button' && (
                <div>
                  <Label htmlFor="hoverColor">Hover Color</Label>
                  <ColorInput
                    value={selectedComponent.props.hoverColor || '#f0f0f0'}
                    onChange={(value) => handleChange('hoverColor', value)}
                    id="hoverColor"
                  />
                </div>
              )}
              
              {/* Paragraph-specific style */}
              {selectedComponent.type === 'paragraph' && (
                <div>
                  <Label htmlFor="padding">Padding</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[selectedComponent.props.padding || 10]}
                      min={0}
                      max={40}
                      step={1}
                      onValueChange={(value) => handleChange('padding', value[0])}
                      className="flex-1"
                    />
                    <span className="text-sm w-8 text-right">
                      {selectedComponent.props.padding || 10}px
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        {/* Advanced Properties */}
        <div className="property-group mb-3">
          <div 
            className="flex justify-between items-center cursor-pointer py-1"
            onClick={() => toggleSection('advanced')}
          >
            <h4 className="font-medium">Advanced</h4>
            {expanded.advanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          
          {expanded.advanced && (
            <div className="pt-2 pb-4">
              <div>
                <Label>Component ID</Label>
                <div className="mt-1 text-sm text-gray-500 break-all font-mono">
                  {selectedComponent.id}
                </div>
              </div>
              
              {selectedComponent.type === 'slider' && (
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="from">Min Value</Label>
                    <Input
                      id="from"
                      type="number"
                      value={selectedComponent.props.from || 0}
                      onChange={(e) => handleChange('from', parseInt(e.target.value) || 0)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="to">Max Value</Label>
                    <Input
                      id="to"
                      type="number"
                      value={selectedComponent.props.to || 100}
                      onChange={(e) => handleChange('to', parseInt(e.target.value) || 100)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="value">Current Value</Label>
                    <Input
                      id="value"
                      type="number"
                      value={selectedComponent.props.value || 50}
                      onChange={(e) => handleChange('value', parseInt(e.target.value) || 50)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="orient">Orientation</Label>
                    <Select
                      value={selectedComponent.props.orient || 'horizontal'}
                      onValueChange={(value) => handleChange('orient', value)}
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
                </div>
              )}
              
              {/* More advanced properties based on component type */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
