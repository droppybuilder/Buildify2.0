
import { generateComponentCode } from './componentCodeGenerator';

/**
 * Generates the complete Python code for the application
 * @param components The list of components to include in the code
 * @param windowTitle The title for the application window
 */
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
    const indent = '        ';
    components.forEach(component => {
      // Generate code for this component and add it to the main code
      const componentCode = generateComponentCode(component, indent);
      code += componentCode;
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
