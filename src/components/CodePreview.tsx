
import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css'; // Base theme which we'll override with our custom CSS
import { generateCode } from '@/utils/codeGenerator';

interface CodePreviewProps {
  components: any[];
  isTkinter: boolean;
}

export const CodePreview = ({ components, isTkinter }: CodePreviewProps) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [code, setCode] = useState<string>("");

  // Generate code when components or isTkinter changes
  useEffect(() => {
    console.log("Generating code, isTkinter:", isTkinter);
    try {
      const generatedCode = generateCode(components, isTkinter);
      setCode(generatedCode);
      
      if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
      }
    } catch (error) {
      console.error("Error generating code:", error);
      // Fallback code if generation fails
      const fallbackCode = isTkinter 
        ? `import tkinter as tk\n# Error generating code: ${error}`
        : `import customtkinter as ctk\n# Error generating code: ${error}`;
      setCode(fallbackCode);
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
