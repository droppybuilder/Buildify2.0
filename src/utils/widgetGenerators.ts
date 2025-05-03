
/**
 * Generates code for a specific widget type
 * @param type The widget type
 * @param safeId The sanitized component ID
 * @param props The component properties
 * @param indent The indentation string to use
 */
export function generateWidgetCode(type: string, safeId: string, props: any, indent: string): string {
  // Normalize the type to lowercase for case-insensitive matching
  const normalizedType = type.toLowerCase();
  
  // Map component types to their generator functions
  switch (normalizedType) {
    case 'ctklabel':
    case 'label':
      return generateLabelCode(safeId, props, indent);
    case 'ctkbutton':
    case 'button':
      return generateButtonCode(safeId, props, indent);
    case 'ctkentry':
    case 'entry':
    case 'textfield':
      return generateEntryCode(safeId, props, indent);
    case 'ctktextbox':
    case 'textbox':
    case 'textarea':
      return generateTextboxCode(safeId, props, indent);
    case 'ctkslider':
    case 'slider':
      return generateSliderCode(safeId, props, indent);
    case 'ctkswitch':
    case 'switch':
      return generateSwitchCode(safeId, props, indent);
    case 'ctkprogressbar':
    case 'progressbar':
      return generateProgressBarCode(safeId, props, indent);
    case 'paragraph':
    case 'text':
      return generateParagraphCode(safeId, props, indent);
    case 'frame':
    case 'container':
      return generateFrameCode(safeId, props, indent);
    case 'checkbox':
    case 'ctkcheckbox':
      return generateCheckboxCode(safeId, props, indent);
    case 'image':
    case 'picture':
      return generateImageCode(safeId, props, indent);
    case 'notebook':
    case 'tabs':
    case 'tabview':
      return generateNotebookCode(safeId, props, indent);
    case 'listbox':
    case 'list':
      return generateListboxCode(safeId, props, indent);
    case 'canvas':
    case 'drawing':
      return generateCanvasCode(safeId, props, indent);
    case 'datepicker':
    case 'calendar':
      return generateDatePickerCode(safeId, props, indent);
    case 'combobox':
    case 'dropdown':
      return generateComboboxCode(safeId, props, indent);
    case 'radiobutton':
    case 'radio':
      return generateRadioButtonCode(safeId, props, indent);
    default:
      // Return a descriptive comment for unsupported types
      return `${indent}# Unsupported component type: ${type}\n${indent}# Creating a label as a placeholder\n${indent}self.${safeId} = ctk.CTkLabel(self, text="Unsupported: ${type}", bg_color="#ffcccc")\n${indent}self.${safeId}.place(x=${props.x}, y=${props.y}, width=${props.width}, height=${props.height})\n`;
  }
}

function generateLabelCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  if (props.image) {
    const imagePath = props.image;
    const imageSize = props.image_size || { width: 50, height: 50 };
    code += `${indent}self.${safeId} = ctk.CTkLabel(self, text="${props.text || ''}", image=self.load_image("${imagePath}", (${imageSize.width}, ${imageSize.height})), compound="${props.compound || 'left'}", ${props.fontConfig})\n`;
    code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y}, width=${props.width}, height=${props.height})\n`;
  } else {
    code += `${indent}self.${safeId} = ctk.CTkLabel(self, text="${props.text || ''}", width=${props.width}, height=${props.height}, corner_radius=${props.cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", ${props.fontConfig})\n`;
    code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  }
  
  return code;
}

function generateButtonCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = ctk.CTkButton(self, text="${props.text || 'Button'}", width=${props.width}, height=${props.height}, corner_radius=${props.cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.bg_color || '#3b82f6'}", text_color="${props.text_color || '#ffffff'}", border_width=${props.borderWidth}, border_color="${props.borderColor}", ${props.fontConfig})\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}

function generateEntryCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = ctk.CTkEntry(self, width=${props.width}, height=${props.height}, corner_radius=${props.cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${props.borderWidth}, border_color="${props.borderColor}", ${props.fontConfig})\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}

function generateTextboxCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = ctk.CTkTextbox(self, width=${props.width}, height=${props.height || 80}, corner_radius=${props.cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${props.borderWidth}, border_color="${props.borderColor}", ${props.fontConfig})\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  if (props.text) {
    code += `${indent}self.${safeId}.insert("1.0", """${props.text}""")\n`;
  }
  
  return code;
}

function generateSliderCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = ctk.CTkSlider(self, width=${props.width || 160}, height=${props.height || 16}, corner_radius=${props.cornerRadius}, border_width=${props.borderWidth}, bg_color="${props.bg_color || '#e2e8f0'}", fg_color="${props.fg_color || '#ffffff'}", progress_color="${props.progressColor || '#3b82f6'}")\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}

function generateSwitchCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = ctk.CTkSwitch(self, text="${props.text || 'Switch'}", ${props.fontConfig}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#3b82f6'}", progress_color="${props.progressColor || '#3b82f6'}", text_color="${props.text_color || '#000000'}")\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}

function generateProgressBarCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = ctk.CTkProgressBar(self, width=${props.width || 160}, height=${props.height || 16}, corner_radius=${props.cornerRadius}, border_width=${props.borderWidth}, bg_color="${props.bg_color || '#e2e8f0'}", fg_color="${props.fg_color || '#ffffff'}", progress_color="${props.progressColor || '#3b82f6'}")\n`;
  code += `${indent}self.${safeId}.set(${(props.value || 50) / 100})\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}

function generateParagraphCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = ctk.CTkTextbox(self, width=${props.width || 200}, height=${props.height || 100}, corner_radius=${props.cornerRadius}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#ffffff'}", text_color="${props.text_color || '#000000'}", border_width=${props.borderWidth}, border_color="${props.borderColor}", ${props.fontConfig})\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  code += `${indent}self.${safeId}.insert("1.0", """${props.text || 'Paragraph text'}""")\n`;
  code += `${indent}self.${safeId}.configure(state="disabled")  # Make read-only\n`;
  
  return code;
}

function generateFrameCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = ctk.CTkFrame(self, width=${props.width || 200}, height=${props.height || 150}, corner_radius=${props.cornerRadius}, bg_color="${props.bg_color || '#f0f0f0'}", fg_color="${props.fg_color || '#ffffff'}", border_width=${props.borderWidth}, border_color="${props.borderColor}")\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}

function generateCheckboxCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = ctk.CTkCheckBox(self, text="${props.text || 'Checkbox'}", ${props.fontConfig}, bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#3b82f6'}", text_color="${props.text_color || '#000000'}")\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}

function generateImageCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  const imagePath = props.image || "placeholder.png";
  const imageWidth = props.width || 100;
  const imageHeight = props.height || 100;
  
  code += `${indent}# Image setup for ${safeId}\n`;
  code += `${indent}# Make sure to place the image file "${imagePath}" in your project directory\n`;
  code += `${indent}self.img_${safeId} = self.load_image("${imagePath}", (${imageWidth}, ${imageHeight}))\n`;
  code += `${indent}self.image_label_${safeId} = ctk.CTkLabel(self, image=self.img_${safeId}, text="")\n`;
  code += `${indent}self.image_label_${safeId}.place(x=${props.x}, y=${props.y}, width=${imageWidth}, height=${imageHeight})\n`;
  
  return code;
}

function generateNotebookCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}# For a CTk notebook equivalent, we need to create a tabbed view\n`;
  code += `${indent}self.${safeId}_frame = ctk.CTkFrame(self, width=${props.width || 300}, height=${props.height || 200}, corner_radius=${props.cornerRadius}, bg_color="${props.bg_color || '#f0f0f0'}", fg_color="${props.fg_color || '#ffffff'}", border_width=${props.borderWidth}, border_color="${props.borderColor}")\n`;
  code += `${indent}self.${safeId}_frame.place(x=${props.x}, y=${props.y})\n`;
  code += `${indent}\n`;
  code += `${indent}# Create tab buttons on top\n`;
  code += `${indent}self.${safeId}_tabs = []\n`;
  code += `${indent}tab_titles = "${props.tabs || 'Tab 1,Tab 2,Tab 3'}".split(',')\n`;
  code += `${indent}tab_width = ${props.width || 300} / len(tab_titles)\n`;
  code += `${indent}\n`;
  code += `${indent}for i, tab_title in enumerate(tab_titles):\n`;
  code += `${indent}    tab_btn = ctk.CTkButton(self.${safeId}_frame, text=tab_title.strip(), corner_radius=0, height=30, width=tab_width, ${props.fontConfig}, fg_color="${props.fg_color || '#ffffff'}" if i == 0 else "${props.bg_color || '#f0f0f0'}", text_color="${props.text_color || '#000000'}")\n`;
  code += `${indent}    tab_btn.place(x=i*tab_width, y=0)\n`;
  code += `${indent}    self.${safeId}_tabs.append(tab_btn)\n`;
  code += `${indent}    \n`;
  code += `${indent}# Create content frame below tabs\n`;
  code += `${indent}self.${safeId}_content = ctk.CTkFrame(self.${safeId}_frame, width=${props.width || 300}, height=${(props.height || 200)-30}, corner_radius=0, fg_color="${props.fg_color || '#ffffff'}")\n`;
  code += `${indent}self.${safeId}_content.place(x=0, y=30)\n`;
  
  return code;
}

function generateListboxCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}# Since CustomTkinter doesn't have a native listbox, we'll use a CTkScrollableFrame with labels\n`;
  code += `${indent}self.${safeId}_frame = ctk.CTkScrollableFrame(self, width=${props.width || 200}, height=${props.height || 150}, corner_radius=${props.cornerRadius}, fg_color="${props.fg_color || '#ffffff'}", border_width=${props.borderWidth}, border_color="${props.borderColor}")\n`;
  code += `${indent}self.${safeId}_frame.place(x=${props.x}, y=${props.y})\n`;
  code += `${indent}\n`;
  code += `${indent}# Add items to the listbox\n`;
  code += `${indent}items = "${props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5'}".split(',')\n`;
  code += `${indent}self.${safeId}_items = []\n`;
  code += `${indent}\n`;
  code += `${indent}for i, item in enumerate(items):\n`;
  code += `${indent}    item_label = ctk.CTkLabel(self.${safeId}_frame, text=item.strip(), anchor="w", ${props.fontConfig}, text_color="${props.text_color || '#000000'}")\n`;
  code += `${indent}    item_label.pack(fill="x", padx=5, pady=2)\n`;
  code += `${indent}    self.${safeId}_items.append(item_label)\n`;
  
  return code;
}

function generateCanvasCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}self.${safeId} = tk.Canvas(self, width=${props.width || 200}, height=${props.height || 150}, bg="${props.bg_color || '#ffffff'}", highlightthickness=${props.borderWidth}, highlightbackground="${props.borderColor}")\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  code += `${indent}\n`;
  code += `${indent}# Example drawing\n`;
  code += `${indent}self.${safeId}.create_rectangle(20, 20, 50, 50, fill="#3b82f6")\n`;
  code += `${indent}self.${safeId}.create_oval(60, 20, 90, 50, fill="#f97316")\n`;
  
  return code;
}

function generateDatePickerCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}# Requires tkcalendar library: pip install tkcalendar\n`;
  code += `${indent}try:\n`;
  code += `${indent}    from tkcalendar import DateEntry\n`;
  code += `${indent}    self.${safeId} = DateEntry(self, width=12, background='darkblue', foreground='white', ${props.fontConfig}, borderwidth=${props.borderWidth})\n`;
  code += `${indent}    self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  code += `${indent}except ImportError:\n`;
  code += `${indent}    print("tkcalendar not installed. Install with: pip install tkcalendar")\n`;
  code += `${indent}    # Fallback to a label\n`;
  code += `${indent}    self.${safeId} = ctk.CTkLabel(self, text="DatePicker (requires tkcalendar)", ${props.fontConfig})\n`;
  code += `${indent}    self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}

function generateComboboxCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}# Create a combobox/dropdown\n`;
  code += `${indent}values = "${props.items || 'Option 1,Option 2,Option 3'}".split(',')\n`;
  code += `${indent}self.${safeId} = ctk.CTkComboBox(self, values=[item.strip() for item in values], width=${props.width}, height=${props.height}, corner_radius=${props.cornerRadius}, border_width=${props.borderWidth}, fg_color="${props.fg_color || '#ffffff'}", border_color="${props.borderColor}", text_color="${props.text_color || '#000000'}", ${props.fontConfig})\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}

function generateRadioButtonCode(safeId: string, props: any, indent: string): string {
  let code = '';
  
  code += `${indent}# Create a radio button\n`;
  code += `${indent}self.${safeId} = ctk.CTkRadioButton(self, text="${props.text || 'Radio Button'}", bg_color="${props.bg_color || '#ffffff'}", fg_color="${props.fg_color || '#3b82f6'}", text_color="${props.text_color || '#000000'}", ${props.fontConfig})\n`;
  code += `${indent}self.${safeId}.place(x=${props.x}, y=${props.y})\n`;
  
  return code;
}
