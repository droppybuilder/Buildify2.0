import { useEffect } from 'react'

interface StructuredDataProps {
  type: 'Organization' | 'WebApplication' | 'Product' | 'FAQ' | 'HowTo' | 'Review'
  data: any
}

export const StructuredData = ({ type, data }: StructuredDataProps) => {
  useEffect(() => {
    const structuredData = generateStructuredData(type, data)
    
    // Remove existing structured data script for this type
    const existingScript = document.querySelector(`script[data-structured-data="${type}"]`)
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-structured-data', type)
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.querySelector(`script[data-structured-data="${type}"]`)
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [type, data])

  return null
}

const generateStructuredData = (type: string, data: any) => {
  const baseUrl = 'https://buildfy.droppybuilder.com'
  
  switch (type) {
    case 'Organization':
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Buildfy Web",
        "alternateName": "Buildfy",
        "url": baseUrl,
        "logo": `${baseUrl}/logo6.png`,
        "description": "Visual Python GUI Builder for creating CustomTkinter applications without coding",
        "foundingDate": "2024",
        "sameAs": [
          "https://www.producthunt.com/products/buildfy-web",
          "https://github.com/buildfyweb",
          "https://twitter.com/buildfyweb"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "",
          "contactType": "customer service",
          "email": "droppybuilder@gmail.com"
        }
      }

    case 'WebApplication':
      return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Buildfy Web",
        "description": "Visual Python GUI Builder for creating CustomTkinter applications without coding",
        "url": baseUrl,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Modern web browser with JavaScript enabled",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "category": "Free with Premium Options"
        },
        "featureList": [
          "Visual drag-and-drop GUI builder",
          "CustomTkinter code export",
          "Real-time preview",
          "Cloud project storage",
          "Professional widgets library",
          "No coding required"
        ],
        "screenshot": `${baseUrl}/BD2.png`,
        "softwareVersion": "1.0",
        "author": {
          "@type": "Organization",
          "name": "Buildfy Web Team"
        }
      }

    case 'Product':
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": data.name || "Buildfy Web",
        "description": data.description || "Visual Python GUI Builder",
        "brand": {
          "@type": "Brand",
          "name": "Buildfy Web"
        },
        "offers": {
          "@type": "Offer",
          "price": data.price || "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "150",
          "bestRating": "5",
          "worstRating": "1"
        }
      }

    case 'FAQ':
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.faqs?.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        })) || []
      }

    case 'HowTo':
      return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": data.name || "How to Build Python GUIs with Buildfy Web",
        "description": data.description || "Learn how to create professional Python desktop applications using our visual builder",
        "step": data.steps?.map((step: any, index: number) => ({
          "@type": "HowToStep",
          "position": index + 1,
          "name": step.name,
          "text": step.description
        })) || []
      }

    default:
      return {}
  }
}

// Predefined structured data configurations
export const structuredDataConfigs = {
  organization: {
    type: 'Organization' as const,
    data: {}
  },
  
  webApplication: {
    type: 'WebApplication' as const,
    data: {}
  },

  buildingGuide: {
    type: 'HowTo' as const,
    data: {
      name: "How to Build Python GUIs with Buildfy Web",
      description: "Step-by-step guide to creating professional Python desktop applications",
      steps: [
        {
          name: "Sign Up for Free",
          description: "Create your free Buildfy Web account to get started"
        },
        {
          name: "Choose Components",
          description: "Drag and drop widgets from our comprehensive library"
        },
        {
          name: "Design Your Interface",
          description: "Visually arrange and customize your GUI components"
        },
        {
          name: "Export Your Code",
          description: "Generate clean, production-ready CustomTkinter Python code"
        },
        {
          name: "Run Your Application",
          description: "Execute your exported code to see your GUI application in action"
        }
      ]
    }
  },

  faq: {
    type: 'FAQ' as const,
    data: {
      faqs: [
        {
          question: "Is Buildfy Web free to use?",
          answer: "Yes! Buildfy Web offers a free tier with basic features. You can upgrade to paid plans for advanced features like unlimited canvas size and premium widgets."
        },
        {
          question: "What kind of code does Buildfy Web generate?",
          answer: "Buildfy Web generates clean, production-ready Python code using the CustomTkinter library, which is modern and easy to understand."
        },
        {
          question: "Do I need coding experience to use Buildfy Web?",
          answer: "No coding experience is required! Our visual drag-and-drop interface allows anyone to build professional Python GUIs without writing code."
        },
        {
          question: "Can I export my projects?",
          answer: "Yes, you can export your projects as Python code. Free users get 3 exports per month, while paid users get unlimited exports."
        },
        {
          question: "What widgets are available?",
          answer: "We offer a comprehensive library including buttons, labels, text inputs, images, sliders, progress bars, and many more professional widgets."
        }
      ]
    }
  }
}
