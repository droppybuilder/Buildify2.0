
/**
 * Sanitizes an ID to make it a valid Python variable name
 */
const sanitizeId = (id: string): string => {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
};

/**
 * Groups components by type for more efficient code generation
 */
const optimizeComponents = (components: any[]): Record<string, any[]> => {
  // Group components by type
  const compsByType: Record<string, any[]> = {};
  
  components.forEach(comp => {
    if (!compsByType[comp.type]) {
      compsByType[comp.type] = [];
    }
    compsByType[comp.type].push(comp);
  });
  
  return compsByType;
};

/**
 * Generates Tkinter code from components
 */
const generateTkinterCode = (
  components: any[], 
  appName: string, 
  windowTitle: string, 
  includeImageData: boolean, 
  customImports: string, 
  optimize: boolean
): string => {
  const imports = `import tkinter as tk
from tkinter import ttk
import os
import base64
from io import BytesIO
from PIL import Image, ImageTk
${customImports ? customImports + '\n' : ''}

class ${appName.replace(/\s+/g, '')}:
    def __init__(self, root):
        self.root = root
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
        self.images = []  # Keep references to images to prevent garbage collection
`;

  // Image extraction code if needed
  let imageData = '';
  let imageSetup = '';
  if (includeImageData) {
    const imageComponents = components.filter(comp => comp.type === 'image' && comp.props.src && !comp.props.src.startsWith('/placeholder'));
    
    if (imageComponents.length > 0) {
      imageData = `
    def load_image(self, path=None, data=None, size=None):
        """Load an image from path, data, or use a placeholder"""
        try:
            if data:
                # Load from embedded data
                image = Image.open(BytesIO(base64.b64decode(data)))
            elif path and os.path.exists(path):
                # Load from file
                image = Image.open(path)
            else:
                # Create a placeholder image
                image = Image.new('RGB', size or (100, 100), color='#CCCCCC')
                
            if size:
                image = image.resize(size)
                
            photo_image = ImageTk.PhotoImage(image)
            self.images.append(photo_image)  # Keep a reference
            return photo_image
        except Exception as e:
            print(f"Error loading image: {e}")
            # Return a placeholder on error
            placeholder = Image.new('RGB', size or (100, 100), color='#FF0000')
            if size:
                placeholder = placeholder.resize(size)
            photo_image = ImageTk.PhotoImage(placeholder)
            self.images.append(photo_image)
            return photo_image
        
`;

      // Setup each image component
      imageComponents.forEach((comp, index) => {
        const safeId = sanitizeId(comp.id);
        const imgPath = `os.path.join("images", "image_${index}.png")`;
        const imgSize = `(${Math.round(comp.size.width)}, ${Math.round(comp.size.height)})`;
        
        imageSetup += `
        # Image: ${safeId}
        self.img_${safeId} = self.load_image(path=${imgPath}, size=${imgSize})
        self.image_${safeId} = tk.Label(root, image=self.img_${safeId}, bg="${comp.props.bgColor || '#ffffff'}")
        self.image_${safeId}.place(x=${Math.round(comp.position.x)}, y=${Math.round(comp.position.y)}, width=${Math.round(comp.size.width)}, height=${Math.round(comp.size.height)})
`;
      });
    }
  }

  let setupComponents = '';
  
  if (optimize) {
    // Use optimized grouped components approach
    const compsByType = optimizeComponents(components);
    
    // Generate code for each type separately
    Object.entries(compsByType).forEach(([type, comps]) => {
      // Skip image components if they're handled separately
      if (type === 'image' && includeImageData) {
        const relevantComps = comps.filter(c => !c.props.src || c.props.src.startsWith('/placeholder'));
        if (relevantComps.length === 0) return;
      }
      
      setupComponents += `\n        # Setup ${type} components\n`;
      
      comps.forEach(component => {
        const safeId = sanitizeId(component.id);
        
        // Skip image components if they're handled separately
        if (component.type === 'image' && includeImageData && component.props.src && !component.props.src.startsWith('/placeholder')) {
          return;
        }
        
        switch (component.type) {
          case 'button':
            setupComponents += `        self.button_${safeId} = tk.Button(root, 
            text="${component.props.text}",
            bg="${component.props.bgColor}",
            fg="${component.props.fgColor}",
            activebackground="${component.props.hoverColor || '#f0f0f0'}",
            borderwidth=1,
            relief="solid")
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'label':
            setupComponents += `        self.label_${safeId} = tk.Label(root, 
            text="${component.props.text}",
            fg="${component.props.fgColor}",
            font=("TkDefaultFont", ${component.props.fontSize || 12}),
            anchor="w")
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'entry':
            setupComponents += `        self.entry_${safeId} = tk.Entry(root,
            bg="${component.props.bgColor}",
            borderwidth=1,
            relief="solid")
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'slider':
            setupComponents += `        self.slider_${safeId} = tk.Scale(root,
            from_=${component.props.from || 0},
            to=${component.props.to || 100},
            orient="${component.props.orient === 'vertical' ? 'vertical' : 'horizontal'}",
            background="${component.props.bgColor || '#e2e8f0'}",
            troughcolor="${component.props.troughColor || '#3b82f6'}",
            sliderlength=16,
            showvalue=True)
        self.slider_${safeId}.set(${component.props.value || 50})
        self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'frame':
            setupComponents += `        self.frame_${safeId} = tk.Frame(root,
            bg="${component.props.bgColor || '#ffffff'}",
            borderwidth=${component.props.borderwidth || 1},
            relief="${component.props.relief || 'flat'}")
        self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'checkbox':
            setupComponents += `        self.var_${safeId} = tk.BooleanVar(value=${component.props.checked ? 'True' : 'False'})
        self.checkbox_${safeId} = tk.Checkbutton(root,
            text="${component.props.text}",
            fg="${component.props.fgColor || '#000000'}",
            variable=self.var_${safeId},
            onvalue=True,
            offvalue=False)
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;

          case 'dropdown':
            const options = (component.props.options || 'Option 1,Option 2,Option 3').split(',').map((o: string) => o.trim());
            setupComponents += `        self.var_${safeId} = tk.StringVar(value="${component.props.selected || options[0]}")
        self.dropdown_${safeId} = ttk.Combobox(root,
            values=[${options.map(o => `"${o}"`).join(', ')}],
            textvariable=self.var_${safeId},
            state="readonly")
        self.dropdown_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'image':
            if (!includeImageData || !component.props.src || component.props.src.startsWith('/placeholder')) {
              setupComponents += `        self.image_${safeId} = tk.Label(root, text="Image", bg="light gray")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Note: Add your image file to the same directory and update the code:
        # img = tk.PhotoImage(file="your_image.png")
        # self.image_${safeId}.configure(image=img)
        # self.image_${safeId}.image = img  # Keep a reference\n\n`;
            }
            break;
        }
      });
    });
  } else {
    // Use the standard approach (no optimization)
    setupComponents = components.map(component => {
      const safeId = sanitizeId(component.id);
      
      // Skip image components if they're handled separately
      if (component.type === 'image' && includeImageData && component.props.src && !component.props.src.startsWith('/placeholder')) {
        return '';
      }
      
      switch (component.type) {
        case 'button':
          return `        self.button_${safeId} = tk.Button(root, 
            text="${component.props.text}",
            bg="${component.props.bgColor}",
            fg="${component.props.fgColor}",
            activebackground="${component.props.hoverColor || '#f0f0f0'}",
            borderwidth=1,
            relief="solid")
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'label':
          return `        self.label_${safeId} = tk.Label(root, 
            text="${component.props.text}",
            fg="${component.props.fgColor}",
            font=("TkDefaultFont", ${component.props.fontSize || 12}),
            anchor="w")
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'entry':
          return `        self.entry_${safeId} = tk.Entry(root,
            bg="${component.props.bgColor}",
            borderwidth=1,
            relief="solid")
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'slider':
          return `        self.slider_${safeId} = tk.Scale(root,
            from_=${component.props.from || 0},
            to=${component.props.to || 100},
            orient="${component.props.orient === 'vertical' ? 'vertical' : 'horizontal'}",
            background="${component.props.bgColor || '#e2e8f0'}",
            troughcolor="${component.props.troughColor || '#3b82f6'}",
            sliderlength=16,
            showvalue=True)
        self.slider_${safeId}.set(${component.props.value || 50})
        self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'frame':
          return `        self.frame_${safeId} = tk.Frame(root,
            bg="${component.props.bgColor || '#ffffff'}",
            borderwidth=${component.props.borderwidth || 1},
            relief="${component.props.relief || 'flat'}")
        self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'checkbox':
          return `        self.var_${safeId} = tk.BooleanVar(value=${component.props.checked ? 'True' : 'False'})
        self.checkbox_${safeId} = tk.Checkbutton(root,
            text="${component.props.text}",
            fg="${component.props.fgColor || '#000000'}",
            variable=self.var_${safeId},
            onvalue=True,
            offvalue=False)
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;

        case 'dropdown':
          const options = (component.props.options || 'Option 1,Option 2,Option 3').split(',').map((o: string) => o.trim());
          return `        self.var_${safeId} = tk.StringVar(value="${component.props.selected || options[0]}")
        self.dropdown_${safeId} = ttk.Combobox(root,
            values=[${options.map(o => `"${o}"`).join(', ')}],
            textvariable=self.var_${safeId},
            state="readonly")
        self.dropdown_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'image':
          if (!includeImageData || !component.props.src || component.props.src.startsWith('/placeholder')) {
            return `        self.image_${safeId} = tk.Label(root, text="Image", bg="light gray")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Note: Add your image file to the same directory and update the code:
        # img = tk.PhotoImage(file="your_image.png")
        # self.image_${safeId}.configure(image=img)
        # self.image_${safeId}.image = img  # Keep a reference`;
          }
          return ''; // Already handled in imageSetup
          
        default:
          return '';
      }
    }).join('\n\n');
  }

  const main = `
if __name__ == "__main__":
    root = tk.Tk()
    app = ${appName.replace(/\s+/g, '')}(root)
    root.mainloop()
`;

  const requirements = `"""
Requirements:
- Python 3.6+
- Pillow (PIL)

To install dependencies:
pip install pillow
"""`;

  return requirements + '\n\n' + imports + imageData + '        # Setup UI components\n' + (imageSetup ? imageSetup : '') + setupComponents + main;
};

/**
 * Generates CustomTkinter code from components
 */
const generateCustomTkinterCode = (
  components: any[], 
  appName: string, 
  windowTitle: string, 
  includeImageData: boolean, 
  customImports: string, 
  optimize: boolean
): string => {
  const imports = `import customtkinter as ctk
from PIL import Image
import os
import requests
from io import BytesIO
import urllib.parse
import base64
${customImports ? customImports + '\n' : ''}

class ${appName.replace(/\s+/g, '')}:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("${windowTitle}")
        self.root.geometry("800x600")
        self.images = []  # Keep references to images
        self._create_widgets()
        
    def load_image(self, path=None, data=None, size=None):
        """Load an image from path, data or create a placeholder"""
        try:
            if data:
                # Load from embedded data
                image = Image.open(BytesIO(base64.b64decode(data)))
            elif path and os.path.exists(path):
                # Load from file path
                image = Image.open(path)
            else:
                # Create a placeholder
                image = Image.new('RGB', size or (100, 100), color='#CCCCCC')
                
            if size:
                image = image.resize(size)
                
            return image
        except Exception as e:
            print(f"Error loading image: {e}")
            # Return a placeholder on error
            placeholder = Image.new('RGB', size or (100, 100), color='#FF0000')
            if size:
                placeholder = placeholder.resize(size)
            return placeholder

    def _create_widgets(self):`;

  // Handle images
  let imageSetup = '';
  if (includeImageData) {
    const imageComponents = components.filter(comp => comp.type === 'image' && comp.props.src && !comp.props.src.startsWith('/placeholder'));
    
    imageComponents.forEach((comp, index) => {
      const safeId = sanitizeId(comp.id);
      const imgPath = `os.path.join("images", "image_${index}.png")`;
      const imgSize = `(${Math.round(comp.size.width)}, ${Math.round(comp.size.height)})`;
      
      imageSetup += `
        # Image: ${safeId}
        img_${safeId} = self.load_image(path=${imgPath}, size=${imgSize})
        self.ctk_img_${safeId} = ctk.CTkImage(
            light_image=img_${safeId},
            dark_image=img_${safeId},
            size=${imgSize})
        self.image_${safeId} = ctk.CTkLabel(
            self.root, 
            image=self.ctk_img_${safeId},
            text="")
        self.image_${safeId}.place(x=${Math.round(comp.position.x)}, y=${Math.round(comp.position.y)})
        self.images.append(self.ctk_img_${safeId})  # Keep reference
`;
    });
  }

  let setupComponents = '';
  
  if (optimize) {
    // Use optimized grouped components approach
    const compsByType = optimizeComponents(components);
    
    // Generate code for each type separately
    Object.entries(compsByType).forEach(([type, comps]) => {
      // Skip image components if they're handled separately
      if (type === 'image' && includeImageData) {
        const relevantComps = comps.filter(c => !c.props.src || c.props.src.startsWith('/placeholder'));
        if (relevantComps.length === 0) return;
      }
      
      setupComponents += `\n        # Setup ${type} components\n`;
      
      comps.forEach(component => {
        const safeId = sanitizeId(component.id);
        
        // Skip image components if they're handled separately
        if (component.type === 'image' && includeImageData && component.props.src && !component.props.src.startsWith('/placeholder')) {
          return;
        }
        
        switch (component.type) {
          case 'button':
            setupComponents += `        self.button_${safeId} = ctk.CTkButton(self.root, 
            text="${component.props.text}",
            fg_color="${component.props.bgColor || '#3b82f6'}",
            text_color="${component.props.fgColor || '#ffffff'}",
            hover_color="${component.props.hoverColor || '#2563eb'}",
            border_color="${component.props.borderColor || '#e2e8f0'}",
            corner_radius=${component.props.cornerRadius || 8})
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'image':
            if (!includeImageData || !component.props.src || component.props.src.startsWith('/placeholder')) {
              setupComponents += `        # Placeholder image - replace with your own image
        self.image_${safeId} = ctk.CTkLabel(self.root, text="Image", fg_color="gray70")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            }
            break;

          case 'label':
            setupComponents += `        self.label_${safeId} = ctk.CTkLabel(self.root, 
            text="${component.props.text}",
            text_color="${component.props.fgColor || '#000000'}",
            font=("TkDefaultFont", ${component.props.fontSize || 12}),
            anchor="w")
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'entry':
            setupComponents += `        self.entry_${safeId} = ctk.CTkEntry(self.root,
            fg_color="${component.props.bgColor || '#ffffff'}",
            border_color="${component.props.borderColor || '#e2e8f0'}",
            corner_radius=${component.props.cornerRadius || 8},
            placeholder_text="${component.props.placeholder || ''}")
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'slider':
            setupComponents += `        self.slider_${safeId} = ctk.CTkSlider(self.root,
            from_=${component.props.from || 0},
            to=${component.props.to || 100},
            orientation="${component.props.orient === 'vertical' ? 'vertical' : 'horizontal'}",
            button_color="${component.props.troughColor || '#3b82f6'}",
            button_hover_color="${component.props.troughColor ? adjustColor(component.props.troughColor, -20) : '#2563eb'}",
            progress_color="${component.props.troughColor || '#3b82f6'}")
        self.slider_${safeId}.set(${component.props.value || 50})
        self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'frame':
            setupComponents += `        self.frame_${safeId} = ctk.CTkFrame(self.root,
            fg_color="${component.props.bgColor || '#ffffff'}",
            border_width=${component.props.borderwidth || 1},
            border_color="${component.props.borderColor || '#e2e8f0'}",
            corner_radius=${component.props.cornerRadius || 8})
        self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'checkbox':
            setupComponents += `        self.checkbox_${safeId} = ctk.CTkCheckBox(self.root,
            text="${component.props.text}",
            text_color="${component.props.fgColor || '#000000'}")
        ${component.props.checked ? 'self.checkbox_' + safeId + '.select()' : 'self.checkbox_' + safeId + '.deselect()'}
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
          
          case 'dropdown':
            const options = (component.props.options || 'Option 1,Option 2,Option 3').split(',').map((o: string) => o.trim());
            setupComponents += `        self.dropdown_${safeId} = ctk.CTkOptionMenu(self.root,
            values=[${options.map(o => `"${o}"`).join(', ')}],
            fg_color="${component.props.bgColor || '#ffffff'}",
            text_color="${component.props.fgColor || '#000000'}")
        self.dropdown_${safeId}.set("${component.props.selected || options[0]}")
        self.dropdown_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})\n\n`;
            break;
        }
      });
    });
  } else {
    // Use the standard approach (no optimization)
    setupComponents = components.map(component => {
      const safeId = sanitizeId(component.id);
      
      // Skip image components if they're handled separately
      if (component.type === 'image' && includeImageData && component.props.src && !component.props.src.startsWith('/placeholder')) {
        return '';
      }
      
      switch (component.type) {
        case 'button':
          return `        self.button_${safeId} = ctk.CTkButton(self.root, 
            text="${component.props.text}",
            fg_color="${component.props.bgColor || '#3b82f6'}",
            text_color="${component.props.fgColor || '#ffffff'}",
            hover_color="${component.props.hoverColor || '#2563eb'}",
            border_color="${component.props.borderColor || '#e2e8f0'}",
            corner_radius=${component.props.cornerRadius || 8})
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'label':
          return `        self.label_${safeId} = ctk.CTkLabel(self.root, 
            text="${component.props.text}",
            text_color="${component.props.fgColor || '#000000'}",
            font=("TkDefaultFont", ${component.props.fontSize || 12}),
            anchor="w")
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'entry':
          return `        self.entry_${safeId} = ctk.CTkEntry(self.root,
            fg_color="${component.props.bgColor || '#ffffff'}",
            border_color="${component.props.borderColor || '#e2e8f0'}",
            corner_radius=${component.props.cornerRadius || 8},
            placeholder_text="${component.props.placeholder || ''}")
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'slider':
          return `        self.slider_${safeId} = ctk.CTkSlider(self.root,
            from_=${component.props.from || 0},
            to=${component.props.to || 100},
            orientation="${component.props.orient === 'vertical' ? 'vertical' : 'horizontal'}",
            button_color="${component.props.troughColor || '#3b82f6'}",
            button_hover_color="${component.props.troughColor ? adjustColor(component.props.troughColor, -20) : '#2563eb'}",
            progress_color="${component.props.troughColor || '#3b82f6'}")
        self.slider_${safeId}.set(${component.props.value || 50})
        self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'frame':
          return `        self.frame_${safeId} = ctk.CTkFrame(self.root,
            fg_color="${component.props.bgColor || '#ffffff'}",
            border_width=${component.props.borderwidth || 1},
            border_color="${component.props.borderColor || '#e2e8f0'}",
            corner_radius=${component.props.cornerRadius || 8})
        self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'checkbox':
          return `        self.checkbox_${safeId} = ctk.CTkCheckBox(self.root,
            text="${component.props.text}",
            text_color="${component.props.fgColor || '#000000'}")
        ${component.props.checked ? 'self.checkbox_' + safeId + '.select()' : 'self.checkbox_' + safeId + '.deselect()'}
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'dropdown':
          const options = (component.props.options || 'Option 1,Option 2,Option 3').split(',').map((o: string) => o.trim());
          return `        self.dropdown_${safeId} = ctk.CTkOptionMenu(self.root,
            values=[${options.map(o => `"${o}"`).join(', ')}],
            fg_color="${component.props.bgColor || '#ffffff'}",
            text_color="${component.props.fgColor || '#000000'}")
        self.dropdown_${safeId}.set("${component.props.selected || options[0]}")
        self.dropdown_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'image':
          if (!includeImageData || !component.props.src || component.props.src.startsWith('/placeholder')) {
            return `        # Placeholder image - replace with your own image
        self.image_${safeId} = ctk.CTkLabel(self.root, text="Image", fg_color="gray70")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
          }
          return ''; // Already handled in imageSetup
      }
      
      return '';
    }).join('\n\n');
  }

  const main = `
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = ${appName.replace(/\s+/g, '')}()
    app.run()
`;

  const requirements = `"""
Requirements:
- Python 3.6+
- CustomTkinter
- Pillow (PIL)

To install dependencies:
pip install customtkinter pillow
"""`;

  return requirements + '\n\n' + imports + '        # Setup UI components\n' + (imageSetup ? imageSetup : '') + setupComponents + main;
};

/**
 * Main function to generate code based on components
 */
export const generateCode = (
  components: any[], 
  isTkinter: boolean, 
  appName: string, 
  windowTitle: string, 
  includeImageData: boolean,
  customImports: string,
  optimize: boolean
): string => {
  if (isTkinter) {
    return generateTkinterCode(components, appName, windowTitle, includeImageData, customImports, optimize);
  }
  return generateCustomTkinterCode(components, appName, windowTitle, includeImageData, customImports, optimize);
};
