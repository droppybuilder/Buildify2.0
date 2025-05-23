import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/useSubscription'
import { useAuth } from '@/contexts/AuthContext'

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

const plans: PricingPlan[] = [
   {
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
         { name: 'Export code', included: false },
         { name: 'Advanced widgets', included: false },
         { name: 'No watermarks', included: false },
         { name: 'Priority support', included: false },
      ],
   },
   {
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
         { name: 'Priority support', included: false },
         { name: 'Custom integrations', included: false },
      ],
   },
   {
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
         { name: 'AI Integration', included: true },
      ],
   },
   {
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
         { name: 'AI Integration', included: true },
      ],
   },
]

export default function PricingPlans() {
   const [processing, setProcessing] = useState<string | null>(null)
   const { subscription, loading } = useSubscription()
   const { user } = useAuth()
   const navigate = useNavigate()

   const handleUpgrade = async (plan: PricingPlan) => {
      try {
         // Check if user is logged in
         if (!user) {
            toast.error('Please login to upgrade your plan')
            navigate('/auth')
            return
         }

         setProcessing(plan.id)
         console.log(`Processing upgrade to ${plan.name} plan for user ${user.uid}`)

         // Mock success message for demo purposes
         toast.success(`Upgraded to ${plan.name} plan successfully`)
      } catch (error) {
         console.error('Error upgrading plan:', error)
         toast.error('Failed to process upgrade. Please try again.')
      } finally {
         setProcessing(null)
      }
   }

   const getCurrentPlan = () => {
      if (!subscription) return 'free'
      return subscription.tier
   }

   const isCurrentPlan = (planTier: string) => {
      return getCurrentPlan() === planTier
   }

   return (
      <div className='container mx-auto py-10 relative'>
         {/* Close Icon */}
         <button
            className='absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors'
            onClick={() => navigate('/')}
            aria-label='Close'
         >
            <X className='w-6 h-6 text-gray-500 hover:text-primary' />
         </button>
         <div className='text-center mb-10'>
            <h1 className='text-3xl font-bold'>Choose Your Plan</h1>
            <p className='text-muted-foreground mt-2'>Select the plan that best fits your needs</p>
         </div>

         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {plans.map((plan) => (
               <Card
                  key={plan.id}
                  className={`rounded-3xl border-2 border-indigo-200 bg-white shadow-lg flex flex-col items-center px-6 py-10 relative hover:shadow-2xl transition-shadow`}
                  style={{ minHeight: 520 }}
               >
                  {/* Subtitle/Banner */}
                  <div
                     className='absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-100 text-indigo-700 px-5 py-1 rounded-full font-semibold shadow text-sm border border-indigo-200 w-44 text-center'
                  >
                     {plan.subtitle}
                  </div>
                  <h3 className='text-2xl font-bold mt-6 mb-1 text-indigo-700'>{plan.name}</h3>
                  <div className='mb-4'>
                     <span className='text-3xl font-bold'>{plan.price}</span>
                     <span className='text-muted-foreground ml-1 text-base'>/{plan.billingPeriod}</span>
                  </div>
                  <ul className='mb-6 text-gray-700 text-left w-full max-w-xs mx-auto space-y-2'>
                     {plan.features.map((feature, i) => (
                        <li key={i} className='flex items-center gap-2'>
                           {feature.included ? (
                              <span className='text-green-500 font-bold text-lg' aria-label='Included'>✔</span>
                           ) : (
                              <span className='text-red-400 font-bold text-lg' aria-label='Not included'>✖</span>
                           )}
                           <span>{feature.name}</span>
                        </li>
                     ))}
                  </ul>
                  <CardFooter className='w-full flex flex-col items-center mt-auto'>
                     <Button
                        className='w-full'
                        variant={isCurrentPlan(plan.tier) ? 'secondary' : 'default'}
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
      </div>
   )
}
