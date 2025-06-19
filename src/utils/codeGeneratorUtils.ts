
/**
 * Utility functions for code generation
 */

/**
 * Sanitizes component IDs to be valid Python variable names
 * @param id The component ID to sanitize
 */
export function sanitizeId(id: string): string {
  // Replace non-alphanumeric characters with underscores
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Extracts and formats properties for code generation
 * @param component The component to extract properties from
 */
export function getComponentProps(component: any): any {
  const props: any = {};
  
  // Extract basic properties
  props.x = Math.round(component.position?.x || 0);
  props.y = Math.round(component.position?.y || 0);
  props.width = Math.round(component.size?.width || 100);
  props.height = Math.round(component.size?.height || 30);
    // Extract style properties
  props.text = component.props?.text || '';
  props.bg_color = component.props?.bgColor || '#1A1A1A';  // Background color
  // For CustomTkinter: fg_color is the component background (button, frame, etc.)
  // fgColor from PropertyPanel is actually text color in the visual, but bgColor is the component background
  props.fg_color = component.props?.bgColor || '#3b82f6';  // Component background color (button color, frame color, etc.)
  props.text_color = component.props?.fgColor || '#ffffff';  // Text color
  props.cornerRadius = component.props?.cornerRadius || 8;
  props.borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
  props.borderColor = component.props?.borderColor || '#e2e8f0';
  
  // Properly format the font configuration
  const fontFamily = component.props?.fontFamily || "Arial";
  const fontSize = component.props?.fontSize || 12;
  const fontWeight = component.props?.fontWeight || "normal";
  const fontStyle = component.props?.fontStyle || "normal";
  
  // Build the font tuple string safely - DO NOT include in keyword arguments
  // Remove the trailing comma and parenthesis to fix the positional/keyword argument issue
  let fontConfig = `font=("${fontFamily}", ${fontSize}`;
  
  // Handle font style and weight combinations properly for CTk
  if (fontWeight === 'bold' && fontStyle === 'italic') {
    fontConfig += ', "bold italic"';
  } else if (fontWeight === 'bold') {
    fontConfig += ', "bold"';
  } else if (fontStyle === 'italic') {
    fontConfig += ', "italic"';
  } else {
    fontConfig += ', "normal"';
  }
  
  fontConfig += ')';
  props.fontConfig = fontConfig;
  
  // Toggle/checkbox state
  props.checked = component.props?.checked || false;
  props.value = component.props?.value !== undefined ? component.props.value : 0.5;
  
  // Handle visibility
  props.visible = component.visible !== false; // Default to true
  
  // For widgets that can be in on/off states
  props.isOn = component.props?.isOn === true;
  
  // Image properties if applicable
  if (component.props?.src || component.props?.image) {
    // Ensure proper path for images - assets folder
    let imagePath = component.props?.src || component.props?.image;
    
    // If it's a data URL, use the fileName property (which should be set in CodePreview.tsx)
    if (imagePath && imagePath.startsWith('data:') && component.props?.fileName) {
      imagePath = `assets/${component.props.fileName}`;
    }
    // If it's not a placeholder and doesn't already have assets/ prefix
    else if (imagePath && !imagePath.startsWith('assets/') && !imagePath.startsWith('placeholder')) {
      imagePath = `assets/${imagePath.split('/').pop()}`;
    }
    
    props.image = imagePath;
    props.image_size = {
      width: component.props?.imageWidth || props.width,
      height: component.props?.imageHeight || props.height
    };
    props.compound = component.props?.compound || 'left';
  }
  
  // Layout properties for grid and pack layouts
  props.padx = component.props?.padx !== undefined ? component.props.padx : 5;
  props.pady = component.props?.pady !== undefined ? component.props.pady : 5;
  props.row = component.props?.row !== undefined ? component.props.row : null;
  props.column = component.props?.column !== undefined ? component.props.column : null;
  props.rowspan = component.props?.rowspan || 1;
  props.columnspan = component.props?.columnspan || 1;
  props.sticky = component.props?.sticky || '';
  props.useGrid = component.props?.useGrid === true || 
                 (props.row !== null && props.column !== null);
  
  return props;
}

/**
 * Generates the grid placement code if grid layout properties exist
 * @param id Component ID
 * @param props Component properties
 * @param indent Indentation to use
 */
export function generateGridCode(id: string, props: any, indent: string): string {
  if (props.useGrid && props.row !== null && props.column !== null) {
    let code = '';
    const sticky = props.sticky ? `, sticky="${props.sticky}"` : '';
    code += `${indent}self.${id}.grid(row=${props.row}, column=${props.column}, rowspan=${props.rowspan}, columnspan=${props.columnspan}, padx=${props.padx}, pady=${props.pady}${sticky})\n`;
    return code;
  }
  return '';
}

/**
 * Converts an RGB hex color to a darker or lighter shade
 * @param hexColor The original hex color
 * @param percent Percentage to adjust brightness (negative = darker, positive = lighter)
 */
export function adjustColorBrightness(hexColor: string, percent: number): string {
  if (!hexColor || hexColor === 'transparent') {
    return hexColor;
  }
  
  // Remove # if present
  hexColor = hexColor.replace('#', '');
  
  // Parse the hex values
  let r = parseInt(hexColor.substring(0, 2), 16);
  let g = parseInt(hexColor.substring(2, 4), 16);
  let b = parseInt(hexColor.substring(4, 6), 16);
  
  // Adjust brightness
  r = Math.min(255, Math.max(0, Math.round(r * (1 + percent / 100))));
  g = Math.min(255, Math.max(0, Math.round(g * (1 + percent / 100))));
  b = Math.min(255, Math.max(0, Math.round(b * (1 + percent / 100))));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Ensures all component images are included in the assets
 * @param components The list of components
 * @returns Object mapping src URLs to filenames
 */
export function collectComponentImages(components: any[]): Record<string, string> {
  const images: Record<string, string> = {};
    if (!components || !components.length) {
    console.log('No components provided for image collection');
    return images;
  }
  
  // Process components to find all images
  const processComponent = (component: any) => {
    // Safety check for component structure
    if (!component || typeof component !== 'object' || !component.props) {
      return;
    }
    
    // Check for image source in props
    const src = component.props.src;
    const fileName = component.props.fileName;
    
    // Process data URLs for images - be very strict about validation
    if (src && typeof src === 'string' && src.startsWith('data:') && src.includes(',')) {
      // Use provided fileName or generate a unique one based on component type and ID
      let imageFileName = fileName;
      
      if (!imageFileName) {
        const componentType = component.type || 'component';
        const componentId = component.id || 'unknown';
        const timestamp = Date.now();
        imageFileName = `${componentType}-${componentId}-${timestamp}.png`;
      }
      
      // Ensure the filename has a proper extension
      if (!imageFileName.match(/\.(png|jpg|jpeg|gif|bmp|webp)$/i)) {
        imageFileName += '.png';
      }
      
      console.log(`Found image in component ${component.id}: ${imageFileName} (src length: ${src.length})`);
      images[src] = imageFileName;
    }
      // Also check for image property which might be used in some components
    const image = component.props.image;
    if (image && typeof image === 'string' && image.startsWith('data:') && image.includes(',')) {
      let imageFileName = fileName;
      
      if (!imageFileName) {
        const componentType = component.type || 'component';
        const componentId = component.id || 'unknown';
        const timestamp = Date.now();
        imageFileName = `${componentType}-${componentId}-image-${timestamp}.png`;
      }
      
      // Ensure the filename has a proper extension
      if (!imageFileName.match(/\.(png|jpg|jpeg|gif|bmp|webp)$/i)) {
        imageFileName += '.png';
      }
      
      console.log(`Found image property in component ${component.id}: ${imageFileName} (image length: ${image.length})`);
      images[image] = imageFileName;
    }
  };
  // Process each component with error handling
  components.forEach((component, index) => {
    try {
      processComponent(component);
    } catch (error) {
      console.warn(`Error processing component at index ${index}:`, error);
      // Continue processing other components
    }
  });
    console.log(`Collected ${Object.keys(images).length} images from ${components.length} components`);
  return images;
}
