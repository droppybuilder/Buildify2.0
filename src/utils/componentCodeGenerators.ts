
/**
 * Collection of code generators for specific component types
 * Extracted from codeGenerator.ts to improve organization
 */

/**
 * Generates code for a button component
 */
export function generateButtonCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    return `self.button_${safeId} = tk.Button(self.root, 
        text="${component.props?.text || 'Button'}",
        bg="${component.props?.bgColor || '#e0e0e0'}",
        fg="${component.props?.fgColor || '#000000'}",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}),
        activebackground="${component.props?.hoverColor || '#f0f0f0'}")
self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Button ${safeId} is managed in the JavaScript UI`;
  }
}

/**
 * Generates code for a label component
 */
export function generateLabelCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
    const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
    
    return `self.label_${safeId} = tk.Label(self.root, 
        text="${component.props?.text || 'Label'}",
        fg="${component.props?.fgColor || '#000000'}",
        bg="${component.props?.bgColor || '#ffffff'}",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"))
self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Label ${safeId} is managed in the JavaScript UI`;
  }
}

/**
 * Generates code for an entry component
 */
export function generateEntryCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    return `self.entry_${safeId} = tk.Entry(self.root,
        bg="${component.props?.bgColor || '#ffffff'}",
        fg="${component.props?.fgColor || '#000000'}",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}))
self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Entry ${safeId} is managed in the JavaScript UI`;
  }
}

/**
 * Generates code for an image component
 * Modified to use CTkImage for proper HighDPI support
 */
export function generateImageCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  const fileName = component.props?.fileName || "placeholder.png";
  
  if (isTkinter) {
    return `# Image setup for ${safeId}
# Place the image file "${fileName}" in your project directory
self.img_${safeId} = self.load_ctk_image("${fileName}", (${Math.round(component.size.width)}, ${Math.round(component.size.height)}))
self.image_label_${safeId} = ctk.CTkLabel(self.root, image=self.img_${safeId}, text="")
self.image_label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
# Keep reference to prevent garbage collection
self._image_references.append(self.img_${safeId})`;
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Image ${safeId} (${fileName}) is managed in the JavaScript UI`;
  }
}

/**
 * Generates code for a paragraph component
 */
export function generateParagraphCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
    const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
    
    return `self.text_${safeId} = tk.Text(self.root, 
        fg="${component.props?.fgColor || '#000000'}",
        bg="${component.props?.bgColor || '#ffffff'}",
        wrap="word",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"))
self.text_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
self.text_${safeId}.insert("1.0", """${component.props?.text || 'Paragraph text'}""")
self.text_${safeId}.config(state="disabled")  # Make read-only unless editing is needed`;
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Paragraph ${safeId} is managed in the JavaScript UI`;
  }
}

/**
 * Generates code for a slider component
 */
export function generateSliderCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    return `self.slider_${safeId} = tk.Scale(self.root, 
        from_=${component.props?.min || 0}, 
        to=${component.props?.max || 100}, 
        orient="${component.props?.orientation || 'horizontal'}")
self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Slider ${safeId} is managed in the JavaScript UI`;
  }
}

/**
 * Generates code for a checkbox component
 */
export function generateCheckboxCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    return `self.var_${safeId} = tk.BooleanVar()
self.checkbox_${safeId} = tk.Checkbutton(self.root, 
        text="${component.props?.text || 'Checkbox'}", 
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}),
        fg="${component.props?.fgColor || '#000000'}",
        variable=self.var_${safeId})
self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Checkbox ${safeId} is managed in the JavaScript UI`;
  }
}

/**
 * Generates code for other components
 */
export function generateOtherComponentCode(component: any, isTkinter: boolean): string {
  // Generate code for other component types as needed
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    switch (component.type) {
      case 'paragraph':
        return generateParagraphCode(component, isTkinter);
      case 'datepicker':
        return generateDatePickerCode(component, safeId);
      case 'progressbar':
        return generateProgressBarCode(component, safeId);
      case 'frame':
        return generateFrameCode(component, safeId);
      case 'notebook':
        return generateNotebookCode(component, safeId);
      case 'listbox':
        return generateListboxCode(component, safeId);
      case 'canvas':
        return generateCanvasCode(component, safeId);
      default:
        return `# Unsupported component type: ${component.type}`;
    }
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Component ${safeId} (${component.type}) is managed in the JavaScript UI`;
  }
}

function generateDatePickerCode(component: any, safeId: string): string {
  return `# Requires tkcalendar library: pip install tkcalendar
# Add this import: from tkcalendar import DateEntry
self.date_picker_${safeId} = DateEntry(self.root, width=12, background='darkblue', foreground='white', borderwidth=2)
self.date_picker_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
}

function generateProgressBarCode(component: any, safeId: string): string {
  return `self.progress_${safeId} = ttk.Progressbar(self.root, orient='horizontal', length=${Math.round(component.size.width)}, mode='determinate')
self.progress_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
self.progress_${safeId}['value'] = ${component.props?.value || 50}  # Set initial value`;
}

function generateFrameCode(component: any, safeId: string): string {
  return `self.frame_${safeId} = tk.Frame(self.root, 
      bg="${component.props?.bgColor || '#f0f0f0'}", 
      highlightbackground="${component.props?.borderColor || '#cccccc'}", 
      highlightthickness=${component.props?.borderWidth || 1})
self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
}

function generateNotebookCode(component: any, safeId: string): string {
  return `self.notebook_${safeId} = ttk.Notebook(self.root)
self.notebook_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})

# Example tabs
self.tab1_${safeId} = tk.Frame(self.notebook_${safeId})
self.tab2_${safeId} = tk.Frame(self.notebook_${safeId})
self.notebook_${safeId}.add(self.tab1_${safeId}, text="Tab 1")
self.notebook_${safeId}.add(self.tab2_${safeId}, text="Tab 2")`;
}

function generateListboxCode(component: any, safeId: string): string {
  const items = component.props?.items || ["Item 1", "Item 2", "Item 3"];
  const itemArray = typeof items === 'string' ? items.split(',') : items;
  
  let code = `self.listbox_${safeId} = tk.Listbox(self.root, 
      font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}))
self.listbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
`;
  
  // Add items
  itemArray.forEach((item: string, index: number) => {
    code += `self.listbox_${safeId}.insert(${index}, "${item.trim()}")\n`;
  });
  
  return code;
}

function generateCanvasCode(component: any, safeId: string): string {
  return `self.canvas_${safeId} = tk.Canvas(self.root, bg='white')
self.canvas_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})

# Example drawing on canvas
self.canvas_${safeId}.create_rectangle(20, 20, 100, 100, fill='blue', outline='black')
self.canvas_${safeId}.create_oval(120, 20, 200, 100, fill='red', outline='black')`;
}
