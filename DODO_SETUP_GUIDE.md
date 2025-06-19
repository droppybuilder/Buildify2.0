# DodoPayments Integration Setup Guide

## 🚀 Complete Integration Status

✅ **Backend API Routes Created**
- `/api/payment/create.js` - Creates DodoPayments payment links
- `/api/webhooks/dodo.js` - Handles payment webhooks

✅ **Frontend Updated**
- `PricingPlans.tsx` - Now uses DodoPayments instead of PayU
- `PaymentSuccess.tsx` - Handles DodoPayments redirect flow
- `useSubscription.ts` - Updated for DodoPayments fields

✅ **Dependencies Added**
- `standardwebhooks` for webhook verification

## 📋 Required Information

### 1. DodoPayments Dashboard Setup
You need to provide these values from your DodoPayments dashboard:

```env
DODO_PAYMENTS_API_KEY=your_dodo_api_key_here
DODO_WEBHOOK_KEY=your_webhook_secret_key_here
```

### 2. Product IDs
Create products in DodoPayments dashboard and get their IDs:

```env
DODO_STANDARD_PRODUCT_ID=prod_xxxxxxxxxx
DODO_PRO_PRODUCT_ID=prod_yyyyyyyyyy  
DODO_LIFETIME_PRODUCT_ID=prod_zzzzzzzzzz
```

### 3. Application URLs
```env
BASE_URL=https://your-domain.vercel.app
VERCEL_URL=https://your-project.vercel.app
```

## 🛠️ Deployment Steps

### Step 1: Install Dependencies
```bash
npm install standardwebhooks
```

### Step 2: Deploy to Vercel
```bash
vercel --prod
```

### Step 3: Configure Environment Variables in Vercel
1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add all the environment variables from the list above

### Step 4: Configure DodoPayments Webhook
1. Go to DodoPayments Dashboard > Settings > Webhooks
2. Add webhook URL: `https://your-project.vercel.app/api/webhooks/dodo`
3. Select events: `payment.succeeded`, `payment.failed`, `subscription.activated`

## 🧪 Testing Steps

### Step 1: Test Payment Creation
1. Open browser console on your website
2. Run: `fetch('/api/payment/create', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({planId: 'standard', userId: 'test123', userEmail: 'test@example.com', userName: 'Test User'})})`
3. Should return payment URL if successful

### Step 2: Test Payment Flow
1. Go to pricing page
2. Click upgrade on any plan
3. Should redirect to DodoPayments checkout
4. Use test card: `4242 4242 4242 4242`
5. Should redirect back to payment success page

### Step 3: Test Webhook
1. Complete a test payment
2. Check Vercel function logs for webhook events
3. Verify user subscription is updated in your database

## 🔍 Debugging

### Check Vercel Function Logs
```bash
vercel logs
```

### Common Issues
1. **Environment variables not set**: Check Vercel dashboard
2. **Product ID not found**: Verify product IDs in DodoPayments dashboard
3. **Webhook not working**: Check webhook URL configuration
4. **CORS errors**: Vercel.json should handle this

### Test Commands
```javascript
// Test in browser console
testDodoPaymentsIntegration()
testPaymentSuccess()
```

## 📱 User Flow

1. **User clicks upgrade** → Frontend calls `/api/payment/create`
2. **API creates payment link** → DodoPayments returns checkout URL
3. **User redirects to checkout** → Completes payment on DodoPayments
4. **Payment succeeds** → DodoPayments sends webhook to `/api/webhooks/dodo`
5. **Webhook updates database** → User subscription activated
6. **User redirects back** → Payment success page with confirmation

## ⚠️ Important Notes

- **Remove all PayU code** after testing DodoPayments
- **Test in sandbox mode** before going live
- **Monitor webhook delivery** in DodoPayments dashboard
- **Set up proper error handling** for failed payments
- **Configure retry logic** for webhook failures

## 🎯 Next Steps After Setup

1. Test complete payment flow
2. Verify webhook integration
3. Update any remaining PayU references
4. Deploy to production
5. Monitor payment analytics
