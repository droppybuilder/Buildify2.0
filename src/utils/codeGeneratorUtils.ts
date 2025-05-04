
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
  props.bg_color = component.props?.bgColor || '#1A1A1A';  // Dark background to match web preview
  props.fg_color = component.props?.fgColor || component.props?.bgColor || '#3b82f6';
  props.text_color = component.props?.textColor || '#ffffff';  // Default to white text for dark mode
  props.cornerRadius = component.props?.cornerRadius || 8;
  props.borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
  props.borderColor = component.props?.borderColor || '#e2e8f0';
  
  // Font properties with fixed styling to prevent "unknown font style" errors
  const fontFamily = component.props?.fontFamily || 'Arial';
  const fontSize = component.props?.fontSize || 12;
  
  // Improved font configuration - separated bold and italic to avoid "unknown font style" errors
  let fontConfig = `font=("${fontFamily}", ${fontSize}`;
  
  // Font weight should be applied correctly
  if (component.props?.fontWeight === 'bold') {
    fontConfig += ', "bold"';
  }
  
  // Only add italic if specified
  else if (component.props?.fontStyle === 'italic') {
    fontConfig += ', "italic"';
  }
  
  // Close the font configuration
  fontConfig += ')';
  
  props.fontConfig = fontConfig;
  
  // Toggle/checkbox state
  props.checked = component.props?.checked || false;
  props.value = component.props?.value;
  
  // Image properties if applicable
  if (component.props?.image) {
    props.image = component.props.image;
    props.image_size = {
      width: component.props.imageWidth || props.width,
      height: component.props.imageHeight || props.height
    };
    props.compound = component.props.compound || 'left';
  }
  
  // Layout properties for grid and pack layouts
  props.padx = component.props?.padx || 5;
  props.pady = component.props?.pady || 5;
  props.row = component.props?.row || 0;
  props.column = component.props?.column || 0;
  props.rowspan = component.props?.rowspan || 1;
  props.columnspan = component.props?.columnspan || 1;
  props.sticky = component.props?.sticky || '';
  
  return props;
}
