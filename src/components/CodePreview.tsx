
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

const generateTkinterCode = (components: any[]) => {
  const imports = `import tkinter as tk
from tkinter import ttk

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Tkinter GUI")
`;

  const setupComponents = components.map(component => {
    switch (component.type) {
      case 'button':
        return `        self.button_${component.id} = tk.Button(root, text="${component.props.text}")
        self.button_${component.id}.place(x=${component.position.x}, y=${component.position.y}, width=${component.size.width}, height=${component.size.height})`;
      case 'label':
        return `        self.label_${component.id} = tk.Label(root, text="${component.props.text}")
        self.label_${component.id}.place(x=${component.position.x}, y=${component.position.y}, width=${component.size.width}, height=${component.size.height})`;
      case 'entry':
        return `        self.entry_${component.id} = tk.Entry(root)
        self.entry_${component.id}.place(x=${component.position.x}, y=${component.position.y}, width=${component.size.width}, height=${component.size.height})`;
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

class App:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("CustomTkinter GUI")
`;

  const setupComponents = components.map(component => {
    switch (component.type) {
      case 'button':
        return `        self.button_${component.id} = ctk.CTkButton(self.root, text="${component.props.text}")
        self.button_${component.id}.place(x=${component.position.x}, y=${component.position.y}, width=${component.size.width}, height=${component.size.height})`;
      case 'label':
        return `        self.label_${component.id} = ctk.CTkLabel(self.root, text="${component.props.text}")
        self.label_${component.id}.place(x=${component.position.x}, y=${component.position.y}, width=${component.size.width}, height=${component.size.height})`;
      case 'entry':
        return `        self.entry_${component.id} = ctk.CTkEntry(self.root)
        self.entry_${component.id}.place(x=${component.position.x}, y=${component.position.y}, width=${component.size.width}, height=${component.size.height})`;
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
