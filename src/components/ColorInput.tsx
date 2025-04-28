
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from 'react-use';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorInput: React.FC<ColorInputProps> = ({
  value,
  onChange,
  label
}) => {
  const [inputValue, setInputValue] = useState(value || '#ffffff');
  const [isOpen, setIsOpen] = useState(false);
  
  // Update internal state when prop value changes
  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  const isValidHexColor = (color: string): boolean => {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  };

  const formatColorValue = (color: string): string => {
    // Ensure the color starts with #
    let formattedColor = color.startsWith('#') ? color : `#${color}`;
    
    // Clean up the color value
    formattedColor = '#' + formattedColor.replace(/[^0-9A-F]/gi, '').substring(0, 6);
    
    // If color is too short after cleanup, return default white
    if (formattedColor.length < 4) {
      return '#ffffff';
    }
    
    // If it's a 3-digit hex, convert to 6-digit
    if (formattedColor.length === 4) {
      const r = formattedColor[1];
      const g = formattedColor[2];
      const b = formattedColor[3];
      formattedColor = `#${r}${r}${g}${g}${b}${b}`;
    }
    
    // Ensure we have a valid 6-digit hex
    if (formattedColor.length !== 7) {
      formattedColor = formattedColor.padEnd(7, '0');
    }
    
    return formattedColor;
  };

  // Create a debounced value to use for onChange
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  
  // Use the useDebounce hook correctly (it watches a value, not a callback)
  useDebounce(
    () => {
      if (isValidHexColor(debouncedValue)) {
        onChange(debouncedValue);
      }
    },
    300,
    [debouncedValue]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (isValidHexColor(newValue)) {
      setDebouncedValue(newValue);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor); // Immediately notify parent
  };

  const handleBlur = () => {
    const formattedColor = formatColorValue(inputValue);
    setInputValue(formattedColor);
    onChange(formattedColor); // Update parent with validated color
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  // Use the color as background if valid, otherwise use white
  const displayColor = isValidHexColor(inputValue) ? inputValue : '#ffffff';

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-10 h-10 p-0 border-2 flex-shrink-0"
            style={{ backgroundColor: displayColor }}
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Pick a color</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" side="right" align="start">
          <input
            type="color"
            value={displayColor}
            onChange={handleColorPickerChange}
            onBlur={handleBlur}
            className="w-32 h-32 cursor-pointer border-0"
          />
        </PopoverContent>
      </Popover>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="font-mono"
        placeholder="#ffffff"
      />
    </div>
  );
};
