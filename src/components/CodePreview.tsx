
import React, { useState, useEffect } from 'react';
import { generatePythonCode } from '@/utils/codeGenerator';
import Prism from 'prismjs';
import { Button } from '@/components/ui/button';

interface CodePreviewProps {
  components: any[];
  visible: boolean;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ components, visible }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (visible) {
      const pythonCode = generatePythonCode(components);
      setCode(pythonCode);
    }
  }, [components, visible]);

  useEffect(() => {
    if (visible) {
      Prism.highlightAll();
    }
  }, [code, visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="h-full overflow-auto bg-background p-4">
      <div className="mb-4 bg-muted p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Generated Python Code (Tkinter)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This is a preview of the Python code that will be generated.
        </p>
        <div className="relative">
          <pre className="overflow-x-auto rounded-md bg-[#282c34] p-4">
            <code className="language-python">{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
