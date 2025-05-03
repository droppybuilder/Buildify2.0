
/**
 * Sanitizes a component ID for use in Python code
 * @param id The component ID to sanitize
 */
export function sanitizeId(id?: string): string {
  return id ? id.replace(/[^a-zA-Z0-9_]/g, '_') : `widget_${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Gets the properties of a component with default values
 * @param component The component to get properties for
 */
export function getComponentProps(component: any): any {
  const props = component.props || {};
  
  // Ensure x and y coordinates are defined or use defaults
  const xPos = props.x !== undefined ? props.x : 10;
  const yPos = props.y !== undefined ? props.y : 10;
  
  // For consistency, ensure these properties always have default values
  const borderWidth = props.borderWidth !== undefined ? props.borderWidth : 1;
  const borderColor = props.borderColor || "#e2e8f0";
  const cornerRadius = props.cornerRadius !== undefined ? props.cornerRadius : 8;
  const width = props.width !== undefined ? props.width : 100;
  const height = props.height !== undefined ? props.height : 30;
  
  // Build proper font configuration
  let fontConfig = buildFontConfig(props);
  
  return {
    ...props,
    x: xPos,
    y: yPos,
    borderWidth,
    borderColor,
    cornerRadius,
    width,
    height,
    fontConfig
  };
}

/**
 * Builds the font configuration string for a component
 * @param props The component properties
 */
export function buildFontConfig(props: any): string {
  if (props.font || props.fontSize || props.fontWeight || props.fontStyle) {
    const fontFamily = props.font || "Arial";
    const fontSize = props.fontSize || 12;
    
    // Build font options list
    let fontStyles = [];
    
    if (props.fontWeight === 'bold') {
      fontStyles.push('bold');
    }
    
    if (props.fontStyle === 'italic') {
      fontStyles.push('italic');
    }
    
    // Generate the font tuple with proper format
    if (fontStyles.length > 0) {
      return `font=("${fontFamily}", ${fontSize}, "${fontStyles.join(' ')}")`;
    } else {
      return `font=("${fontFamily}", ${fontSize})`;
    }
  }
  
  return 'font=("Arial", 12)';
}
