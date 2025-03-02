
import { useMemo, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

interface CodePreviewProps {
  components: any[];
  isTkinter: boolean;
}

export const CodePreview = ({ components, isTkinter }: CodePreviewProps) => {
  const codeRef = useRef<HTMLElement>(null);
  
  const generatedCode = useMemo(() => {
    if (isTkinter) {
      return generateTkinterCode(components);
    }
    return generateCustomTkinterCode(components);
  }, [components, isTkinter]);

  // Apply syntax highlighting when code changes
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [generatedCode]);

  return (
    <div className="h-64 border-t flex flex-col">
      <div className="p-2 bg-secondary flex items-center justify-between">
        <span className="text-xs font-medium">Generated Code</span>
      </div>
      <pre className="flex-1 p-0 m-0 overflow-auto code-preview">
        <code ref={codeRef} className="language-python">{generatedCode}</code>
      </pre>
    </div>
  );
};

const generateTkinterCode = (components: any[]) => {
  const imports = `import tkinter as tk
from tkinter import ttk
import os
from PIL import Image, ImageTk

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Tkinter GUI")
        self.images = []  # Keep references to prevent garbage collection
`;

  const setupComponents = components.map(component => {
    switch (component.type) {
      case 'button':
        return `        self.button_${component.id} = tk.Button(root, text="${component.props.text || 'Button'}")
        self.button_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'label':
        return `        self.label_${component.id} = tk.Label(root, text="${component.props.text || 'Label'}")
        self.label_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'entry':
        return `        self.entry_${component.id} = tk.Entry(root)
        self.entry_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'image':
        return `        # Image placeholder - replace with your own image
        self.image_${component.id} = tk.Label(root, text="Image")
        self.image_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Use this code to load an actual image:
        # img = ImageTk.PhotoImage(Image.open("path/to/image.png"))
        # self.image_${component.id}.configure(image=img)
        # self.images.append(img)  # Keep a reference`;
      case 'slider':
        return `        self.slider_${component.id} = tk.Scale(root, from_=${component.props.from || 0}, to=${component.props.to || 100}, orient="${component.props.orient || 'horizontal'}")
        self.slider_${component.id}.set(${component.props.value || 50})
        self.slider_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'frame':
        return `        self.frame_${component.id} = tk.Frame(root, bd=${component.props.borderwidth || 1}, relief="${component.props.relief || 'flat'}")
        self.frame_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'checkbox':
        return `        self.var_${component.id} = tk.BooleanVar(value=${component.props.checked ? 'True' : 'False'})
        self.checkbox_${component.id} = tk.Checkbutton(root, text="${component.props.text || 'Checkbox'}", variable=self.var_${component.id})
        self.checkbox_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'datepicker':
        return `        self.datepicker_${component.id} = tk.Entry(root)
        self.datepicker_${component.id}.insert(0, "${component.props.format || 'yyyy-mm-dd'}")
        self.datepicker_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # This is a simple entry field in Tkinter
        # For a real date picker, you'd need to implement a calendar popup`;
      case 'progressbar':
        return `        self.progress_${component.id} = ttk.Progressbar(root, orient="horizontal", length=${Math.round(component.size.width)}, mode='determinate')
        self.progress_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.progress_${component.id}["value"] = ${component.props.value || 50}`;
      case 'notebook':
        const tabsRaw = component.props.tabs || 'Tab 1,Tab 2,Tab 3';
        const tabsList = tabsRaw.split(',').map((tab: string) => tab.trim());
        let notebookCode = `        self.notebook_${component.id} = ttk.Notebook(root)
        self.notebook_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        tabsList.forEach((tab: string, i: number) => {
          notebookCode += `\n        self.tab_${component.id}_${i} = tk.Frame(self.notebook_${component.id})
        self.notebook_${component.id}.add(self.tab_${component.id}_${i}, text="${tab}")`;
        });
        
        return notebookCode;
      case 'listbox':
        const items = component.props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5';
        const itemsList = items.split(',').map((item: string) => item.trim());
        
        let listboxCode = `        self.listbox_${component.id} = tk.Listbox(root)
        self.listbox_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        itemsList.forEach((item: string, i: number) => {
          listboxCode += `\n        self.listbox_${component.id}.insert(${i}, "${item}")`;
        });
        
        return listboxCode;
      case 'canvas':
        return `        self.canvas_${component.id} = tk.Canvas(root, bd=${component.props.borderwidth || 1})
        self.canvas_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'dropdown':
        const options = component.props.options || 'Option 1,Option 2,Option 3';
        const optionsList = options.split(',').map((option: string) => option.trim());
        return `        self.dropdown_var_${component.id} = tk.StringVar(value="${component.props.selected || optionsList[0]}")
        self.dropdown_${component.id} = ttk.Combobox(root, textvariable=self.dropdown_var_${component.id})
        self.dropdown_${component.id}['values'] = (${optionsList.map(opt => `"${opt}"`).join(', ')})
        self.dropdown_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      default:
        return '';
    }
  }).join('\n\n');

  const main = `
if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()
`;

  return imports + setupComponents + main;
};

const generateCustomTkinterCode = (components: any[]) => {
  const imports = `import customtkinter as ctk
from PIL import Image, ImageTk
import os

class App:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("CustomTkinter GUI")
        self.create_widgets()
        
    def create_widgets(self):
`;

  const setupComponents = components.map(component => {
    switch (component.type) {
      case 'button':
        return `        self.button_${component.id} = ctk.CTkButton(self.root, text="${component.props.text || 'Button'}", width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.button_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
      case 'label':
        return `        self.label_${component.id} = ctk.CTkLabel(self.root, text="${component.props.text || 'Label'}", width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.label_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
      case 'entry':
        return `        self.entry_${component.id} = ctk.CTkEntry(self.root, placeholder_text="${component.props.placeholder || ''}", width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.entry_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
      case 'image':
        return `        # Image placeholder - replace with your own image 
        self.image_${component.id} = ctk.CTkLabel(self.root, text="Image", width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.image_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
        # Use this code to load an actual image:
        # img = Image.open("path/to/image.png")
        # ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=(${Math.round(component.size.width)}, ${Math.round(component.size.height)}))
        # self.image_${component.id}.configure(image=ctk_img, text="")`;
      case 'slider':
        return `        self.slider_${component.id} = ctk.CTkSlider(self.root, from_=${component.props.from || 0}, to=${component.props.to || 100}, orientation="${component.props.orient || 'horizontal'}", width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.slider_${component.id}.set(${component.props.value || 50})
        self.slider_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
      case 'frame':
        return `        self.frame_${component.id} = ctk.CTkFrame(self.root, border_width=${component.props.borderwidth || 1}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.frame_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
      case 'checkbox':
        return `        self.checkbox_${component.id} = ctk.CTkCheckBox(self.root, text="${component.props.text || 'Checkbox'}", width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        ${component.props.checked ? 'self.checkbox_' + component.id + '.select()' : 'self.checkbox_' + component.id + '.deselect()'}
        self.checkbox_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
      case 'datepicker':
        return `        self.datepicker_${component.id} = ctk.CTkEntry(self.root, placeholder_text="${component.props.format || 'yyyy-mm-dd'}", width=${Math.round(component.size.width) - 30}, height=${Math.round(component.size.height)})
        self.datepicker_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
        self.calendar_button_${component.id} = ctk.CTkButton(self.root, text="📅", width=30, height=${Math.round(component.size.height)})
        self.calendar_button_${component.id}.place(x=${Math.round(component.position.x) + Math.round(component.size.width) - 30}, y=${Math.round(component.position.y)})`;
      case 'progressbar':
        return `        self.progressbar_${component.id} = ctk.CTkProgressBar(self.root, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.progressbar_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})
        self.progressbar_${component.id}.set(${(component.props.value || 50) / 100})`;
      case 'notebook':
        const tabsRaw = component.props.tabs || 'Tab 1,Tab 2,Tab 3';
        const tabsList = tabsRaw.split(',').map((tab: string) => tab.trim());
        
        let notebookCode = `        self.tabview_${component.id} = ctk.CTkTabview(self.root, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.tabview_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
        
        tabsList.forEach((tab: string) => {
          const safeTabName = tab.replace(/\s+/g, '_');
          notebookCode += `\n        self.tab_${component.id}_${safeTabName} = self.tabview_${component.id}.add("${tab}")`;
        });
        
        notebookCode += `\n        self.tabview_${component.id}.set("${component.props.selectedTab || tabsList[0]}")`;
        return notebookCode;
      case 'listbox':
        const items = component.props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5';
        const itemsList = items.split(',').map((item: string) => item.trim());
        
        let listboxCode = `        self.scrollable_frame_${component.id} = ctk.CTkScrollableFrame(self.root, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.scrollable_frame_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
        
        itemsList.forEach((item: string, i: number) => {
          listboxCode += `\n        self.item_${component.id}_${i} = ctk.CTkLabel(self.scrollable_frame_${component.id}, text="${item}", anchor="w")
        self.item_${component.id}_${i}.pack(fill="x", padx=5, pady=2)`;
        });
        
        return listboxCode;
      case 'canvas':
        return `        self.canvas_${component.id} = ctk.CTkCanvas(self.root, bd=${component.props.borderwidth || 1}, highlightthickness=0, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.canvas_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
      case 'dropdown':
        const options = component.props.options || 'Option 1,Option 2,Option 3';
        const optionsList = options.split(',').map((option: string) => option.trim());
        return `        self.dropdown_${component.id} = ctk.CTkOptionMenu(self.root, 
            values=[${optionsList.map(opt => `"${opt}"`).join(', ')}],
            width=${Math.round(component.size.width)}, 
            height=${Math.round(component.size.height)})
        self.dropdown_${component.id}.set("${component.props.selected || optionsList[0]}")
        self.dropdown_${component.id}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
      default:
        return '';
    }
  }).join('\n\n');

  const main = `
if __name__ == "__main__":
    app = App()
    app.root.mainloop()
`;

  return imports + setupComponents + main;
};
