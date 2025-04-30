
import React from 'react';

interface Component {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  props: Record<string, any>;
}

interface ComponentPreviewProps {
  component: Component;
  isHovered: boolean;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ component, isHovered }) => {
  const { type, props } = component;
  
  // Render different component previews based on type
  switch (type) {
    case 'button':
      return (
        <div 
          className="flex items-center justify-center rounded-md"
          style={{
            backgroundColor: props.bgColor || '#ffffff',
            color: props.fgColor || '#000000',
            border: `${props.borderWidth || 1}px solid ${props.borderColor || '#e2e8f0'}`,
            borderRadius: `${props.cornerRadius || 8}px`,
            fontFamily: props.font || 'Arial',
            fontSize: `${props.fontSize || 12}px`,
            fontWeight: props.fontWeight || 'normal',
            fontStyle: props.fontStyle || 'normal',
            width: '100%', 
            height: '100%'
          }}
        >
          {props.text || 'Button'}
        </div>
      );

    case 'label':
      return (
        <div 
          className="flex items-center"
          style={{
            color: props.fgColor || '#000000',
            fontFamily: props.font || 'Arial',
            fontSize: `${props.fontSize || 12}px`,
            fontWeight: props.fontWeight || 'normal',
            fontStyle: props.fontStyle || 'normal',
            width: '100%', 
            height: '100%'
          }}
        >
          {props.text || 'Label'}
        </div>
      );

    case 'entry':
      return (
        <div 
          className="flex items-center rounded-md"
          style={{
            backgroundColor: props.bgColor || '#ffffff',
            border: `${props.borderWidth || 1}px solid ${props.borderColor || '#e2e8f0'}`,
            borderRadius: `${props.cornerRadius || 8}px`,
            padding: '4px 8px',
            color: props.fgColor || '#000000',
            fontFamily: props.font || 'Arial',
            fontSize: `${props.fontSize || 12}px`,
            fontWeight: props.fontWeight || 'normal',
            fontStyle: props.fontStyle || 'normal',
            width: '100%', 
            height: '100%'
          }}
        >
          {props.placeholder ? <span className="text-gray-400">{props.placeholder}</span> : null}
        </div>
      );

    case 'image':
      return (
        <div className="flex items-center justify-center w-full h-full overflow-hidden"
          style={{
            border: `${props.borderWidth || 1}px solid ${props.borderColor || '#e2e8f0'}`,
            borderRadius: `${props.cornerRadius || 8}px`,
            backgroundColor: 'rgba(229, 231, 235, 0.5)'
          }}
        >
          {props.src ? (
            <img 
              src={props.src} 
              alt={props.alt || 'Image'}
              className="object-contain h-full w-full"
            />
          ) : (
            <div className="text-gray-500 text-center p-2 text-sm">
              {props.fileName || 'No image'}
            </div>
          )}
        </div>
      );
      
    case 'paragraph':
      return (
        <div 
          className="overflow-auto rounded-md p-2"
          style={{
            backgroundColor: props.bgColor || '#ffffff',
            border: `${props.borderWidth || 1}px solid ${props.borderColor || '#e2e8f0'}`,
            borderRadius: `${props.cornerRadius || 8}px`,
            color: props.fgColor || '#000000',
            fontFamily: props.font || 'Arial',
            fontSize: `${props.fontSize || 12}px`,
            fontWeight: props.fontWeight || 'normal',
            fontStyle: props.fontStyle || 'normal',
            lineHeight: props.lineHeight || 1.5,
            padding: `${props.padding || 10}px`,
            width: '100%', 
            height: '100%'
          }}
        >
          {props.text || 'Paragraph text'}
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-center" style={{ height: '100%' }}>
          <div 
            className="w-4 h-4 mr-2 border rounded flex-shrink-0"
            style={{
              backgroundColor: props.checked ? (props.checkedColor || '#3b82f6') : '#ffffff',
              borderColor: props.borderColor || '#e2e8f0'
            }}
          >
            {props.checked && <span className="text-white flex justify-center items-center w-full h-full">✓</span>}
          </div>
          <span 
            style={{
              color: props.fgColor || '#000000',
              fontFamily: props.font || 'Arial',
              fontSize: `${props.fontSize || 12}px`,
              fontWeight: props.fontWeight || 'normal',
              fontStyle: props.fontStyle || 'normal'
            }}
          >
            {props.text || 'Checkbox'}
          </span>
        </div>
      );

    case 'slider':
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div 
            className="h-2 w-full rounded-full relative"
            style={{ 
              backgroundColor: props.bgColor || '#e2e8f0'
            }}
          >
            <div 
              className="absolute h-full rounded-full"
              style={{ 
                width: `${(props.value || 50) / (props.to || 100) * 100}%`,
                backgroundColor: props.progressColor || '#3b82f6'
              }}
            />
            <div 
              className="absolute w-4 h-4 rounded-full bg-white border-2 top-1/2 -translate-y-1/2"
              style={{ 
                left: `calc(${(props.value || 50) / (props.to || 100) * 100}% - 8px)`,
                borderColor: props.progressColor || '#3b82f6'
              }}
            />
          </div>
        </div>
      );

    // Add other component types as needed
    default:
      return (
        <div className="flex items-center justify-center border border-gray-300 bg-gray-100 text-gray-500 w-full h-full">
          {type}
        </div>
      );
  }
};

export default ComponentPreview;
