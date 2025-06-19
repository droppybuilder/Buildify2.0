// Test frontend subscription reading logic
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

// Simulate the frontend getSubscription function
async function getSubscription(userId) {
  try {
    // Read from users collection instead of subscriptions
    const docRef = db.collection('users').doc(userId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      
      // Check if user has subscription data from webhook
      if (data.subscription) {
        return {
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
        };
      }
      
      // Fallback to legacy subscription_type field
      return {
        user_id: userId,
        tier: (data.subscription_type || 'free').toLowerCase(),
        subscriptionExpiry: data.subscriptionExpiry || null,
      };
    } else {
      console.warn('No user found for user:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

async function testFrontendSubscriptionRead() {
  console.log('🧪 Testing frontend subscription reading logic...\n');

  // Test with the user we created in the previous test
  const testUserId = 'test-user-123';
  
  try {
    const subscription = await getSubscription(testUserId);
    
    if (subscription) {
      console.log('✅ Subscription found:', JSON.stringify(subscription, null, 2));
      
      // Test if the subscription is considered "paid"
      const isPaid = subscription.tier !== 'free' && subscription.status === 'active';
      console.log(`💰 Is subscription paid? ${isPaid ? 'YES' : 'NO'}`);
      
      // Test tier-based features
      const normalizedTier = subscription.tier === 'lifetime' ? 'pro' : subscription.tier;
      console.log(`🎯 Normalized tier for features: ${normalizedTier}`);
      
    } else {
      console.log('❌ No subscription found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test with a user that doesn't exist
async function testNonExistentUser() {
  console.log('\n🧪 Testing with non-existent user...\n');

  const nonExistentUserId = 'non-existent-user-999';
  
  try {
    const subscription = await getSubscription(nonExistentUserId);
    
    if (subscription) {
      console.log('🤔 Unexpected: Subscription found for non-existent user:', JSON.stringify(subscription, null, 2));
    } else {
      console.log('✅ Correctly returned null for non-existent user');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function runTests() {
  await testFrontendSubscriptionRead();
  await testNonExistentUser();
  console.log('\n🏁 Frontend subscription tests completed');
}

runTests().catch(console.error);
