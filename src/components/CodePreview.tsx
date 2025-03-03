
import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css'; // Base theme which we'll override with our custom CSS

interface CodePreviewProps {
  components: any[];
  isTkinter: boolean;
}

export const CodePreview = ({ components, isTkinter }: CodePreviewProps) => {
  const codeRef = useRef<HTMLPreElement>(null);
  // Add state to force re-render
  const [code, setCode] = useState<string>("");

  const generateTkinterCode = (components: any[]) => {
    const imports = `import tkinter as tk
from tkinter import ttk
import os
import base64
from io import BytesIO
from PIL import Image, ImageTk

class MyGUIApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Tkinter GUI App")
        self.root.geometry("800x600")
        self.images = []  # Keep references to images to prevent garbage collection
`;

    const setupComponents = components.map(component => {
      const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
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
          return `        self.image_${safeId} = tk.Label(root, text="Image", bg="light gray")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Note: Add your image file to the same directory and update the code:
        # img = tk.PhotoImage(file="your_image.png")
        # self.image_${safeId}.configure(image=img)
        # self.image_${safeId}.image = img  # Keep a reference`;
        
        case 'progressbar':
          return `        self.progressbar_${safeId} = ttk.Progressbar(root,
            orient="horizontal",
            length=${Math.round(component.size.width)},
            mode="${component.props.mode || 'determinate'}")
        self.progressbar_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.progressbar_${safeId}["value"] = ${component.props.value || 50}`;
          
        case 'datepicker':
          return `        # Requires tkcalendar library: pip install tkcalendar
        from tkcalendar import DateEntry
        self.datepicker_${safeId} = DateEntry(root,
            width=${Math.round(component.size.width/8)},
            background="${component.props.bgColor || '#0066cc'}",
            foreground="${component.props.fgColor || '#ffffff'}",
            borderwidth=${component.props.borderwidth || 2})
        self.datepicker_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'canvas':
          return `        self.canvas_${safeId} = tk.Canvas(root,
            bg="${component.props.bgColor || '#ffffff'}",
            borderwidth=${component.props.borderwidth || 1},
            relief="${component.props.relief || 'flat'}")
        self.canvas_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Draw a sample shape
        self.canvas_${safeId}.create_rectangle(10, 10, ${Math.round(component.size.width/2)}, ${Math.round(component.size.height/2)}, fill="${component.props.fillColor || '#3b82f6'}")`;
          
        case 'listbox':
          const items = (component.props.items || 'Item 1,Item 2,Item 3').split(',').map((i: string) => i.trim());
          return `        self.listbox_${safeId} = tk.Listbox(root,
            bg="${component.props.bgColor || '#ffffff'}",
            fg="${component.props.fgColor || '#000000'}",
            selectbackground="${component.props.selectBgColor || '#3b82f6'}",
            selectforeground="${component.props.selectFgColor || '#ffffff'}",
            borderwidth=${component.props.borderwidth || 1},
            relief="${component.props.relief || 'solid'}")
        self.listbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        ${items.map((item, idx) => `self.listbox_${safeId}.insert(${idx}, "${item}")`).join('\n        ')}`;
        
        case 'notebook':
          return `        self.notebook_${safeId} = ttk.Notebook(root)
        self.notebook_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Add sample tabs
        self.tab1_${safeId} = tk.Frame(self.notebook_${safeId})
        self.tab2_${safeId} = tk.Frame(self.notebook_${safeId})
        self.notebook_${safeId}.add(self.tab1_${safeId}, text='Tab 1')
        self.notebook_${safeId}.add(self.tab2_${safeId}, text='Tab 2')`;

        default:
          return '';
      }
    }).join('\n\n');

    const main = `
if __name__ == "__main__":
    root = tk.Tk()
    app = MyGUIApp(root)
    root.mainloop()
`;

    return imports + '        # Setup UI components\n' + setupComponents + main;
  };

  const generateCustomTkinterCode = (components: any[]) => {
    const imports = `import customtkinter as ctk
from PIL import Image
import os
import base64
from io import BytesIO

class MyGUIApp:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("CustomTkinter GUI App")
        self.root.geometry("800x600")
        ctk.set_appearance_mode("dark")  # Use "dark" or "light"
        ctk.set_default_color_theme("blue")  # Themes: "blue" (standard), "green", "dark-blue"
        self.images = []  # Keep references to images
        self._create_widgets()
        
    def _create_widgets(self):`;

    const setupComponents = components.map(component => {
      const safeId = component.id.replace(/[^a-zA-Z0-9_]/g, '_');
      switch (component.type) {
        case 'button':
          return `        self.button_${safeId} = ctk.CTkButton(self.root, 
            text="${component.props.text || 'Button'}",
            fg_color="${component.props.bgColor || '#3b82f6'}",
            text_color="${component.props.fgColor || '#ffffff'}",
            hover_color="${component.props.hoverColor || '#2563eb'}",
            border_color="${component.props.borderColor || 'transparent'}",
            corner_radius=${component.props.cornerRadius || 8})
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
        case 'image':
          return `        # Placeholder image - replace with your own image
        self.image_${safeId} = ctk.CTkLabel(self.root, text="Image", fg_color="gray70")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # To use an actual image:
        # img = ctk.CTkImage(light_image=Image.open("path/to/image.png"), size=(${Math.round(component.size.width)}, ${Math.round(component.size.height)}))
        # self.image_${safeId}.configure(image=img)
        # self.images.append(img)  # Keep a reference`;

        case 'label':
          return `        self.label_${safeId} = ctk.CTkLabel(self.root, 
            text="${component.props.text || 'Label'}",
            text_color="${component.props.fgColor || '#ffffff'}",
            font=("TkDefaultFont", ${component.props.fontSize || 12}),
            anchor="w")
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
        case 'entry':
          return `        self.entry_${safeId} = ctk.CTkEntry(self.root,
            fg_color="${component.props.bgColor || 'transparent'}",
            text_color="${component.props.fgColor || '#ffffff'}",
            border_color="${component.props.borderColor || '#3b82f6'}",
            corner_radius=${component.props.cornerRadius || 8},
            placeholder_text="${component.props.placeholder || ''}")
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
        case 'slider':
          return `        self.slider_${safeId} = ctk.CTkSlider(self.root,
            from_=${component.props.from || 0},
            to=${component.props.to || 100},
            orientation="${component.props.orient === 'vertical' ? 'vertical' : 'horizontal'}",
            button_color="${component.props.troughColor || '#3b82f6'}",
            button_hover_color="${component.props.hoverColor || '#2563eb'}",
            progress_color="${component.props.troughColor || '#3b82f6'}")
        self.slider_${safeId}.set(${component.props.value || 50})
        self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
        case 'frame':
          return `        self.frame_${safeId} = ctk.CTkFrame(self.root,
            fg_color="${component.props.bgColor || 'transparent'}",
            border_width=${component.props.borderwidth || 1},
            border_color="${component.props.borderColor || '#3b82f6'}",
            corner_radius=${component.props.cornerRadius || 8})
        self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
        case 'checkbox':
          return `        self.checkbox_${safeId} = ctk.CTkCheckBox(self.root,
            text="${component.props.text || 'Checkbox'}",
            text_color="${component.props.fgColor || '#ffffff'}",
            fg_color="${component.props.bgColor || '#3b82f6'}",
            hover_color="${component.props.hoverColor || '#2563eb'}")
        ${component.props.checked ? 'self.checkbox_' + safeId + '.select()' : 'self.checkbox_' + safeId + '.deselect()'}
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      
        case 'dropdown':
          const options = (component.props.options || 'Option 1,Option 2,Option 3').split(',').map((o: string) => o.trim());
          return `        self.dropdown_${safeId} = ctk.CTkOptionMenu(self.root,
            values=[${options.map(o => `"${o}"`).join(', ')}],
            fg_color="${component.props.bgColor || '#3b82f6'}",
            button_color="${component.props.bgColor || '#3b82f6'}",
            button_hover_color="${component.props.hoverColor || '#2563eb'}",
            text_color="${component.props.fgColor || '#ffffff'}")
        self.dropdown_${safeId}.set("${component.props.selected || options[0]}")
        self.dropdown_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        case 'progressbar':
          return `        self.progressbar_${safeId} = ctk.CTkProgressBar(self.root,
            orientation="${component.props.orient === 'vertical' ? 'vertical' : 'horizontal'}",
            progress_color="${component.props.progressColor || '#3b82f6'}")
        self.progressbar_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.progressbar_${safeId}.set(${(component.props.value || 50) / 100})`;
          
        case 'datepicker':
          return `        # CustomTkinter doesn't have a built-in DateEntry
        # This is a label placeholder that would open a date dialog when clicked
        self.datepicker_${safeId} = ctk.CTkButton(self.root,
            text="${component.props.dateText || 'Select Date'}",
            fg_color="${component.props.bgColor || '#3b82f6'}",
            text_color="${component.props.fgColor || '#ffffff'}",
            command=self._show_date_dialog_${safeId})
        self.datepicker_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        
    def _show_date_dialog_${safeId}(self):
        # This would show a date selection dialog
        # For now, this is just a placeholder
        print("Date dialog would show here")`;
          
        case 'canvas':
          return `        # CustomTkinter doesn't have a direct equivalent to Canvas
        # Using a Frame with label for visualization
        self.canvas_${safeId} = ctk.CTkFrame(self.root,
            fg_color="${component.props.bgColor || '#1e293b'}",
            border_width=${component.props.borderwidth || 1},
            border_color="${component.props.borderColor || '#3b82f6'}",
            corner_radius=${component.props.cornerRadius || 8})
        self.canvas_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        
        # Add a label inside to explain
        self.canvas_label_${safeId} = ctk.CTkLabel(self.canvas_${safeId},
            text="Canvas Element\\n(Create shapes in code)",
            text_color="${component.props.fgColor || '#ffffff'}")
        self.canvas_label_${safeId}.place(relx=0.5, rely=0.5, anchor="center")`;
        
        case 'listbox':
          return `        # Placeholder for values
        items_${safeId} = ${JSON.stringify((component.props.items || 'Item 1,Item 2,Item 3').split(',').map(i => i.trim()))}
        
        # CustomTkinter scrollable frame for listbox
        self.listbox_container_${safeId} = ctk.CTkScrollableFrame(self.root,
            fg_color="${component.props.bgColor || 'transparent'}",
            border_width=${component.props.borderwidth || 1},
            border_color="${component.props.borderColor || '#3b82f6'}",
            corner_radius=${component.props.cornerRadius || 8},
            width=${Math.round(component.size.width-20)},
            height=${Math.round(component.size.height-20)})
        self.listbox_container_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
        
        # Add items as labels or buttons
        self.listbox_items_${safeId} = []
        for i, item in enumerate(items_${safeId}):
            label = ctk.CTkLabel(self.listbox_container_${safeId}, 
                text=item,
                text_color="${component.props.fgColor || '#ffffff'}",
                fg_color="transparent",
                anchor="w",
                padx=5, pady=2)
            label.pack(fill="x", padx=2, pady=2)
            self.listbox_items_${safeId}.append(label)`;
        
        case 'notebook':
          return `        # CustomTkinter TabView
        self.notebook_${safeId} = ctk.CTkTabview(self.root,
            fg_color="${component.props.bgColor || 'transparent'}",
            border_width=${component.props.borderwidth || 1},
            border_color="${component.props.borderColor || '#3b82f6'}",
            corner_radius=${component.props.cornerRadius || 8},
            segmented_button_fg_color="${component.props.tabColor || '#1e293b'}",
            segmented_button_selected_color="${component.props.selectedTabColor || '#3b82f6'}",
            segmented_button_selected_hover_color="${component.props.hoverColor || '#2563eb'}")
        self.notebook_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        
        # Add tabs
        self.tab1_${safeId} = self.notebook_${safeId}.add("Tab 1")
        self.tab2_${safeId} = self.notebook_${safeId}.add("Tab 2")
        
        # Add sample content to tabs
        ctk.CTkLabel(self.tab1_${safeId}, text="Tab 1 Content").pack(padx=20, pady=20)
        ctk.CTkLabel(self.tab2_${safeId}, text="Tab 2 Content").pack(padx=20, pady=20)`;

        default:
          return '';
      }
    }).join('\n\n');

    const main = `

if __name__ == "__main__":
    app = MyGUIApp()
    app.root.mainloop()`;

    return imports + '\n        # Setup UI components\n' + setupComponents + main;
  };

  // Generate code when components or isTkinter changes
  useEffect(() => {
    const generatedCode = isTkinter 
      ? generateTkinterCode(components)
      : generateCustomTkinterCode(components);
    
    setCode(generatedCode);
    
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [components, isTkinter]);

  // Additional effect to ensure syntax highlighting is applied
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="code-preview-header p-3 border-b flex justify-between items-center">
        <span className="font-semibold">Code Preview</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {isTkinter ? "Tkinter" : "CustomTkinter"}
        </span>
      </div>
      <div className="code-preview-container flex-1 overflow-auto p-3">
        <pre className="code-preview language-python h-full m-0" ref={codeRef}>
          <code className="language-python">{code}</code>
        </pre>
      </div>
    </div>
  );
};
