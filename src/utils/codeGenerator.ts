
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

  components.forEach(component => {
    const props = component.props || {};
    
    // Common font configuration
    const fontConfig = props.font 
      ? `font=("${props.font}", ${props.fontSize || 12}${props.fontWeight === 'bold' ? ', "bold"' : ''}${props.fontStyle === 'italic' ? ', "italic"' : ''})`
      : 'font=("Arial", 12)';
    
    // For consistency, ensure these properties always have default values
    const borderWidth = props.borderWidth !== undefined ? props.borderWidth : 1;
    const borderColor = props.borderColor || "#e2e8f0";
    const cornerRadius = props.cornerRadius !== undefined ? props.cornerRadius : 8;
    
    switch (component.type) {
      case 'CTkLabel':
        if (props.image) {
          const imagePath = props.image;
          const imageSize = props.image_size || { width: 50, height: 50 };
          code += `
        self.${component.id} = ctk.CTkLabel(self, text="${props.text || ''}", image=self.load_image("${imagePath}", (${imageSize.width}, ${imageSize.height})), compound="${props.compound || 'left'}", ${fontConfig})
        self.${component.id}.place(x=${props.x}, y=${props.y}, width=${props.width}, height=${props.height})
`;
        } else {
          code += `
        self.${component.id} = ctk.CTkLabel(self, text="${props.text || ''}", width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color}", fg_color="${props.fg_color}", text_color="${props.text_color}", ${fontConfig})
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        }
        break;
      case 'CTkButton':
        code += `
        self.${component.id} = ctk.CTkButton(self, text="${props.text}", width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color}", fg_color="${props.fg_color}", text_color="${props.text_color}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkEntry':
        code += `
        self.${component.id} = ctk.CTkEntry(self, width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color}", fg_color="${props.fg_color}", text_color="${props.text_color}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkTextbox':
        code += `
        self.${component.id} = ctk.CTkTextbox(self, width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color}", fg_color="${props.fg_color}", text_color="${props.text_color}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkSlider':
        code += `
        self.${component.id} = ctk.CTkSlider(self, width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, border_width=${borderWidth})
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkSwitch':
        code += `
        self.${component.id} = ctk.CTkSwitch(self, text="${props.text}", ${fontConfig})
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkProgressBar':
        code += `
        self.${component.id} = ctk.CTkProgressBar(self, width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, border_width=${borderWidth})
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'paragraph':
        code += `
        self.${component.id} = ctk.CTkTextbox(self, width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${borderWidth}, border_color="${borderColor}", ${fontConfig})
        self.${component.id}.place(x=${props.x}, y=${props.y})
        self.${component.id}.insert("1.0", """${props.text || 'Paragraph text'}""")
        self.${component.id}.configure(state="disabled")  # Make read-only
`;
        break;
      case 'frame':
        code += `
        self.${component.id} = ctk.CTkFrame(self, width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#f0f0f0'}", fg_color="${props.fg_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}")
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'notebook':
        code += `
        # For a CTk notebook equivalent, we need to create a tabbed view
        self.${component.id}_frame = ctk.CTkFrame(self, width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, bg_color="${props.bg_color || '#f0f0f0'}", fg_color="${props.fg_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}")
        self.${component.id}_frame.place(x=${props.x}, y=${props.y})
        
        # Create tab buttons on top
        self.${component.id}_tabs = []
        tab_titles = "${props.tabs || 'Tab 1,Tab 2,Tab 3'}".split(',')
        tab_width = ${props.width} / len(tab_titles)
        
        for i, tab_title in enumerate(tab_titles):
            tab_btn = ctk.CTkButton(self.${component.id}_frame, text=tab_title.strip(), corner_radius=0, height=30, width=tab_width, ${fontConfig})
            tab_btn.place(x=i*tab_width, y=0)
            self.${component.id}_tabs.append(tab_btn)
            
        # Create content frame below tabs
        self.${component.id}_content = ctk.CTkFrame(self.${component.id}_frame, width=${props.width}, height=${props.height-30}, corner_radius=0, fg_color="${props.fg_color || '#ffffff'}")
        self.${component.id}_content.place(x=0, y=30)
`;
        break;
      case 'listbox':
        code += `
        # Since CustomTkinter doesn't have a native listbox, we'll use a CTkScrollableFrame with labels
        self.${component.id}_frame = ctk.CTkScrollableFrame(self, width=${props.width}, height=${props.height}, corner_radius=${cornerRadius}, fg_color="${props.fg_color || '#ffffff'}", border_width=${borderWidth}, border_color="${borderColor}")
        self.${component.id}_frame.place(x=${props.x}, y=${props.y})
        
        # Add items to the listbox
        items = "${props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5'}".split(',')
        self.${component.id}_items = []
        
        for i, item in enumerate(items):
            item_label = ctk.CTkLabel(self.${component.id}_frame, text=item.strip(), anchor="w", ${fontConfig})
            item_label.pack(fill="x", padx=5, pady=2)
            self.${component.id}_items.append(item_label)
`;
        break;
      case 'canvas':
        code += `
        self.${component.id} = tk.Canvas(self, width=${props.width}, height=${props.height}, bg="${props.bg_color || '#ffffff'}", highlightthickness=${borderWidth}, highlightbackground="${borderColor}")
        self.${component.id}.place(x=${props.x}, y=${props.y})
        
        # Example drawing
        self.${component.id}.create_rectangle(20, 20, 50, 50, fill="#3b82f6")
        self.${component.id}.create_oval(60, 20, 90, 50, fill="#f97316")
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
