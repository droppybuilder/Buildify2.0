
import { generateWidgetCode } from './widgetGenerators';
import { sanitizeId, getComponentProps } from './codeGeneratorUtils';

/**
 * Generates Python code for a specific component
 * @param component The component to generate code for
 * @param indent The indentation string to use
 */
export function generateComponentCode(component: any, indent: string): string {
  if (!component || !component.type) {
    return `${indent}# Missing component data or type\n`;
  }
  
  const props = getComponentProps(component);
  const safeId = sanitizeId(component.id);
  
  try {
    return generateWidgetCode(component.type, safeId, props, indent);
  } catch (error) {
    console.error(`Error generating code for component ${component.id}:`, error);
    return `${indent}# Error generating code for ${component.type} (${component.id})\n`;
  }
}
