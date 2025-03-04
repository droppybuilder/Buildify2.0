
import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
// Remove the problematic import for HTML highlighting
import 'prismjs/themes/prism.css';
import { generateCode } from '@/utils/codeGenerator';

interface CodePreviewProps {
  components: any[];
  isTkinter: boolean;
}

export const CodePreview = ({ components, isTkinter }: CodePreviewProps) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [code, setCode] = useState<string>("");
  const [codeType, setCodeType] = useState<"python" | "html" | "javascript">("python");
  
  // Generate code when components or isTkinter changes
  useEffect(() => {
    console.log("CodePreview - Generating code with mode:", isTkinter ? "Tkinter" : "Eel");
    console.log("CodePreview - Components count:", components.length);
    
    try {
      if (codeType === "python") {
        const generatedCode = generateCode(components, isTkinter);
        setCode(generatedCode);
      } else if (codeType === "html" && !isTkinter) {
        setCode(generateHtmlTemplate());
      } else if (codeType === "javascript" && !isTkinter) {
        setCode(generateJavaScript(components));
      } else {
        // Default to Python if we're in an invalid state
        setCodeType("python");
        const generatedCode = generateCode(components, isTkinter);
        setCode(generatedCode);
      }
      
      if (codeRef.current) {
        // For HTML, since we don't have prism-html component, we can use markup
        // which is included in the core Prism package
        if (codeType === "html") {
          codeRef.current.className = "code-preview language-markup";
        }
        Prism.highlightElement(codeRef.current);
      }
    } catch (error) {
      console.error("Error generating code:", error);
      setCode(`# Error generating code: ${error}`);
    }
  }, [components, isTkinter, codeType]);

  // Apply syntax highlighting whenever code changes
  useEffect(() => {
    if (codeRef.current) {
      // For HTML, since we don't have prism-html component, we can use markup
      if (codeType === "html") {
        codeRef.current.className = "code-preview language-markup";
      }
      Prism.highlightElement(codeRef.current);
    }
  }, [code, codeType]);
  
  // Generate HTML template for Eel
  const generateHtmlTemplate = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eel GUI Application</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="app-container">
        <div id="componentContainer" class="component-container">
            <!-- Components will be rendered here dynamically -->
        </div>
    </div>
    
    <script type="text/javascript" src="/eel.js"></script>
    <script src="js/app.js"></script>
</body>
</html>`;
  };
  
  // Generate JavaScript for Eel
  const generateJavaScript = (components: any[]) => {
    return `// Main application JavaScript for Eel
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize the application
    await initApp();
});

// Initialize the application
async function initApp() {
    try {
        // Get components from Python
        const components = await eel.get_components()();
        
        // Render components
        renderComponents(components);
        
        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Render components based on data from Python
function renderComponents(components) {
    const container = document.getElementById('componentContainer');
    container.innerHTML = ''; // Clear existing components
    
    components.forEach(component => {
        const element = createComponentElement(component);
        container.appendChild(element);
    });
}

// Create DOM element for a component
function createComponentElement(component) {
    const element = document.createElement('div');
    element.id = \`component-\${component.id}\`;
    element.className = \`component component-\${component.type}\`;
    element.style.position = 'absolute';
    element.style.left = \`\${component.position.x}px\`;
    element.style.top = \`\${component.position.y}px\`;
    element.style.width = \`\${component.size.width}px\`;
    element.style.height = \`\${component.size.height}px\`;
    
    // Create inner content based on component type
    switch(component.type) {
        case 'button':
            element.innerHTML = \`<button class="eel-button">\${component.props.text || 'Button'}</button>\`;
            element.querySelector('button').addEventListener('click', () => {
                handleComponentAction(component.id, 'click');
            });
            break;
            
        case 'label':
            element.innerHTML = \`<div class="eel-label">\${component.props.text || 'Label'}</div>\`;
            break;
            
        case 'entry':
            element.innerHTML = \`<input type="text" class="eel-entry" placeholder="\${component.props.placeholder || ''}">\`;
            element.querySelector('input').addEventListener('change', (e) => {
                handleComponentAction(component.id, 'change', { value: e.target.value });
            });
            break;
            
        case 'image':
            element.innerHTML = \`<img src="images/image_\${component.id}.png" class="eel-image">\`;
            break;
            
        case 'slider':
            element.innerHTML = \`<input type="range" min="\${component.props.min || 0}" max="\${component.props.max || 100}" class="eel-slider">\`;
            element.querySelector('input').addEventListener('input', (e) => {
                handleComponentAction(component.id, 'change', { value: e.target.value });
            });
            break;
            
        case 'checkbox':
            element.innerHTML = \`<label class="eel-checkbox"><input type="checkbox"><span>\${component.props.text || 'Checkbox'}</span></label>\`;
            element.querySelector('input').addEventListener('change', (e) => {
                handleComponentAction(component.id, 'change', { checked: e.target.checked });
            });
            break;
            
        default:
            element.innerHTML = \`<div class="eel-unknown">\${component.type}</div>\`;
    }
    
    return element;
}

// Handle component actions
async function handleComponentAction(componentId, action, data = null) {
    try {
        const result = await eel.handle_component_action(componentId, action, data)();
        console.log('Action result:', result);
    } catch (error) {
        console.error('Error handling component action:', error);
    }
}

// Set up global event listeners
function setupEventListeners() {
    // Example global event listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            console.log('Escape key pressed');
        }
    });
}

// Update a specific component
async function updateComponent(componentId, properties) {
    try {
        const result = await eel.update_component(componentId, properties)();
        if (result.status === 'success') {
            // Refresh components to reflect changes
            const components = await eel.get_components()();
            renderComponents(components);
        }
    } catch (error) {
        console.error('Error updating component:', error);
    }
}`;
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white">
      <div className="code-preview-header p-3 border-b flex justify-between items-center">
        <span className="font-semibold">Code Preview</span>
        <div className="flex items-center space-x-2">
          {!isTkinter && (
            <div className="flex space-x-1">
              <button 
                onClick={() => setCodeType("python")}
                className={`text-xs px-2 py-1 rounded ${codeType === "python" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                Python
              </button>
              <button 
                onClick={() => setCodeType("html")}
                className={`text-xs px-2 py-1 rounded ${codeType === "html" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                HTML
              </button>
              <button 
                onClick={() => setCodeType("javascript")}
                className={`text-xs px-2 py-1 rounded ${codeType === "javascript" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                JavaScript
              </button>
            </div>
          )}
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded ml-2">
            {isTkinter ? "Tkinter" : "Eel"}
          </span>
        </div>
      </div>
      <div className="code-preview-container flex-1 overflow-auto p-3">
        <pre 
          className={`code-preview ${codeType === "html" ? "language-markup" : `language-${codeType}`} h-full m-0`} 
          ref={codeRef}
        >
          <code className={codeType === "html" ? "language-markup" : `language-${codeType}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};
