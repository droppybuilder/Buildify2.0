import { createHash } from 'crypto';

// Environment variables (set these in Vercel dashboard)
const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
const MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const PAYU_BASE_URL = 'https://test.payu.in/_payment'; // Use production URL for live

const PLAN_DETAILS = {
   standard: { amount: '8.00', productinfo: 'Standard Plan' },
   pro: { amount: '95.00', productinfo: 'Pro Plan' },
   lifetime: { amount: '200.00', productinfo: 'Lifetime Plan' },
};

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
   }

   const { planId, userId, userEmail, userName } = req.body;
   if (!planId || !userId || !userEmail || !userName) {
      return res.status(400).json({ error: 'Missing required fields' });
   }

   const txnid = 'txn_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
   const { amount, productinfo } = PLAN_DETAILS[planId] || {};
   if (!amount) return res.status(400).json({ error: 'Invalid planId' });

   // Success and failure URLs
   const surl = `${BASE_URL}/payment-success`;
   const furl = `${BASE_URL}/payment-failure`;

   // Prepare hash string
   const hashString = `${MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${userName}|${userEmail}|||||||||||${MERCHANT_SALT}`;
   const hash = createHash('sha512').update(hashString).digest('hex');

   // Render a form that auto-submits to PayU
   const formHtml = `
    <html><body>
    <form id="payuForm" method="post" action="${PAYU_BASE_URL}">
      <input type="hidden" name="key" value="${MERCHANT_KEY}" />
      <input type="hidden" name="txnid" value="${txnid}" />
      <input type="hidden" name="amount" value="${amount}" />
      <input type="hidden" name="productinfo" value="${productinfo}" />
      <input type="hidden" name="firstname" value="${userName}" />
      <input type="hidden" name="email" value="${userEmail}" />
      <input type="hidden" name="phone" value="" />
      <input type="hidden" name="surl" value="${surl}" />
      <input type="hidden" name="furl" value="${furl}" />
      <input type="hidden" name="hash" value="${hash}" />
      <input type="hidden" name="udf1" value="${userId}" />
    </form>
    <script>document.getElementById('payuForm').submit();</script>
    </body></html>
  `;

   res.setHeader('Content-Type', 'text/html');
   res.status(200).send(formHtml);
}
