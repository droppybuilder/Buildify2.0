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
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Position & Size</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>X Position</Label>
            <Input
              type="number"
              value={Math.round(selectedComponent.position.x)}
              onChange={(e) => onUpdate({
                ...selectedComponent,
                position: {
                  ...selectedComponent.position,
                  x: parseInt(e.target.value) || 0
                }
              })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Y Position</Label>
            <Input
              type="number"
              value={Math.round(selectedComponent.position.y)}
              onChange={(e) => onUpdate({
                ...selectedComponent,
                position: {
                  ...selectedComponent.position,
                  y: parseInt(e.target.value) || 0
                }
              })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Width</Label>
            <Input
              type="number"
              value={Math.round(selectedComponent.size.width)}
              onChange={(e) => onUpdate({
                ...selectedComponent,
                size: {
                  ...selectedComponent.size,
                  width: parseInt(e.target.value) || 0
                }
              })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Height</Label>
            <Input
              type="number"
              value={Math.round(selectedComponent.size.height)}
              onChange={(e) => onUpdate({
                ...selectedComponent,
                size: {
                  ...selectedComponent.size,
                  height: parseInt(e.target.value) || 0
                }
              })}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Properties</h3>
        
        {['button', 'label', 'checkbox'].includes(selectedComponent.type) && (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                type="text"
                value={selectedComponent.props.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
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
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}

        {['button', 'entry', 'frame'].includes(selectedComponent.type) && (
          <div className="space-y-4">
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
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>Corner Radius</Label>
              <Input
                type="number"
                value={selectedComponent.props.cornerRadius || 8}
                onChange={(e) => handlePropertyChange('cornerRadius', parseInt(e.target.value) || 0)}
                min="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={selectedComponent.props.borderColor || '#e2e8f0'}
                  onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  value={selectedComponent.props.borderColor || '#e2e8f0'}
                  onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}

        {selectedComponent.type === 'button' && (
          <div>
            <Label>Hover Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={selectedComponent.props.hoverColor || '#f0f0f0'}
                onChange={(e) => handlePropertyChange('hoverColor', e.target.value)}
                className="w-20 h-10 p-1"
              />
              <Input
                type="text"
                value={selectedComponent.props.hoverColor || '#f0f0f0'}
                onChange={(e) => handlePropertyChange('hoverColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        )}

        {selectedComponent.type === 'entry' && (
          <div>
            <Label>Placeholder</Label>
            <Input
              type="text"
              value={selectedComponent.props.placeholder || ''}
              onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        {selectedComponent.type === 'image' && (
          <div className="space-y-4">
            <div>
              <Label>Upload Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Image Source URL</Label>
              <Input
                type="text"
                value={selectedComponent.props.src || '/placeholder.svg'}
                onChange={(e) => handlePropertyChange('src', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Fit</Label>
              <Select 
                value={selectedComponent.props.fit || 'contain'}
                onValueChange={(value) => handlePropertyChange('fit', value)}
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
                value={selectedComponent.props.cornerRadius || 8}
                onChange={(e) => handlePropertyChange('cornerRadius', parseInt(e.target.value) || 0)}
                min="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Border Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={selectedComponent.props.borderColor || '#e2e8f0'}
                  onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  type="text"
                  value={selectedComponent.props.borderColor || '#e2e8f0'}
                  onChange={(e) => handlePropertyChange('borderColor', e.target.value)}
                  className="flex-1"
                />
              </div>
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
                onChange={(e) => handlePropertyChange('from', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Maximum Value</Label>
              <Input
                type="number"
                value={selectedComponent.props.to || 100}
                onChange={(e) => handlePropertyChange('to', parseInt(e.target.value) || 100)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Current Value</Label>
              <Input
                type="number"
                value={selectedComponent.props.value || 50}
                onChange={(e) => handlePropertyChange('value', parseInt(e.target.value) || 50)}
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
                onChange={(e) => handlePropertyChange('borderwidth', parseInt(e.target.value) || 1)}
                min="0"
                max="10"
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
