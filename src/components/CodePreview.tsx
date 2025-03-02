
import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css'; // Base theme which we'll override with our custom CSS

interface CodePreviewProps {
  components: any[];
  isTkinter: boolean;
}

export const CodePreview = ({ components, isTkinter }: CodePreviewProps) => {
  const codeRef = useRef<HTMLPreElement>(null);

  const generateTkinterCode = (components: any[]) => {
    // TKinter code generation function
    const imports = `import tkinter as tk
from tkinter import ttk
import os
import base64
from io import BytesIO
from PIL import Image, ImageTk

class MyGUIApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Tkinter GUI App")
        self.root.geometry("800x600")
        self.images = []  # Keep references to images to prevent garbage collection
`;

    const setupComponents = components.map(component => {
      const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
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
          return `        self.image_${safeId} = tk.Label(root, text="Image", bg="light gray")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Note: Add your image file to the same directory and update the code:
        # img = tk.PhotoImage(file="your_image.png")
        # self.image_${safeId}.configure(image=img)
        # self.image_${safeId}.image = img  # Keep a reference`;
        
        default:
          return '';
      }
    }).join('\n\n');

    const main = `
if __name__ == "__main__":
    root = tk.Tk()
    app = MyGUIApp(root)
    root.mainloop()
`;

    return imports + '        # Setup UI components\n' + setupComponents + main;
  };

  const generateCustomTkinterCode = (components: any[]) => {
    // CustomTKinter code generation function
    const imports = `import customtkinter as ctk
from PIL import Image
import os
import base64
from io import BytesIO

class MyGUIApp:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("CustomTkinter GUI App")
        self.root.geometry("800x600")
        self.images = []  # Keep references to images
        self._create_widgets()
        
    def _create_widgets(self):`;

    const setupComponents = components.map(component => {
      const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
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
        return `        # Placeholder image - replace with your own image
        self.image_${safeId} = ctk.CTkLabel(self.root, text="Image", fg_color="gray70")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;

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

    const main = `

if __name__ == "__main__":
    app = MyGUIApp()
    app.root.mainloop()`;

    return imports + '\n        # Setup UI components\n' + setupComponents + main;
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

  const code = isTkinter 
    ? generateTkinterCode(components)
    : generateCustomTkinterCode(components);

  useEffect(() => {
    if (codeRef.current) {
      // Force re-highlighting on every code change
      Prism.highlightElement(codeRef.current);
    }
  }, [code, isTkinter]);

  // Also highlight on component mount
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, []);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="code-preview-header">
        <span>Code Preview</span>
        <span className="text-xs text-muted-foreground">{isTkinter ? "Tkinter" : "CustomTkinter"}</span>
      </div>
      <div className="code-preview-container">
        <pre className="code-preview language-python" ref={codeRef}>
          <code className="language-python">{code}</code>
        </pre>
      </div>
    </div>
  );
};
