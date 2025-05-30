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
 * Check if a subscription has a specific feature
 */
export function hasFeature(subscription: Subscription | null, feature: string): boolean {
   const tier = normalizeTier(subscription?.tier || 'free')
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
   const tier = normalizeTier(subscription?.tier || 'free')
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
         // Map Firestore user fields to Subscription shape
         return {
            user_id: userId,
            tier: (data.subscription_type || 'free').toLowerCase(),
            subscriptionExpiry: data.subscription?.subscriptionExpiry || data.subscriptionExpiry || null,
            // Optionally add more fields if you store them
         }
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
