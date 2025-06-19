// Test script to debug webhook handler and Firebase integration
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message);
    process.exit(1);
  }
}

const db = getFirestore();

async function testWebhookHandler() {
  console.log('🧪 Testing webhook handler and Firebase integration...\n');

  // Test user ID (replace with a real user ID from your Firebase)
  const testUserId = 'test-user-123';
  
  // Simulate webhook payload
  const webhookPayload = {
    type: 'payment.succeeded',
    payment_id: 'pay_test_123456',
    amount: '999',
    currency: 'USD',
    customer: {
      email: 'test@example.com',
      name: 'Test User'
    },
    metadata: {
      userId: testUserId,
      planType: 'pro'
    }
  };

  console.log('📦 Simulating webhook payload:', JSON.stringify(webhookPayload, null, 2));

  try {
    // Simulate the handlePaymentSuccess function
    const { customer, metadata, payment_id, amount, currency } = webhookPayload;
    
    if (!metadata?.userId || !metadata?.planType) {
      throw new Error('Missing metadata in webhook payload');
    }

    // Calculate subscription expiry
    const expiry = calculateSubscriptionExpiry(metadata.planType);
    console.log(`📅 Calculated expiry for ${metadata.planType}: ${expiry}`);

    // Update user subscription in Firestore
    const userRef = db.collection('users').doc(metadata.userId);
    const updateData = {
      subscription: {
        tier: metadata.planType,
        paid: true,
        dodo_payment_id: payment_id,
        dodo_amount: amount,
        currency: currency,
        updated_at: new Date().toISOString(),
        subscriptionExpiry: expiry,
        status: 'active',
        payment_method: 'dodo',
        customer_email: customer.email,
        customer_name: customer.name
      }
    };

    console.log('💾 Writing to Firestore:', JSON.stringify(updateData, null, 2));
    await userRef.set(updateData, { merge: true });
    console.log('✅ Successfully updated Firestore');    // Read back the data to verify
    const docSnap = await userRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      console.log('📖 Data read back from Firestore:', JSON.stringify(data, null, 2));
      
      // Test how the frontend would read this data
      if (data.subscription) {
        const frontendSubscription = {
          user_id: testUserId,
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
        console.log('🎯 Frontend would see this subscription:', JSON.stringify(frontendSubscription, null, 2));
      } else {
        console.log('❌ No subscription data found in document');
      }
    } else {
      console.log('❌ Document does not exist after write');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

function calculateSubscriptionExpiry(planType) {
  const now = new Date();
  
  switch (planType) {
    case 'lifetime':
      return 'lifetime';
    case 'pro':
      // 1 year for pro plan
      const proExpiry = new Date(now);
      proExpiry.setFullYear(proExpiry.getFullYear() + 1);
      return proExpiry.toISOString();
    case 'standard':
      // 1 month for standard plan
      const standardExpiry = new Date(now);
      standardExpiry.setMonth(standardExpiry.getMonth() + 1);
      return standardExpiry.toISOString();
    default:
      return null;
  }
}

// Run the test
testWebhookHandler().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Test failed:', error);
  process.exit(1);
});
