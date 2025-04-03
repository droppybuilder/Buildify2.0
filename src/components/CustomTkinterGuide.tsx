
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const CustomTkinterGuide = () => {
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h2 className="text-lg font-semibold mb-3">CustomTkinter Troubleshooting Guide</h2>
      
      <Alert variant="warning" className="mb-4">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertTitle>Known Compatibility Issues</AlertTitle>
        <AlertDescription>
          Some components have properties that aren't supported in CustomTkinter. 
          Most commonly, CTkLabel with image doesn't support border properties.
        </AlertDescription>
      </Alert>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Common Error: "Unsupported arguments"</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">If you see: <code className="bg-gray-100 px-1">ValueError: ['border_width', 'border_color'] are not supported arguments</code></p>
            <p className="text-sm text-muted-foreground">
              Some CustomTkinter widgets don't support all properties. For example, CTkLabel with images can't use border_width or border_color. 
              The GUI builder automatically removes unsupported properties when generating code.
            </p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>Images Not Loading</AccordionTrigger>
          <AccordionContent>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>Make sure image files are in the same directory as app.py</li>
              <li>Check that the load_image method is defined exactly as shown in the code</li>
              <li>Verify that you're maintaining references to images (using self._image_references)</li>
              <li>If using a custom image, make sure the file exists and is a valid image format</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3">
          <AccordionTrigger>Module Not Found Errors</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">For errors like: <code className="bg-gray-100 px-1">No module named 'customtkinter'</code></p>
            <p className="text-sm">Run this to install all required packages:</p>
            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
              pip install -r requirements.txt
            </pre>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Widget Placement Issues</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              CustomTkinter widgets require width and height to be set in the constructor, not in place() method.
              The GUI builder handles this correctly in the generated code.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
