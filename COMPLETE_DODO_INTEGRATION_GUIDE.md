# Complete DodoPayments Integration Guide for React + Firebase + Vercel

**Date:** June 19, 2025  
**Status:** Successfully Tested & Working  
**Integration Type:** React Frontend + Firebase Auth/Database + Vercel Serverless Functions

## 🎯 What This Guide Covers

This is a complete, battle-tested guide for integrating DodoPayments into a React application with Firebase and Vercel serverless functions. Every detail has been tested and verified to work.

## 📋 Prerequisites

- React application (Vite or Create React App)
- Firebase project with Firestore
- Vercel account for deployment
- DodoPayments account (start with test mode)
- Basic knowledge of React, Node.js, and serverless functions

## 🔧 Part 1: DodoPayments Dashboard Setup

### 1.1 Create DodoPayments Account
1. Sign up at https://dodopayments.com
2. Verify your email and complete account setup
3. **Important**: Start in TEST MODE for development

### 1.2 Create Products in Dashboard
1. Navigate to **Products** section
2. Create products for each subscription plan:
   - **Standard Plan** → Note the Product ID (format: `pdt_xxxxxxxxxxxxx`)
   - **Pro Plan** → Note the Product ID  
   - **Lifetime Plan** → Note the Product ID
3. **Critical**: Save these Product IDs - you'll need them later

### 1.3 Get API Credentials
1. Go to **API Settings** or **Developer** section
2. Copy your **API Key** (format: `email.xxxxx` or similar)
3. **Important**: This is your TEST mode API key

### 1.4 Setup Webhooks (Critical for Success Redirect)
1. Navigate to **Webhooks** section
2. Add webhook URL: `https://your-domain.vercel.app/api/webhooks/dodo`
3. Select events: `payment.completed`, `payment.failed`, `subscription.created`
4. Generate and save the **Webhook Secret** (format: `whsec_xxxxx`)
5. **Critical**: The webhook URL must be your actual deployed domain

## 🚀 Part 2: Project Setup

### 2.1 Install Dependencies
```bash
npm install dotenv standardwebhooks
```

### 2.2 Environment Variables Setup
Create `.env.local` in your project root:

```bash
# DodoPayments Configuration (TEST MODE)
DODO_PAYMENTS_API_KEY=your_api_key_here
DODO_WEBHOOK_KEY=whsec_your_webhook_secret_here
DODO_API_BASE_URL=https://test.dodopayments.com
DODO_MODE=test

# DodoPayments Product IDs (from your dashboard)
DODO_STANDARD_PRODUCT_ID=pdt_your_standard_product_id
DODO_PRO_PRODUCT_ID=pdt_your_pro_product_id
DODO_LIFETIME_PRODUCT_ID=pdt_your_lifetime_product_id

# Application URLs (CRITICAL for redirects)
BASE_URL=https://your-domain.vercel.app
VERCEL_URL=https://your-domain.vercel.app

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### 2.3 Vercel Configuration
Create `vercel.json` in project root:

```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

## 💻 Part 3: Backend Implementation (Vercel Serverless Functions)

### 3.1 Payment Creation API (`api/payment/create.js`)

**CRITICAL ENDPOINT DISCOVERY**: Use `/payments` NOT `/subscriptions`

```javascript
// api/payment/create.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, userId, userEmail, userName } = req.body;
    
    console.log('Payment creation request:', { planId, userId, userEmail, userName });
    
    if (!planId || !userId || !userEmail || !userName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: planId, userId, userEmail, userName' 
      });
    }

    const productId = getDodoProductId(planId);
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: `Invalid plan ID: ${planId}`
      });
    }

    const payment = await createDodoPayment({
      productId,
      userId,
      userEmail,
      userName,
      planId
    });

    return res.status(200).json({
      success: true,
      paymentUrl: payment.payment_link,
      paymentId: payment.payment_id
    });
  } catch (error) {
    console.error('DodoPayments API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Payment creation failed',
      details: error.message 
    });
  }
}

function getDodoProductId(planId) {
  const productMapping = {
    'standard': process.env.DODO_STANDARD_PRODUCT_ID,
    'pro': process.env.DODO_PRO_PRODUCT_ID,
    'lifetime': process.env.DODO_LIFETIME_PRODUCT_ID
  };
  
  return productMapping[planId];
}

async function createDodoPayment({ productId, userId, userEmail, userName, planId }) {
  const baseUrl = process.env.DODO_API_BASE_URL || 'https://test.dodopayments.com';
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  
  if (!apiKey) {
    throw new Error('DodoPayments API key not configured');
  }

  // CRITICAL: Use product_cart array, NOT individual product_id
  const payload = {
    payment_link: true,
    product_cart: [
      {
        product_id: productId,
        quantity: 1
      }
    ],
    customer: {
      email: userEmail,
      name: userName,
      create_new_customer: true
    },
    billing: {
      city: "New York",
      country: "US", 
      state: "NY",
      street: "123 Main St",
      zipcode: "10001"
    },
    return_url: `${process.env.BASE_URL}/payment-success`,
    metadata: {
      userId: userId,
      planType: planId,
      timestamp: new Date().toISOString(),
      source: 'your-app-name'
    }
  };

  const response = await fetch(`${baseUrl}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData = {};
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }
    throw new Error(`DodoPayments API error: ${response.status} - ${errorData?.message || response.statusText}`);
  }

  return await response.json();
}
```

### 3.2 Webhook Handler (`api/webhooks/dodo.js`)

```javascript
// api/webhooks/dodo.js
import { Webhook } from 'standardwebhooks';
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookSecret = process.env.DODO_WEBHOOK_KEY;
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    // Verify webhook signature
    const wh = new Webhook(webhookSecret);
    const payload = JSON.stringify(req.body);
    const headers = req.headers;
    
    let event;
    try {
      event = wh.verify(payload, headers);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    console.log('Webhook event received:', event.type);

    if (event.type === 'payment.completed') {
      await handlePaymentCompleted(event.data);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentCompleted(paymentData) {
  try {
    const { metadata, customer, payment_id } = paymentData;
    const { userId, planType } = metadata;

    if (!userId || !planType) {
      console.error('Missing metadata in payment:', paymentData);
      return;
    }

    // Update user subscription in Firestore
    const db = admin.firestore();
    await db.collection('users').doc(userId).update({
      subscription: {
        plan: planType,
        status: 'active',
        paymentId: payment_id,
        activatedAt: admin.firestore.FieldValue.serverTimestamp(),
        expiresAt: getExpirationDate(planType)
      }
    });

    console.log(`Subscription activated for user ${userId}: ${planType}`);
  } catch (error) {
    console.error('Failed to process payment completion:', error);
  }
}

function getExpirationDate(planType) {
  if (planType === 'lifetime') return null;
  
  const now = new Date();
  const expirationDate = new Date(now);
  expirationDate.setMonth(now.getMonth() + (planType === 'standard' ? 1 : 12));
  
  return admin.firestore.Timestamp.fromDate(expirationDate);
}
```

## 🎨 Part 4: Frontend Integration

### 4.1 Payment Initiation Component

```jsx
// src/components/Subscription/PricingPlans.tsx
import { useAuth } from '../contexts/AuthContext';

export function PricingPlans() {
  const { user } = useAuth();

  const handleSubscribe = async (planId) => {
    if (!user) {
      // Redirect to login
      return;
    }

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName || user.email
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to payment URL
        window.location.href = result.paymentUrl;
      } else {
        console.error('Payment creation failed:', result.error);
        alert('Payment creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="pricing-plans">
      {/* Your pricing plans UI */}
      <button onClick={() => handleSubscribe('standard')}>
        Subscribe to Standard
      </button>
      <button onClick={() => handleSubscribe('pro')}>
        Subscribe to Pro
      </button>
      <button onClick={() => handleSubscribe('lifetime')}>
        Subscribe to Lifetime
      </button>
    </div>
  );
}
```

### 4.2 Payment Success Page

```jsx
// src/pages/PaymentSuccess.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const success = searchParams.get('success');
    
    if (success === 'true' && paymentId) {
      setStatus('success');
      // Optional: Verify payment status with your backend
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  if (status === 'processing') {
    return <div>Processing your payment...</div>;
  }

  if (status === 'success') {
    return (
      <div className="payment-success">
        <h1>Payment Successful!</h1>
        <p>Your subscription has been activated.</p>
        <button onClick={() => window.location.href = '/dashboard'}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="payment-failed">
      <h1>Payment Failed</h1>
      <p>There was an issue with your payment. Please try again.</p>
      <button onClick={() => window.location.href = '/pricing'}>
        Try Again
      </button>
    </div>
  );
}
```

## 🧪 Part 5: Testing

### 5.1 Local Testing
```bash
# Start development servers
npm run dev          # Frontend
vercel dev           # Backend APIs

# Test payment creation
curl -X POST http://localhost:3000/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "standard",
    "userId": "test123",
    "userEmail": "test@example.com", 
    "userName": "Test User"
  }'
```

Expected response:
```json
{
  "success": true,
  "paymentUrl": "https://test.checkout.dodopayments.com/xxxxxx",
  "paymentId": "pay_xxxxxx"
}
```

### 5.2 End-to-End Testing
1. Click subscribe button on your frontend
2. Complete payment on DodoPayments checkout
3. Verify webhook receives payment notification
4. Check user subscription updated in Firestore
5. Verify redirect to success page

## 🚀 Part 6: Production Deployment

### 6.1 Vercel Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:
```
DODO_PAYMENTS_API_KEY=your_api_key
DODO_WEBHOOK_KEY=whsec_xxxxx
DODO_API_BASE_URL=https://test.dodopayments.com
DODO_STANDARD_PRODUCT_ID=pdt_xxxxx
DODO_PRO_PRODUCT_ID=pdt_xxxxx
DODO_LIFETIME_PRODUCT_ID=pdt_xxxxx
BASE_URL=https://your-domain.vercel.app
VERCEL_URL=https://your-domain.vercel.app
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### 6.2 Update DodoPayments Webhook URL
1. Go to DodoPayments dashboard
2. Update webhook URL to: `https://your-domain.vercel.app/api/webhooks/dodo`
3. Test webhook delivery

## ⚠️ Common Issues & Solutions

### Issue 1: 404 Not Found
- **Cause**: Wrong endpoint path
- **Solution**: Use `/payments` not `/subscriptions`

### Issue 2: 422 Missing field `product_cart`
- **Cause**: Wrong payload structure
- **Solution**: Use `product_cart` array, not individual `product_id`

### Issue 3: Redirect Not Working
- **Cause**: Wrong webhook URL or return_url
- **Solution**: Ensure webhook URL matches your deployed domain

### Issue 4: Environment Variables Not Loading
- **Cause**: Variables not set in Vercel
- **Solution**: Add all variables in Vercel dashboard

## 🔥 Key Learnings & Critical Points

1. **API Endpoint**: Always use `/payments` endpoint
2. **Payload Structure**: Must use `product_cart` array
3. **Webhook URL**: Must match your actual deployed domain
4. **Return URL**: Use your domain + `/payment-success`
5. **Environment Variables**: Must be set in both local and Vercel
6. **Product IDs**: Must exist in your DodoPayments dashboard
7. **API Key**: Must be from correct mode (test/live)

## 📚 API Reference

### DodoPayments API Endpoints
- **Test Mode**: `https://test.dodopayments.com/payments`
- **Live Mode**: `https://live.dodopayments.com/payments`

### Required Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### Webhook Events
- `payment.completed` - Payment successful
- `payment.failed` - Payment failed
- `subscription.created` - Subscription created

This guide has been tested and verified to work. Follow each step carefully and you'll have a working DodoPayments integration!
