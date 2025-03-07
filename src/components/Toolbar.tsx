
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { exportProject } from '@/utils/codeGenerator';
import { toast } from "sonner";
import { 
  Save, 
  Undo2, 
  Redo2, 
  FileDown, 
  Code, 
  X,
  Copy 
} from 'lucide-react';

interface ToolbarProps {
  components: any[];
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onToggleCodePreview?: () => void;
  showCodePreview?: boolean;
}

export const Toolbar = ({ 
  components, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  onToggleCodePreview,
  showCodePreview
}: ToolbarProps) => {
  
  const handleExport = async () => {
    try {
      const success = await exportProject(components);
      if (success) {
        toast.success("Project exported successfully!");
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <div className="h-14 border-b flex items-center justify-between px-4 bg-gray-50 border-border">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onUndo} 
          disabled={!canUndo} 
          title="Undo"
        >
          <Undo2 className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRedo} 
          disabled={!canRedo} 
          title="Redo"
        >
          <Redo2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-800">Tkinter GUI Builder</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {onToggleCodePreview && (
          <Button
            variant="outline"
            onClick={onToggleCodePreview}
            className="flex items-center space-x-1"
            title={showCodePreview ? "Hide Code Preview" : "Show Code Preview"}
          >
            {showCodePreview ? (
              <>
                <X className="h-4 w-4" />
                <span>Hide Code</span>
              </>
            ) : (
              <>
                <Code className="h-4 w-4" />
                <span>Show Code</span>
              </>
            )}
          </Button>
        )}
        
        <Separator orientation="vertical" className="h-8" />
        
        <Button 
          variant="outline" 
          onClick={handleExport} 
          className="flex items-center space-x-1"
          title="Export Python Application"
          disabled={components.length === 0}
        >
          <FileDown className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};
