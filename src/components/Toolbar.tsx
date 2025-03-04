
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
  components: any[];
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({ 
  components,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: ToolbarProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appName, setAppName] = useState("MyEelApp");
  const [windowTitle, setWindowTitle] = useState("Eel GUI Application");
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
      // Always use Eel (isTkinter = false)
      const mainPythonCode = generateCode(components, false, appName, windowTitle, includeImageData, customImports, optimizeCode);
      
      const zip = new JSZip();
      const fileName = exportFilename || 'my_app';
      
      // Add main Python file
      zip.file(`${fileName}.py`, mainPythonCode);
      
      // Add requirements.txt
      const requirements = "eel==0.15.0\npillow==9.5.0\nrequests==2.31.0";
      zip.file("requirements.txt", requirements);
      
      // Add readme
      const readme = `# ${appName} GUI Application

This is an Eel GUI application built with Python.

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

- Eel requires Chrome to be installed on your system or another compatible browser.
`;
      zip.file("README.md", readme);
      
      // Create web folder structure
      const webFolder = zip.folder("web");
      const cssFolder = webFolder.folder("css");
      const jsFolder = webFolder.folder("js");
      const imagesFolder = webFolder.folder("images");
      
      // Add HTML file
      webFolder.file("index.html", `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${windowTitle}</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="app-container">
        <div id="componentContainer" class="component-container">
            <!-- Components will be rendered here dynamically -->
        </div>
    </div>
    
    <script type="text/javascript" src="/eel.js"></script>
    <script src="js/app.js"></script>
</body>
</html>`);
      
      // Add CSS file
      cssFolder.file("styles.css", `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
}

.app-container {
    width: 100%;
    height: 100vh;
    position: relative;
}

.component-container {
    position: relative;
    width: 800px;
    height: 600px;
    margin: 0 auto;
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Component styles */
.component {
    position: absolute;
}

.eel-button {
    width: 100%;
    height: 100%;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.eel-button:hover {
    background-color: #2563eb;
}

.eel-label {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
}

.eel-entry {
    width: 100%;
    height: 100%;
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.eel-slider {
    width: 100%;
}

.eel-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
}

.eel-image {
    max-width: 100%;
    max-height: 100%;
}`);
      
      // Add JavaScript file
      jsFolder.file("app.js", `// Main application JavaScript for Eel
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize the application
    await initApp();
});

// Initialize the application
async function initApp() {
    try {
        // Get components from Python
        const components = await eel.get_components()();
        
        // Render components
        renderComponents(components);
        
        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Render components based on data from Python
function renderComponents(components) {
    const container = document.getElementById('componentContainer');
    container.innerHTML = ''; // Clear existing components
    
    components.forEach(component => {
        const element = createComponentElement(component);
        container.appendChild(element);
    });
}

// Create DOM element for a component
function createComponentElement(component) {
    const element = document.createElement('div');
    element.id = \`component-\${component.id}\`;
    element.className = \`component component-\${component.type}\`;
    element.style.position = 'absolute';
    element.style.left = \`\${component.position.x}px\`;
    element.style.top = \`\${component.position.y}px\`;
    element.style.width = \`\${component.size.width}px\`;
    element.style.height = \`\${component.size.height}px\`;
    
    // Create inner content based on component type
    switch(component.type) {
        case 'button':
            element.innerHTML = \`<button class="eel-button">\${component.props.text || 'Button'}</button>\`;
            element.querySelector('button').addEventListener('click', () => {
                handleComponentAction(component.id, 'click');
            });
            break;
            
        case 'label':
            element.innerHTML = \`<div class="eel-label">\${component.props.text || 'Label'}</div>\`;
            break;
            
        case 'entry':
            element.innerHTML = \`<input type="text" class="eel-entry" placeholder="\${component.props.placeholder || ''}">\`;
            element.querySelector('input').addEventListener('change', (e) => {
                handleComponentAction(component.id, 'change', { value: e.target.value });
            });
            break;
            
        case 'image':
            element.innerHTML = \`<img src="images/image_\${component.id}.png" class="eel-image" alt="Image">\`;
            break;
            
        case 'slider':
            element.innerHTML = \`<input type="range" min="\${component.props.min || 0}" max="\${component.props.max || 100}" class="eel-slider">\`;
            element.querySelector('input').addEventListener('input', (e) => {
                handleComponentAction(component.id, 'change', { value: e.target.value });
            });
            break;
            
        case 'checkbox':
            element.innerHTML = \`<label class="eel-checkbox"><input type="checkbox"><span>\${component.props.text || 'Checkbox'}</span></label>\`;
            element.querySelector('input').addEventListener('change', (e) => {
                handleComponentAction(component.id, 'change', { checked: e.target.checked });
            });
            break;
            
        default:
            element.innerHTML = \`<div class="eel-unknown">\${component.type}</div>\`;
    }
    
    return element;
}

// Handle component actions
async function handleComponentAction(componentId, action, data = null) {
    try {
        const result = await eel.handle_component_action(componentId, action, data)();
        console.log('Action result:', result);
    } catch (error) {
        console.error('Error handling component action:', error);
    }
}

// Set up global event listeners
function setupEventListeners() {
    // Example global event listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            console.log('Escape key pressed');
        }
    });
}

// Update a specific component
async function updateComponent(componentId, properties) {
    try {
        const result = await eel.update_component(componentId, properties)();
        if (result.status === 'success') {
            // Refresh components to reflect changes
            const components = await eel.get_components()();
            renderComponents(components);
        }
    } catch (error) {
        console.error('Error updating component:', error);
    }
}`);
      
      const imageComponents = components.filter(c => c.type === 'image' && c.props.src && !c.props.src.startsWith('/placeholder'));
      
      if (imageComponents.length > 0 && includeImageData) {
        const imgFolder = zip.folder("web").folder("images");
        
        for (let i = 0; i < imageComponents.length; i++) {
          const comp = imageComponents[i];
          const imgSrc = comp.props.src;
          
          try {
            if (imgSrc.startsWith('data:image')) {
              const base64Data = imgSrc.split(',')[1];
              imgFolder.file(`image_${comp.id}.png`, base64Data, {base64: true});
            } 
            else if (imgSrc.startsWith('blob:')) {
              const response = await fetch(imgSrc);
              const blob = await response.blob();
              imgFolder.file(`image_${comp.id}.png`, blob);
            }
          } catch (error) {
            console.error(`Error processing image ${i}:`, error);
          }
        }
      }
      
      const content = await zip.generateAsync({type: "blob"});
      saveAs(content, `${fileName}_eel.zip`);
      toast.success("Code and resources exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export code. See console for details.");
    }
  };

  const handleCopyCode = () => {
    // Always use Eel (isTkinter = false)
    const code = generateCode(components, false, appName, windowTitle, includeImageData, customImports, optimizeCode);
    navigator.clipboard.writeText(code)
      .then(() => toast.success("Code copied to clipboard!"))
      .catch(() => toast.error("Failed to copy code"));
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
                placeholder="import requests"
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
