import { Webhook } from "standardwebhooks";
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}
const db = getFirestore();

const webhook = new Webhook(process.env.DODO_WEBHOOK_KEY);

export default async function handler(req, res) {
  // Enhanced logging for debugging
  console.log('🎯 DodoPayments webhook called!', {
    method: req.method,
    headers: {
      'webhook-id': req.headers['webhook-id'],
      'webhook-timestamp': req.headers['webhook-timestamp'], 
      'webhook-signature': req.headers['webhook-signature'] ? 'present' : 'missing',
      'content-type': req.headers['content-type']
    },
    bodyType: typeof req.body,
    bodyKeys: req.body ? Object.keys(req.body) : []
  });

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get raw body as string for webhook verification
    const rawBody = JSON.stringify(req.body);
    
    const webhookHeaders = {
      "webhook-id": req.headers["webhook-id"] || "",
      "webhook-signature": req.headers["webhook-signature"] || "",
      "webhook-timestamp": req.headers["webhook-timestamp"] || "",
    };    // Verify webhook authenticity
    await webhook.verify(rawBody, webhookHeaders);
    const payload = req.body;

    console.log('✅ Webhook verified successfully');
    console.log('📦 DodoPayments webhook payload:', {
      type: payload.type,
      payment_id: payload.payment_id,
      metadata: payload.metadata
    });

    // Handle different webhook events
    switch (payload.type) {
      case 'payment.succeeded':
        await handlePaymentSuccess(payload);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;
      case 'subscription.activated':
        await handleSubscriptionActivated(payload);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload);
        break;
      default:
        console.log('Unhandled webhook type:', payload.type);
    }    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', {
      message: error.message,
      stack: error.stack,
      headers: req.headers,
      body: req.body
    });
    return res.status(400).json({ 
      error: 'Webhook verification failed',
      details: error.message 
    });
  }
}

async function handlePaymentSuccess(payload) {
  const { customer, metadata, payment_id, amount, currency } = payload;
  
  try {
    if (!metadata?.userId || !metadata?.planType) {
      console.error('Missing metadata in webhook payload');
      return;
    }

    // Calculate subscription expiry based on plan
    const expiry = calculateSubscriptionExpiry(metadata.planType);

    // Update user subscription in Firestore
    const userRef = db.collection('users').doc(metadata.userId);
    await userRef.set({
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
    }, { merge: true });    console.log(`✅ Payment succeeded - updating subscription for user: ${metadata.userId}, plan: ${metadata.planType}`);
  } catch (error) {
    console.error('❌ Failed to update subscription:', error);
    throw error;
  }
}

async function handlePaymentFailed(payload) {
  const { metadata, payment_id, failure_reason } = payload;
  
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
          reason: failure_reason,
          attempted_at: new Date().toISOString(),
          plan_type: metadata.planType
        }
      }
    }, { merge: true });

    console.log(`Payment failed for user: ${metadata.userId}, reason: ${failure_reason}`);
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
