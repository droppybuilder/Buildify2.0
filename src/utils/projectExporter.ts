import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generatePythonCode } from './pythonCodeGenerator';
import { collectComponentImages } from './codeGeneratorUtils';

/**
 * Exports the project as a ZIP file containing Python code and required files
 * @param components The list of components to export
 * @param windowSettings Optional window settings object containing title, size, and bgColor
 */
export async function exportProject(
  components: any[], 
  windowSettings = { 
    title: 'My CustomTkinter Application', 
    size: { width: 800, height: 600 }, 
    bgColor: '#1A1A1A' 
  }
) {
  try {
    console.log(`Starting project export with ${components.length} components`);
    
    // Create a new JSZip instance
    const zip = new JSZip();
      // Generate Python code
    console.log('Generating Python code...');
    const pythonCode = generatePythonCode(components, windowSettings);
    
    // Add files to the zip
    zip.file("app.py", pythonCode);
    zip.file("requirements.txt", "customtkinter>=5.2.0\nPillow>=9.0.0\ntkcalendar>=1.6.1\n");
    zip.file("README.md", generateReadmeContent(windowSettings.title));
    
    // Create the assets directory
    const assets = zip.folder("assets");
    if (!assets) {
      throw new Error("Failed to create assets directory in ZIP");
    }
    
    // Create a placeholder image and add it to assets
    console.log('Adding placeholder image...');
    try {
      const placeholderImageData = generatePlaceholderImage();
      assets.file("placeholder.png", placeholderImageData, {base64: true});
      console.log('✓ Placeholder image added successfully');
    } catch (placeholderError) {
      console.error('Failed to add placeholder image:', placeholderError);
      // Continue without placeholder if it fails
    }
    
    // Image processing - completely safe, never fails the export
    console.log('Processing component images...');
    try {
      const componentImages = collectComponentImages(components);
      
      if (Object.keys(componentImages).length > 0) {
        console.log(`Found ${Object.keys(componentImages).length} images to process`);
        
        for (const [src, fileName] of Object.entries(componentImages)) {
          try {
            if (src && typeof src === 'string' && src.startsWith('data:') && src.includes(',')) {
              const commaIndex = src.indexOf(',');
              const base64Data = src.substring(commaIndex + 1);
              
              const validBase64 = validateAndCleanBase64(base64Data);
              if (validBase64) {
                assets.file(fileName, validBase64, { base64: true });
                console.log(`✓ Added image: ${fileName}`);
              } else {
                // Use placeholder for invalid images
                assets.file(fileName, generatePlaceholderImage(), { base64: true });
                console.log(`✓ Added placeholder for invalid image: ${fileName}`);
              }
            }
          } catch (imageError) {
            console.warn(`Failed to process image ${fileName}:`, imageError);
            // Skip this image and continue
          }
        }
      } else {
        console.log('No images found in components');
      }
    } catch (imageProcessingError) {
      console.warn('Error during image processing:', imageProcessingError);
      // Continue without images
    }
    
    // Generate the zip file
    console.log('Generating ZIP file...');
    const content = await zip.generateAsync({ 
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6
      }
    });
    
    // Save the zip file
    console.log('Saving ZIP file...');
    saveAs(content, "customtkinter-project.zip");
    console.log("Project export completed successfully");
    
  } catch (error) {
    console.error("Error exporting project:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to export project";
    if (error instanceof Error) {
      if (error.message.includes('ZIP') || error.message.includes('zip')) {
        errorMessage += ": Failed to create ZIP archive. Please try again.";
      } else if (error.message.includes('Python') || error.message.includes('code')) {
        errorMessage += ": Failed to generate code. Please check your components and try again.";
      } else {
        errorMessage += `: ${error.message}`;
      }
    } else {
      errorMessage += ": Unknown error occurred";
    }
    
    throw new Error(errorMessage);
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

## Troubleshooting
If your GUI doesn't load properly or shows a blank window:
- Make sure all required packages are installed correctly
- Check if all image files are in the correct locations
- Verify Python and PIL/Pillow versions are compatible
- If you see "load_image" related errors, the app structure has been corrected to properly handle this

### Image handling
The application is designed to handle missing images gracefully:
- If an image file is not found, a blue placeholder is displayed
- Image references are properly maintained to prevent garbage collection
- All images should be placed in the 'assets' folder

### Layout issues
- The application uses both place and grid layout managers
- Configure the window size in the App.__init__() method if needed
- For grid layout customization, modify the grid_columnconfigure and grid_rowconfigure settings

If you still encounter issues, please check the console output for detailed error messages.
`;
}

/**
 * Generates a simple placeholder PNG image
 * Returns a base64-encoded PNG image
 */
function generatePlaceholderImage(): string {
  // A minimal, guaranteed valid base64-encoded PNG image (1x1 transparent pixel)
  // This is the smallest possible valid PNG and is guaranteed to work with JSZip
  return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGKuXNDCwAAAABJRU5ErkJggg==';
}

/**
 * Validates and cleans base64 data
 * @param base64Data The base64 string to validate
 * @returns Cleaned and valid base64 string or null if invalid
 */
function validateAndCleanBase64(base64Data: string): string | null {
  // Return null for any invalid input instead of throwing errors
  try {
    if (!base64Data || typeof base64Data !== 'string') {
      console.debug('Invalid base64 input: not a string or empty');
      return null;
    }
    
    // Remove any whitespace and newlines
    let cleaned = base64Data.replace(/\s/g, '');
    
    // Remove any non-base64 characters (keep only A-Z, a-z, 0-9, +, /, =)
    cleaned = cleaned.replace(/[^A-Za-z0-9+/=]/g, '');
    
    // Check if the string is empty after cleaning
    if (cleaned.length === 0) {
      console.debug('Base64 string is empty after cleaning');
      return null;
    }
    
    // Remove any padding first to check the actual content length
    const withoutPadding = cleaned.replace(/=+$/, '');
    
    // Check minimum length (at least 4 characters for valid base64)
    if (withoutPadding.length < 4) {
      console.debug('Base64 string too short:', withoutPadding.length);
      return null;
    }
    
    // Add proper padding: base64 strings should be a multiple of 4 in length
    const remainder = withoutPadding.length % 4;
    let paddedBase64 = withoutPadding;
    if (remainder !== 0) {
      paddedBase64 += '='.repeat(4 - remainder);
    }
    
    // Validate the content length after padding
    if (paddedBase64.length % 4 !== 0) {
      console.debug('Base64 string has invalid length after padding:', paddedBase64.length);
      return null;
    }
    
    // Try to validate by attempting to decode (in browser environment)
    if (typeof atob !== 'undefined') {
      try {
        const decoded = atob(paddedBase64);
        // Check if decoded content makes sense (not empty, reasonable length)
        if (decoded.length === 0) {
          console.debug('Base64 decoded to empty content');
          return null;
        }
        console.debug(`Base64 validation successful: ${paddedBase64.length} chars -> ${decoded.length} bytes`);
        return paddedBase64;
      } catch (decodeError) {
        console.debug('Base64 decode failed:', decodeError);
        // Try a more lenient approach - remove any problematic characters at the end
        try {
          const lenientBase64 = withoutPadding.substring(0, Math.floor(withoutPadding.length / 4) * 4);
          if (lenientBase64.length >= 4) {
            const finalPadding = lenientBase64.length % 4;
            const finalPaddedBase64 = lenientBase64 + (finalPadding !== 0 ? '='.repeat(4 - finalPadding) : '');
            
            const lenientDecoded = atob(finalPaddedBase64);
            if (lenientDecoded.length > 0) {
              console.debug('Base64 validation successful with lenient approach');
              return finalPaddedBase64;
            }
          }
        } catch (secondError) {
          console.debug('Lenient base64 validation also failed:', secondError);
        }
        return null;
      }
    }
    
    // If atob is not available, assume the cleaned base64 is valid
    return paddedBase64;
    
  } catch (error) {
    console.debug('Unexpected error in base64 validation:', error);
    return null;
  }
}
