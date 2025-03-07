
import React, { useState, useEffect } from 'react';
import { generatePythonCode, exportProject } from '@/utils/codeGenerator';
import Prism from 'prismjs';
import { Button } from '@/components/ui/button';
import { Copy, Download, Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface CodePreviewProps {
  components: any[];
  visible: boolean;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ components, visible }) => {
  const [code, setCode] = useState('');
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExport = async () => {
    try {
      setIsExporting(true);
      // Ensure component properties are correctly prepared
      const preparedComponents = components.map(component => ({
        ...component,
        properties: component.properties || {}
      }));
      
      await exportProject(preparedComponents);
      toast.success("Project exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export project. Check console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="h-full overflow-auto bg-background p-4">
      <div className="mb-4 bg-muted p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Generated Python Code (CustomTkinter)</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyToClipboard}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>{isExporting ? "Exporting..." : "Export Project"}</span>
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          This code will create a CustomTkinter application with all your designed components.
        </p>
        <div className="relative">
          <pre className="overflow-x-auto rounded-md bg-[#282c34] p-4">
            <code className="language-python">{code}</code>
          </pre>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        <h3 className="font-medium text-foreground mb-2">Usage Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Export the project using the button above</li>
          <li>Extract the downloaded ZIP file</li>
          <li>Install the required dependencies with <code className="bg-muted-foreground/20 px-1 rounded">pip install -r requirements.txt</code></li>
          <li>Run the application with <code className="bg-muted-foreground/20 px-1 rounded">python app.py</code></li>
        </ol>
      </div>
    </div>
  );
};
