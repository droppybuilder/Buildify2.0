
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generatePythonCode } from './pythonCodeGenerator';
import { collectComponentImages } from './codeGeneratorUtils';

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
    zip.file("README.md", generateReadmeContent(windowTitle));
    
    // Create the assets directory
    const assets = zip.folder("assets");
    
    // Collect images from components
    const componentImages = collectComponentImages(components);
    
    // Process and add images to the zip
    for (const [src, fileName] of Object.entries(componentImages)) {
      try {
        // Convert data URL to binary
        const base64Data = src.substring(src.indexOf(',') + 1);
        if (assets) {
          assets.file(fileName, base64Data, { base64: true });
        }
      } catch (err) {
        console.error(`Error processing image ${fileName}:`, err);
      }
    }
    
    // Always include a placeholder image for fallback
    const placeholderImageData = generatePlaceholderImage();
    zip.file("placeholder.png", placeholderImageData, {base64: true});
    
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
 * @param windowTitle The window title for the app
 */
function generateReadmeContent(windowTitle?: string): string {
  return `# ${windowTitle || "CustomTkinter GUI Application"}

This is a modern CustomTkinter GUI application generated with GUI Builder.

## Requirements
- Python 3.7 or later
- Packages listed in requirements.txt

## Installation
1. Install Python from https://www.python.org/downloads/
2. Install dependencies: 
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

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
- If images don't load, check that they are in the correct folder (root or assets subfolder)

### Common Issues
- **Image loading errors**: Make sure all images are in the project folder or in the assets subfolder
- **Unknown font style errors**: Font styles should be either "normal", "bold", "italic", or "bold italic"
- **Layout issues**: If widgets overlap, consider using grid layout with appropriate row/column settings
- **Dark mode appearance**: If dark mode looks incorrect, make sure your system theme is set to dark

## Customization
You can customize the appearance of the application by modifying the following settings:
- Change the appearance mode: "light", "dark", or "system" (uses OS setting)
- Change the color theme: "blue", "green", or "dark-blue"
- Adjust the window size and title
- Customize each widget's properties (colors, fonts, sizes, etc.)
`;
}

/**
 * Generates a simple placeholder PNG image
 * Returns a base64-encoded PNG image
 */
function generatePlaceholderImage(): string {
  // A minimal base64-encoded PNG image (a blue square)
  return 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAF3SURBVHhe7dAxAQAwDASh+je9+WsYD0LACQScgIATEHACAk5AwAkIOAEBJyDgBASc+7N3lY0dwGF4AkvQOLO8AY0rhcc4zPLs2TU77d21+xPIA8QD+fkB4oFkyzHngXggOSACyRLZcsx5IB5IDogvWVkiW445D8QDyQERSJbIlmPOA/FAckAEkiWy5ZjzQDyQHBCBZIlsOeY8EA8kB0QgWSJbjjkPxAPJARFIlsiWY84D8UByQASSJbLlmPNAPJAcEIFkiWw55jwQDyQHRCBZIluOOQ/EA8kBEUiWyJZjzgPxQHJABJIlsuWY80A8kBwQgWSJbDnmPBAPJAdEIFkiW445D8QDyQERSJbIlmPOA/FAckAEkiWy5ZjzQDyQHBCBZIlsOeY8EA8kB0QgWSJbDyQHRCBZIlsOeY8EA8kB0QgWSJbDnmPBAPJAcEIFkiWy5ZjzQDyQHRCBZIlsOeY8EA8kBEUiWyJZjzgPxQArtpXaW3e+UawAAAABJRU5ErkJggg==';
}
