// import { Subscription } from '@/hooks/useSubscription';

// export const FEATURES = {
//   EXPORT_CODE: 'export_code',
//   ADVANCED_WIDGETS: 'advanced_widgets',
//   REMOVE_WATERMARK: 'remove_watermark',
//   UNLIMITED_CANVAS: 'unlimited_canvas',
//   PRIORITY_SUPPORT: 'priority_support',
//   CUSTOM_INTEGRATIONS: 'custom_integrations',
// };

// export const TIER_FEATURES = {
//   free: [
//     FEATURES.UNLIMITED_CANVAS,
//   ],
//   standard: [
//     FEATURES.UNLIMITED_CANVAS,
//     FEATURES.EXPORT_CODE,
//     FEATURES.ADVANCED_WIDGETS,
//     FEATURES.REMOVE_WATERMARK,
//   ],
//   pro: [
//     FEATURES.UNLIMITED_CANVAS,
//     FEATURES.EXPORT_CODE,
//     FEATURES.ADVANCED_WIDGETS,
//     FEATURES.REMOVE_WATERMARK,
//     FEATURES.PRIORITY_SUPPORT,
//     FEATURES.CUSTOM_INTEGRATIONS,
//   ],
// };

// /**
//  * Check if a subscription has a specific feature
//  */
// export function hasFeature(subscription: Subscription | null, feature: string): boolean {
//   const tier = subscription?.tier || 'free';
//   return TIER_FEATURES[tier].includes(feature);
// }

// /**
//  * Get features available for a specific tier
//  */
// export function getFeatures(tier: 'free' | 'standard' | 'pro') {
//   return TIER_FEATURES[tier];
// }

// /**
//  * Check if a widget is available for a subscription tier
//  */
// export function isWidgetAvailable(widget: string, subscription: Subscription | null): boolean {
//   const tier = subscription?.tier || 'free';
//   const advancedWidgets = ['DatePicker', 'ColorPicker', 'Slider', 'ProgressBar', 'TabView'];

//   // All users have access to basic widgets
//   if (!advancedWidgets.includes(widget)) {
//     return true;
//   }

//   // Only paid users have access to advanced widgets
//   return tier === 'standard' || tier === 'pro';
// }

import { db } from '../integrations/firebase/firebase.config'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Subscription } from '@/hooks/useSubscription'

export const FEATURES = {
   EXPORT_CODE: 'export_code',
   ADVANCED_WIDGETS: 'advanced_widgets',
   REMOVE_WATERMARK: 'remove_watermark',
   UNLIMITED_CANVAS: 'unlimited_canvas',
   PRIORITY_SUPPORT: 'priority_support',
   CUSTOM_INTEGRATIONS: 'custom_integrations',
}

export const TIER_FEATURES = {
   free: [FEATURES.UNLIMITED_CANVAS],
   standard: [FEATURES.UNLIMITED_CANVAS, FEATURES.EXPORT_CODE, FEATURES.ADVANCED_WIDGETS, FEATURES.REMOVE_WATERMARK],
   pro: [
      FEATURES.UNLIMITED_CANVAS,
      FEATURES.EXPORT_CODE,
      FEATURES.ADVANCED_WIDGETS,
      FEATURES.REMOVE_WATERMARK,
      FEATURES.PRIORITY_SUPPORT,
      FEATURES.CUSTOM_INTEGRATIONS,
   ],
}

/**
 * Normalize the tier string to a standard set of values
 * Treat 'lifetime' as 'pro' for feature checks
 */
function normalizeTier(tier: string): 'free' | 'standard' | 'pro' {
   if (tier === 'lifetime') return 'pro'
   if (tier === 'standard') return 'standard'
   if (tier === 'pro') return 'pro'
   return 'free'
}

/**
 * Check if a subscription has expired
 */
export function isSubscriptionExpired(subscription: Subscription | null): boolean {
   if (!subscription || !subscription.subscriptionExpiry) {
      return false // No expiry data means it's free or lifetime
   }
   
   if (subscription.subscriptionExpiry === 'lifetime') {
      return false // Lifetime never expires
   }
   
   const expiryDate = new Date(subscription.subscriptionExpiry)
   const now = new Date()
   
   return expiryDate < now
}

/**
 * Get the effective subscription tier, considering expiry
 */
export function getEffectiveTier(subscription: Subscription | null): 'free' | 'standard' | 'pro' | 'lifetime' {
   if (!subscription) {
      return 'free'
   }
   
   // Check if subscription has expired
   if (isSubscriptionExpired(subscription)) {
      return 'free'
   }
   
   return subscription.tier || 'free'
}

/**
 * Check if a subscription has a specific feature
 */
export function hasFeature(subscription: Subscription | null, feature: string): boolean {
   const effectiveTier = getEffectiveTier(subscription)
   const tier = normalizeTier(effectiveTier)
   return TIER_FEATURES[tier].includes(feature)
}

/**
 * Get features available for a specific tier
 */
export function getFeatures(tier: 'free' | 'standard' | 'pro' | 'lifetime') {
   return TIER_FEATURES[normalizeTier(tier)]
}

/**
 * Check if a widget is available for a subscription tier
 */
export function isWidgetAvailable(widget: string, subscription: Subscription | null): boolean {
   const effectiveTier = getEffectiveTier(subscription)
   const tier = normalizeTier(effectiveTier)
   const advancedWidgets = ['DatePicker', 'ColorPicker', 'Slider', 'ProgressBar', 'TabView']

   // All users have access to basic widgets
   if (!advancedWidgets.includes(widget)) {
      return true
   }

   // Only paid users have access to advanced widgets
   return tier === 'standard' || tier === 'pro'
}

/**
 * Fetch subscription data for a user from Firestore
 */
export async function getSubscription(userId: string): Promise<Subscription | null> {
   try {
      // Read from users collection instead of subscriptions
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
         const data = docSnap.data()
         
         let subscription: Subscription | null = null
         
         // Check if user has subscription data from webhook
         if (data.subscription) {
            subscription = {
               user_id: userId,
               tier: data.subscription.tier || 'free',
               subscriptionExpiry: data.subscription.subscriptionExpiry || null,
               status: data.subscription.status || null,
               dodo_payment_id: data.subscription.dodo_payment_id || null,
               dodo_amount: data.subscription.dodo_amount || null,
               currency: data.subscription.currency || null,
               payment_method: data.subscription.payment_method || null,
               customer_email: data.subscription.customer_email || null,
               customer_name: data.subscription.customer_name || null,
               updated_at: data.subscription.updated_at || null,
            }
         } else {
            // Fallback to legacy subscription_type field
            subscription = {
               user_id: userId,
               tier: (data.subscription_type || 'free').toLowerCase() as 'free' | 'standard' | 'pro' | 'lifetime',
               subscriptionExpiry: data.subscriptionExpiry || null,
            }
         }
         
         // Check if subscription has expired and update if necessary
         if (subscription && isSubscriptionExpired(subscription)) {
            console.log(`Subscription expired for user ${userId}, updating to free tier`)
            
            // Update the user's subscription to free tier
            const expiredSubscriptionData = {
               ...data.subscription,
               tier: 'free',
               status: 'expired',
               updated_at: new Date().toISOString(),
               expired_at: new Date().toISOString()
            }
            
            await setDoc(docRef, {
               subscription: expiredSubscriptionData
            }, { merge: true })
            
            // Return the updated subscription
            subscription.tier = 'free'
            subscription.status = 'expired'
         }
         
         return subscription
      } else {
         console.warn('No user found for user:', userId)
         return null
      }
   } catch (error) {
      console.error('Error fetching subscription:', error)
      return null
   }
}

/**
 * Update subscription data for a user in Firestore
 */
export async function setSubscription(userId: string, subscriptionData: Subscription): Promise<void> {
   try {
      const docRef = doc(db, 'subscriptions', userId)
      await setDoc(docRef, subscriptionData)
   } catch (error) {
      console.error('Error updating subscription:', error)
   }
}

/**
 * Get subscription status text for display
 */
export function getSubscriptionStatus(subscription: Subscription | null): string {
   if (!subscription) {
      return 'Free'
   }
   
   if (isSubscriptionExpired(subscription)) {
      return 'Expired'
   }
   
   if (subscription.status === 'cancelled') {
      return 'Cancelled'
   }
   
   if (subscription.status === 'payment_failed') {
      return 'Payment Failed'
   }
   
   if (subscription.tier === 'lifetime') {
      return 'Lifetime'
   }
   
   return 'Active'
}

/**
 * Get remaining days until subscription expires
 */
export function getRemainingDays(subscription: Subscription | null): number | null {
   if (!subscription || !subscription.subscriptionExpiry || subscription.subscriptionExpiry === 'lifetime') {
      return null
   }
   
   const expiryDate = new Date(subscription.subscriptionExpiry)
   const now = new Date()
   const diffTime = expiryDate.getTime() - now.getTime()
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
   
   return Math.max(0, diffDays)
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isExpiringSoon(subscription: Subscription | null): boolean {
   const remainingDays = getRemainingDays(subscription)
   return remainingDays !== null && remainingDays <= 7
}
