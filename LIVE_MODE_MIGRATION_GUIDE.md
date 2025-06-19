# DodoPayments: Test Mode to Live Mode Migration Guide

**Date:** June 19, 2025

## Overview
This guide explains how to switch from DodoPayments test mode to live mode for production use.

## ⚠️ IMPORTANT: Complete Test Mode First
Before switching to live mode, ensure:
- [ ] Test payments work completely
- [ ] Webhooks receive and process events correctly
- [ ] User subscriptions update in Firestore
- [ ] Payment redirect works properly
- [ ] All error handling is tested

## Step 1: DodoPayments Dashboard - Live Mode Setup

### 1.1 Switch to Live Mode
1. Log into your DodoPayments dashboard
2. Look for a "Mode" switcher (usually top-right corner)
3. Switch from "Test Mode" to "Live Mode"
4. **Important**: This may require additional account verification

### 1.2 Create Live Products
1. In Live Mode, recreate your products:
   - Standard Plan
   - Pro Plan  
   - Lifetime Plan
2. **Critical**: Product IDs will be different from test mode
3. Note down the new Live Product IDs (format: `pdt_xxxxxxxxxxxxx`)

### 1.3 Get Live API Credentials
1. Go to **API Settings** in Live Mode
2. Generate a new **Live API Key**
3. Generate a new **Live Webhook Secret**
4. **Important**: Live keys are different from test keys

### 1.4 Update Webhook URLs
1. Navigate to **Webhooks** in Live Mode
2. Add webhook URL: `https://buildify20.vercel.app/api/webhooks/dodo`
3. Select events: `payment.completed`, `payment.failed`, `subscription.created`
4. Use the new Live webhook secret

## Step 2: Update Environment Variables

### 2.1 Local Development (.env.local)
```bash
# DodoPayments Configuration (LIVE MODE)
DODO_PAYMENTS_API_KEY=your_live_api_key_here
DODO_WEBHOOK_KEY=whsec_your_live_webhook_secret
DODO_API_BASE_URL=https://live.dodopayments.com
DODO_MODE=live

# DodoPayments Live Product IDs
DODO_STANDARD_PRODUCT_ID=pdt_live_standard_id
DODO_PRO_PRODUCT_ID=pdt_live_pro_id
DODO_LIFETIME_PRODUCT_ID=pdt_live_lifetime_id

# Application URLs (same as before)
BASE_URL=https://buildify20.vercel.app
VERCEL_URL=https://buildify20.vercel.app

# Firebase Configuration (same as before)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### 2.2 Vercel Production Environment
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update ALL DodoPayments variables for **Production** environment:

```
DODO_PAYMENTS_API_KEY=your_live_api_key_here
DODO_WEBHOOK_KEY=whsec_your_live_webhook_secret
DODO_API_BASE_URL=https://live.dodopayments.com
DODO_MODE=live
DODO_STANDARD_PRODUCT_ID=pdt_live_standard_id
DODO_PRO_PRODUCT_ID=pdt_live_pro_id
DODO_LIFETIME_PRODUCT_ID=pdt_live_lifetime_id
```

## Step 3: Code Changes

### 3.1 Remove Fallback Values
Update `api/payment/create.js` to remove test mode fallbacks:

```javascript
// Remove this fallback in production
const apiKey = process.env.DODO_PAYMENTS_API_KEY; // Remove || 'fallback_key'

// Remove fallback mappings
function getDodoProductId(planId) {
  const productMapping = {
    'standard': process.env.DODO_STANDARD_PRODUCT_ID,
    'pro': process.env.DODO_PRO_PRODUCT_ID,
    'lifetime': process.env.DODO_LIFETIME_PRODUCT_ID
  };
  
  // No fallback values in production
  return productMapping[planId];
}
```

### 3.2 Update Base URL Logic
```javascript
// Ensure production URLs are used
const baseUrl = process.env.DODO_API_BASE_URL; // Should be https://live.dodopayments.com
```

## Step 4: Testing Live Mode

### 4.1 Use Real Payment Methods
- Real credit/debit cards
- Real bank accounts
- Real PayPal accounts
- **Note**: You will be charged real money

### 4.2 Test Small Amounts First
1. Create a test product with $1 price
2. Complete a real payment
3. Verify all systems work correctly
4. Refund the test payment if needed

### 4.3 Verification Checklist
- [ ] Live payment completes successfully
- [ ] Webhook receives live payment events
- [ ] User subscription updates in Firestore
- [ ] Success page displays correctly
- [ ] No console errors in production

## Step 5: Monitoring & Maintenance

### 5.1 Monitor Webhook Delivery
1. Check DodoPayments dashboard for webhook delivery status
2. Monitor your Vercel function logs
3. Set up alerts for failed webhooks

### 5.2 Error Handling
```javascript
// Add production error monitoring
if (process.env.DODO_MODE === 'live') {
  // Send errors to monitoring service (Sentry, LogRocket, etc.)
  console.error('PRODUCTION ERROR:', error);
}
```

### 5.3 Backup & Recovery
1. Regular Firestore backups
2. Payment reconciliation reports
3. Customer support workflows

## Step 6: Gradual Rollout Strategy

### Option A: Feature Flag
```javascript
const useLivePayments = process.env.ENABLE_LIVE_PAYMENTS === 'true';
const apiBaseUrl = useLivePayments 
  ? 'https://live.dodopayments.com'
  : 'https://test.dodopayments.com';
```

### Option B: Staging Environment
1. Deploy to staging with live credentials
2. Test thoroughly with small amounts
3. Deploy to production when confident

## Security Considerations

### 5.1 Environment Variable Security
- Never commit live API keys to git
- Use Vercel's secure environment variables
- Rotate keys regularly

### 5.2 Webhook Security
```javascript
// Always verify webhook signatures in production
const wh = new Webhook(process.env.DODO_WEBHOOK_KEY);
try {
  const event = wh.verify(payload, headers);
} catch (err) {
  return res.status(400).json({ error: 'Invalid signature' });
}
```

## Rollback Plan

If issues occur in live mode:

1. **Immediate**: Switch environment variables back to test mode
2. **Update**: Change `DODO_API_BASE_URL` to test URL
3. **Redeploy**: Push changes to Vercel
4. **Notify**: Inform users of maintenance
5. **Debug**: Fix issues in test mode first

## Cost Considerations

### Live Mode Costs
- DodoPayments transaction fees (typically 2.9% + $0.30)
- Vercel function execution costs
- Firebase storage/operations costs

### Optimization
- Monitor transaction volumes
- Optimize webhook processing
- Consider caching strategies

## Support & Documentation

- DodoPayments Live Mode Documentation
- DodoPayments Support (for live mode issues)
- Your internal monitoring/alerting systems

## Final Checklist Before Going Live

- [ ] All test mode functionality working perfectly
- [ ] Live products created in DodoPayments dashboard
- [ ] Live API keys generated and secured
- [ ] Environment variables updated in Vercel
- [ ] Webhook URLs updated to live endpoints
- [ ] Small test payment completed successfully
- [ ] Error monitoring/alerting set up
- [ ] Customer support process defined
- [ ] Rollback plan tested
- [ ] Team trained on live mode operations

**Remember**: Live mode processes real money. Test thoroughly before switching!
