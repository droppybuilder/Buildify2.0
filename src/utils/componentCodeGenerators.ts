
import { adjustColorBrightness } from './codeGeneratorUtils';

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
    // Add font weight and style to button font configuration
    const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
    const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
    const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
    const borderColor = component.props?.borderColor || '#e2e8f0';
    
    return `self.button_${safeId} = ctk.CTkButton(self.root, 
        text="${component.props?.text || 'Button'}",
        bg_color="${component.props?.bgColor || '#e0e0e0'}",
        fg_color="${component.props?.bgColor || '#e0e0e0'}",
        text_color="${component.props?.fgColor || '#000000'}",
        hover_color="${component.props?.hoverColor || '#f0f0f0'}",
        corner_radius=${component.props?.cornerRadius || 8},
        border_color="${borderColor}",
        border_width=${borderWidth},
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"))
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
      return `self.label_${safeId} = ctk.CTkLabel(self.root, 
        text="${component.props?.text || 'Label'}",
        text_color="${component.props?.fgColor || '#000000'}",
        fg_color="${component.props?.bgColor || 'transparent'}",
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
    // Add font related properties to the entry component
    const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
    const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
    const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
    const borderColor = component.props?.borderColor || '#e2e8f0';
    
    return `self.entry_${safeId} = ctk.CTkEntry(self.root,
        placeholder_text="${component.props?.placeholder || 'Enter text...'}",
        bg_color="${component.props?.bgColor || '#ffffff'}",
        fg_color="${component.props?.bgColor || '#ffffff'}",
        text_color="${component.props?.fgColor || '#000000'}",
        corner_radius=${component.props?.cornerRadius || 8},
        border_color="${borderColor}",
        border_width=${borderWidth},
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"))
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
  const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
  const borderColor = component.props?.borderColor || '#e2e8f0';
  
  if (isTkinter) {    return `# Image setup for ${safeId}
# Make sure to place the image file "${fileName}" in your project directory
self.img_${safeId} = ctk.CTkImage(light_image=Image.open("${fileName}"), 
                                 size=(${Math.round(component.size.width)}, ${Math.round(component.size.height)}))
self.image_label_${safeId} = ctk.CTkLabel(self.root, image=self.img_${safeId}, text="", fg_color="${component.props?.bgColor || 'transparent'}")
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
    const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
    const borderColor = component.props?.borderColor || '#e2e8f0';
    
    return `self.text_${safeId} = customtkinter.CTkTextbox(self.root, 
        text_color="${component.props?.fgColor || '#000000'}",
        fg_color="${component.props?.bgColor || '#ffffff'}",
        corner_radius=${component.props?.cornerRadius || 8},
        border_width=${borderWidth},
        border_color="${borderColor}",
        wrap="word",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"))
self.text_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
self.text_${safeId}.insert("1.0", """${component.props?.text || 'Paragraph text'}""")
self.text_${safeId}.configure(state="disabled")  # Make read-only unless editing is needed`;
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Paragraph ${safeId} is managed in the JavaScript UI`;
  }
}

/**
 * Generates code for a textbox component
 */
export function generateTextboxCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
    const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
    const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
    const borderColor = component.props?.borderColor || '#e2e8f0';
    
    return `self.textbox_${safeId} = ctk.CTkTextbox(self.root, 
        fg_color="${component.props?.bgColor || '#ffffff'}", 
        text_color="${component.props?.fgColor || '#000000'}",
        corner_radius=${component.props?.cornerRadius || 8},
        border_width=${borderWidth},
        border_color="${borderColor}",
        wrap="word",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"))
self.textbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
${component.props?.text ? `self.textbox_${safeId}.insert("1.0", """${component.props.text}""")` : ''}`;
  } else {
    // For Eel, we just return a comment since components are handled via JSON
    return `# Textbox ${safeId} is managed in the JavaScript UI`;
  }
}

/**
 * Generates code for a slider component
 */
export function generateSliderCode(component: any, isTkinter: boolean): string {
  const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
  
  if (isTkinter) {
    const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 0;
    const borderColor = component.props?.borderColor || '#cbd5e1';
    
    return `self.slider_${safeId} = ctk.CTkSlider(self.root, 
        from_=${component.props?.from || 0}, 
        to=${component.props?.to || 100}, 
        orientation="${component.props?.orientation || 'horizontal'}",
        border_width=${borderWidth},
        border_color="${borderColor}",
        fg_color="${component.props?.bgColor || '#e2e8f0'}",
        progress_color="${component.props?.progressColor || '#3b82f6'}",
        button_color="${component.props?.buttonColor || '#ffffff'}",
        button_hover_color="${component.props?.buttonColor ? adjustColorBrightness(component.props.buttonColor, -20) : '#e0e0e0'}")
self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
self.slider_${safeId}.set(${(component.props?.value || 50) / 100})`;
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
    const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
    const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
    
    return `self.checkbox_${safeId} = ctk.CTkCheckBox(self.root, 
        text="${component.props?.text || 'Checkbox'}", 
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"),
        text_color="${component.props?.fgColor || '#000000'}",
        fg_color="${component.props?.checkedColor || '#3b82f6'}",
        border_color="${component.props?.borderColor || '#e2e8f0'}")
self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
${component.props?.checked ? `self.checkbox_${safeId}.select()` : `self.checkbox_${safeId}.deselect()`}`;
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
      case 'textbox':
        return generateTextboxCode(component, isTkinter);
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
  const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
  const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
  const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
  const borderColor = component.props?.borderColor || '#e2e8f0';
  
  return `# Requires tkcalendar library: pip install tkcalendar
# Add this import: from tkcalendar import DateEntry
self.date_picker_${safeId} = DateEntry(self.root, 
        width=12, 
        background='darkblue', 
        foreground='white',
        date_pattern="${component.props?.format || 'yyyy-mm-dd'}",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"),
        borderwidth=${borderWidth})
self.date_picker_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
}

function generateProgressBarCode(component: any, safeId: string): string {
  const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 0;
  const borderColor = component.props?.borderColor || '#e2e8f0';
  
  return `self.progress_${safeId} = ctk.CTkProgressBar(self.root, 
        orientation='horizontal',
        width=${Math.round(component.size.width)},
        height=${Math.round(component.size.height)},
        corner_radius=${component.props?.cornerRadius || 4},
        progress_color="${component.props?.progressColor || '#3b82f6'}",
        fg_color="${component.props?.bgColor || '#e2e8f0'}",
        border_width=${borderWidth},
        border_color="${borderColor}")
self.progress_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
self.progress_${safeId}.set(${(component.props?.value || 50) / 100})  # CTk uses 0-1 for progress`;
}

function generateFrameCode(component: any, safeId: string): string {
  const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
  const borderColor = component.props?.borderColor || '#e2e8f0';
  
  return `self.frame_${safeId} = ctk.CTkFrame(self.root, 
      corner_radius=${component.props?.cornerRadius || 4},
      fg_color="${component.props?.bgColor || '#f0f0f0'}", 
      border_color="${borderColor}", 
      border_width=${borderWidth})
self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
}

function generateNotebookCode(component: any, safeId: string): string {
  const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
  const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
  const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
  const borderColor = component.props?.borderColor || '#e2e8f0';
  
  return `# Since CustomTkinter doesn't have a direct notebook widget, we'll create one using frames and buttons
self.notebook_container_${safeId} = ctk.CTkFrame(self.root,
      corner_radius=${component.props?.cornerRadius || 4},
      fg_color="${component.props?.bgColor || '#f0f0f0'}",
      border_width=${borderWidth},
      border_color="${borderColor}")
self.notebook_container_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})

# Create tab bar
self.notebook_tabs_${safeId} = ctk.CTkFrame(self.notebook_container_${safeId}, 
      fg_color="${component.props?.bgColor || '#f0f0f0'}", 
      corner_radius=0)
self.notebook_tabs_${safeId}.place(x=0, y=0, width=${Math.round(component.size.width)}, height=30)

# Create content frame
self.notebook_content_${safeId} = ctk.CTkFrame(self.notebook_container_${safeId}, 
      fg_color="${component.props?.fgColor || '#ffffff'}", 
      corner_radius=${component.props?.cornerRadius || 4})
self.notebook_content_${safeId}.place(x=0, y=30, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height) - 30})

# Add tab buttons
tab_titles = ["Tab 1", "Tab 2", "Tab 3"]
tab_width = ${Math.round(component.size.width)}/len(tab_titles)
self.notebook_tab_buttons_${safeId} = []

for i, tab_title in enumerate(tab_titles):
    btn = ctk.CTkButton(self.notebook_tabs_${safeId}, 
        text=tab_title,
        width=tab_width,
        height=30,
        corner_radius=0,
        fg_color="${component.props?.bgColor || '#f0f0f0'}" if i != 0 else "${component.props?.fgColor || '#ffffff'}",
        text_color="${component.props?.fgColor || '#000000'}",
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"))
    btn.place(x=i*tab_width, y=0)
    self.notebook_tab_buttons_${safeId}.append(btn)`;
}

function generateListboxCode(component: any, safeId: string): string {
  const items = component.props?.items || ["Item 1", "Item 2", "Item 3"];
  const itemArray = typeof items === 'string' ? items.split(',') : items;
  const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
  const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
  const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
  const borderColor = component.props?.borderColor || '#e2e8f0';
  
  let code = `# Since CustomTkinter doesn't have a native listbox, we'll use a CTkScrollableFrame with labels
self.listbox_frame_${safeId} = ctk.CTkScrollableFrame(self.root, 
      width=${Math.round(component.size.width)},
      height=${Math.round(component.size.height)},
      corner_radius=${component.props?.cornerRadius || 4},
      fg_color="${component.props?.bgColor || '#ffffff'}",
      border_width=${borderWidth},
      border_color="${borderColor}")
self.listbox_frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})

# Add items to the listbox
self.listbox_items_${safeId} = []
`;
  
  // Add items
  itemArray.forEach((item: string, index: number) => {
    code += `item_${index} = ctk.CTkLabel(self.listbox_frame_${safeId}, 
        text="${item.trim()}", 
        anchor="w", 
        font=("${component.props?.font || 'Arial'}", ${component.props?.fontSize || 12}, "${fontWeight} ${fontStyle}"),
        text_color="${component.props?.fgColor || '#000000'}")
item_${index}.pack(fill="x", padx=5, pady=2)
self.listbox_items_${safeId}.append(item_${index})
`;
  });
  
  return code;
}

function generateCanvasCode(component: any, safeId: string): string {
  const borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
  const borderColor = component.props?.borderColor || '#e2e8f0';
  
  return `# Use Tkinter canvas since CustomTkinter doesn't have a canvas widget
self.canvas_${safeId} = tk.Canvas(self.root, 
      bg="${component.props?.bgColor || 'white'}", 
      highlightthickness=${borderWidth},
      highlightbackground="${borderColor}")
self.canvas_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})

# Example drawing on canvas
self.canvas_${safeId}.create_rectangle(20, 20, 100, 100, fill='blue', outline='black')
self.canvas_${safeId}.create_oval(120, 20, 200, 100, fill='red', outline='black')`;
}
