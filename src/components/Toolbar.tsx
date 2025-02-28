
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  Undo2, 
  Redo2, 
  Download, 
  Copy, 
  Grid, 
  Eye,
  Settings
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
  const [appName, setAppName] = useState("My GUI App");
  const [windowTitle, setWindowTitle] = useState("Tkinter GUI App");
  const [includeImageData, setIncludeImageData] = useState(true);
  
  const handleExportCode = () => {
    const code = generateCode(components, isTkinter, appName, windowTitle, includeImageData);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/\s+/g, '_')}_${isTkinter ? 'tkinter' : 'customtkinter'}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Code exported successfully!");
  };

  const handleCopyCode = () => {
    const code = generateCode(components, isTkinter, appName, windowTitle, includeImageData);
    navigator.clipboard.writeText(code)
      .then(() => toast.success("Code copied to clipboard!"))
      .catch(() => toast.error("Failed to copy code"));
  };

  const generateCode = (components: any[], isTkinter: boolean, appName: string, windowTitle: string, includeImageData: boolean) => {
    if (isTkinter) {
      return generateTkinterCode(components, appName, windowTitle, includeImageData);
    }
    return generateCustomTkinterCode(components, appName, windowTitle, includeImageData);
  };

  const sanitizeId = (id: string) => {
    return id.replace(/[^a-zA-Z0-9_]/g, '_');
  };

  const generateTkinterCode = (components: any[], appName: string, windowTitle: string, includeImageData: boolean) => {
    const imports = `import tkinter as tk
from tkinter import ttk
import os
import base64
from io import BytesIO
from PIL import Image, ImageTk

class ${appName.replace(/\s+/g, '')}:
    def __init__(self, root):
        self.root = root
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
`;

    // Image extraction code if needed
    let imageData = '';
    if (includeImageData) {
      const imageComponents = components.filter(comp => comp.type === 'image' && comp.props.src && !comp.props.src.startsWith('/placeholder'));
      
      if (imageComponents.length > 0) {
        imageData = `
    def load_embedded_image(self, base64_data, size=None):
        """Load an image from base64 data"""
        image = Image.open(BytesIO(base64.b64decode(base64_data)))
        if size:
            image = image.resize(size)
        return ImageTk.PhotoImage(image)
        
`;
      }
    }

    const setupComponents = components.map(component => {
      const safeId = sanitizeId(component.id);
      switch (component.type) {
        case 'button':
          return `        self.button_${safeId} = tk.Button(root, 
            text="${component.props.text}",
            bg="${component.props.bgColor}",
            fg="${component.props.fgColor}")
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'label':
          return `        self.label_${safeId} = tk.Label(root, 
            text="${component.props.text}",
            fg="${component.props.fgColor}",
            font=("TkDefaultFont", ${component.props.fontSize}))
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'entry':
          return `        self.entry_${safeId} = tk.Entry(root,
            bg="${component.props.bgColor}")
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'slider':
          return `        self.slider_${safeId} = tk.Scale(root,
            from_=${component.props.from || 0},
            to=${component.props.to || 100},
            orient="${component.props.orient === 'vertical' ? 'vertical' : 'horizontal'}")
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
            variable=self.var_${safeId})
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;

        case 'dropdown':
          const options = (component.props.options || 'Option 1,Option 2,Option 3').split(',').map((o: string) => o.trim());
          return `        self.var_${safeId} = tk.StringVar(value="${component.props.selected || options[0]}")
        self.dropdown_${safeId} = ttk.Combobox(root,
            values=[${options.map(o => `"${o}"`).join(', ')}],
            textvariable=self.var_${safeId})
        self.dropdown_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'image':
          if (includeImageData && component.props.src && !component.props.src.startsWith('/placeholder')) {
            return `        # Image component will be handled in embedded images section`;
          } else {
            return `        self.image_${safeId} = tk.Label(root)
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Note: Add your image file to the same directory and update the code:
        # img = tk.PhotoImage(file="your_image.png")
        # self.image_${safeId}.configure(image=img)
        # self.image_${safeId}.image = img  # Keep a reference`;
          }
          
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
pip install pillow
"""`;

    return requirements + '\n\n' + imports + imageData + setupComponents + main;
  };

  const generateCustomTkinterCode = (components: any[], appName: string, windowTitle: string, includeImageData: boolean) => {
    const imports = `import customtkinter as ctk
from PIL import Image
import os
import requests
from io import BytesIO
import urllib.parse
import base64

class ${appName.replace(/\s+/g, '')}:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
        self._create_widgets()
        
    def load_image(self, path):
        """Load image from local path or URL"""
        try:
            if path.startswith(('http://', 'https://')):
                response = requests.get(path)
                return Image.open(BytesIO(response.content))
            elif path.startswith('data:image'):
                # Handle embedded base64 image
                data_url_pattern = r'data:image/(.*?);base64,(.*)'
                import re
                match = re.match(data_url_pattern, path)
                if match:
                    image_data = match.group(2)
                    return Image.open(BytesIO(base64.b64decode(image_data)))
            elif os.path.exists(path):
                return Image.open(path)
            else:
                print(f"Image not found: {path}")
                return None
        except Exception as e:
            print(f"Error loading image: {e}")
            return None

    def _create_widgets(self):`;

    const setupComponents = components.map(component => {
      const safeId = sanitizeId(component.id);
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
        return `        image_path = "${component.props.src}"
        image = self.load_image(image_path)
        if image:
            self.image_${safeId} = ctk.CTkImage(
                light_image=image,
                size=(${Math.round(component.size.width)}, ${Math.round(component.size.height)}))
            self.image_label_${safeId} = ctk.CTkLabel(self.root,
                image=self.image_${safeId},
                text="")
            self.image_label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;

      case 'label':
        return `        self.label_${safeId} = ctk.CTkLabel(self.root, 
            text="${component.props.text}",
            text_color="${component.props.fgColor || '#000000'}",
            font=("TkDefaultFont", ${component.props.fontSize || 12}))
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
        self.checkbox_${safeId}.${component.props.checked ? '' : 'deselect()'}
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
pip install customtkinter Pillow requests
"""`;

    const main = `

if __name__ == "__main__":
    app = ${appName.replace(/\s+/g, '')}()
    app.root.mainloop()`;

    return requirements + '\n\n' + imports + '\n' + setupComponents + main;
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
      <div className="h-14 border-b flex items-center px-4 gap-4 bg-white">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
          >
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
