import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Undo2, 
  Redo2, 
  Download, 
  Copy, 
  Settings,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateCode } from "@/utils/codeGenerator";

interface ToolbarProps {
  isTkinter: boolean;
  setIsTkinter: (value: boolean) => void;
  components: any[];
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({ 
  isTkinter, 
  setIsTkinter,
  components,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: ToolbarProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appName, setAppName] = useState("MyGUIApp");
  const [windowTitle, setWindowTitle] = useState("GUI Application");
  const [includeImageData, setIncludeImageData] = useState(true);
  const [exportFilename, setExportFilename] = useState("my_app");
  const [customImports, setCustomImports] = useState("");
  const [optimizeCode, setOptimizeCode] = useState(true);
  
  const handleExportCode = async () => {
    if (components.length === 0) {
      toast.error("No components to export. Add some components first.");
      return;
    }

    try {
      const mainCode = generateCode(components, isTkinter, appName, windowTitle, includeImageData, customImports, optimizeCode);
      
      const zip = new JSZip();
      const fileName = exportFilename || 'my_app';
      
      zip.file(`${fileName}.py`, mainCode);
      
      const requirements = isTkinter 
        ? "pillow==9.5.0" 
        : "customtkinter==5.2.0\npillow==9.5.0\nrequests==2.31.0";
      zip.file("requirements.txt", requirements);
      
      const readme = `# ${appName} GUI Application

This is a Python GUI application built with ${isTkinter ? 'Tkinter' : 'CustomTkinter'}.

## Requirements

- Python 3.6 or later
- See requirements.txt for dependencies

## Installation

1. Install the required packages:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

2. Run the application:
   \`\`\`
   python ${fileName}.py
   \`\`\`

## Notes

- If you encounter any image loading issues, make sure the image paths are correct.
- For any issues with CustomTkinter, please refer to the official documentation.
`;
      zip.file("README.md", readme);
      
      const imageComponents = components.filter(c => c.type === 'image' && c.props.src && !c.props.src.startsWith('/placeholder'));
      
      if (imageComponents.length > 0 && includeImageData) {
        const imgFolder = zip.folder("images");
        
        for (let i = 0; i < imageComponents.length; i++) {
          const comp = imageComponents[i];
          const imgSrc = comp.props.src;
          
          try {
            if (imgSrc.startsWith('data:image')) {
              const base64Data = imgSrc.split(',')[1];
              imgFolder.file(`image_${i}.png`, base64Data, {base64: true});
            } 
            else if (imgSrc.startsWith('blob:')) {
              const response = await fetch(imgSrc);
              const blob = await response.blob();
              imgFolder.file(`image_${i}.png`, blob);
            }
          } catch (error) {
            console.error(`Error processing image ${i}:`, error);
          }
        }
      }
      
      const content = await zip.generateAsync({type: "blob"});
      saveAs(content, `${fileName}_${isTkinter ? 'tkinter' : 'customtkinter'}.zip`);
      toast.success("Code and resources exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export code. See console for details.");
    }
  };

  const handleCopyCode = () => {
    const code = generateCode(components, isTkinter, appName, windowTitle, includeImageData, customImports, optimizeCode);
    navigator.clipboard.writeText(code)
      .then(() => toast.success("Code copied to clipboard!"))
      .catch(() => toast.error("Failed to copy code"));
  };

  const handleTkinterToggle = (checked: boolean) => {
    console.log("Toolbar - Switching to:", checked ? "CustomTkinter" : "Tkinter");
    setIsTkinter(!checked);
    toast.info(`Switched to ${!checked ? "Tkinter" : "CustomTkinter"} mode`);
  };

  return (
    <div className="border-b flex items-center justify-between p-2 bg-white">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Tkinter</span>
          <Switch
            checked={!isTkinter}
            onCheckedChange={handleTkinterToggle}
            id="tkinter-toggle"
          />
          <span className="text-sm font-medium">CustomTkinter</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center space-x-1"
        >
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyCode}
          className="flex items-center space-x-1"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy Code
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={handleExportCode}
          className="flex items-center space-x-1"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>
      
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Export Settings</DialogTitle>
            <DialogDescription>
              Configure how your Python GUI code is generated
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="appName" className="text-right">App Class Name</Label>
              <Input
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="col-span-2"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="windowTitle" className="text-right">Window Title</Label>
              <Input
                id="windowTitle"
                value={windowTitle}
                onChange={(e) => setWindowTitle(e.target.value)}
                className="col-span-2"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="filename" className="text-right">Filename</Label>
              <Input
                id="filename"
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value)}
                className="col-span-2"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="customImports" className="text-right">Custom Imports</Label>
              <Textarea
                id="customImports"
                value={customImports}
                onChange={(e) => setCustomImports(e.target.value)}
                placeholder="from tkinter import filedialog"
                className="col-span-2 h-20"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="includeImages">Include Images</Label>
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  id="includeImages"
                  checked={includeImageData}
                  onCheckedChange={setIncludeImageData}
                />
                <span className="text-sm text-muted-foreground">
                  Export image files with code
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="optimizeCode">Optimize Code</Label>
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  id="optimizeCode"
                  checked={optimizeCode}
                  onCheckedChange={setOptimizeCode}
                />
                <span className="text-sm text-muted-foreground">
                  Group components by type for efficiency
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
