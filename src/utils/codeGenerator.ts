
import { adjustColor } from './colorUtils';
import {
  generateButtonCode,
  generateLabelCode,
  generateEntryCode,
  generateImageCode,
  generateSliderCode,
  generateCheckboxCode,
  generateOtherComponentCode
} from './componentCodeGenerators';

/**
 * Generates Python code for the entire application based on the provided components and settings.
 * @param components - The components to generate code for.
 * @param isTkinter - Whether to generate Tkinter code or CustomTkinter code.
 * @param appName - The name of the application class.
 * @param windowTitle - The title of the application window.
 * @param includeImageData - Whether to include image data in the generated code.
 * @param customImports - Custom imports to include in the generated code.
 * @param optimizeCode - Whether to optimize the generated code by grouping components by type.
 * @returns The generated code as a string.
 */
export function generateCode(
  components: any[],
  isTkinter: boolean,
  appName: string = "MyGUIApp",
  windowTitle: string = "GUI Application",
  includeImageData: boolean = true,
  customImports: string = "",
  optimizeCode: boolean = true
): string {
  console.log(`generateCode called with isTkinter=${isTkinter}, components=${components.length}`);

  // Generate template code if no components
  if (components.length === 0) {
    return isTkinter ? 
      `import tkinter as tk
from tkinter import ttk
import os
import base64
from io import BytesIO
from PIL import Image, ImageTk
${customImports ? customImports + '\n' : ''}

class ${appName}:
    def __init__(self, root):
        self.root = root
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
        self.images = []  # Keep references to images to prevent garbage collection
        # Setup UI components

if __name__ == "__main__":
    root = tk.Tk()
    app = ${appName}(root)
    root.mainloop()` :
      `import customtkinter as ctk
from PIL import Image, ImageTk
import os
import base64
from io import BytesIO
${customImports ? customImports + '\n' : ''}

class ${appName}:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
        ctk.set_appearance_mode("light")
        ctk.set_default_color_theme("blue")
        self.images = []  # Keep references to images
        self._create_widgets()
        
    def _create_widgets(self):
        # UI Components here
        pass

if __name__ == "__main__":
    app = ${appName}()
    app.root.mainloop()`;
  }

  // Prepare the imports section
  const imports = isTkinter
    ? `import tkinter as tk
from tkinter import ttk
import os
import base64
from io import BytesIO
from PIL import Image, ImageTk
${customImports ? customImports : ''}`
    : `import customtkinter as ctk
from PIL import Image, ImageTk
import os
import base64
from io import BytesIO
${customImports ? customImports : ''}`;

  // Prepare the window setup code
  const setupCode = isTkinter
    ? `class ${appName}:
    def __init__(self, root):
        self.root = root
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
        self.images = []  # Keep references to images
        self.setup_ui()
        
    def setup_ui(self):
        # UI Components
`
    : `class ${appName}:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
        ctk.set_appearance_mode("light")
        ctk.set_default_color_theme("blue")
        self.images = []  # Keep references to images
        self._create_widgets()
        
    def _create_widgets(self):
        # UI Components
`;

  // Generate code for each component
  let componentsCode = '';
  
  if (optimizeCode) {
    // Group components by type for more efficient code
    const groupedComponents = components.reduce((acc: any, comp: any) => {
      if (!acc[comp.type]) {
        acc[comp.type] = [];
      }
      acc[comp.type].push(comp);
      return acc;
    }, {});

    // Generate code for each component type
    for (const type in groupedComponents) {
      componentsCode += `\n        # ${type} components\n`;
      groupedComponents[type].forEach((comp: any) => {
        const code = generateComponentCode(comp, isTkinter);
        componentsCode += `        ${code.replace(/\n/g, '\n        ')}\n`;
      });
    }
  } else {
    // Generate code for each component individually
    components.forEach((comp) => {
      const code = generateComponentCode(comp, isTkinter);
      componentsCode += `\n        # ${comp.type} component\n        ${code.replace(/\n/g, '\n        ')}\n`;
    });
  }

  // Generate the main application code
  const mainCode = isTkinter ?
    `\nif __name__ == "__main__":
    root = tk.Tk()
    app = ${appName}(root)
    root.mainloop()` :
    `\nif __name__ == "__main__":
    app = ${appName}()
    app.root.mainloop()`;

  // Combine all sections
  return `${imports}\n\n${setupCode}${componentsCode}\n${mainCode}`;
}

/**
 * Generates code for a given component based on its type and properties.
 * @param component - The component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
export function generateComponentCode(component: any, isTkinter: boolean): string {
  switch (component.type) {
    case 'button':
      return generateButtonCode(component, isTkinter);
    case 'label':
      return generateLabelCode(component, isTkinter);
    case 'entry':
      return generateEntryCode(component, isTkinter);
    case 'image':
      return generateImageCode(component, isTkinter);
    case 'slider':
      return generateSliderCode(component, isTkinter);
    case 'checkbox':
      return generateCheckboxCode(component, isTkinter);
    default:
      return generateOtherComponentCode(component, isTkinter);
  }
}
