
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

  // Add widgets creation INSIDE the __init__ method
  components.forEach(component => {
    const props = component.props || {};
    
    // Ensure x and y coordinates are defined or use defaults
    const xPos = props.x !== undefined ? props.x : 10;
    const yPos = props.y !== undefined ? props.y : 10;
    
    // Fixed: Build proper font configuration with combined weight and style
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
    
    // Sanitize ID for Python by removing dashes and other invalid characters which would cause syntax errors
    const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
    
    switch (component.type) {
      case 'CTkLabel':
        if (props.image) {
          const imagePath = props.image;
          const imageSize = props.image_size || { width: 50, height: 50 };
          code += `
        self.${safeId} = ctk.CTkLabel(self, text="${props.text || ''}", image=self.load_image("${imagePath}", (${imageSize.width}, ${imageSize.height})), compound="${props.compound || 'left'}", ${fontConfig})
        self.${safeId}.place(x=${xPos}, y=${yPos}, width=${props.width || 100}, height=${props.height || 30})
`;
        } else {
          code += `
        self.${safeId} = ctk.CTkLabel(self, text="${props.text || ''}", width=${props.width || 100}, height=${props.height || 30}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", ${fontConfig})
        self.${safeId}.place(x=${xPos}, y=${yPos})
`;
        }
        break;
      case 'CTkButton':
        code += `
        self.${safeId} = ctk.CTkButton(self, text="${props.text || 'Button'}", width=${props.width || 100}, height=${props.height || 30}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#3b82f6'}", text_color="${props.text_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})
        self.${safeId}.place(x=${xPos}, y=${yPos})
`;
        break;
      case 'CTkEntry':
        code += `
        self.${safeId} = ctk.CTkEntry(self, width=${props.width || 100}, height=${props.height || 30}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})
        self.${safeId}.place(x=${xPos}, y=${yPos})
`;
        break;
      case 'CTkTextbox':
        code += `
        self.${safeId} = ctk.CTkTextbox(self, width=${props.width || 100}, height=${props.height || 80}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})
        self.${safeId}.place(x=${xPos}, y=${yPos})
`;
        if (props.text) {
          code += `        self.${safeId}.insert("1.0", """${props.text}""")
`;
        }
        break;
      case 'CTkSlider':
        code += `
        self.${safeId} = ctk.CTkSlider(self, width=${props.width || 160}, height=${props.height || 16}, corner_radius=${cornerRadius}, border_width=${borderWidth}, bg_color="${props.bg_color || '#e2e8f0'}", fg_color="${props.fg_color || '#ffffff'}", progress_color="${props.progressColor || '#3b82f6'}")
        self.${safeId}.place(x=${xPos}, y=${yPos})
`;
        break;
      case 'CTkSwitch':
        code += `
        self.${safeId} = ctk.CTkSwitch(self, text="${props.text || 'Switch'}", ${fontConfig}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#3b82f6'}", progress_color="${props.progressColor || '#3b82f6'}", text_color="${props.text_color || '#000000'}")
        self.${safeId}.place(x=${xPos}, y=${yPos})
`;
        break;
      case 'CTkProgressBar':
        code += `
        self.${safeId} = ctk.CTkProgressBar(self, width=${props.width || 160}, height=${props.height || 16}, corner_radius=${cornerRadius}, border_width=${borderWidth}, bg_color="${props.bg_color || '#e2e8f0'}", fg_color="${props.fg_color || '#ffffff'}", progress_color="${props.progressColor || '#3b82f6'}")
        self.${safeId}.set(${(props.value || 50) / 100})
        self.${safeId}.place(x=${xPos}, y=${yPos})
`;
        break;
      case 'paragraph':
        code += `
        self.${safeId} = ctk.CTkTextbox(self, width=${props.width || 200}, height=${props.height || 100}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})
        self.${safeId}.place(x=${xPos}, y=${yPos})
        self.${safeId}.insert("1.0", """${props.text || 'Paragraph text'}""")
        self.${safeId}.configure(state="disabled")  # Make read-only
`;
        break;
      case 'textbox':
        code += `
        self.${safeId} = ctk.CTkTextbox(self, width=${props.width || 200}, height=${props.height || 100}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})
        self.${safeId}.place(x=${xPos}, y=${yPos})
        ${props.text ? `self.${safeId}.insert("1.0", """${props.text}""")` : ''}
`;
        break;
      case 'frame':
        code += `
        self.${safeId} = ctk.CTkFrame(self, width=${props.width || 200}, height=${props.height || 150}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#f0f0f0'}", fg_color="${props.fg_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}")
        self.${safeId}.place(x=${xPos}, y=${yPos})
`;
        break;
      case 'notebook':
        code += `
        # For a CTk notebook equivalent, we need to create a tabbed view
        self.${safeId}_frame = ctk.CTkFrame(self, width=${props.width || 300}, height=${props.height || 200}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#f0f0f0'}", fg_color="${props.fg_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}")
        self.${safeId}_frame.place(x=${xPos}, y=${yPos})
        
        # Create tab buttons on top
        self.${safeId}_tabs = []
        tab_titles = "${props.tabs || 'Tab 1,Tab 2,Tab 3'}".split(',')
        tab_width = ${props.width || 300} / len(tab_titles)
        
        for i, tab_title in enumerate(tab_titles):
            tab_btn = ctk.CTkButton(self.${safeId}_frame, text=tab_title.strip(), corner_radius=0, height=30, width=tab_width, ${fontConfig}, fg_color="${props.fg_color || '#ffffff'}" if i == 0 else "${props.bg_color || '#f0f0f0'}", text_color="${props.text_color || '#000000'}")
            tab_btn.place(x=i*tab_width, y=0)
            self.${safeId}_tabs.append(tab_btn)
            
        # Create content frame below tabs
        self.${safeId}_content = ctk.CTkFrame(self.${safeId}_frame, width=${props.width || 300}, height=${(props.height || 200)-30}, corner_radius=0, fg_color="${props.fg_color || '#ffffff'}")
        self.${safeId}_content.place(x=0, y=30)
`;
        break;
      case 'listbox':
        code += `
        # Since CustomTkinter doesn't have a native listbox, we'll use a CTkScrollableFrame with labels
        self.${safeId}_frame = ctk.CTkScrollableFrame(self, width=${props.width || 200}, height=${props.height || 150}, corner_radius=${cornerRadius}, fg_color="${props.fg_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}")
        self.${safeId}_frame.place(x=${xPos}, y=${yPos})
        
        # Add items to the listbox
        items = "${props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5'}".split(',')
        self.${safeId}_items = []
        
        for i, item in enumerate(items):
            item_label = ctk.CTkLabel(self.${safeId}_frame, text=item.strip(), anchor="w", ${fontConfig}, text_color="${props.text_color || '#000000'}")
            item_label.pack(fill="x", padx=5, pady=2)
            self.${safeId}_items.append(item_label)
`;
        break;
      case 'canvas':
        code += `
        self.${safeId} = tk.Canvas(self, width=${props.width || 200}, height=${props.height || 150}, bg="${props.bg_color || '#ffffff'}", highlightthickness=${borderWidth}, highlightbackground="${borderColor}")
        self.${safeId}.place(x=${xPos}, y=${yPos})
        
        # Example drawing
        self.${safeId}.create_rectangle(20, 20, 50, 50, fill="#3b82f6")
        self.${safeId}.create_oval(60, 20, 90, 50, fill="#f97316")
`;
        break;
      default:
        break;
    }
  });

  code += `

if __name__ == "__main__":
    app = App()
    app.mainloop()
`;

  return code;
}
