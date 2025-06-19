import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getSubscription } from '@/utils/subscriptionUtils'

export interface Subscription {
   id?: string
   user_id?: string
   tier: 'free' | 'standard' | 'pro' | 'lifetime'
   starts_at?: string | null
   expires_at?: string | null
   dodo_payment_id?: string | null
   dodo_amount?: string | null
   currency?: string | null
   payment_method?: string | null
   customer_email?: string | null
   customer_name?: string | null
   status?: 'active' | 'cancelled' | 'payment_failed' | null
   updated_at?: string | null
   subscriptionExpiry?: string | null
}

export const useSubscription = () => {
   const { user } = useAuth()
   const [subscription, setSubscription] = useState<Subscription | null>(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<Error | null>(null)

   // console.log('useSubscription hook initialized') // Debug log
   // console.log('Current user:', user) // Debug log

   const fetchSubscription = async () => {
      if (!user) {
         setSubscription(null)
         setLoading(false)
         return
      }
      try {
         setLoading(true)
         const sub = await getSubscription(user.uid)
         // console.log('Fetched subscription:', sub) // Debug log
         setSubscription(sub)
      } catch (err) {
         setError(err instanceof Error ? err : new Error('Unknown error occurred'))
         setSubscription(null)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchSubscription()
      // Optionally, listen to user changes
   }, [user])

   return {
      subscription,
      loading,
      error,
      refetch: fetchSubscription,
   }
}
