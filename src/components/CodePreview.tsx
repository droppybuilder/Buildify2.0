
import { useMemo } from 'react';

interface CodePreviewProps {
  components: any[];
  isTkinter: boolean;
}

export const CodePreview = ({ components, isTkinter }: CodePreviewProps) => {
  const generatedCode = useMemo(() => {
    if (isTkinter) {
      return generateTkinterCode(components);
    }
    return generateCustomTkinterCode(components);
  }, [components, isTkinter]);

  return (
    <div className="h-64 border-t flex flex-col">
      <div className="p-2 bg-secondary border-b">
        <span className="text-xs font-medium">Generated Code</span>
      </div>
      <pre className="flex-1 p-4 overflow-auto text-sm bg-zinc-50">
        <code>{generatedCode}</code>
      </pre>
    </div>
  );
};

const sanitizeId = (id: string) => {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
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
    const safeId = sanitizeId(component.id);
    
    switch (component.type) {
      case 'button':
        return `        self.button_${safeId} = tk.Button(root, text="${component.props.text || 'Button'}")
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'label':
        return `        self.label_${safeId} = tk.Label(root, text="${component.props.text || 'Label'}")
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'entry':
        return `        self.entry_${safeId} = tk.Entry(root)
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'image':
        return `        # Image placeholder - replace with your own image
        self.image_${safeId} = tk.Label(root, text="Image")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Use this code to load an actual image:
        # img = ImageTk.PhotoImage(Image.open("path/to/image.png"))
        # self.image_${safeId}.configure(image=img)
        # self.images.append(img)  # Keep a reference`;
      case 'slider':
        return `        self.slider_${safeId} = tk.Scale(root, from_=${component.props.from || 0}, to=${component.props.to || 100}, orient="${component.props.orient || 'horizontal'}")
        self.slider_${safeId}.set(${component.props.value || 50})
        self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'frame':
        return `        self.frame_${safeId} = tk.Frame(root, bd=${component.props.borderwidth || 1}, relief="${component.props.relief || 'flat'}")
        self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'checkbox':
        return `        self.var_${safeId} = tk.BooleanVar(value=${component.props.checked ? 'True' : 'False'})
        self.checkbox_${safeId} = tk.Checkbutton(root, text="${component.props.text || 'Checkbox'}", variable=self.var_${safeId})
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'datepicker':
        return `        self.datepicker_${safeId} = tk.Entry(root)
        self.datepicker_${safeId}.insert(0, "${component.props.format || 'yyyy-mm-dd'}")
        self.datepicker_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # This is a simple entry field in Tkinter
        # For a real date picker, you'd need to implement a calendar popup`;
      case 'progressbar':
        return `        self.progress_${safeId} = ttk.Progressbar(root, orient="horizontal", length=${Math.round(component.size.width)}, mode='determinate')
        self.progress_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.progress_${safeId}["value"] = ${component.props.value || 50}`;
      case 'notebook':
        const tabsRaw = component.props.tabs || 'Tab 1,Tab 2,Tab 3';
        const tabsList = tabsRaw.split(',').map((tab: string) => tab.trim());
        let notebookCode = `        self.notebook_${safeId} = ttk.Notebook(root)
        self.notebook_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        tabsList.forEach((tab: string, i: number) => {
          notebookCode += `\n        self.tab_${safeId}_${i} = tk.Frame(self.notebook_${safeId})
        self.notebook_${safeId}.add(self.tab_${safeId}_${i}, text="${tab}")`;
        });
        
        return notebookCode;
      case 'listbox':
        const items = component.props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5';
        const itemsList = items.split(',').map((item: string) => item.trim());
        
        let listboxCode = `        self.listbox_${safeId} = tk.Listbox(root)
        self.listbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        itemsList.forEach((item: string, i: number) => {
          listboxCode += `\n        self.listbox_${safeId}.insert(${i}, "${item}")`;
        });
        
        return listboxCode;
      case 'canvas':
        return `        self.canvas_${safeId} = tk.Canvas(root, bd=${component.props.borderwidth || 1})
        self.canvas_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
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
    const safeId = sanitizeId(component.id);
    
    switch (component.type) {
      case 'button':
        return `        self.button_${safeId} = ctk.CTkButton(self.root, text="${component.props.text || 'Button'}")
        self.button_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'label':
        return `        self.label_${safeId} = ctk.CTkLabel(self.root, text="${component.props.text || 'Label'}")
        self.label_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'entry':
        return `        self.entry_${safeId} = ctk.CTkEntry(self.root, placeholder_text="${component.props.placeholder || ''}")
        self.entry_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'image':
        return `        # Image placeholder - replace with your own image 
        self.image_${safeId} = ctk.CTkLabel(self.root, text="Image")
        self.image_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        # Use this code to load an actual image:
        # img = Image.open("path/to/image.png")
        # ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=(${Math.round(component.size.width)}, ${Math.round(component.size.height)}))
        # self.image_${safeId}.configure(image=ctk_img, text="")`;
      case 'slider':
        return `        self.slider_${safeId} = ctk.CTkSlider(self.root, from_=${component.props.from || 0}, to=${component.props.to || 100}, orientation="${component.props.orient || 'horizontal'}")
        self.slider_${safeId}.set(${component.props.value || 50})
        self.slider_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'frame':
        return `        self.frame_${safeId} = ctk.CTkFrame(self.root, border_width=${component.props.borderwidth || 1})
        self.frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'checkbox':
        return `        self.checkbox_${safeId} = ctk.CTkCheckBox(self.root, text="${component.props.text || 'Checkbox'}")
        ${component.props.checked ? 'self.checkbox_' + safeId + '.select()' : 'self.checkbox_' + safeId + '.deselect()'}
        self.checkbox_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
      case 'datepicker':
        return `        self.datepicker_${safeId} = ctk.CTkEntry(self.root, placeholder_text="${component.props.format || 'yyyy-mm-dd'}")
        self.datepicker_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width) - 30}, height=${Math.round(component.size.height)})
        self.calendar_button_${safeId} = ctk.CTkButton(self.root, text="📅", width=30, height=${Math.round(component.size.height) - 4})
        self.calendar_button_${safeId}.place(x=${Math.round(component.position.x) + Math.round(component.size.width) - 30}, y=${Math.round(component.position.y)})`;
      case 'progressbar':
        return `        self.progressbar_${safeId} = ctk.CTkProgressBar(self.root)
        self.progressbar_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.progressbar_${safeId}.set(${(component.props.value || 50) / 100})`;
      case 'notebook':
        const tabsRaw = component.props.tabs || 'Tab 1,Tab 2,Tab 3';
        const tabsList = tabsRaw.split(',').map((tab: string) => tab.trim());
        
        let notebookCode = `        self.tabview_${safeId} = ctk.CTkTabview(self.root)
        self.tabview_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
        
        tabsList.forEach((tab: string) => {
          const safeTabName = tab.replace(/\s+/g, '_');
          notebookCode += `\n        self.tab_${safeId}_${safeTabName} = self.tabview_${safeId}.add("${tab}")`;
        });
        
        notebookCode += `\n        self.tabview_${safeId}.set("${component.props.selectedTab || tabsList[0]}")`;
        return notebookCode;
      case 'listbox':
        const items = component.props.items || 'Item 1,Item 2,Item 3,Item 4,Item 5';
        const itemsList = items.split(',').map((item: string) => item.trim());
        
        let listboxCode = `        self.scrollable_frame_${safeId} = ctk.CTkScrollableFrame(self.root, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})
        self.scrollable_frame_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)})`;
        
        itemsList.forEach((item: string, i: number) => {
          listboxCode += `\n        self.item_${safeId}_${i} = ctk.CTkLabel(self.scrollable_frame_${safeId}, text="${item}", anchor="w")
        self.item_${safeId}_${i}.pack(fill="x", padx=5, pady=2)`;
        });
        
        return listboxCode;
      case 'canvas':
        return `        self.canvas_${safeId} = ctk.CTkCanvas(self.root, bd=${component.props.borderwidth || 1}, highlightthickness=0)
        self.canvas_${safeId}.place(x=${Math.round(component.position.x)}, y=${Math.round(component.position.y)}, width=${Math.round(component.size.width)}, height=${Math.round(component.size.height)})`;
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
