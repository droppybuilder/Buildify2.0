
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Undo2, 
  Redo2, 
  Download, 
  Copy, 
  Grid, 
  Eye 
} from "lucide-react";

interface ToolbarProps {
  isTkinter: boolean;
  setIsTkinter: (value: boolean) => void;
}

export const Toolbar = ({ isTkinter, setIsTkinter }: ToolbarProps) => {
  return (
    <div className="h-14 border-b flex items-center px-4 gap-4 bg-white">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Undo2 size={16} />
        </Button>
        <Button variant="outline" size="icon">
          <Redo2 size={16} />
        </Button>
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Grid size={16} />
        </Button>
        <Button variant="outline" size="icon">
          <Eye size={16} />
        </Button>
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-2">
        <span className="text-sm">Tkinter</span>
        <Switch
          checked={!isTkinter}
          onCheckedChange={(checked) => setIsTkinter(!checked)}
        />
        <span className="text-sm">CustomTkinter</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Copy size={16} className="mr-2" />
          Copy Code
        </Button>
        <Button variant="default" size="sm">
          <Download size={16} className="mr-2" />
          Export .py
        </Button>
      </div>
    </div>
  );
};
