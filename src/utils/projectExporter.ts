
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generatePythonCode } from './pythonCodeGenerator';

/**
 * Exports the project as a ZIP file containing Python code and required files
 * @param components The list of components to export
 * @param windowTitle Optional title for the application window
 */
export async function exportProject(components: any[], windowTitle?: string) {
  try {
    // Create a new JSZip instance
    const zip = new JSZip();
    
    // Generate Python code
    const pythonCode = generatePythonCode(components, windowTitle);
    
    // Add files to the zip
    zip.file("app.py", pythonCode);
    zip.file("requirements.txt", "customtkinter>=5.2.0\nPillow>=9.0.0\ntkcalendar>=1.6.1\n");
    zip.file("README.md", generateReadmeContent());
    zip.file("assets/placeholder.png", ""); // Create assets folder
    
    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });
    
    // Save the zip file
    saveAs(content, "customtkinter-project.zip");
  } catch (error) {
    console.error("Error exporting project:", error);
    throw error;
  }
}

/**
 * Generates the content for the README.md file
 */
function generateReadmeContent(): string {
  return `# CustomTkinter GUI Application

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
- Modern UI with system theme detection (adapts to your OS settings)
- Responsive layout with grid system
- Customizable components
- Cross-platform compatibility (Windows, macOS, Linux)

## Theme settings
This application uses CustomTkinter's system mode by default to match your operating system theme:
\`\`\`python
ctk.set_appearance_mode("system")
\`\`\`

You can also manually set it to "light" or "dark" by changing the above line.

## Layout configuration
The app uses both place geometry manager for absolute positioning and grid layout for responsive design.
To make a widget use the grid layout instead of place, set these properties in the component:
- row: grid row position
- column: grid column position
- rowspan: number of rows to span
- columnspan: number of columns to span
- sticky: directions to stick to cell edges (n, s, e, w)

## Troubleshooting
If your UI doesn't match the preview:
- Make sure you have the latest version of CustomTkinter installed
- Check that the appearance mode and color theme are set correctly
- For DatePicker, ensure you have tkcalendar installed
`;
}
