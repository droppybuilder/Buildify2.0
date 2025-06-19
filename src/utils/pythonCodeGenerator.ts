import { generateComponentCode } from './componentCodeGenerator'

interface WindowSettings {
   title: string;
   size: { width: number; height: number };
   bgColor: string;
   appearanceMode?: string;
}

/**
 * Generates the complete Python code for the application
 * @param components The list of components to include in the code
 * @param windowSettings The window settings object containing title, size, bgColor, and appearanceMode
 */
export function generatePythonCode(
   components: any[], 
   windowSettings: WindowSettings = { 
      title: 'My CustomTkinter Application', 
      size: { width: 800, height: 600 }, 
      bgColor: '#1A1A1A',
      appearanceMode: 'system'
   }
): string {
   // Initialize code with imports and class definition
   let code = `import customtkinter as ctk
import tkinter as tk
from PIL import Image, ImageTk
import os
import sys
from pathlib import Path

class App(ctk.CTk):
    def __init__(self):
        super().__init__()        # Set appearance mode and default color theme
        ctk.set_appearance_mode("${windowSettings.appearanceMode || 'system'}")  # Options: "light", "dark", "system"
        ctk.set_default_color_theme("blue")  # Options: "blue", "green", "dark-blue"

        self.title("${windowSettings.title}")
        self.geometry("${windowSettings.size.width}x${windowSettings.size.height}")
        
        # Set background color
        self.configure(fg_color="${windowSettings.bgColor}")  # Dynamic background color

        # Configure grid layout (4x4) for better responsiveness
        self.grid_columnconfigure((0, 1, 2, 3), weight=1)
        self.grid_rowconfigure((0, 1, 2, 3), weight=1)

        # Create assets directory if it doesn't exist
        assets_dir = Path("assets")
        assets_dir.mkdir(exist_ok=True)

        # Store references to images to prevent garbage collection
        self._image_references = []
        
        # Create all widgets and components
        self.create_widgets()
        
    def create_widgets(self):
        """Create and place all widgets"""
`

   // Process components and add widget creation code within the create_widgets method
   if (components && components.length > 0) {
      components.forEach((component) => {
         // Only include visible components
         if (component.visible !== false) {
            // Generate code for this component and add it to the main code
            const componentCode = generateComponentCode(component, '        ')
            code += componentCode
         }
      })
   }

   // Add the load_image method as a separate method in the class with improved error handling
   code += `
    def load_image(self, path, size):
        """Load an image, resize it and return as CTkImage"""
        try:
            # Handle path as string or Path object
            path_str = str(path)
            
            # Check if image file exists
            if os.path.exists(path_str):
                img = Image.open(path_str)
                img = img.resize(size, Image.LANCZOS if hasattr(Image, 'LANCZOS') else Image.ANTIALIAS)
                ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=size)
                self._image_references.append(ctk_img)  # Keep reference
                return ctk_img
            else:
                print(f"Image file not found: {path_str}")
                # Use placeholder image
                placeholder_path = "assets/placeholder.png"
                if os.path.exists(placeholder_path):
                    img = Image.open(placeholder_path)
                    img = img.resize(size, Image.LANCZOS if hasattr(Image, 'LANCZOS') else Image.ANTIALIAS)
                    ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=size)
                    self._image_references.append(ctk_img)
                    return ctk_img
                else:
                    # Create a fallback colored rectangle
                    img = Image.new('RGB', size, color='#3B82F6')  # Blue color as placeholder
                    ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=size)
                    self._image_references.append(ctk_img)
                    return ctk_img
        except Exception as e:
            print(f"Error loading image '{path}': {e}")
            # Create a colored rectangle with error indication
            try:
                img = Image.new('RGB', size, color='#FF5555')  # Red color for error
                ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=size)
                self._image_references.append(ctk_img)
                return ctk_img
            except Exception as e2:
                print(f"Failed to create error placeholder: {e2}")
                # Last resort - return None and let CustomTkinter handle it
                return None
`

   // Add main method with error handling
   code += `

if __name__ == "__main__":
    try:
        app = App()
        app.mainloop()
    except Exception as e:
        print(f"Error running application: {e}")
        import traceback
        traceback.print_exc()
`

   return code
}
