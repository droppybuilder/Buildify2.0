import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface Subscription {
   id: string
   user_id: string
   tier: 'free' | 'standard' | 'pro'
   starts_at: string
   expires_at: string | null
   gumroad_product_id: string | null
   gumroad_purchase_id: string | null
   created_at: string
   updated_at: string
}

export const useSubscription = () => {
   const [subscription, setSubscription] = useState<Subscription | null>(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<Error | null>(null)

   const fetchSubscription = async () => {
      try {
         setLoading(true)

         const {
            data: { session },
         } = await supabase.auth.getSession()

         if (!session) {
            setSubscription(null)
            return
         }

         const { data, error: subscriptionError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .single()

         if (subscriptionError) {
            throw subscriptionError
         }

         setSubscription(data as Subscription)
      } catch (err) {
         console.error('Error fetching subscription:', err)
         setError(err instanceof Error ? err : new Error('Unknown error occurred'))
         setSubscription(null)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchSubscription()

      // Set up auth state listener to refetch subscription when auth state changes
      const {
         data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
         // If user logs in or out, refetch subscription
         if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            fetchSubscription()
         }
      })

      return () => {
         authSubscription.unsubscribe()
      }
   }, [])

   return {
      subscription,
      loading,
      error,
      refetch: fetchSubscription,
   }
}
