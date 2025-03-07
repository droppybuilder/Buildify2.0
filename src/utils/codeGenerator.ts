
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const generatePythonCode = (components: any[]) => {
  // Import statements
  let code = `import customtkinter as ctk
from PIL import Image, ImageTk
import os
import sys

# Set appearance mode and default color theme
ctk.set_appearance_mode("System")  # Modes: "System" (standard), "Dark", "Light"
ctk.set_default_color_theme("blue")  # Themes: "blue" (standard), "green", "dark-blue"

class Application(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("My CustomTkinter Application")
        self.geometry("800x600")
        
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
  
  // Generate a valid Python variable name from component id
  // Replace any non-alphanumeric characters with underscores
  const varName = `self.${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  
  // Component specific code
  switch (component.type) {
    case 'button':
      code += `${spaces}${varName} = ctk.CTkButton(self, text="${component.properties?.text || 'Button'}", fg_color="${component.properties?.backgroundColor || '#3b82f6'}", text_color="${component.properties?.textColor || 'white'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      if (component.properties?.onClick) {
        code += `${spaces}${varName}.configure(command=self.${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}_click)\n`;
        code += `\n${spaces}def ${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}_click(self):\n`;
        code += `${spaces}    print("${component.id.replace(/[^a-zA-Z0-9_]/g, '_')} clicked")\n`;
      }
      break;
      
    case 'label':
      code += `${spaces}${varName} = ctk.CTkLabel(self, text="${component.properties?.text || 'Label'}", bg_color="transparent", text_color="${component.properties?.textColor || '#000000'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      break;
      
    case 'textbox':
    case 'entry':
      code += `${spaces}${varName} = ctk.CTkEntry(self, fg_color="${component.properties?.backgroundColor || 'transparent'}", text_color="${component.properties?.textColor || '#000000'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      if (component.properties?.placeholder) {
        code += `${spaces}${varName}.insert(0, "${component.properties.placeholder}")\n`;
      }
      break;
      
    case 'checkbox':
      code += `${spaces}${varName}_var = ctk.BooleanVar(value=${component.properties?.checked ? 'True' : 'False'})\n`;
      code += `${spaces}${varName} = ctk.CTkCheckBox(self, text="${component.properties?.text || 'Checkbox'}", variable=${varName}_var, text_color="${component.properties?.textColor || '#000000'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      break;
      
    case 'dropdown':
      const options = component.properties?.options || ['Option 1', 'Option 2', 'Option 3'];
      code += `${spaces}${varName} = ctk.CTkOptionMenu(self, values=${JSON.stringify(options).replace(/"/g, "'").replace("[", "[").replace("]", "]")})\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      if (component.properties?.defaultValue) {
        code += `${spaces}${varName}.set("${component.properties.defaultValue}")\n`;
      }
      break;
      
    case 'image':
      code += `${spaces}# Load image for ${component.id}\n`;
      code += `${spaces}${varName}_img = self.load_image("path_to_image.png", (${width}, ${height}))\n`;
      code += `${spaces}${varName} = ctk.CTkLabel(self, image=${varName}_img, text="")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      
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
      code += `${spaces}${varName} = ctk.CTkSlider(self, from_=${component.properties?.min || 0}, to=${component.properties?.max || 100}, number_of_steps=${component.properties?.max ? component.properties.max - (component.properties?.min || 0) : 100})\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      code += `${spaces}${varName}.set(${component.properties?.value || 0})\n`;
      break;
      
    case 'frame':
      code += `${spaces}${varName} = ctk.CTkFrame(self, fg_color="${component.properties?.backgroundColor || '#ffffff'}", border_width=${component.properties?.borderWidth || 0})\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      break;
      
    case 'progressbar':
      code += `${spaces}${varName} = ctk.CTkProgressBar(self, orientation="horizontal", width=${width})\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      code += `${spaces}${varName}.set(${(component.properties?.value || 0) / (component.properties?.maxValue || 100)})\n`;
      break;
      
    case 'listbox':
      // CustomTkinter doesn't have a direct listbox equivalent, so we'll create a scrollable frame with labels
      code += `${spaces}# Create a scrollable frame for listbox functionality\n`;
      code += `${spaces}${varName}_frame = ctk.CTkScrollableFrame(self, fg_color="${component.properties?.backgroundColor || '#ffffff'}")\n`;
      code += `${spaces}${varName}_frame.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      
      if (component.properties?.items) {
        const items = component.properties.items;
        items.forEach((item: string, index: number) => {
          code += `${spaces}${varName}_item${index} = ctk.CTkLabel(${varName}_frame, text="${item}", text_color="${component.properties?.textColor || '#000000'}", anchor="w")\n`;
          code += `${spaces}${varName}_item${index}.pack(fill="x", padx=5, pady=2)\n`;
        });
      }
      break;
      
    case 'textarea':
      code += `${spaces}${varName} = ctk.CTkTextbox(self, fg_color="${component.properties?.backgroundColor || '#ffffff'}", text_color="${component.properties?.textColor || '#000000'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y}, width=${width}, height=${height})\n`;
      if (component.properties?.defaultValue) {
        code += `${spaces}${varName}.insert("0.0", "${component.properties.defaultValue}")\n`;
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
  const requirements = `customtkinter>=5.2.0
Pillow>=9.0.0
`;
  zip.file("requirements.txt", requirements);
  
  // Create a README.md file
  const readme = `# CustomTkinter GUI Application

This is a modern CustomTkinter GUI application generated from the GUI Builder.

## Requirements
- Python 3.7 or later
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
  saveAs(content, "customtkinter-gui-app.zip");
  
  return true;
};
