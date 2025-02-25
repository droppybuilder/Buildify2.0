
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";

interface PropertyPanelProps {
  selectedComponent: any;
  onUpdate: (component: any) => void;
}

export const PropertyPanel = ({ selectedComponent, onUpdate }: PropertyPanelProps) => {
  if (!selectedComponent) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Select a component to edit its properties
      </div>
    );
  }

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>, axis: 'x' | 'y') => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const newComponent = {
        ...selectedComponent,
        position: {
          ...selectedComponent.position,
          [axis]: value
        }
      };
      onUpdate(newComponent);
      console.log('Position updated:', newComponent.position);
    }
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height') => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      const newComponent = {
        ...selectedComponent,
        size: {
          ...selectedComponent.size,
          [dimension]: value
        }
      };
      onUpdate(newComponent);
      console.log('Size updated:', newComponent.size);
    }
  };

  const handlePropertyChange = (key: string, value: any) => {
    const newComponent = {
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [key]: value
      }
    };
    onUpdate(newComponent);
    console.log(`Property ${key} updated:`, value);
    toast.success(`Updated ${key}`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Position & Size</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>X Position</Label>
            <Input
              type="number"
              value={selectedComponent.position.x}
              onChange={(e) => handlePositionChange(e, 'x')}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Y Position</Label>
            <Input
              type="number"
              value={selectedComponent.position.y}
              onChange={(e) => handlePositionChange(e, 'y')}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Width</Label>
            <Input
              type="number"
              value={selectedComponent.size.width}
              onChange={(e) => handleSizeChange(e, 'width')}
              className="mt-1"
              min={10}
            />
          </div>
          <div>
            <Label>Height</Label>
            <Input
              type="number"
              value={selectedComponent.size.height}
              onChange={(e) => handleSizeChange(e, 'height')}
              className="mt-1"
              min={10}
            />
          </div>
        </div>
      </div>

      <Separator />

      {selectedComponent.type === 'button' && (
        <div className="space-y-4">
          <div>
            <Label>Button Text</Label>
            <Input
              value={selectedComponent.props.text || ''}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Background Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={selectedComponent.props.bgColor || '#ffffff'}
                onChange={(e) => handlePropertyChange('bgColor', e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                type="text"
                value={selectedComponent.props.bgColor || '#ffffff'}
                onChange={(e) => handlePropertyChange('bgColor', e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label>Text Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={selectedComponent.props.fgColor || '#000000'}
                onChange={(e) => handlePropertyChange('fgColor', e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                type="text"
                value={selectedComponent.props.fgColor || '#000000'}
                onChange={(e) => handlePropertyChange('fgColor', e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {selectedComponent.type === 'label' && (
        <div className="space-y-4">
          <div>
            <Label>Label Text</Label>
            <Input
              value={selectedComponent.props.text || ''}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Font Size</Label>
            <Input
              type="number"
              value={selectedComponent.props.fontSize || 12}
              onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value))}
              min={8}
              max={72}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Text Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={selectedComponent.props.fgColor || '#000000'}
                onChange={(e) => handlePropertyChange('fgColor', e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                type="text"
                value={selectedComponent.props.fgColor || '#000000'}
                onChange={(e) => handlePropertyChange('fgColor', e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {selectedComponent.type === 'entry' && (
        <div className="space-y-4">
          <div>
            <Label>Placeholder Text</Label>
            <Input
              value={selectedComponent.props.placeholder || ''}
              onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Background Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={selectedComponent.props.bgColor || '#ffffff'}
                onChange={(e) => handlePropertyChange('bgColor', e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                type="text"
                value={selectedComponent.props.bgColor || '#ffffff'}
                onChange={(e) => handlePropertyChange('bgColor', e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {selectedComponent.type === 'checkbox' && (
        <div className="space-y-4">
          <div>
            <Label>Checkbox Text</Label>
            <Input
              value={selectedComponent.props.text || ''}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={selectedComponent.props.value || false}
              onCheckedChange={(checked) => handlePropertyChange('value', checked)}
            />
            <Label>Checked</Label>
          </div>
        </div>
      )}

      {selectedComponent.type === 'slider' && (
        <div className="space-y-4">
          <div>
            <Label>Minimum Value</Label>
            <Input
              type="number"
              value={selectedComponent.props.from || 0}
              onChange={(e) => handlePropertyChange('from', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Maximum Value</Label>
            <Input
              type="number"
              value={selectedComponent.props.to || 100}
              onChange={(e) => handlePropertyChange('to', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Current Value</Label>
            <Input
              type="number"
              value={selectedComponent.props.value || 50}
              onChange={(e) => handlePropertyChange('value', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Orientation</Label>
            <Select
              value={selectedComponent.props.orient || 'horizontal'}
              onValueChange={(value) => handlePropertyChange('orient', value)}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </Select>
          </div>
        </div>
      )}

      {selectedComponent.type === 'frame' && (
        <div className="space-y-4">
          <div>
            <Label>Background Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={selectedComponent.props.background || 'transparent'}
                onChange={(e) => handlePropertyChange('background', e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                type="text"
                value={selectedComponent.props.background || 'transparent'}
                onChange={(e) => handlePropertyChange('background', e.target.value)}
                placeholder="transparent"
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label>Border Style</Label>
            <Select
              value={selectedComponent.props.relief || 'flat'}
              onValueChange={(value) => handlePropertyChange('relief', value)}
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
              value={selectedComponent.props.borderwidth || 1}
              onChange={(e) => handlePropertyChange('borderwidth', parseInt(e.target.value))}
              min={0}
              max={10}
              className="mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};
