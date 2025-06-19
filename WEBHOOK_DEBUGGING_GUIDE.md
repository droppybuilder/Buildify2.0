# Webhook Debugging Guide

This guide helps debug why the DodoPayments webhook is not updating the frontend subscription after successful payment.

## Problem Summary
- Payment flow works: payment link creation, redirect to success page ✅
- Webhook handler code is correct: writes data to Firebase properly ✅
- Frontend subscription reading is correct: reads data from Firebase properly ✅ 
- **Issue**: Webhook endpoint returns 404 or is not being called by DodoPayments ❌

## Testing Results

### ✅ Firebase Integration Test
```bash
node test-webhook-handler.js
```
**Result**: Firebase write and read operations work perfectly.

### ✅ Frontend Subscription Read Test  
```bash
node test-frontend-subscription.js
```
**Result**: Frontend correctly reads subscription data from Firebase.

### ❌ Webhook Endpoint Test
```bash
node test-webhook-endpoint.js
```
**Result**: Webhook endpoint returns 404 on production URL.

## Debugging Steps

### 1. Check Vercel Deployment
```bash
# Deploy to Vercel to ensure API functions are deployed
npm run build
vercel --prod

# Or if using GitHub integration, push to main branch
git add .
git commit -m "Fix webhook endpoint"
git push origin main
```

### 2. Verify Environment Variables on Vercel
Go to Vercel Dashboard → Project → Settings → Environment Variables

Required variables:
```
DODO_PAYMENTS_API_KEY=2RdhbTr4OeZimZOh.x38SM3G0x4_8o35V7lOfm_Wb04pjgr-jUpP1i_ccJRv2-Hcq
DODO_WEBHOOK_KEY=whsec_dyCawXmjue9gR33qZjmFf7Ak
DODO_API_BASE_URL=https://api.dodopayments.com
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
BASE_URL=https://buildfyweb.vercel.app/
```

### 3. Test Webhook Endpoint After Deployment
```bash
# Test production webhook endpoint
curl -X POST https://buildfyweb.vercel.app/api/webhooks/dodo \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

Expected responses:
- **400 Bad Request**: "Webhook verification failed" (endpoint exists but signature verification fails) ✅
- **405 Method Not Allowed**: Only if using GET instead of POST
- **404 Not Found**: Endpoint not deployed ❌

### 4. Check DodoPayments Webhook Configuration
1. Log in to DodoPayments Dashboard
2. Go to Settings → Webhooks
3. Verify webhook URL: `https://buildfyweb.vercel.app/api/webhooks/dodo`
4. Verify events are enabled: `payment.succeeded`, `payment.failed`
5. Check webhook delivery logs for failures

### 5. Add Logging to Webhook Handler
Add console.log at the beginning of the webhook handler:

```javascript
export default async function handler(req, res) {
  console.log('🎯 Webhook called!', {
    method: req.method,
    headers: Object.keys(req.headers),
    hasBody: !!req.body
  });
  
  // ... rest of handler
}
```

Check Vercel Function logs: Vercel Dashboard → Project → Functions → View logs

### 6. Test with Real Payment
1. Create a test payment using minimum amount ($1-5)
2. Complete payment flow
3. Check Vercel function logs immediately after payment
4. Check Firebase for subscription update

### 7. Manual Webhook Testing
If webhook is still not working, test manually:

```javascript
// Run this script to manually trigger subscription update
node manual-subscription-update.js
```

## Common Issues & Solutions

### Issue: 404 Not Found on Webhook Endpoint
**Cause**: API functions not deployed to Vercel
**Solution**: 
```bash
vercel --prod
# Wait for deployment to complete
# Test webhook endpoint again
```

### Issue: Webhook endpoint exists but returns 400
**Cause**: Webhook signature verification failing (expected during testing)
**Solution**: This is normal - DodoPayments will send proper signatures

### Issue: Webhook called but Firebase not updated
**Cause**: Environment variables not set on Vercel
**Solution**: Add FIREBASE_SERVICE_ACCOUNT_KEY to Vercel environment variables

### Issue: Firebase updated but frontend not refreshing
**Cause**: Frontend not re-fetching subscription data  
**Solution**: The subscription hook should automatically refresh, but you can manually call `refetch()` from `useSubscription` on the success page.

## Manual Fix Script
Create this script if webhook fails completely:

```javascript
// manual-subscription-update.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
  });
}
const db = getFirestore();

async function manualSubscriptionUpdate(userId, planType) {
  const userRef = db.collection('users').doc(userId);
  await userRef.set({
    subscription: {
      tier: planType,
      paid: true,
      status: 'active',
      payment_method: 'dodo',
      updated_at: new Date().toISOString(),
      subscriptionExpiry: planType === 'lifetime' ? 'lifetime' : new Date(Date.now() + 365*24*60*60*1000).toISOString()
    }
  }, { merge: true });
  
  console.log(`✅ Manually updated subscription for ${userId} to ${planType}`);
}

// Usage: node manual-subscription-update.js USER_ID PLAN_TYPE
const [userId, planType] = process.argv.slice(2);
if (userId && planType) {
  manualSubscriptionUpdate(userId, planType).then(() => process.exit(0));
} else {
  console.log('Usage: node manual-subscription-update.js USER_ID PLAN_TYPE');
  console.log('Example: node manual-subscription-update.js abc123 pro');
}
```

## Next Steps
1. Deploy to Vercel and test webhook endpoint
2. Verify environment variables on Vercel  
3. Check DodoPayments webhook configuration
4. Test with real payment and monitor logs
5. Use manual fix script if needed
