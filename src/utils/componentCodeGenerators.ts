
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
        activebackground="${component.props?.hoverColor || '#f0f0f0'}")
self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  } else {
    return `self.button_${safeId} = ctk.CTkButton(self.root, 
        text="${component.props?.text || 'Button'}",
        fg_color="${component.props?.bgColor || '#3b82f6'}",
        text_color="${component.props?.fgColor || '#ffffff'}",
        hover_color="${component.props?.hoverColor || '#2563eb'}")
self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  }
}

/**
 * Generates code for a label component
 */
export function generateLabelCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    return `self.label_${safeId} = tk.Label(self.root, 
        text="${component.props?.text || 'Label'}",
        fg="${component.props?.fgColor || '#000000'}",
        bg="${component.props?.bgColor || '#ffffff'}",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}))
self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  } else {
    return `self.label_${safeId} = ctk.CTkLabel(self.root, 
        text="${component.props?.text || 'Label'}",
        text_color="${component.props?.fgColor || '#ffffff'}",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}))
self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
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
        fg="${component.props?.fgColor || '#000000'}")
self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  } else {
    return `self.entry_${safeId} = ctk.CTkEntry(self.root,
        fg_color="${component.props?.bgColor || 'transparent'}",
        text_color="${component.props?.fgColor || '#ffffff'}",
        placeholder_text="${component.props?.placeholder || ''}")
self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  }
}

/**
 * Generates code for an image component
 */
export function generateImageCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    return `# Image setup
image_path_${safeId} = "images/image_${safeId}.png"  # Adjust path as needed
self.img_${safeId} = Image.open(image_path_${safeId})
self.photo_${safeId} = ImageTk.PhotoImage(self.img_${safeId}.resize((${Math.round(component.size.width)}, ${Math.round(component.size.height)})))
self.image_label_${safeId} = tk.Label(self.root, image=self.photo_${safeId})
self.image_label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
self.images.append(self.photo_${safeId})  # Keep reference to prevent garbage collection`;
  } else {
    return `# Image setup
image_path_${safeId} = "images/image_${safeId}.png"  # Adjust path as needed
self.img_${safeId} = Image.open(image_path_${safeId})
self.photo_${safeId} = ImageTk.PhotoImage(self.img_${safeId}.resize((${Math.round(component.size.width)}, ${Math.round(component.size.height)})))
self.image_label_${safeId} = ctk.CTkLabel(self.root, image=self.photo_${safeId}, text="")
self.image_label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
self.images.append(self.photo_${safeId})  # Keep reference to prevent garbage collection`;
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
    return `self.slider_${safeId} = ctk.CTkSlider(self.root, 
        from_=${component.props?.min || 0}, 
        to=${component.props?.max || 100}, 
        orientation="${component.props?.orientation || 'horizontal'}")
self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
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
        variable=self.var_${safeId})
self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
  } else {
    return `self.var_${safeId} = ctk.BooleanVar()
self.checkbox_${safeId} = ctk.CTkCheckBox(self.root, 
        text="${component.props?.text || 'Checkbox'}", 
        variable=self.var_${safeId})
self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
  }
}

/**
 * Generates code for other components
 */
export function generateOtherComponentCode(component: any, isTkinter: boolean): string {
  // Generate code for other component types as needed
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  switch (component.type) {
    case 'datepicker':
      return generateDatePickerCode(component, isTkinter, safeId);
    case 'progressbar':
      return generateProgressBarCode(component, isTkinter, safeId);
    case 'frame':
      return generateFrameCode(component, isTkinter, safeId);
    case 'notebook':
      return generateNotebookCode(component, isTkinter, safeId);
    case 'listbox':
      return generateListboxCode(component, isTkinter, safeId);
    case 'canvas':
      return generateCanvasCode(component, isTkinter, safeId);
    default:
      return `# Unsupported component type: ${component.type}`;
  }
}

function generateDatePickerCode(component: any, isTkinter: boolean, safeId: string): string {
  if (isTkinter) {
    return `# Requires tkcalendar library: pip install tkcalendar
# Add this import: from tkcalendar import DateEntry
self.date_picker_${safeId} = DateEntry(self.root, width=12, background='darkblue', foreground='white', borderwidth=2)
self.date_picker_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
  } else {
    return `# CustomTkinter doesn't have a built-in DatePicker, using a frame with label as placeholder
self.date_frame_${safeId} = ctk.CTkFrame(self.root, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
self.date_frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
self.date_label_${safeId} = ctk.CTkLabel(self.date_frame_${safeId}, text="Date Picker")
self.date_label_${safeId}.place(relx=0.5, rely=0.5, anchor="center")`;
  }
}

function generateProgressBarCode(component: any, isTkinter: boolean, safeId: string): string {
  if (isTkinter) {
    return `self.progress_${safeId} = ttk.Progressbar(self.root, orient='horizontal', length=${Math.round(component.size.width)}, mode='determinate')
self.progress_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
self.progress_${safeId}['value'] = 50  # Set initial value`;
  } else {
    return `self.progress_${safeId} = ctk.CTkProgressBar(self.root, width=${Math.round(component.size.width)})
self.progress_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
self.progress_${safeId}.set(0.5)  # Set initial value (0-1)`;
  }
}

function generateFrameCode(component: any, isTkinter: boolean, safeId: string): string {
  if (isTkinter) {
    return `self.frame_${safeId} = tk.Frame(self.root, 
        bg="${component.props?.bgColor || '#f0f0f0'}", 
        highlightbackground="${component.props?.borderColor || '#cccccc'}", 
        highlightthickness=${component.props?.borderWidth || 1})
self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  } else {
    return `self.frame_${safeId} = ctk.CTkFrame(self.root, 
        fg_color="${component.props?.bgColor || 'transparent'}", 
        border_color="${component.props?.borderColor || '#cccccc'}", 
        border_width=${component.props?.borderWidth || 1})
self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
  }
}

function generateNotebookCode(component: any, isTkinter: boolean, safeId: string): string {
  if (isTkinter) {
    return `self.notebook_${safeId} = ttk.Notebook(self.root)
self.notebook_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})

# Example tabs
self.tab1_${safeId} = tk.Frame(self.notebook_${safeId})
self.tab2_${safeId} = tk.Frame(self.notebook_${safeId})
self.notebook_${safeId}.add(self.tab1_${safeId}, text="Tab 1")
self.notebook_${safeId}.add(self.tab2_${safeId}, text="Tab 2")`;
  } else {
    return `self.tabview_${safeId} = ctk.CTkTabview(self.root)
self.tabview_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})

# Example tabs
self.tab1_${safeId} = self.tabview_${safeId}.add("Tab 1")
self.tab2_${safeId} = self.tabview_${safeId}.add("Tab 2")`;
  }
}

function generateListboxCode(component: any, isTkinter: boolean, safeId: string): string {
  const items = component.props?.items || ["Item 1", "Item 2", "Item 3"];
  
  if (isTkinter) {
    let code = `self.listbox_${safeId} = tk.Listbox(self.root)
self.listbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
`;
    
    // Add items
    items.forEach((item: string, index: number) => {
      code += `self.listbox_${safeId}.insert(${index}, "${item}")\n`;
    });
    
    return code;
  } else {
    return `# CustomTkinter doesn't have a direct Listbox equivalent
self.list_frame_${safeId} = ctk.CTkScrollableFrame(self.root, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
self.list_frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})

# Add items as labels
${items.map((item: string, index: number) => 
  `self.list_item_${safeId}_${index} = ctk.CTkLabel(self.list_frame_${safeId}, text="${item}")
self.list_item_${safeId}_${index}.pack(pady=2, padx=5, anchor="w")`
).join('\n')}`;
  }
}

function generateCanvasCode(component: any, isTkinter: boolean, safeId: string): string {
  if (isTkinter) {
    return `self.canvas_${safeId} = tk.Canvas(self.root, bg='white')
self.canvas_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})

# Example drawing on canvas
self.canvas_${safeId}.create_rectangle(20, 20, 100, 100, fill='blue', outline='black')
self.canvas_${safeId}.create_oval(120, 20, 200, 100, fill='red', outline='black')`;
  } else {
    return `# CustomTkinter doesn't have a direct Canvas equivalent
# Using a Frame with CTkCanvas utility
self.canvas_frame_${safeId} = ctk.CTkFrame(self.root, fg_color="white")
self.canvas_frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})

# You would need to use tk.Canvas within CTkFrame for actual drawing
self.canvas_${safeId} = tk.Canvas(self.canvas_frame_${safeId}, bg='white', highlightthickness=0)
self.canvas_${safeId}.pack(fill="both", expand=True)

# Example drawing
self.canvas_${safeId}.create_rectangle(20, 20, 100, 100, fill='blue', outline='black')
self.canvas_${safeId}.create_oval(120, 20, 200, 100, fill='red', outline='black')`;
  }
}
