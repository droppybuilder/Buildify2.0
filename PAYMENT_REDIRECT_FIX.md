# Payment Redirect Troubleshooting Guide

## Issue: Payment Successful but Not Redirecting

**Date:** June 19, 2025

### The Problem
- Payment completes successfully on DodoPayments
- User sees "Payment Successful" on DodoPayments page
- Shows "Redirecting in 0s" and "Click here if not redirected"
- Does NOT redirect to your success page

### Root Cause
The `return_url` in your payment payload doesn't match your actual deployed domain.

### Solution Steps

#### 1. Fix Environment Variables
Update your `.env.local` and Vercel environment variables:

```bash
# Make sure these match your actual Vercel deployment URL
BASE_URL=https://buildify20.vercel.app
VERCEL_URL=https://buildify20.vercel.app
```

#### 2. Update DodoPayments Webhook URL
1. Go to DodoPayments Dashboard
2. Navigate to **Webhooks** section
3. Update webhook URL to: `https://buildify20.vercel.app/api/webhooks/dodo`
4. Save changes

#### 3. Test Payment Flow
1. Create a new payment link
2. Complete the payment
3. Should redirect to: `https://buildify20.vercel.app/payment-success`

### Debugging

#### Check Return URL in API Logs
The payment creation API now logs the return URL:
```
Return URL will be: https://buildify20.vercel.app/payment-success
```

#### Check Payment Success Page Parameters
The success page now logs all URL parameters:
```javascript
console.log('Payment Success Page - URL Parameters:', {
   paymentId,
   status,
   success,
   fullUrl: window.location.href
})
```

#### Manual Redirect Test
If auto-redirect fails, users can click "Click here if not redirected" which should take them to your success page.

### Common Redirect URLs by Provider

| Provider | Expected Parameters |
|----------|-------------------|
| DodoPayments | `?payment_id=xxx&status=completed` |
| Stripe | `?payment_intent=xxx&redirect_status=succeeded` |
| PayPal | `?paymentId=xxx&PayerID=xxx` |

### Updated Payment Success Page
Now handles multiple parameter formats:
- `status=succeeded` OR `status=completed` OR `success=true`
- Logs all parameters for debugging
- Shows appropriate success/error messages

### Verification Checklist
- [ ] Environment variables updated with correct domain
- [ ] Vercel environment variables match local ones
- [ ] DodoPayments webhook URL updated to correct domain
- [ ] Payment success page route exists at `/payment-success`
- [ ] Test payment completes and redirects properly

### Next Steps After Fix
1. Test the complete payment flow
2. Verify webhook receives payment notifications
3. Check user subscription updates in Firestore
4. Monitor logs for any remaining issues
