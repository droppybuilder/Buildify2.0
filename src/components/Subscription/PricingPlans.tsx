import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/useSubscription'
import { useAuth } from '@/contexts/AuthContext'
import { isSubscriptionExpired, isExpiringSoon, getRemainingDays } from '@/utils/subscriptionUtils'

interface PlanFeature {
   name: string
   included: boolean
}

interface PricingPlan {
   id: string
   name: string
   description: string
   price: string
   billingPeriod: string
   features: PlanFeature[]
   tier: 'free' | 'standard' | 'pro' | 'lifetime'
   subtitle?: string
}

const plans: PricingPlan[] = [   {
      id: 'free',
      name: 'Free',
      description: 'Basic features for hobbyists',
      subtitle: 'Forever Free',
      price: '$0',
      billingPeriod: 'Forever',
      tier: 'free',
      features: [
         { name: 'Basic widgets', included: true },
         { name: 'Limited canvas size', included: true },
         { name: 'Watermarked exports', included: true },
         { name: 'Community support', included: true },
         { name: 'Cloud projects (limit: 3)', included: true },
         { name: 'Export code', included: false },
         { name: 'Advanced widgets', included: false },
         { name: 'No watermarks', included: false },
         { name: 'Priority support', included: false },
      ],
   },   {
      id: 'standard',
      name: 'Standard',
      description: 'For serious developers',
      subtitle: 'Pay As You Go',
      price: '$8',
      billingPeriod: 'Monthly',
      tier: 'standard',
      features: [
         { name: 'Basic widgets', included: true },
         { name: 'Unlimited canvas size', included: true },
         { name: 'Export code without watermark', included: true },
         { name: 'Community support', included: true },
         { name: 'Advanced widgets', included: true },
         { name: 'Email support', included: true },
         { name: 'Cloud projects (limit: 10)', included: true },
         { name: 'Priority support', included: false },
         { name: 'Custom integrations', included: false },
      ],
   },   {
      id: 'pro',
      name: 'Pro',
      description: 'For professional developers',
      subtitle: 'Pay As You Go',
      price: '$95',
      billingPeriod: 'Yearly',
      tier: 'pro',
      features: [
         { name: 'Basic widgets', included: true },
         { name: 'Unlimited canvas size', included: true },
         { name: 'Export code without watermark', included: true },
         { name: 'Community support', included: true },
         { name: 'Advanced widgets', included: true },
         { name: 'Email support', included: true },
         { name: 'Priority support', included: true },
         { name: 'Custom integrations', included: true },
         { name: 'Cloud projects (limit: 20)', included: true },
      ],
   },   {
      id: 'lifetime',
      name: 'Lifetime',
      description: 'Pay once - Use Forever',
      subtitle: 'One-Time Payment',
      price: '$200',
      billingPeriod: 'Forever',
      tier: 'lifetime',
      features: [
         { name: 'Basic widgets', included: true },
         { name: 'Unlimited canvas size', included: true },
         { name: 'Export code without watermark', included: true },
         { name: 'Community support', included: true },
         { name: 'Advanced widgets', included: true },
         { name: 'Email support', included: true },
         { name: 'Priority support', included: true },
         { name: 'Custom integrations', included: true },
         { name: 'Lifetime updates', included: true },
         { name: 'Cloud projects (unlimited)', included: true },
      ],
   },
]

// Add helper to normalize tier
type Tier = 'free' | 'standard' | 'pro' | 'lifetime';
function normalizeTier(tier: Tier): 'free' | 'standard' | 'pro' {
  if (tier === 'lifetime') return 'pro';
  if (tier === 'pro') return 'pro';
  if (tier === 'standard') return 'standard';
  return 'free';
}

export default function PricingPlans() {
   const [processing, setProcessing] = useState<string | null>(null)
   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
   const { subscription, loading } = useSubscription()
   const { user } = useAuth()
   const navigate = useNavigate()

   // Mouse tracking for animated cursor
   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         setMousePosition({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
   }, [])

   // Check for cancelled payment
   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search)
      const status = urlParams.get('status')
      
      if (status === 'cancelled') {
         toast.error('❌ Payment was cancelled. Please try again when you\'re ready.')
         // Clean up URL
         window.history.replaceState({}, '', '/pricing')
      }
   }, [])

   // Helper to get the user's normalized tier
   const getCurrentTier = () => {
      if (!subscription) return 'free'
      return normalizeTier(subscription.tier)
   }

   // Filter plans based on current tier
   const currentTier = getCurrentTier()
   let filteredPlans: PricingPlan[] = []
   if (currentTier === 'free') {
      filteredPlans = plans
   } else if (currentTier === 'standard') {
      filteredPlans = plans.filter(p => ['standard', 'pro', 'lifetime'].includes(p.tier))
   } else if (currentTier === 'pro') {
      filteredPlans = plans.filter(p => ['pro', 'lifetime'].includes(p.tier))
   } else if (currentTier === 'lifetime') {
      filteredPlans = plans.filter(p => p.tier === 'lifetime')
   }   const handleUpgrade = async (plan: PricingPlan) => {
      if (!user) {
         toast.error('Please login to upgrade your plan')
         navigate('/auth')
         return
      }
      if (plan.tier === 'free') {
         toast.info('You are already on the Free plan.')
         return
      }
      setProcessing(plan.id)
      
      try {
         // Call DodoPayments API to create payment link
         const response = await fetch('/api/payment/create', {
            method: 'POST',
            headers: { 
               'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
               planId: plan.tier,
               userId: user.uid,
               userEmail: user.email,
               userName: user.displayName || user.email,
            }),
         })
         
         const result = await response.json()
         
         if (result.success) {
            // Store payment attempt for tracking
            localStorage.setItem('pendingPayment', JSON.stringify({
               paymentId: result.paymentId,
               planId: plan.tier,
               timestamp: Date.now()
            }))
            
            // Redirect to DodoPayments checkout
            window.location.href = result.paymentUrl
         } else {
            throw new Error(result.error || 'Payment creation failed')
         }
      } catch (error) {
         console.error('Payment creation failed:', error)
         toast.error(`Payment initialization failed: ${error.message}`)
      } finally {
         setProcessing(null)
      }
   }

   const getCurrentPlan = () => {
      if (!subscription) return 'free'
      return normalizeTier(subscription.tier)
   }

   const isCurrentPlan = (planTier: string) => {
      return getCurrentPlan() === normalizeTier(planTier as Tier)
   }

   // Helper to format expiry date
   const getExpiryText = () => {
      if (!subscription || !subscription.subscriptionExpiry) return null;
      if (subscription.subscriptionExpiry === 'lifetime') return 'Never (Lifetime)';
      const date = new Date(subscription.subscriptionExpiry);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
   };   return (
      <div className='min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'>
         {/* Animated Cursor Effect */}
         <div
            className='fixed w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-50 opacity-50 transition-all duration-300 ease-out'
            style={{
               left: mousePosition.x - 12,
               top: mousePosition.y - 12,
               background: `radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)`,
            }}
         />

         {/* Dynamic Background */}
         <div className='pointer-events-none fixed inset-0 -z-10'>
            <div className='absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full blur-3xl animate-float-1' />
            <div className='absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl animate-float-2' />
            <div className='absolute top-1/2 left-1/2 w-[40vw] h-[40vw] bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-float-3' />
         </div>

         <div className='container mx-auto py-20 relative z-10'>
            {/* Close Icon */}
            <button
               className='absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/10'
               onClick={() => navigate('/')}
               aria-label='Close'
            >
               <X className='w-6 h-6 text-gray-300 hover:text-white' />
            </button>

            <div className='text-center mb-16'>
               <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4'>
                  Choose Your Plan
               </h1>
               <p className='text-gray-300 text-xl'>Select the plan that best fits your needs</p>
            </div>

            <div className='flex flex-wrap justify-center gap-8'>
               {filteredPlans.map((plan) => (
                  <Card
                     key={plan.id}
                     className={`rounded-3xl border-2 border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col items-center px-6 py-10 relative hover:shadow-purple-500/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-purple-400/50`}
                     style={{ minHeight: 520 }}
                  >
                     {/* Subtitle/Banner */}
                     <div className='absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-1 rounded-full font-semibold shadow-lg text-sm border border-purple-400/30 w-44 text-center'>
                        {plan.subtitle}
                     </div>
                     <h3 className='text-2xl font-bold mt-6 mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>{plan.name}</h3>
                     <div className='mb-4'>
                        <span className='text-4xl font-bold text-white'>{plan.price}</span>
                        <span className='text-gray-300 ml-1 text-base'>/{plan.billingPeriod}</span>
                     </div>
                     <ul className='mb-6 text-gray-300 text-left w-full max-w-xs mx-auto space-y-3'>
                        {plan.features.map((feature, i) => (
                           <li
                              key={i}
                              className='flex items-center gap-3'
                           >
                              {feature.included ? (
                                 <span
                                    className='text-green-400 font-bold text-lg'
                                    aria-label='Included'
                                 >
                                    ✔
                                 </span>
                              ) : (
                                 <span
                                    className='text-red-400 font-bold text-lg'
                                    aria-label='Not included'
                                 >
                                    ✖
                                 </span>
                              )}
                              <span className='text-sm'>{feature.name}</span>
                           </li>
                        ))}
                     </ul>
                     <CardFooter className='w-full flex flex-col items-center mt-auto'>
                        <Button
                           className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                              isCurrentPlan(plan.tier) 
                                 ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                 : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                           }`}
                           onClick={() => handleUpgrade(plan)}
                           disabled={processing !== null || (isCurrentPlan(plan.tier) && plan.tier !== 'free')}
                        >
                           {processing === plan.id
                              ? 'Processing...'
                              : isCurrentPlan(plan.tier)
                              ? 'Current Plan'
                              : `Upgrade to ${plan.name}`}
                        </Button>
                     </CardFooter>
                  </Card>
               ))}
            </div>
              {/* Show expiry for upgraded users */}
            {subscription && subscription.tier !== 'free' && (
               <div className='mt-8 text-center space-y-4'>
                  <div className='inline-flex items-center px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full'>
                     <span className='text-sm text-gray-300'>
                        Subscription expires: <span className='text-white font-semibold'>{getExpiryText() || 'Unknown'}</span>
                     </span>
                     {getRemainingDays(subscription) !== null && (
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                           isSubscriptionExpired(subscription) 
                              ? 'bg-red-500/20 text-red-400'
                              : isExpiringSoon(subscription)
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                        }`}>
                           {isSubscriptionExpired(subscription) 
                              ? 'Expired' 
                              : `${getRemainingDays(subscription)} days left`
                           }
                        </span>
                     )}
                  </div>
                  
                  {isSubscriptionExpired(subscription) && (
                     <div className='max-w-md mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30'>
                        <p className='text-red-400 text-sm'>
                           ⚠️ Your subscription has expired. You've been moved to the free tier. Upgrade to restore premium features.
                        </p>
                     </div>
                  )}
                  
                  {isExpiringSoon(subscription) && !isSubscriptionExpired(subscription) && (
                     <div className='max-w-md mx-auto p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30'>
                        <p className='text-yellow-400 text-sm'>
                           ⏰ Your subscription expires soon! Renew now to avoid any interruption to your premium features.
                        </p>
                     </div>
                  )}
               </div>
            )}
         </div>

         {/* Custom Styles */}
         <style>{`
            @keyframes float-1 {
               0%, 100% { transform: translate(0, 0) rotate(0deg); }
               33% { transform: translate(30px, -30px) rotate(120deg); }
               66% { transform: translate(-20px, 20px) rotate(240deg); }
            }
            @keyframes float-2 {
               0%, 100% { transform: translate(0, 0) rotate(0deg); }
               33% { transform: translate(-30px, -30px) rotate(-120deg); }
               66% { transform: translate(20px, 20px) rotate(-240deg); }
            }
            @keyframes float-3 {
               0%, 100% { transform: translate(0, 0) scale(1); }
               50% { transform: translate(20px, -20px) scale(1.1); }
            }
            .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
            .animate-float-2 { animation: float-2 25s ease-in-out infinite; }
            .animate-float-3 { animation: float-3 15s ease-in-out infinite; }
         `}</style>
      </div>
   )
}
