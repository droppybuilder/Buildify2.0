import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Undo2, 
  Redo2, 
  Download, 
  Copy, 
  Grid, 
  Eye,
  Settings,
  File,
  Sun,
  Moon
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
import { ThemeContext } from '../App';

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
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appName, setAppName] = useState("MyGUIApp");
  const [windowTitle, setWindowTitle] = useState("Tkinter GUI App");
  const [includeImageData, setIncludeImageData] = useState(true);
  const [exportFilename, setExportFilename] = useState("my_app");
  const [customImports, setCustomImports] = useState("");
  
  const handleExportCode = async () => {
    if (components.length === 0) {
      toast.error("No components to export. Add some components first.");
      return;
    }

    try {
      const mainCode = generateCode(components, isTkinter, appName, windowTitle, includeImageData, customImports);
      
      // Create a zip file with the code and requirements
      const zip = new JSZip();
      const fileName = exportFilename || 'my_app';
      
      // Add main Python file
      zip.file(`${fileName}.py`, mainCode);
      
      // Add requirements.txt
      const requirements = isTkinter 
        ? "pillow==9.5.0" 
        : "customtkinter==5.2.0\npillow==9.5.0\nrequests==2.31.0";
      zip.file("requirements.txt", requirements);
      
      // Add README
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
      
      // Handle image files if needed
      const imageComponents = components.filter(c => c.type === 'image' && c.props.src && !c.props.src.startsWith('/placeholder'));
      
      if (imageComponents.length > 0 && includeImageData) {
        // Create an images folder
        const imgFolder = zip.folder("images");
        
        // Add image files (in a real app, you'd extract the actual images)
        for (let i = 0; i < imageComponents.length; i++) {
          const comp = imageComponents[i];
          const imgSrc = comp.props.src;
          
          try {
            // Handle data URLs
            if (imgSrc.startsWith('data:image')) {
              const base64Data = imgSrc.split(',')[1];
              imgFolder.file(`image_${i}.png`, base64Data, {base64: true});
            } 
            // Handle Blob URLs (from URL.createObjectURL)
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
      
      // Generate and download the zip file
      const content = await zip.generateAsync({type: "blob"});
      saveAs(content, `${fileName}_${isTkinter ? 'tkinter' : 'customtkinter'}.zip`);
      toast.success("Code and resources exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export code. See console for details.");
    }
  };

  const handleCopyCode = () => {
    const code = generateCode(components, isTkinter, appName, windowTitle, includeImageData, customImports);
    navigator.clipboard.writeText(code)
      .then(() => toast.success("Code copied to clipboard!"))
      .catch(() => toast.error("Failed to copy code"));
  };

  const generateCode = (components: any[], isTkinter: boolean, appName: string, windowTitle: string, includeImageData: boolean, customImports: string) => {
    if (isTkinter) {
      return generateTkinterCode(components, appName, windowTitle, includeImageData, customImports);
    }
    return generateCustomTkinterCode(components, appName, windowTitle, includeImageData, customImports);
  };

  const sanitizeId = (id: string) => {
    return id.replace(/[^a-zA-Z0-9_]/g, '_');
  };

  const generateTkinterCode = (components: any[], appName: string, windowTitle: string, includeImageData: boolean, customImports: string) => {
    const imports = `import tkinter as tk
from tkinter import ttk
import os
import base64
from io import BytesIO
from PIL import Image, ImageTk
${customImports ? customImports + '\n' : ''}

class ${appName.replace(/\s+/g, '')}:
    def __init__(self, root):
        self.root = root
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
        self.images = []  # Keep references to images to prevent garbage collection
`;

    // Image extraction code if needed
    let imageData = '';
    let imageSetup = '';
    if (includeImageData) {
      const imageComponents = components.filter(comp => comp.type === 'image' && comp.props.src && !comp.props.src.startsWith('/placeholder'));
      
      if (imageComponents.length > 0) {
        imageData = `
    def load_image(self, path=None, data=None, size=None):
        """Load an image from path, data, or use a placeholder"""
        try:
            if data:
                # Load from embedded data
                image = Image.open(BytesIO(base64.b64decode(data)))
            elif path and os.path.exists(path):
                # Load from file
                image = Image.open(path)
            else:
                # Create a placeholder image
                image = Image.new('RGB', size or (100, 100), color='#CCCCCC')
                
            if size:
                image = image.resize(size)
                
            photo_image = ImageTk.PhotoImage(image)
            self.images.append(photo_image)  # Keep a reference
            return photo_image
        except Exception as e:
            print(f"Error loading image: {e}")
            # Return a placeholder on error
            placeholder = Image.new('RGB', size or (100, 100), color='#FF0000')
            if size:
                placeholder = placeholder.resize(size)
            photo_image = ImageTk.PhotoImage(placeholder)
            self.images.append(photo_image)
            return photo_image
        
`;

        // Setup each image component
        imageComponents.forEach((comp, index) => {
          const safeId = sanitizeId(comp.id);
          const imgPath = `os.path.join("images", "image_${index}.png")`;
          const imgSize = `(${Math.round(comp.size.width)}, ${Math.round(comp.size.height)})`;
          
          imageSetup += `
        # Image: ${safeId}
        self.img_${safeId} = self.load_image(path=${imgPath}, size=${imgSize})
        self.image_${safeId} = tk.Label(root, image=self.img_${safeId}, bg="${comp.props.bgColor || '#ffffff'}")
        self.image_${safeId}.place(x=${Math.round(comp.position.x)}, y=${Math.round(comp.position.y)}, width=${Math.round(comp.size.width)}, height=${Math.round(comp.size.height)})
`;
        });
      }
    }

    const setupComponents = components.map(component => {
      const safeId = sanitizeId(component.id);
      
      // Skip image components if they're handled separately
      if (component.type === 'image' && includeImageData && component.props.src && !component.props.src.startsWith('/placeholder')) {
        return '';
      }
      
      switch (component.type) {
        case 'button':
          return `        self.button_${safeId} = tk.Button(root, 
            text="${component.props.text}",
            bg="${component.props.bgColor}",
            fg="${component.props.fgColor}",
            activebackground="${component.props.hoverColor || '#f0f0f0'}",
            borderwidth=1,
            relief="solid")
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'label':
          return `        self.label_${safeId} = tk.Label(root, 
            text="${component.props.text}",
            fg="${component.props.fgColor}",
            font=("TkDefaultFont", ${component.props.fontSize || 12}),
            anchor="w")
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'entry':
          return `        self.entry_${safeId} = tk.Entry(root,
            bg="${component.props.bgColor}",
            borderwidth=1,
            relief="solid")
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'slider':
          return `        self.slider_${safeId} = tk.Scale(root,
            from_=${component.props.from || 0},
            to=${component.props.to || 100},
            orient="${component.props.orient === 'vertical' ? 'vertical' : 'horizontal'}",
            background="${component.props.bgColor || '#e2e8f0'}",
            troughcolor="${component.props.troughColor || '#3b82f6'}",
            sliderlength=16,
            showvalue=True)
        self.slider_${safeId}.set(${component.props.value || 50})
        self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'frame':
          return `        self.frame_${safeId} = tk.Frame(root,
            bg="${component.props.bgColor || '#ffffff'}",
            borderwidth=${component.props.borderwidth || 1},
            relief="${component.props.relief || 'flat'}")
        self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'checkbox':
          return `        self.var_${safeId} = tk.BooleanVar(value=${component.props.checked ? 'True' : 'False'})
        self.checkbox_${safeId} = tk.Checkbutton(root,
            text="${component.props.text}",
            fg="${component.props.fgColor || '#000000'}",
            variable=self.var_${safeId},
            onvalue=True,
            offvalue=False)
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;

        case 'dropdown':
          const options = (component.props.options || 'Option 1,Option 2,Option 3').split(',').map((o: string) => o.trim());
          return `        self.var_${safeId} = tk.StringVar(value="${component.props.selected || options[0]}")
        self.dropdown_${safeId} = ttk.Combobox(root,
            values=[${options.map(o => `"${o}"`).join(', ')}],
            textvariable=self.var_${safeId},
            state="readonly")
        self.dropdown_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'image':
          if (!includeImageData || !component.props.src || component.props.src.startsWith('/placeholder')) {
            return `        self.image_${safeId} = tk.Label(root, text="Image", bg="light gray")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Note: Add your image file to the same directory and update the code:
        # img = tk.PhotoImage(file="your_image.png")
        # self.image_${safeId}.configure(image=img)
        # self.image_${safeId}.image = img  # Keep a reference`;
          }
          return ''; // Already handled in imageSetup
          
        default:
          return '';
      }
    }).join('\n\n');

    const main = `
if __name__ == "__main__":
    root = tk.Tk()
    app = ${appName.replace(/\s+/g, '')}(root)
    root.mainloop()
`;

    const requirements = `"""
Requirements:
- Python 3.6+
- Pillow (PIL)

To install dependencies:
pip install pillow
"""`;

    return requirements + '\n\n' + imports + imageData + '        # Setup UI components\n' + (imageSetup ? imageSetup : '') + setupComponents + main;
  };

  const generateCustomTkinterCode = (components: any[], appName: string, windowTitle: string, includeImageData: boolean, customImports: string) => {
    const imports = `import customtkinter as ctk
from PIL import Image
import os
import requests
from io import BytesIO
import urllib.parse
import base64
${customImports ? customImports + '\n' : ''}

class ${appName.replace(/\s+/g, '')}:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
        self.images = []  # Keep references to images
        self._create_widgets()
        
    def load_image(self, path=None, data=None, size=None):
        """Load an image from path, data or create a placeholder"""
        try:
            if data:
                # Load from embedded data
                image = Image.open(BytesIO(base64.b64decode(data)))
            elif path and os.path.exists(path):
                # Load from file path
                image = Image.open(path)
            else:
                # Create a placeholder
                image = Image.new('RGB', size or (100, 100), color='#CCCCCC')
                
            if size:
                image = image.resize(size)
                
            return image
        except Exception as e:
            print(f"Error loading image: {e}")
            # Return a placeholder on error
            placeholder = Image.new('RGB', size or (100, 100), color='#FF0000')
            if size:
                placeholder = placeholder.resize(size)
            return placeholder

    def _create_widgets(self):`;

    // Handle images
    let imageSetup = '';
    if (includeImageData) {
      const imageComponents = components.filter(comp => comp.type === 'image' && comp.props.src && !comp.props.src.startsWith('/placeholder'));
      
      imageComponents.forEach((comp, index) => {
        const safeId = sanitizeId(comp.id);
        const imgPath = `os.path.join("images", "image_${index}.png")`;
        const imgSize = `(${Math.round(comp.size.width)}, ${Math.round(comp.size.height)})`;
        
        imageSetup += `
        # Image: ${safeId}
        img_${safeId} = self.load_image(path=${imgPath}, size=${imgSize})
        self.ctk_img_${safeId} = ctk.CTkImage(
            light_image=img_${safeId},
            dark_image=img_${safeId},
            size=${imgSize})
        self.image_${safeId} = ctk.CTkLabel(
            self.root, 
            image=self.ctk_img_${safeId},
            text="")
        self.image_${safeId}.place(x=${Math.round(comp.position.x)}, y=${Math.round(comp.position.y)})
        self.images.append(self.ctk_img_${safeId})  # Keep reference
`;
      });
    }

    const setupComponents = components.map(component => {
      const safeId = sanitizeId(component.id);
      
      // Skip image components if they're handled separately
      if (component.type === 'image' && includeImageData && component.props.src && !component.props.src.startsWith('/placeholder')) {
        return '';
      }
      
      switch (component.type) {
        case 'button':
          return `        self.button_${safeId} = ctk.CTkButton(self.root, 
            text="${component.props.text}",
            fg_color="${component.props.bgColor || '#ffffff'}",
            text_color="${component.props.fgColor || '#000000'}",
            hover_color="${component.props.hoverColor || '#f0f0f0'}",
            border_color="${component.props.borderColor || '#e2e8f0'}",
            corner_radius=${component.props.cornerRadius || 8})
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
      case 'image':
        if (!includeImageData || !component.props.src || component.props.src.startsWith('/placeholder')) {
          return `        # Placeholder image - replace with your own image
        self.image_${safeId} = ctk.CTkLabel(self.root, text="Image", fg_color="gray70")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        }
        return ''; // Already handled in imageSetup

      case 'label':
        return `        self.label_${safeId} = ctk.CTkLabel(self.root, 
            text="${component.props.text}",
            text_color="${component.props.fgColor || '#000000'}",
            font=("TkDefaultFont", ${component.props.fontSize || 12}),
            anchor="w")
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
      case 'entry':
        return `        self.entry_${safeId} = ctk.CTkEntry(self.root,
            fg_color="${component.props.bgColor || '#ffffff'}",
            border_color="${component.props.borderColor || '#e2e8f0'}",
            corner_radius=${component.props.cornerRadius || 8},
            placeholder_text="${component.props.placeholder || ''}")
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
      case 'slider':
        return `        self.slider_${safeId} = ctk.CTkSlider(self.root,
            from_=${component.props.from || 0},
            to=${component.props.to || 100},
            orientation="${component.props.orient === 'vertical' ? 'vertical' : 'horizontal'}",
            button_color="${component.props.troughColor || '#3b82f6'}",
            button_hover_color="${adjustColor(component.props.troughColor || '#3b82f6', -20)}",
            progress_color="${component.props.troughColor || '#3b82f6'}")
        self.slider_${safeId}.set(${component.props.value || 50})
        self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
      case 'frame':
        return `        self.frame_${safeId} = ctk.CTkFrame(self.root,
            fg_color="${component.props.bgColor || '#ffffff'}",
            border_width=${component.props.borderwidth || 1},
            border_color="${component.props.borderColor || '#e2e8f0'}",
            corner_radius=${component.props.cornerRadius || 8})
        self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
      case 'checkbox':
        return `        self.checkbox_${safeId} = ctk.CTkCheckBox(self.root,
            text="${component.props.text}",
            text_color="${component.props.fgColor || '#000000'}")
        ${component.props.checked ? 'self.checkbox_' + safeId + '.select()' : 'self.checkbox_' + safeId + '.deselect()'}
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
      case 'dropdown':
        const options = (component.props.options || 'Option 1,Option 2,Option 3').split(',').map((o: string) => o.trim());
        return `        self.dropdown_${safeId} = ctk.CTkOptionMenu(self.root,
            values=[${options.map(o => `"${o}"`).join(', ')}],
            fg_color="${component.props.bgColor || '#ffffff'}",
            text_color="${component.props.fgColor || '#000000'}")
        self.dropdown_${safeId}.set("${component.props.selected || options[0]}")
        self.dropdown_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;

      default:
        return '';
      }
    }).join('\n\n');

    const requirements = `"""
Requirements:
- Python 3.6+
- CustomTkinter
- Pillow (PIL)
- Requests (for loading images from URLs)

To install dependencies:
pip install customtkinter pillow requests
"""`;

    const main = `

if __name__ == "__main__":
    app = ${appName.replace(/\s+/g, '')}()
    app.root.mainloop()`;

    return requirements + '\n\n' + imports + '\n        # Setup UI components\n' + (imageSetup ? imageSetup : '') + setupComponents + main;
  };

  const adjustColor = (hex: string, amount: number) => {
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      const newR = Math.max(0, Math.min(255, r + amount));
      const newG = Math.max(0, Math.min(255, g + amount));
      const newB = Math.max(0, Math.min(255, b + amount));

      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    } catch {
      return amount > 0 ? '#f0f0f0' : '#d0d0d0';
    }
  };

  return (
    <>
      <div className="toolbar">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8"
          >
            <Undo2 size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8"
          >
            <Redo2 size={16} />
          </Button>
        </div>

        <div className="toolbar-divider" />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Grid size={16} />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Eye size={16} />
          </Button>
        </div>

        <div className="toolbar-divider" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Tkinter</span>
          <Switch
            checked={!isTkinter}
            onCheckedChange={(checked) => setIsTkinter(!checked)}
          />
          <span className="text-sm font-medium">CustomTkinter</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleDarkMode} 
            className="h-8 w-8"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy size={16} className="mr-2" />
            Copy Code
          </Button>
          <Button variant="default" size="sm" onClick={handleExportCode}>
            <Download size={16} className="mr-2" />
            Export .py
          </Button>
        </div>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Settings</DialogTitle>
            <DialogDescription>
              Configure how your Python GUI code will be generated
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="app-name">Application Class Name</Label>
              <Input
                id="app-name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="MyGUIApp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="window-title">Window Title</Label>
              <Input
                id="window-title"
                value={windowTitle}
                onChange={(e) => setWindowTitle(e.target.value)}
                placeholder="My GUI Application"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="export-filename">Export Filename</Label>
              <Input
                id="export-filename"
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''))}
                placeholder="my_app"
              />
              <p className="text-xs text-muted-foreground">This will be the name of the Python file</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-imports">Custom Imports (optional)</Label>
              <Textarea
                id="custom-imports"
                value={customImports}
                onChange={(e) => setCustomImports(e.target.value)}
                placeholder="import numpy as np\nimport pandas as pd"
                className="resize-y min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">Add any additional imports you need</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="include-images"
                checked={includeImageData}
                onCheckedChange={setIncludeImageData}
              />
              <Label htmlFor="include-images">Include image processing code</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
