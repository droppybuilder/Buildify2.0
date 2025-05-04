
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
  
  // Fix the font configuration to avoid "unknown font style" error
  let fontConfig = 'font=("' + (component.props?.fontFamily || 'Arial') + '", ' + (component.props?.fontSize || 12);
  
  // Add font weight if specified
  const fontWeightPart = component.props?.fontWeight === 'bold' ? ', "bold"' : '';
  
  // Add font style if specified
  const fontStylePart = component.props?.fontStyle === 'italic' ? ', "italic"' : '';
  
  // Combine weight and style correctly - avoid combinations that cause errors
  if (fontWeightPart && fontStylePart) {
    fontConfig += ', "bold italic"';
  } else {
    fontConfig += fontWeightPart + fontStylePart;
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
  if (component.props?.image) {
    props.image = component.props.image;
    props.image_size = {
      width: component.props.imageWidth || props.width,
      height: component.props.imageHeight || props.height
    };
    props.compound = component.props.compound || 'left';
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
