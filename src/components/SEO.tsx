import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  noIndex?: boolean
}

export const SEO = ({
  title = 'Buildfy Web - Visual Python GUI Builder | No-Code CustomTkinter Designer',
  description = 'Build professional Python GUIs with our visual drag-and-drop builder. Export clean, production-ready CustomTkinter code instantly. No coding experience required.',
  keywords = 'Python GUI builder, CustomTkinter, visual designer, drag and drop, no-code, Python app builder, Tkinter GUI, desktop app creator',
  image = 'https://buildfy.droppybuilder.com/og-image.png',
  url,
  type = 'website',
  noIndex = false
}: SEOProps) => {
  const location = useLocation()
  const currentUrl = url || `https://buildfy.droppybuilder.com${location.pathname}`

  useEffect(() => {
    // Update document title
    document.title = title

    // Function to update or create meta tag
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name'
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      
      let meta = document.querySelector(selector) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // Update basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow')

    // Update Open Graph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:url', currentUrl, true)
    updateMetaTag('og:type', type, true)

    // Update Twitter tags
    updateMetaTag('twitter:title', title, true)
    updateMetaTag('twitter:description', description, true)
    updateMetaTag('twitter:image', image, true)
    updateMetaTag('twitter:url', currentUrl, true)

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = currentUrl

  }, [title, description, keywords, image, currentUrl, type, noIndex])

  return null
}

// Predefined SEO configurations for different pages
export const seoConfig = {
  home: {
    title: 'Buildfy Web - Visual Python GUI Builder | No-Code CustomTkinter Designer',
    description: 'Build professional Python GUIs with our visual drag-and-drop builder. Export clean, production-ready CustomTkinter code instantly. No coding experience required.',
    keywords: 'Python GUI builder, CustomTkinter, visual designer, drag and drop, no-code, Python app builder, Tkinter GUI, desktop app creator'
  },
  landing: {
    title: 'Buildfy Web - Create Python GUIs Visually | Free No-Code Builder',
    description: 'Turn your ideas into Python desktop applications without writing code. Our visual builder generates clean CustomTkinter code. Start building for free today!',
    keywords: 'Python GUI builder, CustomTkinter, no-code development, visual programming, Python desktop apps, GUI designer'
  },
  pricing: {
    title: 'Pricing Plans - Buildfy Web | Affordable Python GUI Builder',
    description: 'Choose the perfect plan for your Python GUI development needs. Start free and scale as you grow. Professional features at affordable prices.',
    keywords: 'Python GUI builder pricing, CustomTkinter tools cost, no-code development plans, GUI builder subscription'
  },
  auth: {
    title: 'Sign In - Buildfy Web | Access Your Python GUI Projects',
    description: 'Sign in to Buildfy Web to access your Python GUI projects, export code, and build professional desktop applications.',
    keywords: 'sign in, login, Python GUI projects, CustomTkinter builder access'
  },
  profile: {
    title: 'Profile - Buildfy Web | Manage Your Account',
    description: 'Manage your Buildfy Web account, subscription, and Python GUI project settings.',
    keywords: 'profile, account settings, subscription management, Python GUI projects'
  },
  paymentSuccess: {
    title: 'Payment Successful - Buildfy Web | Welcome to Pro Features',
    description: 'Payment successful! Welcome to Buildfy Web Pro. Start building advanced Python GUIs with unlimited features.',
    keywords: 'payment success, pro features, Python GUI builder subscription'
  },
  notFound: {
    title: '404 - Page Not Found | Buildfy Web',
    description: 'The page you are looking for could not be found. Return to Buildfy Web to continue building Python GUIs.',
    keywords: '404, page not found, Buildfy Web',
    noIndex: true
  }
}
