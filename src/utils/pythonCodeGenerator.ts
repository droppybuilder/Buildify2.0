
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
from PIL import Image, ImageTk
import os
from datetime import datetime
import sys

class App(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Set appearance mode and default color theme
        ctk.set_appearance_mode("system")  # Options: "light", "dark", "system"
        ctk.set_default_color_theme("blue")  # Options: "blue", "green", "dark-blue"

        self.title("${windowTitle}")
        self.geometry("800x600")
        
        # Set background color
        self.configure(fg_color="#1A1A1A")  # Dark background to match web preview

        # Configure grid layout (4x4) for better responsiveness
        self.grid_columnconfigure((0, 1, 2, 3), weight=1)
        self.grid_rowconfigure((0, 1, 2, 3), weight=1)

        # Store references to images to prevent garbage collection
        self._image_references = []
        
        # Create all widgets and components
`;

  // Define the load_image method separately - this is a critical fix to prevent the blank window
  code += `        # Initialize all widgets
        self.create_widgets()
        
    def create_widgets(self):
        """Create and place all widgets"""
`;

  // Process components and add widget creation code within the create_widgets method
  if (components && components.length > 0) {
    components.forEach(component => {
      // Only include visible components
      if (component.visible !== false) {
        // Generate code for this component and add it to the main code
        const componentCode = generateComponentCode(component, '        ');
        code += componentCode;
      }
    });
  }

  // Add the load_image method as a separate method in the class
  code += `
    def _load_image(self, path, size):
        """Load an image, resize it and return as CTkImage"""
        try:
            if os.path.exists(path):
                img = Image.open(path)
                img = img.resize(size, Image.Resampling.LANCZOS)
                ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=size)
                self._image_references.append(ctk_img)  # Keep reference
                return ctk_img
            else:
                print(f"Image file not found: {path}")
                # Create a placeholder colored rectangle
                img = Image.new('RGB', size, color='#3B82F6')  # Blue color as placeholder
                ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=size)
                self._image_references.append(ctk_img)
                return ctk_img
        except Exception as e:
            print(f"Error loading image '{path}': {e}")
            # Create a placeholder colored rectangle with error indication
            img = Image.new('RGB', size, color='#FF5555')  # Red color for error
            ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=size)
            self._image_references.append(ctk_img)
            return ctk_img
            
    # Property to access the load_image method
    @property
    def load_image(self):
        return self._load_image
`;

  // Add main method
  code += `

if __name__ == "__main__":
    app = App()
    app.mainloop()
`;

  return code;
}
