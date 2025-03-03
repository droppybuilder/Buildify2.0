// Import the adjustColor function from colorUtils
import { adjustColor } from './colorUtils';

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
  appName: string,
  windowTitle: string,
  includeImageData: boolean,
  customImports: string,
  optimizeCode: boolean
): string {
  // Prepare the imports section
  const imports = isTkinter
    ? `import tkinter as tk
from tkinter import font as tkFont
from PIL import Image, ImageTk
${customImports ? customImports : ''}`
    : `import customtkinter as ctk
from PIL import Image, ImageTk
${customImports ? customImports : ''}`;

  // Prepare the window setup code
  const setupCode = isTkinter
    ? `class ${appName}(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("${windowTitle}")
        self.geometry("800x600")
        self.configure(bg="#f0f0f0")
        self.setup_ui()
        
    def setup_ui(self):
        # UI Components
`
    : `class ${appName}(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("${windowTitle}")
        self.geometry("800x600")
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")
        self.setup_ui()
        
    def setup_ui(self):
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
      groupedComponents[type].forEach((comp: any, index: number) => {
        const code = generateComponentCode(comp, isTkinter);
        componentsCode += `        ${code.replace(/\n/g, '\n        ')}`;
      });
    }
  } else {
    // Generate code for each component individually
    components.forEach((comp, index) => {
      const code = generateComponentCode(comp, isTkinter);
      componentsCode += `\n        # ${comp.type} component\n        ${code.replace(/\n/g, '\n        ')}`;
    });
  }

  // Generate the main application code
  const mainCode = `\nif __name__ == "__main__":
    app = ${appName}()
    app.mainloop()`;

  // Combine all sections
  return `${imports}\n\n${setupCode}${componentsCode}\n${mainCode}`;
}

/**
 * Generates code for a given component based on its type and properties.
 * @param component - The component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateComponentCode(component: any, isTkinter: boolean): string {
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
    case 'datepicker':
      return generateDatePickerCode(component, isTkinter);
    case 'progressbar':
      return generateProgressBarCode(component, isTkinter);
    case 'frame':
      return generateFrameCode(component, isTkinter);
    case 'notebook':
      return generateNotebookCode(component, isTkinter);
    case 'listbox':
      return generateListboxCode(component, isTkinter);
    case 'canvas':
      return generateCanvasCode(component, isTkinter);
    default:
      return '# Unsupported component type';
  }
}

/**
 * Generates code for a Tkinter or HTML button component.
 * @param component - The button component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateButtonCode(component: any, isTkinter: boolean): string {
  const { text, backgroundColor, textColor, width, height, x, y, padding } = component;
  const adjustedBackgroundColor = adjustColor(backgroundColor, -10);

  if (isTkinter) {
    return `
button = tk.Button(root, text="${text}", bg="${backgroundColor}", fg="${textColor}", width=${width}, height=${height})
button.place(x=${x}, y=${y})
`;
  } else {
    return `
<button style={{
  backgroundColor: '${backgroundColor}',
  color: '${textColor}',
  width: '${width}px',
  height: '${height}px',
  position: 'absolute',
  left: '${x}px',
  top: '${y}px',
  padding: '${padding}px',
  transition: 'background-color 0.3s ease',
  ':hover': {
    backgroundColor: '${adjustedBackgroundColor}',
  }
}}>${text}</button>
`;
  }
}

/**
 * Generates code for a Tkinter or HTML label component.
 * @param component - The label component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateLabelCode(component: any, isTkinter: boolean): string {
  const { text, textColor, backgroundColor, font, fontSize, x, y } = component;

  if (isTkinter) {
    return `
label = tk.Label(root, text="${text}", fg="${textColor}", bg="${backgroundColor}", font=("${font}", ${fontSize}))
label.place(x=${x}, y=${y})
`;
  } else {
    return `
<label style={{
  color: '${textColor}',
  backgroundColor: '${backgroundColor}',
  fontFamily: '${font}',
  fontSize: '${fontSize}px',
  position: 'absolute',
  left: '${x}px',
  top: '${y}px'
}}>${text}</label>
`;
  }
}

/**
 * Generates code for a Tkinter or HTML entry component.
 * @param component - The entry component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateEntryCode(component: any, isTkinter: boolean): string {
  const { width, textColor, backgroundColor, x, y } = component;

  if (isTkinter) {
    return `
entry = tk.Entry(root, width=${width}, fg="${textColor}", bg="${backgroundColor}")
entry.place(x=${x}, y=${y})
`;
  } else {
    return `
<input type="text" style={{
  width: '${width}px',
  color: '${textColor}',
  backgroundColor: '${backgroundColor}',
  position: 'absolute',
  left: '${x}px',
  top: '${y}px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  padding: '5px'
}} />
`;
  }
}

/**
 * Generates code for a Tkinter or HTML image component.
 * @param component - The image component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateImageCode(component: any, isTkinter: boolean): string {
  const { source, width, height, x, y } = component;

  if (isTkinter) {
    return `
# Requires PIL (Pillow) library: pip install Pillow
image = Image.open("${source}")
photo = ImageTk.PhotoImage(image.resize((${width}, ${height})))
image_label = tk.Label(root, image=photo)
image_label.image = photo  # Keep a reference!
image_label.place(x=${x}, y=${y})
`;
  } else {
    return `
<img src="${source}" width="${width}" height="${height}" style={{
  position: 'absolute',
  left: '${x}px',
  top: '${y}px'
}} />
`;
  }
}

/**
 * Generates code for a Tkinter or HTML slider component.
 * @param component - The slider component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateSliderCode(component: any, isTkinter: boolean): string {
  const { from, to, orient, length, x, y } = component;

  if (isTkinter) {
    return `
slider = tk.Scale(root, from_=${from}, to=${to}, orient="${orient}", length=${length})
slider.place(x=${x}, y=${y})
`;
  } else {
    return `
<input type="range" min="${from}" max="${to}" style={{
  position: 'absolute',
  left: '${x}px',
  top: '${y}px',
  width: '${length}px'
}} />
`;
  }
}

/**
 * Generates code for a Tkinter or HTML checkbox component.
 * @param component - The checkbox component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateCheckboxCode(component: any, isTkinter: boolean): string {
  const { text, x, y } = component;

  if (isTkinter) {
    return `
checkbox_var = tk.BooleanVar()
checkbox = tk.Checkbutton(root, text="${text}", variable=checkbox_var)
checkbox.place(x=${x}, y=${y})
`;
  } else {
    return `
<div>
  <input type="checkbox" id="checkbox" style={{
    position: 'absolute',
    left: '${x}px',
    top: '${y}px'
  }} />
  <label htmlFor="checkbox" style={{
    position: 'absolute',
    left: '${Number(x) + 20}px',
    top: '${y}px'
  }}>${text}</label>
</div>
`;
  }
}

/**
 * Generates code for a Tkinter or HTML datepicker component.
 * @param component - The datepicker component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateDatePickerCode(component: any, isTkinter: boolean): string {
  const { x, y } = component;

  if (isTkinter) {
    return `
# Requires tkcalendar library: pip install tkcalendar
from tkcalendar import DateEntry
date_picker = DateEntry(root, width=12, background='darkblue', foreground='white', borderwidth=2)
date_picker.place(x=${x}, y=${y})
`;
  } else {
    return `
<input type="date" style={{
  position: 'absolute',
  left: '${x}px',
  top: '${y}px',
  padding: '5px',
  border: '1px solid #ccc',
  borderRadius: '4px'
}} />
`;
  }
}

/**
 * Generates code for a Tkinter or HTML progressbar component.
 * @param component - The progressbar component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateProgressBarCode(component: any, isTkinter: boolean): string {
  const { length, x, y } = component;

  if (isTkinter) {
    return `
# Requires tkinter.ttk library
import tkinter.ttk as ttk
progressbar = ttk.Progressbar(root, orient=tk.HORIZONTAL, length=${length}, mode='determinate')
progressbar.place(x=${x}, y=${y})
progressbar.start()  # Start animation
`;
  } else {
    return `
<progress value="50" max="100" style={{
  position: 'absolute',
  left: '${x}px',
  top: '${y}px',
  width: '${length}px',
  height: '20px'
}}>
</progress>
`;
  }
}

/**
 * Generates code for a Tkinter or HTML frame component.
 * @param component - The frame component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateFrameCode(component: any, isTkinter: boolean): string {
  const { width, height, backgroundColor, x, y } = component;

  if (isTkinter) {
    return `
frame = tk.Frame(root, width=${width}, height=${height}, bg="${backgroundColor}")
frame.place(x=${x}, y=${y})
`;
  } else {
    return `
<div style={{
  position: 'absolute',
  left: '${x}px',
  top: '${y}px',
  width: '${width}px',
  height: '${height}px',
  backgroundColor: '${backgroundColor}',
  border: '1px solid #ccc'
}}>
</div>
`;
  }
}

/**
 * Generates code for a Tkinter or HTML notebook component.
 * @param component - The notebook component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateNotebookCode(component: any, isTkinter: boolean): string {
  const { width, height, x, y } = component;

  if (isTkinter) {
    return `
# Requires tkinter.ttk library
import tkinter.ttk as ttk
notebook = ttk.Notebook(root, width=${width}, height=${height})
notebook.place(x=${x}, y=${y})

# Example tab
frame1 = tk.Frame(notebook, width=${width}, height=${height})
notebook.add(frame1, text='Tab 1')
`;
  } else {
    return `
<div style={{
  position: 'absolute',
  left: '${x}px',
  top: '${y}px',
  width: '${width}px',
  height: '${height}px',
  border: '1px solid #ccc'
}}>
  <p>Notebook (Tabs would be implemented with JavaScript)</p>
</div>
`;
  }
}

/**
 * Generates code for a Tkinter or HTML listbox component.
 * @param component - The listbox component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateListboxCode(component: any, isTkinter: boolean): string {
  const { width, height, items, x, y } = component;

  if (isTkinter) {
    return `
listbox = tk.Listbox(root, width=${width}, height=${height})
${items.map((item: string, index: number) => `listbox.insert(${index}, "${item}")`).join('\n')}
listbox.place(x=${x}, y=${y})
`;
  } else {
    return `
<select multiple style={{
  position: 'absolute',
  left: '${x}px',
  top: '${y}px',
  width: '${width}px',
  height: '${height}px'
}}>
  ${items.map((item: string) => `<option>${item}</option>`).join('\n  ')}
</select>
`;
  }
}

/**
 * Generates code for a Tkinter or HTML canvas component.
 * @param component - The canvas component to generate code for.
 * @param isTkinter - A boolean indicating whether to generate Tkinter code.
 * @returns The generated code as a string.
 */
function generateCanvasCode(component: any, isTkinter: boolean): string {
  const { width, height, x, y } = component;

  if (isTkinter) {
    return `
canvas = tk.Canvas(root, width=${width}, height=${height}, bg='white')
canvas.place(x=${x}, y=${y})

# Example: Draw a rectangle
canvas.create_rectangle(50, 20, 150, 80, fill="blue")
`;
  } else {
    return `
<canvas width="${width}" height="${height}" style={{
  position: 'absolute',
  left: '${x}px',
  top: '${y}px',
  border: '1px solid #ccc'
}}>
  Your browser does not support the canvas element.
</canvas>
`;
  }
}
