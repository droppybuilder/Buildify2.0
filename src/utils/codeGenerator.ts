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
    switch (component.type) {
      case 'CTkLabel':
        if (props.image) {
          const imagePath = props.image;
          const imageSize = props.image_size || { width: 50, height: 50 };
          code += `
        self.${component.id} = ctk.CTkLabel(self, text="${props.text || ''}", image=self.load_image("${imagePath}", (${imageSize.width}, ${imageSize.height})), compound="${props.compound || 'left'}")
        self.${component.id}.place(x=${props.x}, y=${props.y}, width=${props.width}, height=${props.height})
`;
        } else {
          code += `
        self.${component.id} = ctk.CTkLabel(self, text="${props.text || ''}", width=${props.width}, height=${props.height}, corner_radius=${props.corner_radius}, bg_color="${props.bg_color}", fg_color="${props.fg_color}", text_color="${props.text_color}", font=ctk.CTkFont(size=${props.font_size}))
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        }
        break;
      case 'CTkButton':
        code += `
        self.${component.id} = ctk.CTkButton(self, text="${props.text}", width=${props.width}, height=${props.height}, corner_radius=${props.corner_radius}, bg_color="${props.bg_color}", fg_color="${props.fg_color}", text_color="${props.text_color}", font=ctk.CTkFont(size=${props.font_size}))
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkEntry':
        code += `
        self.${component.id} = ctk.CTkEntry(self, width=${props.width}, height=${props.height}, corner_radius=${props.corner_radius}, bg_color="${props.bg_color}", fg_color="${props.fg_color}", text_color="${props.text_color}", font=ctk.CTkFont(size=${props.font_size}))
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkTextbox':
        code += `
        self.${component.id} = ctk.CTkTextbox(self, width=${props.width}, height=${props.height}, corner_radius=${props.corner_radius}, bg_color="${props.bg_color}", fg_color="${props.fg_color}", text_color="${props.text_color}", font=ctk.CTkFont(size=${props.font_size}) )
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkSlider':
        code += `
        self.${component.id} = ctk.CTkSlider(self, width=${props.width}, height=${props.height})
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkSwitch':
        code += `
        self.${component.id} = ctk.CTkSwitch(self, text="${props.text}")
        self.${component.id}.place(x=${props.x}, y=${props.y})
`;
        break;
      case 'CTkProgressBar':
        code += `
        self.${component.id} = ctk.CTkProgressBar(self, width=${props.width}, height=${props.height})
        self.${component.id}.place(x=${props.x}, y=${props.y})
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
