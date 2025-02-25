
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";

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

  const updateProp = (key: string, value: any) => {
    onUpdate({
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [key]: value
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="font-semibold mb-4">Properties</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                value={selectedComponent.position.x}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  position: {
                    ...selectedComponent.position,
                    x: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                value={selectedComponent.position.y}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  position: {
                    ...selectedComponent.position,
                    y: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Width</Label>
              <Input
                type="number"
                value={selectedComponent.size.width}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  size: {
                    ...selectedComponent.size,
                    width: parseInt(e.target.value)
                  }
                })}
              />
            </div>
            <div>
              <Label className="text-xs">Height</Label>
              <Input
                type="number"
                value={selectedComponent.size.height}
                onChange={(e) => onUpdate({
                  ...selectedComponent,
                  size: {
                    ...selectedComponent.size,
                    height: parseInt(e.target.value)
                  }
                })}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Component-specific properties */}
        {selectedComponent.type === 'button' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Text</Label>
              <Input
                value={selectedComponent.props.text}
                onChange={(e) => updateProp('text', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={selectedComponent.props.bgColor}
                onChange={(e) => updateProp('bgColor', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Text Color</Label>
              <Input
                type="color"
                value={selectedComponent.props.fgColor}
                onChange={(e) => updateProp('fgColor', e.target.value)}
              />
            </div>
          </div>
        )}

        {selectedComponent.type === 'label' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Text</Label>
              <Input
                value={selectedComponent.props.text}
                onChange={(e) => updateProp('text', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Input
                type="number"
                value={selectedComponent.props.fontSize}
                onChange={(e) => updateProp('fontSize', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Text Color</Label>
              <Input
                type="color"
                value={selectedComponent.props.fgColor}
                onChange={(e) => updateProp('fgColor', e.target.value)}
              />
            </div>
          </div>
        )}

        {selectedComponent.type === 'entry' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input
                value={selectedComponent.props.placeholder}
                onChange={(e) => updateProp('placeholder', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={selectedComponent.props.bgColor}
                onChange={(e) => updateProp('bgColor', e.target.value)}
              />
            </div>
          </div>
        )}

        {selectedComponent.type === 'checkbox' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Text</Label>
              <Input
                value={selectedComponent.props.text}
                onChange={(e) => updateProp('text', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={selectedComponent.props.value}
                onCheckedChange={(checked) => updateProp('value', checked)}
              />
              <Label>Checked</Label>
            </div>
          </div>
        )}

        {selectedComponent.type === 'slider' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Minimum Value</Label>
              <Input
                type="number"
                value={selectedComponent.props.from}
                onChange={(e) => updateProp('from', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Maximum Value</Label>
              <Input
                type="number"
                value={selectedComponent.props.to}
                onChange={(e) => updateProp('to', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Current Value</Label>
              <Input
                type="number"
                value={selectedComponent.props.value}
                onChange={(e) => updateProp('value', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Orientation</Label>
              <Select
                value={selectedComponent.props.orient}
                onValueChange={(value) => updateProp('orient', value)}
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </Select>
            </div>
          </div>
        )}

        {selectedComponent.type === 'frame' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={selectedComponent.props.background}
                onChange={(e) => updateProp('background', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Border Style</Label>
              <Select
                value={selectedComponent.props.relief}
                onValueChange={(value) => updateProp('relief', value)}
              >
                <option value="flat">Flat</option>
                <option value="solid">Solid</option>
                <option value="groove">Groove</option>
                <option value="ridge">Ridge</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Border Width</Label>
              <Input
                type="number"
                value={selectedComponent.props.borderwidth}
                onChange={(e) => updateProp('borderwidth', parseInt(e.target.value))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
