
import React, { useState, useEffect } from 'react';
import { generatePythonCode } from '@/utils/codeGenerator';
import Prism from 'prismjs';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CodePreviewProps {
  components: any[];
  visible: boolean;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ components, visible }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (visible) {
      // Ensure component properties are correctly prepared
      const preparedComponents = components.map(component => ({
        ...component,
        properties: component.properties || {}
      }));
      
      const pythonCode = generatePythonCode(preparedComponents);
      setCode(pythonCode);
    }
  }, [components, visible]);

  useEffect(() => {
    if (visible) {
      Prism.highlightAll();
    }
  }, [code, visible]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="h-full overflow-auto bg-background p-4">
      <div className="mb-4 bg-muted p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Generated Python Code (CustomTkinter)</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          This is a preview of the CustomTkinter Python code that will be generated.
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
