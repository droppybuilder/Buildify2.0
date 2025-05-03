
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function exportProject(components: any[], windowTitle?: string) {
  try {
    // Create a new JSZip instance
    const zip = new JSZip();
    
    // Generate Python code
    const pythonCode = generatePythonCode(components, windowTitle);
    
    // Add files to the zip
    zip.file("app.py", pythonCode);
    zip.file("requirements.txt", "customtkinter>=5.2.0\nPillow>=9.0.0\n");
    zip.file("README.md", `# CustomTkinter GUI Application

This is a modern CustomTkinter GUI application generated with GUI Builder.

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

## Features
- Modern UI with CustomTkinter
- Responsive layout
- Customizable components
- Cross-platform compatibility (Windows, macOS, Linux)
`);
    
    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });
    
    // Save the zip file
    saveAs(content, "customtkinter-project.zip");
  } catch (error) {
    console.error("Error exporting project:", error);
    throw error;
  }
}

export function generatePythonCode(components: any[], windowTitle = "My CustomTkinter Application"): string {
  // Initialize code with imports and class definition
  let code = `import customtkinter as ctk
import tkinter as tk
from PIL import Image

class App(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("${windowTitle}")
        self.geometry("800x600")
        self.configure(bg="#f0f0f0")

        # Configure grid layout (1x1)
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self._image_references = []
`;

  // Add the load_image method
  code += `
    def load_image(self, path, size):
        try:
            img = Image.open(path)
            img = img.resize(size, Image.LANCZOS)
            image = ctk.CTkImage(light_image=img, dark_image=img, size=size)
            self._image_references.append(image)
            return image
        except Exception as e:
            print(f"Error loading image: {e}")
            return None
`;

  // Process components and add widget creation code within the __init__ method
  if (components && components.length > 0) {
    components.forEach(component => {
      const props = component.props || {};
      
      // Ensure x and y coordinates are defined or use defaults
      const xPos = props.x !== undefined ? props.x : 10;
      const yPos = props.y !== undefined ? props.y : 10;
      
      // Build proper font configuration with combined weight and style
      let fontConfig = '';
      if (props.font || props.fontSize || props.fontWeight || props.fontStyle) {
        const fontFamily = props.font || "Arial";
        const fontSize = props.fontSize || 12;
        
        // Build font options list
        let fontStyles = [];
        
        if (props.fontWeight === 'bold') {
          fontStyles.push('bold');
        }
        
        if (props.fontStyle === 'italic') {
          fontStyles.push('italic');
        }
        
        // Generate the font tuple with proper format
        if (fontStyles.length > 0) {
          fontConfig = `font=("${fontFamily}", ${fontSize}, "${fontStyles.join(' ')}")`;
        } else {
          fontConfig = `font=("${fontFamily}", ${fontSize})`;
        }
      } else {
        fontConfig = 'font=("Arial", 12)';
      }
      
      // For consistency, ensure these properties always have default values
      const borderWidth = props.borderWidth !== undefined ? props.borderWidth : 1;
      const borderColor = props.borderColor || "#e2e8f0";
      const cornerRadius = props.cornerRadius !== undefined ? props.cornerRadius : 8;
      const width = props.width !== undefined ? props.width : 100;
      const height = props.height !== undefined ? props.height : 30;
      
      // Sanitize ID for Python by removing dashes and other invalid characters which would cause syntax errors
      const safeId = component.id ? component.id.replace(/[^a-zA-Z0-9_]/g, '_') : `widget_${Math.floor(Math.random() * 1000000)}`;
      
      // Add indentation for __init__ method
      const indent = '        ';
      
      switch (component.type) {
        case 'CTkLabel':
          if (props.image) {
            const imagePath = props.image;
            const imageSize = props.image_size || { width: 50, height: 50 };
            code += `${indent}self.${safeId} = ctk.CTkLabel(self, text="${props.text || ''}", image=self.load_image("${imagePath}", (${imageSize.width}, ${imageSize.height})), compound="${props.compound || 'left'}", ${fontConfig})\n`;
            code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos}, width=${width}, height=${height})\n`;
          } else {
            code += `${indent}self.${safeId} = ctk.CTkLabel(self, text="${props.text || ''}", width=${width}, height=${height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", ${fontConfig})\n`;
            code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          }
          break;
        case 'CTkButton':
        case 'Button':
          code += `${indent}self.${safeId} = ctk.CTkButton(self, text="${props.text || 'Button'}", width=${width}, height=${height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#3b82f6'}", text_color="${props.text_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          break;
        case 'CTkEntry':
        case 'Entry':
          code += `${indent}self.${safeId} = ctk.CTkEntry(self, width=${width}, height=${height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          break;
        case 'CTkTextbox':
        case 'textbox':
          code += `${indent}self.${safeId} = ctk.CTkTextbox(self, width=${width}, height=${height || 80}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          if (props.text) {
            code += `${indent}self.${safeId}.insert("1.0", """${props.text}""")\n`;
          }
          break;
        case 'CTkSlider':
        case 'Slider':
          code += `${indent}self.${safeId} = ctk.CTkSlider(self, width=${width || 160}, height=${height || 16}, corner_radius=${cornerRadius}, border_width=${borderWidth}, bg_color="${props.bg_color || '#e2e8f0'}", fg_color="${props.fg_color || '#ffffff'}", progress_color="${props.progressColor || '#3b82f6'}")\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          break;
        case 'CTkSwitch':
        case 'Switch':
          code += `${indent}self.${safeId} = ctk.CTkSwitch(self, text="${props.text || 'Switch'}", ${fontConfig}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#3b82f6'}", progress_color="${props.progressColor || '#3b82f6'}", text_color="${props.text_color || '#000000'}")\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          break;
        case 'CTkProgressBar':
        case 'ProgressBar':
          code += `${indent}self.${safeId} = ctk.CTkProgressBar(self, width=${width || 160}, height=${height || 16}, corner_radius=${cornerRadius}, border_width=${borderWidth}, bg_color="${props.bg_color || '#e2e8f0'}", fg_color="${props.fg_color || '#ffffff'}", progress_color="${props.progressColor || '#3b82f6'}")\n`;
          code += `${indent}self.${safeId}.set(${(props.value || 50) / 100})\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          break;
        case 'paragraph':
        case 'Paragraph':
          code += `${indent}self.${safeId} = ctk.CTkTextbox(self, width=${width || 200}, height=${height || 100}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          code += `${indent}self.${safeId}.insert("1.0", """${props.text || 'Paragraph text'}""")\n`;
          code += `${indent}self.${safeId}.configure(state="disabled")  # Make read-only\n`;
          break;
        case 'frame':
        case 'Frame':
          code += `${indent}self.${safeId} = ctk.CTkFrame(self, width=${width || 200}, height=${height || 150}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#f0f0f0'}", fg_color="${props.fg_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}")\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          break;
        case 'checkbox':
        case 'Checkbox':
        case 'CTkCheckBox':
          code += `${indent}self.${safeId} = ctk.CTkCheckBox(self, text="${props.text || 'Checkbox'}", ${fontConfig}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#3b82f6'}", text_color="${props.text_color || '#000000'}")\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          break;
        case 'image':
        case 'Image':
          const imagePath = props.image || "placeholder.png";
          const imageWidth = width || 100;
          const imageHeight = height || 100;
          code += `${indent}# Image setup for ${safeId}\n`;
          code += `${indent}# Make sure to place the image file "${imagePath}" in your project directory\n`;
          code += `${indent}self.img_${safeId} = ctk.CTkImage(light_image=Image.open("${imagePath}"), size=(${imageWidth}, ${imageHeight}))\n`;
          code += `${indent}self.image_label_${safeId} = ctk.CTkLabel(self, image=self.img_${safeId}, text="")\n`;
          code += `${indent}self.image_label_${safeId}.place(x=${xPos}, y=${yPos}, width=${imageWidth}, height=${imageHeight})\n`;
          code += `${indent}# Keep reference to prevent garbage collection\n`;
          code += `${indent}self._image_references.append(self.img_${safeId})\n`;
          break;
        case 'notebook':
          code += `${indent}# For a CTk notebook equivalent, we need to create a tabbed view\n`;
          code += `${indent}self.${safeId}_frame = ctk.CTkFrame(self, width=${width || 300}, height=${height || 200}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#f0f0f0'}", fg_color="${props.fg_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}")\n`;
          code += `${indent}self.${safeId}_frame.place(x=${xPos}, y=${yPos})\n`;
          code += `${indent}\n`;
          code += `${indent}# Create tab buttons on top\n`;
          code += `${indent}self.${safeId}_tabs = []\n`;
          code += `${indent}tab_titles = "${props.tabs || 'Tab 1,Tab 2,Tab 3'}".split(',')\n`;
          code += `${indent}tab_width = ${width || 300} / len(tab_titles)\n`;
          code += `${indent}\n`;
          code += `${indent}for i, tab_title in enumerate(tab_titles):\n`;
          code += `${indent}    tab_btn = ctk.CTkButton(self.${safeId}_frame, text=tab_title.strip(), corner_radius=0, height=30, width=tab_width, ${fontConfig}, fg_color="${props.fg_color || '#ffffff'}" if i == 0 else "${props.bg_color || '#f0f0f0'}", text_color="${props.text_color || '#000000'}")\n`;
          code += `${indent}    tab_btn.place(x=i*tab_width, y=0)\n`;
          code += `${indent}    self.${safeId}_tabs.append(tab_btn)\n`;
          code += `${indent}    \n`;
          code += `${indent}# Create content frame below tabs\n`;
          code += `${indent}self.${safeId}_content = ctk.CTkFrame(self.${safeId}_frame, width=${width || 300}, height=${(height || 200)-30}, corner_radius=0, fg_color="${props.fg_color || '#ffffff'}")\n`;
          code += `${indent}self.${safeId}_content.place(x=0, y=30)\n`;
          break;
        case 'listbox':
          code += `${indent}# Since CustomTkinter doesn't have a native listbox, we'll use a CTkScrollableFrame with labels\n`;
          code += `${indent}self.${safeId}_frame = ctk.CTkScrollableFrame(self, width=${width || 200}, height=${height || 150}, corner_radius=${cornerRadius}, fg_color="${props.fg_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}")\n`;
          code += `${indent}self.${safeId}_frame.place(x=${xPos}, y=${yPos})\n`;
          code += `${indent}\n`;
          code += `${indent}# Add items to the listbox\n`;
          code += `${indent}items = "${props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5'}".split(',')\n`;
          code += `${indent}self.${safeId}_items = []\n`;
          code += `${indent}\n`;
          code += `${indent}for i, item in enumerate(items):\n`;
          code += `${indent}    item_label = ctk.CTkLabel(self.${safeId}_frame, text=item.strip(), anchor="w", ${fontConfig}, text_color="${props.text_color || '#000000'}")\n`;
          code += `${indent}    item_label.pack(fill="x", padx=5, pady=2)\n`;
          code += `${indent}    self.${safeId}_items.append(item_label)\n`;
          break;
        case 'canvas':
          code += `${indent}self.${safeId} = tk.Canvas(self, width=${width || 200}, height=${height || 150}, bg="${props.bg_color || '#ffffff'}", highlightthickness=${borderWidth}, highlightbackground="${borderColor}")\n`;
          code += `${indent}self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          code += `${indent}\n`;
          code += `${indent}# Example drawing\n`;
          code += `${indent}self.${safeId}.create_rectangle(20, 20, 50, 50, fill="#3b82f6")\n`;
          code += `${indent}self.${safeId}.create_oval(60, 20, 90, 50, fill="#f97316")\n`;
          break;
        case 'datepicker':
        case 'DatePicker':
          code += `${indent}# Requires tkcalendar library: pip install tkcalendar\n`;
          code += `${indent}# Add this import at the top: from tkcalendar import DateEntry\n`;
          code += `${indent}try:\n`;
          code += `${indent}    from tkcalendar import DateEntry\n`;
          code += `${indent}    self.${safeId} = DateEntry(self, width=12, background='darkblue', foreground='white', ${fontConfig}, borderwidth=${borderWidth})\n`;
          code += `${indent}    self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          code += `${indent}except ImportError:\n`;
          code += `${indent}    print("tkcalendar not installed. Install with: pip install tkcalendar")\n`;
          code += `${indent}    # Fallback to a label\n`;
          code += `${indent}    self.${safeId} = ctk.CTkLabel(self, text="DatePicker (requires tkcalendar)", ${fontConfig})\n`;
          code += `${indent}    self.${safeId}.place(x=${xPos}, y=${yPos})\n`;
          break;
        default:
          code += `${indent}# Unsupported component type: ${component.type}\n`;
          break;
      }
    });
  }

  // Add main method
  code += `

if __name__ == "__main__":
    app = App()
    app.mainloop()
`;

  return code;
}
