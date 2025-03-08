
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value || '#ffffff');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor);
  };

  const handleInputBlur = () => {
    let color = inputValue;
    // Ensure the color value is valid
    if (!color.startsWith('#')) {
      color = `#${color}`;
    }
    
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      // Fallback to a default color if invalid
      color = '#ffffff';
    }
    
    setInputValue(color);
    onChange(color);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      {label && <Label>{label}</Label>}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-0 h-full aspect-square p-1 rounded-r-none"
                style={{ backgroundColor: inputValue || '#ffffff' }}
              >
                <span className="sr-only">Open color picker</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" side="bottom" align="start">
              <input
                type="color"
                value={inputValue}
                onChange={handleColorChange}
                className="w-32 h-32 cursor-pointer"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
