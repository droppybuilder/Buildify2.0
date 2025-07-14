import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Routes, Route, useLocation } from 'react-router-dom'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import AuthPage from './components/Auth/AuthPage'
import PricingPlans from './components/Subscription/PricingPlans'
import ProfilePage from './components/Profile/ProfilePage'
import PaymentSuccess from './pages/PaymentSuccess'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AnalyticsProvider, useAnalytics } from './components/Analytics'
import LandingPage from './pages/LandingPage'
import React from 'react'
import './App.css'

const queryClient = new QueryClient()

// Track page views on route changes
function RouteTracker() {
   const location = useLocation()
   const { trackPageView } = useAnalytics()

   React.useEffect(() => {
      trackPageView(location.pathname, document.title)
   }, [location, trackPageView])

   return null
}

const App = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <AnalyticsProvider 
            gaId={import.meta.env.VITE_GA_MEASUREMENT_ID}
            fbPixelId={import.meta.env.VITE_FB_PIXEL_ID}
         >
            <Analytics />
            <SpeedInsights />
            <AuthProvider>
               <TooltipProvider>
                  <RouteTracker />
                  <Toaster />
                  <Sonner />
                  <Routes>
                  <Route
                     path='/landing'
                     element={<LandingPage />}
                  />
                  <Route
                     path='/auth'
                     element={<AuthPage />}
                  />
                  <Route
                     path='/pricing'
                     element={<PricingPlans />}
                  />
                  <Route
                     path='/profile'
                     element={
                        <ProtectedRoute>
                           <ProfilePage />
                        </ProtectedRoute>
                     }
                  />
                  <Route
                     path='/payment-success'
                     element={<PaymentSuccess />}
                  />
                  <Route
                     path='/'
                     element={
                        <ProtectedRoute>
                           <Index />
                        </ProtectedRoute>
                     }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route
                     path='*'
                     element={<NotFound />}
                  />
               </Routes>
            </TooltipProvider>
         </AuthProvider>
         </AnalyticsProvider>
      </QueryClientProvider>
   )
}

export default App
