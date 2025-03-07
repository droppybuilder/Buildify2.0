
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const generatePythonCode = (components: any[]) => {
  // Import statements
  let code = `import tkinter as tk
from tkinter import ttk
from tkinter import filedialog
from PIL import Image, ImageTk
import os
import sys

class Application(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("My Tkinter Application")
        self.geometry("800x600")
        
        # Set theme and appearance
        self.configure(bg="#f0f0f0")
        
        # Create components
        self.create_widgets()
        
    def create_widgets(self):
`;

  // Add components
  components.forEach(component => {
    // Add component creation code based on its type
    code += generateComponentCode(component, 8); // 8 spaces indentation for methods
  });

  // Add main function
  code += `
if __name__ == "__main__":
    app = Application()
    app.mainloop()
`;

  return code;
};

const generateComponentCode = (component: any, indent: number): string => {
  const spaces = ' '.repeat(indent);
  let code = '';
  
  // Generate positioning
  const x = component.position?.x || 0;
  const y = component.position?.y || 0;
  const width = component.size?.width || 100;
  const height = component.size?.height || 30;
  
  // Component specific code
  switch (component.type) {
    case 'button':
      code += `${spaces}self.${component.id} = tk.Button(self, text="${component.properties?.text || 'Button'}", bg="${component.properties?.backgroundColor || '#e0e0e0'}", fg="${component.properties?.textColor || 'black'}")\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      if (component.properties?.onClick) {
        code += `${spaces}self.${component.id}.config(command=self.${component.id}_click)\n`;
        code += `\n${spaces}def ${component.id}_click(self):\n`;
        code += `${spaces}    print("${component.id} clicked")\n`;
      }
      break;
      
    case 'label':
      code += `${spaces}self.${component.id} = tk.Label(self, text="${component.properties?.text || 'Label'}", bg="${component.properties?.backgroundColor || '#f0f0f0'}", fg="${component.properties?.textColor || 'black'}")\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      break;
      
    case 'textbox':
      code += `${spaces}self.${component.id} = tk.Entry(self, bg="${component.properties?.backgroundColor || 'white'}", fg="${component.properties?.textColor || 'black'}")\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      if (component.properties?.placeholder) {
        code += `${spaces}self.${component.id}.insert(0, "${component.properties.placeholder}")\n`;
      }
      break;
      
    case 'checkbox':
      code += `${spaces}self.${component.id}_var = tk.BooleanVar(value=${component.properties?.checked ? 'True' : 'False'})\n`;
      code += `${spaces}self.${component.id} = tk.Checkbutton(self, text="${component.properties?.text || 'Checkbox'}", variable=self.${component.id}_var, bg="${component.properties?.backgroundColor || '#f0f0f0'}")\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      break;
      
    case 'dropdown':
      code += `${spaces}self.${component.id}_var = tk.StringVar()\n`;
      const options = component.properties?.options || ['Option 1', 'Option 2', 'Option 3'];
      code += `${spaces}self.${component.id} = ttk.Combobox(self, textvariable=self.${component.id}_var, values=${JSON.stringify(options).replace(/"/g, "'").replace("[", "[").replace("]", "]")})\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      if (component.properties?.defaultValue) {
        code += `${spaces}self.${component.id}.set("${component.properties.defaultValue}")\n`;
      }
      break;
      
    case 'image':
      code += `${spaces}# Load image for ${component.id}\n`;
      code += `${spaces}self.${component.id}_img = self.load_image("path_to_image.png", (${width}, ${height}))\n`;
      code += `${spaces}self.${component.id} = tk.Label(self, image=self.${component.id}_img, bg="${component.properties?.backgroundColor || '#f0f0f0'}")\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      
      // Add image loading function if it's the first image
      if (!code.includes('def load_image')) {
        code = `${spaces}def load_image(self, path, size):\n` +
               `${spaces}    if not os.path.exists(path):\n` +
               `${spaces}        return None\n` +
               `${spaces}    img = Image.open(path)\n` +
               `${spaces}    img = img.resize(size, Image.LANCZOS)\n` +
               `${spaces}    return ImageTk.PhotoImage(img)\n\n` + code;
      }
      break;
      
    case 'slider':
      code += `${spaces}self.${component.id}_var = tk.DoubleVar(value=${component.properties?.value || 0})\n`;
      code += `${spaces}self.${component.id} = ttk.Scale(self, from_=${component.properties?.min || 0}, to=${component.properties?.max || 100}, variable=self.${component.id}_var, orient=tk.HORIZONTAL)\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      break;
      
    case 'frame':
      code += `${spaces}self.${component.id} = tk.Frame(self, bg="${component.properties?.backgroundColor || '#f0f0f0'}", bd=${component.properties?.borderWidth || 1}, relief=${component.properties?.borderStyle ? `"${component.properties.borderStyle}"` : '"flat"'})\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      break;
      
    case 'progressbar':
      code += `${spaces}self.${component.id} = ttk.Progressbar(self, orient=tk.HORIZONTAL, length=${width}, mode="determinate")\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      code += `${spaces}self.${component.id}["value"] = ${component.properties?.value || 0}\n`;
      break;
      
    case 'listbox':
      code += `${spaces}self.${component.id} = tk.Listbox(self, bg="${component.properties?.backgroundColor || 'white'}", fg="${component.properties?.textColor || 'black'}")\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      
      if (component.properties?.items) {
        const items = component.properties.items;
        items.forEach((item: string, index: number) => {
          code += `${spaces}self.${component.id}.insert(${index}, "${item}")\n`;
        });
      }
      break;
      
    case 'textarea':
      code += `${spaces}self.${component.id} = tk.Text(self, bg="${component.properties?.backgroundColor || 'white'}", fg="${component.properties?.textColor || 'black'}")\n`;
      code += `${spaces}self.${component.id}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      if (component.properties?.defaultValue) {
        code += `${spaces}self.${component.id}.insert(tk.END, "${component.properties.defaultValue}")\n`;
      }
      break;
      
    default:
      code += `${spaces}# Unsupported component type: ${component.type}\n`;
  }
  
  return code;
};

export const exportProject = async (components: any[]) => {
  // Create a new JSZip instance
  const zip = new JSZip();
  
  // Generate Python code
  const pythonCode = generatePythonCode(components);
  zip.file("app.py", pythonCode);
  
  // Create a requirements.txt file
  const requirements = `Pillow>=9.0.0
`;
  zip.file("requirements.txt", requirements);
  
  // Create a README.md file
  const readme = `# Tkinter GUI Application

This is a simple Tkinter GUI application generated from the GUI Builder.

## Requirements
- Python 3.6 or later
- Packages listed in requirements.txt

## Installation
1. Install Python from https://www.python.org/downloads/
2. Install dependencies: \`pip install -r requirements.txt\`

## Running the application
\`\`\`
python app.py
\`\`\`
`;
  zip.file("README.md", readme);
  
  // Generate the ZIP file and download it
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "tkinter-gui-app.zip");
  
  return true;
};
