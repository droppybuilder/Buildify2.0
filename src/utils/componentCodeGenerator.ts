
import { generateWidgetCode } from './widgetGenerators';
import { sanitizeId, getComponentProps } from './codeGeneratorUtils';

/**
 * Generates Python code for a specific component
 * @param component The component to generate code for
 * @param indent The indentation string to use
 */
export function generateComponentCode(component: any, indent: string): string {
  const props = getComponentProps(component);
  const safeId = sanitizeId(component.id);
  
  return generateWidgetCode(component.type, safeId, props, indent);
}
