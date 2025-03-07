
import React, { useState, useEffect } from 'react';
import { generatePythonCode, exportProject } from '@/utils/codeGenerator';
import Prism from 'prismjs';
import { Button } from '@/components/ui/button';
import { Copy, Download, Clipboard, Code, File } from 'lucide-react';
import { toast } from 'sonner';

interface CodePreviewProps {
  components: any[];
  visible: boolean;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ components, visible }) => {
  const [code, setCode] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [codeTab, setCodeTab] = useState<'preview' | 'requirements' | 'readme'>('preview');

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
  }, [code, visible, codeTab]);

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

  const requirementsCode = `customtkinter>=5.2.0
Pillow>=9.0.0
`;

  const readmeCode = `# CustomTkinter GUI Application

This is a modern CustomTkinter GUI application generated with GUI Builder.

## Requirements
- Python 3.7 or later
- Packages listed in requirements.txt

## Installation
1. Install Python from https://www.python.org/downloads/
2. Install dependencies: \`pip install -r requirements.txt\`

## Running the application
\`\`\`
python app.py
\`\`\`

## Features
- Modern UI with CustomTkinter
- Responsive layout
- Customizable components
- Cross-platform compatibility (Windows, macOS, Linux)

## Troubleshooting
If you encounter errors:
1. Make sure you have the correct version of CustomTkinter installed (5.2.0+)
2. Check that all required packages are installed
3. Verify Python version is 3.7 or later
`;

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
        
        <div className="flex space-x-2 mb-4 border-b">
          <Button 
            variant={codeTab === 'preview' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setCodeTab('preview')}
            className="flex items-center gap-1 rounded-b-none"
          >
            <Code className="h-4 w-4" />
            <span>app.py</span>
          </Button>
          <Button 
            variant={codeTab === 'requirements' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setCodeTab('requirements')}
            className="flex items-center gap-1 rounded-b-none"
          >
            <File className="h-4 w-4" />
            <span>requirements.txt</span>
          </Button>
          <Button 
            variant={codeTab === 'readme' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setCodeTab('readme')}
            className="flex items-center gap-1 rounded-b-none"
          >
            <File className="h-4 w-4" />
            <span>README.md</span>
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {codeTab === 'preview' && "This code creates a CustomTkinter application with all your designed components."}
          {codeTab === 'requirements' && "Required packages to run the application."}
          {codeTab === 'readme' && "README documentation for your project."}
        </p>
        
        <div className="relative">
          <pre className="overflow-x-auto rounded-md bg-[#282c34] p-4">
            <code className={`language-${codeTab === 'preview' ? 'python' : codeTab === 'readme' ? 'markdown' : 'bash'}`}>
              {codeTab === 'preview' 
                ? code 
                : codeTab === 'requirements' 
                  ? requirementsCode 
                  : readmeCode}
            </code>
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
