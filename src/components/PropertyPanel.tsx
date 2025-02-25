
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

        {selectedComponent.type === 'button' && (
          <div className="space-y-2">
            <Label>Text</Label>
            <Input
              value={selectedComponent.props.text}
              onChange={(e) => updateProp('text', e.target.value)}
            />
          </div>
        )}

        {selectedComponent.type === 'label' && (
          <div className="space-y-2">
            <Label>Text</Label>
            <Input
              value={selectedComponent.props.text}
              onChange={(e) => updateProp('text', e.target.value)}
            />
          </div>
        )}

        {selectedComponent.type === 'entry' && (
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={selectedComponent.props.placeholder}
              onChange={(e) => updateProp('placeholder', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
