
import { Webhook } from "standardwebhooks";
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Vercel: disable body parsing to get raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}
const db = getFirestore();

const webhook = new Webhook(process.env.DODO_WEBHOOK_KEY);


export default async function handler(req, res) {
  // Immediate debug log for every request
  console.log('🟡 Incoming request to DodoPayments webhook:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    environment: {
      webhook_key_configured: !!process.env.DODO_WEBHOOK_KEY,
      webhook_key_preview: process.env.DODO_WEBHOOK_KEY ? `${process.env.DODO_WEBHOOK_KEY.substring(0, 10)}...` : 'NOT SET'
    }
  });

  // Detect and log possible redirect
  if (req.method === 'GET') {
    console.log('🔴 GET request received (possible redirect/crawler):', req.url);
    return res.status(307).json({ error: 'Temporary redirect - webhook endpoint only accepts POST' });
  }

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DODO_WEBHOOK_KEY) {
    console.error('❌ DODO_WEBHOOK_KEY not configured');
    return res.status(500).json({ 
      error: 'Webhook key not configured',
      debug: 'DODO_WEBHOOK_KEY environment variable is missing'
    });
  }

  let rawBody = '';
  req.on('data', (chunk) => {
    rawBody += chunk;
  });
  req.on('end', async () => {
    // Log raw body for debugging
    console.log('🟢 Raw body received:', rawBody);
    try {
      const webhookHeaders = {
        "webhook-id": req.headers["webhook-id"] || "",
        "webhook-signature": req.headers["webhook-signature"] || "",
        "webhook-timestamp": req.headers["webhook-timestamp"] || "",
      };
      // Log headers for debugging
      console.log('🟢 Webhook headers:', webhookHeaders);
      // Verify webhook authenticity using raw body
      await webhook.verify(rawBody, webhookHeaders);
      const payload = JSON.parse(rawBody);

      console.log('✅ Webhook verified successfully');
      console.log('📦 Full DodoPayments webhook payload:', JSON.stringify(payload, null, 2));

      // Extract the actual payment data from the payload
      const eventType = payload.type;
      const paymentData = payload.data || payload;

      console.log('📦 Event type:', eventType);
      console.log('📦 Payment data:', JSON.stringify(paymentData, null, 2));

      // Handle different webhook events
      switch (eventType) {
        case 'payment.succeeded':
          await handlePaymentSuccess(paymentData);
          break;
        case 'payment.failed':
          await handlePaymentFailed(paymentData);
          break;
        case 'subscription.activated':
          await handleSubscriptionActivated(paymentData);
          break;
        case 'subscription.cancelled':
          await handleSubscriptionCancelled(paymentData);
          break;
        default:
          console.log('Unhandled webhook type:', eventType);
      }
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error('❌ Webhook error:', {
        message: error.message,
        stack: error.stack,
        headers: req.headers,
        rawBody,
      });
      return res.status(400).json({ 
        error: 'Webhook verification failed',
        details: error.message 
      });
    }
  });
}

async function handlePaymentSuccess(paymentData) {
  console.log('🔍 Processing payment success with data:', JSON.stringify(paymentData, null, 2));
  
  // Extract data from the correct DodoPayments webhook structure
  const payment_id = paymentData.payment_id;
  const amount = paymentData.total_amount; // Fixed: was 'amount', should be 'total_amount'
  const currency = paymentData.currency;
  const customer = paymentData.customer || {};
  const metadata = paymentData.metadata || {};
  
  console.log('🔍 Extracted values:', {
    payment_id,
    amount,
    currency,
    customer,
    metadata
  });
  
  try {
    if (!metadata?.userId || !metadata?.planType) {
      console.error('❌ Missing metadata in webhook payload:', {
        metadata,
        hasUserId: !!metadata?.userId,
        hasPlanType: !!metadata?.planType
      });
      
      // Log the full payment data to understand the structure
      console.error('❌ Full payment data for debugging:', JSON.stringify(paymentData, null, 2));
      return;
    }

    // Calculate subscription expiry based on plan
    const expiry = calculateSubscriptionExpiry(metadata.planType);

    console.log('💾 Updating Firestore for user:', metadata.userId);

    // Prepare subscription data with proper null checks
    const subscriptionData = {
      tier: metadata.planType,
      paid: true,
      status: 'active',
      payment_method: 'dodo',
      updated_at: new Date().toISOString(),
      subscriptionExpiry: expiry
    };    // Only add fields if they have values (not undefined)
    if (payment_id) subscriptionData.dodo_payment_id = payment_id;
    if (amount !== undefined && amount !== null) {
      // Convert amount from cents to dollars for display
      const dollarAmount = (parseFloat(amount) / 100).toFixed(2);
      subscriptionData.dodo_amount = dollarAmount;
    }
    if (currency) subscriptionData.currency = currency;
    if (customer.email) subscriptionData.customer_email = customer.email;
    if (customer.name) subscriptionData.customer_name = customer.name;

    console.log('💾 Final subscription data:', subscriptionData);

    // Update user subscription in Firestore
    const userRef = db.collection('users').doc(metadata.userId);
    await userRef.set({
      subscription: subscriptionData
    }, { merge: true });

    console.log(`✅ Payment succeeded - subscription updated for user: ${metadata.userId}, plan: ${metadata.planType}`);
  } catch (error) {
    console.error('❌ Failed to update subscription:', error);
    throw error;
  }
}

async function handlePaymentFailed(payload) {
  const { metadata, payment_id, error_message, error_code } = payload;
  
  try {
    if (!metadata?.userId) {
      console.error('Missing userId in webhook metadata');
      return;
    }

    // Log payment failure but don't update subscription status
    // (user keeps their current plan)
    const userRef = db.collection('users').doc(metadata.userId);
    await userRef.set({
      payment_attempts: {
        [payment_id]: {
          status: 'failed',
          reason: error_message || error_code || 'Payment failed',
          error_code: error_code || 'UNKNOWN',
          attempted_at: new Date().toISOString(),
          plan_type: metadata.planType
        }
      }
    }, { merge: true });

    console.log(`Payment failed for user: ${metadata.userId}, reason: ${error_message || error_code}`);
  } catch (error) {
    console.error('Failed to log payment failure:', error);
    throw error;
  }
}

async function handleSubscriptionActivated(payload) {
  console.log('Subscription activated:', payload.subscription_id);
  // Handle subscription-specific logic here if needed
}

async function handleSubscriptionCancelled(payload) {
  const { metadata } = payload;
  
  try {
    if (!metadata?.userId) return;

    const userRef = db.collection('users').doc(metadata.userId);
    await userRef.set({
      subscription: {
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      }
    }, { merge: true });

    console.log(`Subscription cancelled for user: ${metadata.userId}`);
  } catch (error) {
    console.error('Failed to handle subscription cancellation:', error);
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
