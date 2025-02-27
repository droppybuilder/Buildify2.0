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
  const handleExportCode = () => {
    const code = generateCode(components, isTkinter);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gui_${isTkinter ? 'tkinter' : 'customtkinter'}.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Code exported successfully!");
  };

  const handleCopyCode = () => {
    const code = generateCode(components, isTkinter);
    navigator.clipboard.writeText(code)
      .then(() => toast.success("Code copied to clipboard!"))
      .catch(() => toast.error("Failed to copy code"));
  };

  const generateCode = (components: any[], isTkinter: boolean) => {
    if (isTkinter) {
      return generateTkinterCode(components);
    }
    return generateCustomTkinterCode(components);
  };

  const sanitizeId = (id: string) => {
    return id.replace(/[^a-zA-Z0-9_]/g, '_');
  };

  const generateTkinterCode = (components: any[]) => {
    const imports = `import tkinter as tk
from tkinter import ttk

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Tkinter GUI")
        self.root.geometry("800x600")
`;

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
        default:
          return '';
      }
    }).join('\n\n');

    const main = `
if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()
`;

    return imports + setupComponents + main;
  };

  const generateCustomTkinterCode = (components: any[]) => {
    const imports = `import customtkinter as ctk
from PIL import Image
import os
import requests
from io import BytesIO
import urllib.parse

class App:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("CustomTkinter GUI")
        self.root.geometry("800x600")
        self._create_widgets()
        
    def load_image(self, path):
        """Load image from local path or URL"""
        try:
            if path.startswith(('http://', 'https://')):
                response = requests.get(path)
                return Image.open(BytesIO(response.content))
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
    app = App()
    app.root.mainloop()`;

    return requirements + '\n\n' + imports + '\n' + setupComponents + main;
  };

  const adjustColor = (hex: string, amount: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  return (
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
  );
};
