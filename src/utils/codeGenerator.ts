
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
  const x = Math.round(component.position?.x || 0);
  const y = Math.round(component.position?.y || 0);
  const width = Math.round(component.size?.width || 100);
  const height = Math.round(component.size?.height || 30);
  
  // Generate a valid Python variable name from component id
  // Replace any non-alphanumeric characters with underscores
  const varName = `self.${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  
  // Get properties with fallbacks to avoid undefined
  const props = component.properties || {};
  
  // Component specific code
  switch (component.type) {
    case 'button':
      code += `${spaces}${varName} = ctk.CTkButton(self, text="${props.text || 'Button'}", width=${width}, height=${height}, fg_color="${props.bgColor || '#3b82f6'}", text_color="${props.fgColor || 'white'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      if (props.onClick) {
        code += `${spaces}${varName}.configure(command=self.${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}_click)\n`;
        code += `\n${spaces}def ${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}_click(self):\n`;
        code += `${spaces}    print("${component.id.replace(/[^a-zA-Z0-9_]/g, '_')} clicked")\n`;
      }
      break;
      
    case 'label':
      code += `${spaces}${varName} = ctk.CTkLabel(self, text="${props.text || 'Label'}", width=${width}, height=${height}, text_color="${props.fgColor || '#000000'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      break;
      
    case 'textbox':
    case 'entry':
      code += `${spaces}${varName} = ctk.CTkEntry(self, width=${width}, height=${height}, fg_color="${props.bgColor || 'transparent'}", text_color="${props.fgColor || '#000000'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      if (props.placeholder) {
        code += `${spaces}${varName}.insert(0, "${props.placeholder}")\n`;
      }
      break;
      
    case 'checkbox':
      code += `${spaces}${varName}_var = ctk.BooleanVar(value=${props.checked ? 'True' : 'False'})\n`;
      code += `${spaces}${varName} = ctk.CTkCheckBox(self, text="${props.text || 'Checkbox'}", width=${width}, height=${height}, variable=${varName}_var, text_color="${props.fgColor || '#000000'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      break;
      
    case 'dropdown':
      const options = props.options || ['Option 1', 'Option 2', 'Option 3'];
      code += `${spaces}${varName} = ctk.CTkOptionMenu(self, values=${JSON.stringify(options).replace(/"/g, "'").replace("[", "[").replace("]", "]")}, width=${width}, height=${height})\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      if (props.defaultValue) {
        code += `${spaces}${varName}.set("${props.defaultValue}")\n`;
      }
      break;
      
    case 'image':
      code += `${spaces}# Load image for ${component.id}\n`;
      code += `${spaces}${varName}_img = self.load_image("path_to_image.png", (${width}, ${height}))\n`;
      code += `${spaces}${varName} = ctk.CTkLabel(self, image=${varName}_img, width=${width}, height=${height}, text="")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      
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
      code += `${spaces}${varName} = ctk.CTkSlider(self, from_=${props.min || 0}, to=${props.max || 100}, width=${width}, height=${height}, number_of_steps=${props.max ? Math.round(props.max - (props.min || 0)) : 100})\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      if (props.value !== undefined) {
        code += `${spaces}${varName}.set(${Math.round(props.value) || 0})\n`;
      }
      break;
      
    case 'frame':
      code += `${spaces}${varName} = ctk.CTkFrame(self, width=${width}, height=${height}, fg_color="${props.bgColor || '#ffffff'}", border_width=${props.borderWidth || 0})\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      break;
      
    case 'progressbar':
      code += `${spaces}${varName} = ctk.CTkProgressBar(self, width=${width}, height=${height}, orientation="horizontal")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      // Ensure proper value calculation for progress bar (between 0 and 1)
      const progressValue = (props.value || 0) / (props.maxValue || 100);
      code += `${spaces}${varName}.set(${Math.min(1, Math.max(0, progressValue))})\n`;
      break;
      
    case 'listbox':
      // CustomTkinter doesn't have a direct listbox equivalent, so we'll create a scrollable frame with labels
      code += `${spaces}# Create a scrollable frame for listbox functionality\n`;
      code += `${spaces}${varName}_frame = ctk.CTkScrollableFrame(self, width=${width}, height=${height}, fg_color="${props.bgColor || '#ffffff'}")\n`;
      code += `${spaces}${varName}_frame.place(x=${x}, y=${y})\n`;
      
      if (props.items) {
        const items = Array.isArray(props.items) ? props.items : props.items.split(',');
        items.forEach((item: string, index: number) => {
          code += `${spaces}${varName}_item${index} = ctk.CTkLabel(${varName}_frame, text="${item.trim()}", text_color="${props.fgColor || '#000000'}", anchor="w")\n`;
          code += `${spaces}${varName}_item${index}.pack(fill="x", padx=5, pady=2)\n`;
        });
      }
      break;
      
    case 'textarea':
      code += `${spaces}${varName} = ctk.CTkTextbox(self, width=${width}, height=${height}, fg_color="${props.bgColor || '#ffffff'}", text_color="${props.fgColor || '#000000'}")\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      if (props.defaultValue) {
        code += `${spaces}${varName}.insert("0.0", "${props.defaultValue}")\n`;
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

## Troubleshooting
If you encounter an error about width and height in the place method, make sure you're using CustomTkinter version 5.2.0 or later.
`;
  zip.file("README.md", readme);

  // Add a sample image file
  zip.file("sample_image.png", await fetchSampleImage(), {binary: true});
  
  // Add a more detailed documentation file
  const documentation = `# CustomTkinter GUI Application Documentation

## Overview
This application was created using the CustomTkinter GUI Builder. It uses the CustomTkinter library, 
which is a modern-looking UI framework for Python based on Tkinter.

## Project Structure
- \`app.py\`: The main application file
- \`requirements.txt\`: Python dependencies
- \`sample_image.png\`: A sample image that can be used in your application

## Customizing the Application
You can modify the application by editing the \`app.py\` file. Here are some common customizations:

### Changing the appearance mode
\`\`\`python
ctk.set_appearance_mode("Dark")  # Options: "System", "Dark", "Light"
\`\`\`

### Changing the color theme
\`\`\`python
ctk.set_default_color_theme("green")  # Options: "blue", "green", "dark-blue"
\`\`\`

### Changing the window size
\`\`\`python
self.geometry("1024x768")
\`\`\`

## Adding Event Handlers
To add functionality to buttons or other widgets, locate the event handler functions in the code and add your logic there.

## Further Resources
- CustomTkinter documentation: https://github.com/TomSchimansky/CustomTkinter/wiki
- Tkinter documentation: https://docs.python.org/3/library/tkinter.html
`;
  zip.file("documentation.md", documentation);
  
  // Generate the ZIP file and download it
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "customtkinter-gui-app.zip");
  
  return true;
};

// Helper function to fetch a sample image
async function fetchSampleImage() {
  try {
    const response = await fetch('/placeholder.svg');
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error fetching sample image:', error);
    // Return a minimal 1x1 transparent PNG as fallback
    return new Blob([
      new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
        0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ])
    ], { type: 'image/png' });
  }
}
