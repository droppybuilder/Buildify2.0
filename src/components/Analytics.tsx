import React from 'react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
    dataLayer: any[]
  }
}

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

interface ConversionEvent {
  event_name: string
  currency?: string
  value?: number
  items?: any[]
}

export class Analytics {
  private static instance: Analytics
  private isInitialized = false

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  // Initialize Google Analytics
  initializeGA(measurementId: string) {
    if (typeof window === 'undefined' || this.isInitialized) return

    // Load Google Analytics script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    
    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    })

    this.isInitialized = true
  }

  // Initialize Facebook Pixel
  initializeFBPixel(pixelId: string) {
    if (typeof window === 'undefined') return

    // Facebook Pixel Code
    ;(function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = !0
      n.version = '2.0'
      n.queue = []
      t = b.createElement(e)
      t.async = !0
      t.src = v
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

    window.fbq('init', pixelId)
    window.fbq('track', 'PageView')
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (typeof window === 'undefined') return

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path,
        page_title: title || document.title
      })
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView')
    }
  }

  // Track custom events
  trackEvent({ action, category, label, value }: AnalyticsEvent) {
    if (typeof window === 'undefined') return

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('trackCustom', action, {
        category,
        label,
        value
      })
    }
  }

  // Track conversions
  trackConversion({ event_name, currency, value, items }: ConversionEvent) {
    if (typeof window === 'undefined') return

    // Google Analytics Enhanced Ecommerce
    if (window.gtag) {
      window.gtag('event', event_name, {
        currency: currency || 'USD',
        value: value || 0,
        items: items || []
      })
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', event_name, {
        currency: currency || 'USD',
        value: value || 0
      })
    }
  }

  // Track subscription events
  trackSubscription(plan: string, value: number) {
    this.trackConversion({
      event_name: 'Purchase',
      currency: 'USD',
      value: value,
      items: [{
        item_id: plan.toLowerCase(),
        item_name: `${plan} Plan`,
        category: 'subscription',
        quantity: 1,
        price: value
      }]
    })

    this.trackEvent({
      action: 'subscribe',
      category: 'subscription',
      label: plan,
      value: value
    })
  }

  // Track user engagement
  trackEngagement(action: string, value?: number) {
    this.trackEvent({
      action: action,
      category: 'engagement',
      value: value
    })
  }

  // Track feature usage
  trackFeatureUsage(feature: string, plan: string) {
    this.trackEvent({
      action: 'feature_use',
      category: 'product',
      label: `${feature}_${plan}`
    })
  }

  // Track errors
  trackError(error: string, fatal = false) {
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error,
        fatal: fatal
      })
    }
  }
}

// React Hook for Analytics
export function useAnalytics() {
  const analytics = Analytics.getInstance()

  React.useEffect(() => {
    // Initialize analytics on mount
    analytics.initializeGA(import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID')
    analytics.initializeFBPixel(import.meta.env.VITE_FB_PIXEL_ID || 'FB_PIXEL_ID')
  }, [])

  return {
    trackPageView: analytics.trackPageView.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackSubscription: analytics.trackSubscription.bind(analytics),
    trackEngagement: analytics.trackEngagement.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackError: analytics.trackError.bind(analytics)
  }
}

// Analytics Provider Component
interface AnalyticsProviderProps {
  children: React.ReactNode
  gaId?: string
  fbPixelId?: string
}

export function AnalyticsProvider({ children, gaId, fbPixelId }: AnalyticsProviderProps) {
  React.useEffect(() => {
    const analytics = Analytics.getInstance()
    
    if (gaId) {
      analytics.initializeGA(gaId)
    }
    
    if (fbPixelId) {
      analytics.initializeFBPixel(fbPixelId)
    }
  }, [gaId, fbPixelId])

  return <>{children}</>
}

export default Analytics
