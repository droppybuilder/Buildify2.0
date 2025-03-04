
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
 * @param isTkinter - Kept for backwards compatibility, but will now determine if we use Python UI or Eel
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
  appName: string = "MyEelApp",
  windowTitle: string = "Eel GUI Application",
  includeImageData: boolean = true,
  customImports: string = "",
  optimizeCode: boolean = true
): string {
  console.log(`generateCode called with useEel=${!isTkinter}, components=${components.length}`);

  // Generate template code if no components
  if (components.length === 0) {
    return isTkinter ? 
      // Traditional Python UI (legacy support)
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
      // Eel implementation
      `import eel
import sys
import os
import json
${customImports ? customImports + '\n' : ''}

# Initialize Eel with web directory
eel.init('web')

class ${appName}:
    def __init__(self):
        self.title = "${windowTitle}"
        # Initialize application state
        self.state = {}
        self.setup_callbacks()
    
    def setup_callbacks(self):
        """Register Python functions to be callable from JavaScript"""
        eel.expose(self.handle_event)
    
    def handle_event(self, event_type, data=None):
        """Handle events from the frontend"""
        print(f"Received event: {event_type}, data: {data}")
        return {"status": "success", "message": f"Event {event_type} processed"}
    
    def start(self, dev_mode=False):
        """Start the Eel application"""
        try:
            # Set web app options
            web_app_options = {
                'mode': 'chrome',
                'port': 8080,
                'chromeFlags': ['--disable-http-cache']
            }
            
            # Start the app
            eel.start('index.html', options=web_app_options, block=True)
        except Exception as e:
            print(f"Error starting Eel application: {e}")
            sys.exit(1)

if __name__ == "__main__":
    app = ${appName}()
    app.start(dev_mode=True)`;
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
    : `import eel
import sys
import os
import json
from pathlib import Path
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
    : `# Initialize Eel with web directory
eel.init('web')

class ${appName}:
    def __init__(self):
        self.title = "${windowTitle}"
        # Initialize application state
        self.components = []
        self.setup_callbacks()
        
    def setup_callbacks(self):
        """Register Python functions to be callable from JavaScript"""
        eel.expose(self.handle_component_action)
        eel.expose(self.get_components)
        eel.expose(self.update_component)
        
    def handle_component_action(self, component_id, action, data=None):
        """Handle component actions from the frontend"""
        print(f"Component {component_id}: {action}, data: {data}")
        # Process the action and return result
        return {"status": "success", "message": f"Action {action} processed for component {component_id}"}
    
    def get_components(self):
        """Return components data to JavaScript"""
        return self.components
        
    def update_component(self, component_id, properties):
        """Update component properties"""
        for component in self.components:
            if component["id"] == component_id:
                component.update(properties)
                return {"status": "success"}
        return {"status": "error", "message": "Component not found"}
    
    def register_components(self):
        """Register components for the UI"""
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
    if (isTkinter) {
      // Traditional Python UI code generation
      for (const type in groupedComponents) {
        componentsCode += `\n        # ${type} components\n`;
        groupedComponents[type].forEach((comp: any) => {
          const code = generateComponentCode(comp, isTkinter);
          componentsCode += `        ${code.replace(/\n/g, '\n        ')}\n`;
        });
      }
    } else {
      // Eel component registration
      componentsCode = `    def register_components(self):\n        """Register components for the UI"""\n`;
      componentsCode += `        self.components = [\n`;
      
      // Add each component as a Python dictionary
      components.forEach((comp, index) => {
        componentsCode += `            {\n`;
        componentsCode += `                "id": "${comp.id}",\n`;
        componentsCode += `                "type": "${comp.type}",\n`;
        componentsCode += `                "position": {"x": ${Math.round(comp.position.x)}, "y": ${Math.round(comp.position.y)}},\n`;
        componentsCode += `                "size": {"width": ${Math.round(comp.size.width)}, "height": ${Math.round(comp.size.height)}},\n`;
        componentsCode += `                "props": ${JSON.stringify(comp.props || {}).replace(/"/g, "'")}\n`;
        componentsCode += `            }${index < components.length - 1 ? ',' : ''}\n`;
      });
      
      componentsCode += `        ]\n`;
      
      // Add JavaScript code samples in comments
      componentsCode += `\n        # Example JavaScript for accessing components:\n`;
      componentsCode += `        # async function getComponents() {\n`;
      componentsCode += `        #     const components = await eel.get_components()();\n`;
      componentsCode += `        #     renderComponents(components);\n`;
      componentsCode += `        # }\n`;
    }
  } else {
    // Generate code for each component individually
    if (isTkinter) {
      components.forEach((comp) => {
        const code = generateComponentCode(comp, isTkinter);
        componentsCode += `\n        # ${comp.type} component\n        ${code.replace(/\n/g, '\n        ')}\n`;
      });
    } else {
      // Eel component registration - similar to optimized code but without grouping
      componentsCode = `    def register_components(self):\n        """Register components for the UI"""\n`;
      componentsCode += `        self.components = [\n`;
      
      components.forEach((comp, index) => {
        componentsCode += `            {\n`;
        componentsCode += `                "id": "${comp.id}",\n`;
        componentsCode += `                "type": "${comp.type}",\n`;
        componentsCode += `                "position": {"x": ${Math.round(comp.position.x)}, "y": ${Math.round(comp.position.y)}},\n`;
        componentsCode += `                "size": {"width": ${Math.round(comp.size.width)}, "height": ${Math.round(comp.size.height)}},\n`;
        componentsCode += `                "props": ${JSON.stringify(comp.props || {}).replace(/"/g, "'")}\n`;
        componentsCode += `            }${index < components.length - 1 ? ',' : ''}\n`;
      });
      
      componentsCode += `        ]\n`;
    }
  }

  // Generate the main application code
  const mainCode = isTkinter ?
    `\nif __name__ == "__main__":
    root = tk.Tk()
    app = ${appName}(root)
    root.mainloop()` :
    `    def start(self, dev_mode=False):
        """Start the Eel application"""
        try:
            # Register components
            self.register_components()
            
            # Set web app options
            web_app_options = {
                'mode': 'chrome',
                'port': 8080,
                'chromeFlags': ['--disable-http-cache']
            }
            
            # Start the app
            eel.start('index.html', options=web_app_options, block=True)
        except Exception as e:
            print(f"Error starting Eel application: {e}")
            sys.exit(1)

if __name__ == "__main__":
    app = ${appName}()
    app.start(dev_mode=True)`;

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
