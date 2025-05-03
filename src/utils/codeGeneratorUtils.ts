
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
  props.bg_color = component.props?.bgColor || '#ffffff';
  props.fg_color = component.props?.fgColor || '#ffffff';
  props.text_color = component.props?.textColor || '#000000';
  props.cornerRadius = component.props?.cornerRadius || 8;
  props.borderWidth = component.props?.borderWidth !== undefined ? component.props?.borderWidth : 1;
  props.borderColor = component.props?.borderColor || '#e2e8f0';
  
  // Font properties
  const fontFamily = component.props?.fontFamily || 'Arial';
  const fontSize = component.props?.fontSize || 12;
  const fontWeight = component.props?.fontWeight === 'bold' ? 'bold' : 'normal';
  const fontStyle = component.props?.fontStyle === 'italic' ? 'italic' : 'roman';
  props.fontConfig = `font=("${fontFamily}", ${fontSize}, "${fontWeight} ${fontStyle}")`;
  
  // Image properties if applicable
  if (component.props?.image) {
    props.image = component.props.image;
    props.image_size = {
      width: component.props.imageWidth || props.width,
      height: component.props.imageHeight || props.height
    };
    props.compound = component.props.compound || 'left';
  }
  
  return props;
}
