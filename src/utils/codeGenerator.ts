
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
        
        # Store references to images to prevent garbage collection
        self._image_references = []
    
    def load_image(self, path, size):
        """Helper function to load images with proper error handling"""
        try:
            # Handle both absolute and relative paths
            if os.path.isabs(path):
                img_path = path
            else:
                # Get the directory where the script is located
                script_dir = os.path.dirname(os.path.abspath(__file__))
                img_path = os.path.join(script_dir, path)
            
            if not os.path.exists(img_path):
                print(f"Warning: Image file {img_path} not found")
                return None
                
            img = Image.open(img_path)
            img = img.resize(size, Image.Resampling.LANCZOS)
            photo = ImageTk.PhotoImage(img)
            # Keep a reference to prevent garbage collection
            self._image_references.append(photo)
            return photo
        except Exception as e:
            print(f"Error loading image {path}: {e}")
            return None
        
    def create_widgets(self):
`;

  // Check if we have any image components
  const hasImages = components.some(comp => comp.type === 'image');
  
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
  const props = component.props || {};
  
  // Component specific code
  switch (component.type) {
    case 'button':
      code += `${spaces}${varName} = ctk.CTkButton(self, text="${props.text || 'Button'}", width=${width}, height=${height}`;
      
      // Add colors (with fallbacks)
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      if (props.fgColor) {
        code += `, text_color="${props.fgColor}"`;
      }
      
      // Add hover color if provided
      if (props.hoverColor) {
        code += `, hover_color="${props.hoverColor}"`;
      }
      
      // Add border width and color if provided
      if (props.borderWidth !== undefined) {
        code += `, border_width=${props.borderWidth}`;
      }
      
      if (props.borderColor) {
        code += `, border_color="${props.borderColor}"`;
      }
      
      // Add corner radius if provided
      if (props.cornerRadius !== undefined) {
        code += `, corner_radius=${props.cornerRadius}`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      if (props.onClick) {
        code += `${spaces}${varName}.configure(command=self.${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}_click)\n`;
        code += `\n${spaces}def ${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}_click(self):\n`;
        code += `${spaces}    print("${component.id.replace(/[^a-zA-Z0-9_]/g, '_')} clicked")\n`;
      }
      break;
      
    case 'label':
      code += `${spaces}${varName} = ctk.CTkLabel(self, text="${props.text || 'Label'}", width=${width}, height=${height}`;
      
      // Add colors
      if (props.fgColor) {
        code += `, text_color="${props.fgColor}"`;
      }
      
      // Add corner radius and bg color if provided
      if (props.cornerRadius !== undefined) {
        code += `, corner_radius=${props.cornerRadius}`;
      }
      
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      break;
      
    case 'textbox':
    case 'entry':
    case 'textarea':
      const isMultiline = component.type === 'textarea' || component.type === 'textbox';
      const entryClass = isMultiline ? 'CTkTextbox' : 'CTkEntry';
      
      code += `${spaces}${varName} = ctk.${entryClass}(self, width=${width}, height=${height}`;
      
      // Add colors
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      if (props.fgColor) {
        code += `, text_color="${props.fgColor}"`;
      }
      
      // Add border width and color if provided
      if (props.borderWidth !== undefined) {
        code += `, border_width=${props.borderWidth}`;
      }
      
      if (props.borderColor) {
        code += `, border_color="${props.borderColor}"`;
      }
      
      // Add corner radius if provided
      if (props.cornerRadius !== undefined) {
        code += `, corner_radius=${props.cornerRadius}`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      if (props.placeholder && !isMultiline) {
        code += `${spaces}${varName}.insert(0, "${props.placeholder}")\n`;
      } else if (props.defaultValue && isMultiline) {
        code += `${spaces}${varName}.insert("0.0", "${props.defaultValue}")\n`;
      }
      break;
      
    case 'checkbox':
      code += `${spaces}${varName}_var = ctk.BooleanVar(value=${props.checked ? 'True' : 'False'})\n`;
      code += `${spaces}${varName} = ctk.CTkCheckBox(self, text="${props.text || 'Checkbox'}", width=${width}, height=${height}, variable=${varName}_var`;
      
      // Add colors
      if (props.fgColor) {
        code += `, text_color="${props.fgColor}"`;
      }
      
      // Add border width and color if provided
      if (props.borderWidth !== undefined) {
        code += `, border_width=${props.borderWidth}`;
      }
      
      if (props.borderColor) {
        code += `, border_color="${props.borderColor}"`;
      }
      
      // Add checked color if provided
      if (props.checkedColor) {
        code += `, fg_color="${props.checkedColor}", hover_color="${props.checkedColor}"`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      break;
      
    case 'dropdown':
      const options = props.options || ['Option 1', 'Option 2', 'Option 3'];
      code += `${spaces}${varName} = ctk.CTkOptionMenu(self, values=${JSON.stringify(options).replace(/"/g, "'").replace("[", "[").replace("]", "]")}, width=${width}, height=${height}`;
      
      // Add colors if provided
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      if (props.buttonColor) {
        code += `, button_color="${props.buttonColor}"`;
      }
      
      if (props.fgColor) {
        code += `, text_color="${props.fgColor}"`;
      }
      
      // Add border properties
      if (props.borderWidth !== undefined) {
        code += `, border_width=${props.borderWidth}`;
      }
      
      if (props.borderColor) {
        code += `, border_color="${props.borderColor}"`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      if (props.defaultValue) {
        code += `${spaces}${varName}.set("${props.defaultValue}")\n`;
      }
      break;
      
    case 'image':
      // For image widget, we need to include the actual image in the export
      const imageName = `${component.id.replace(/[^a-zA-Z0-9_]/g, '_')}.png`;
      code += `${spaces}# Load image for ${component.id}\n`;
      code += `${spaces}${varName}_img = self.load_image("${imageName}", (${width}, ${height}))\n`;
      
      // Use a CTkLabel for images but WITHOUT border_width and border_color since they're not supported
      code += `${spaces}${varName} = ctk.CTkLabel(self, image=${varName}_img, width=${width}, height=${height}, text=""`;
      
      // Only add supported properties
      if (props.cornerRadius !== undefined) {
        code += `, corner_radius=${props.cornerRadius}`;
      }
      
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      break;
      
    case 'slider':
      code += `${spaces}${varName} = ctk.CTkSlider(self, from_=${props.from || 0}, to=${props.to || 100}, width=${width}, height=${height}`;
      
      // Add colors if provided
      if (props.progressColor) {
        code += `, progress_color="${props.progressColor}"`;
      }
      
      if (props.buttonColor) {
        code += `, button_color="${props.buttonColor}"`;
      }
      
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      // Add border properties
      if (props.borderWidth !== undefined) {
        code += `, border_width=${props.borderWidth}`;
      }
      
      if (props.borderColor) {
        code += `, border_color="${props.borderColor}"`;
      }
      
      // Add orientation if vertical
      if (props.orient === 'vertical') {
        code += `, orientation="vertical"`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      if (props.value !== undefined) {
        code += `${spaces}${varName}.set(${Math.round(props.value) || 0})\n`;
      }
      break;
      
    case 'frame':
      code += `${spaces}${varName} = ctk.CTkFrame(self, width=${width}, height=${height}`;
      
      // Add colors
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      // Add border properties
      if (props.borderWidth !== undefined) {
        code += `, border_width=${props.borderWidth}`;
      }
      
      if (props.borderColor) {
        code += `, border_color="${props.borderColor}"`;
      }
      
      // Add corner radius if provided
      if (props.cornerRadius !== undefined) {
        code += `, corner_radius=${props.cornerRadius}`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      break;
      
    case 'progressbar':
      code += `${spaces}${varName} = ctk.CTkProgressBar(self, width=${width}, height=${height}, orientation="horizontal"`;
      
      // Add colors if provided
      if (props.progressColor) {
        code += `, progress_color="${props.progressColor}"`;
      }
      
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      // Add corner radius if provided
      if (props.cornerRadius !== undefined) {
        code += `, corner_radius=${props.cornerRadius}`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      // Ensure proper value calculation for progress bar (between 0 and 1)
      const progressValue = (props.value || 0) / (props.maxValue || 100);
      code += `${spaces}${varName}.set(${Math.min(1, Math.max(0, progressValue)).toFixed(2)})\n`;
      break;
      
    case 'listbox':
      // CustomTkinter doesn't have a direct listbox equivalent, so we'll create a scrollable frame with labels
      code += `${spaces}# Create a scrollable frame for listbox functionality\n`;
      code += `${spaces}${varName}_frame = ctk.CTkScrollableFrame(self, width=${width}, height=${height}`;
      
      // Add colors
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      // Add border properties
      if (props.borderWidth !== undefined) {
        code += `, border_width=${props.borderWidth}`;
      }
      
      if (props.borderColor) {
        code += `, border_color="${props.borderColor}"`;
      }
      
      // Add corner radius if provided
      if (props.cornerRadius !== undefined) {
        code += `, corner_radius=${props.cornerRadius}`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}_frame.place(x=${x}, y=${y})\n`;
      
      if (props.items) {
        const items = Array.isArray(props.items) ? props.items : props.items.split(',');
        items.forEach((item: string, index: number) => {
          code += `${spaces}${varName}_item${index} = ctk.CTkLabel(${varName}_frame, text="${item.trim()}"`;
          
          // Add text color
          if (props.fgColor) {
            code += `, text_color="${props.fgColor}"`;
          }
          
          // Add selected color if it's the first item (just for demonstration)
          if (index === 0 && props.selectedColor) {
            code += `, fg_color="${props.selectedColor}"`;
          }
          
          code += `, anchor="w")\n`;
          code += `${spaces}${varName}_item${index}.pack(fill="x", padx=5, pady=2)\n`;
        });
      }
      break;
      
    case 'notebook':
      // CustomTkinter has TabView for notebook-like functionality
      code += `${spaces}${varName} = ctk.CTkTabview(self, width=${width}, height=${height}`;
      
      // Add colors if provided
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      if (props.tabColor) {
        code += `, segmented_button_fg_color="${props.tabColor}"`;
      }
      
      if (props.activeTabColor) {
        code += `, segmented_button_selected_color="${props.activeTabColor}"`;
      }
      
      // Add border properties
      if (props.borderWidth !== undefined) {
        code += `, border_width=${props.borderWidth}`;
      }
      
      if (props.borderColor) {
        code += `, border_color="${props.borderColor}"`;
      }
      
      // Add corner radius if provided
      if (props.cornerRadius !== undefined) {
        code += `, corner_radius=${props.cornerRadius}`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      
      // Create tabs
      if (props.tabs) {
        const tabs = Array.isArray(props.tabs) ? props.tabs : props.tabs.split(',');
        tabs.forEach((tab: string) => {
          const tabName = tab.trim();
          code += `${spaces}${varName}.add("${tabName}")\n`;
        });
        
        // Set initial tab
        if (props.selectedTab) {
          code += `${spaces}${varName}.set("${props.selectedTab}")\n`;
        }
      }
      break;
      
    case 'datepicker':
      // CustomTkinter doesn't have a built-in date picker, so we'll simulate it with an entry
      code += `${spaces}${varName} = ctk.CTkEntry(self, width=${width}, height=${height}`;
      
      // Add colors if provided
      if (props.bgColor) {
        code += `, fg_color="${props.bgColor}"`;
      }
      
      if (props.fgColor) {
        code += `, text_color="${props.fgColor}"`;
      }
      
      // Add border properties
      if (props.borderWidth !== undefined) {
        code += `, border_width=${props.borderWidth}`;
      }
      
      if (props.borderColor) {
        code += `, border_color="${props.borderColor}"`;
      }
      
      // Add corner radius if provided
      if (props.cornerRadius !== undefined) {
        code += `, corner_radius=${props.cornerRadius}`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
      code += `${spaces}${varName}.insert(0, "${props.format || 'yyyy-mm-dd'}")\n`;
      break;
      
    case 'canvas':
      code += `${spaces}${varName} = ctk.CTkCanvas(self, width=${width}, height=${height}`;
      
      // Add background color if provided
      if (props.bgColor) {
        code += `, bg="${props.bgColor}"`;
      }
      
      code += `)\n`;
      code += `${spaces}${varName}.place(x=${x}, y=${y})\n`;
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
  
  // Create a README.md file with clear instructions
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

## Important Note
Make sure all image files are in the same directory as app.py before running the application.

## Features
- Modern UI with CustomTkinter
- Responsive layout
- Customizable components
- Cross-platform compatibility (Windows, macOS, Linux)

## Troubleshooting
If you encounter errors:
1. Ensure all image files are in the same directory as app.py
2. Make sure you have CustomTkinter version 5.2.0 or later installed
3. Check that Python 3.7 or later is installed
4. For missing modules, run: \`pip install -r requirements.txt\`
5. For "unsupported arguments" errors, check the CustomTkinter documentation for supported properties
`;
  zip.file("README.md", readme);

  // Save images from components with type 'image'
  const imageComponents = components.filter(comp => comp.type === 'image');
  
  for (const imageComp of imageComponents) {
    const props = imageComp.props || {};
    if (props.src) {
      try {
        // Try to fetch the image if it's a URL or local file path
        let imageBlob = null;
        
        if (props.src.startsWith('http') || props.src.startsWith('/') || props.src.startsWith('blob:')) {
          try {
            const response = await fetch(props.src);
            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }
            imageBlob = await response.blob();
          } catch (error) {
            console.error('Error fetching image:', error);
            imageBlob = await fetchSampleImage();
          }
        } else {
          // Handle data URLs or other formats
          try {
            // Convert data URL to blob if needed
            if (props.src.startsWith('data:')) {
              const response = await fetch(props.src);
              imageBlob = await response.blob();
            } else {
              imageBlob = await fetchSampleImage();
            }
          } catch (error) {
            console.error('Error processing image data URL:', error);
            imageBlob = await fetchSampleImage();
          }
        }
        
        // Save the image with the component's ID as the filename
        const imageName = `${imageComp.id.replace(/[^a-zA-Z0-9_]/g, '_')}.png`;
        zip.file(imageName, imageBlob, {binary: true});
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  }
  
  // Add a sample image file as backup
  zip.file("sample_image.png", await fetchSampleImage(), {binary: true});
  
  // Add a more detailed documentation file with troubleshooting info
  const documentation = `# CustomTkinter GUI Application Documentation

## Overview
This application was created using the CustomTkinter GUI Builder. It uses the CustomTkinter library, 
which is a modern-looking UI framework for Python based on Tkinter.

## Project Structure
- \`app.py\`: The main application file
- \`requirements.txt\`: Python dependencies
- \`*.png\`: Image files used in your application

## Common Issues and Solutions

### "load_image" attribute error
If you see: "AttributeError: '_tkinter.tkapp' object has no attribute 'load_image'", make sure:
- You have not modified the Application class (the load_image method must be defined exactly as provided)
- All image files are in the same directory as app.py

### "Unsupported arguments" error
If you see an error like "['border_width', 'border_color'] are not supported arguments":
- Some CustomTkinter widgets don't support certain properties (like CTkLabel doesn't support border_width)
- Remove or change the unsupported properties
- Check the CustomTkinter documentation for the supported properties for each widget

### Other common issues:
1. **Image file not found**: Ensure all .png files are in the same directory as app.py
2. **Module not found**: Run \`pip install -r requirements.txt\`
3. **Display issues**: CustomTkinter works best with Python 3.7+ and recent operating systems

## Working with CustomTkinter
CustomTkinter is a modern UI library that enhances the standard Tkinter with modern styling and widgets.

### Key differences from standard Tkinter:
1. Widget styling is done through parameters like fg_color, text_color, etc.
2. Width and height must be provided in the constructor, not in place/pack/grid methods
3. More modern widgets like CTkTabview, CTkScrollableFrame are available
4. Better support for themes and appearance modes

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
