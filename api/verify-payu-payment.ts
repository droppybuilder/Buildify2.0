import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin SDK (set GOOGLE_APPLICATION_CREDENTIALS in Vercel)
if (!getApps().length) {
   initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
   })
}
const db = getFirestore()

const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY!
const MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT!

export default async function handler(req: VercelRequest, res: VercelResponse) {
   if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
   }

   // PayU will POST payment result here
   const body = req.body
   // PayU sends x-www-form-urlencoded, so parse if needed
   const data = typeof body === 'string' ? Object.fromEntries(new URLSearchParams(body)) : body

   const { status, txnid, hash, key, amount, productinfo, email, udf1: userId } = data

   // Prepare hash string for verification (see PayU docs for hash sequence)
   // For success: hash = sha512(salt|status|||||||||||email|firstname|productinfo|amount|txnid|key)
   const hashString = `${MERCHANT_SALT}|${status}|||||||||||${email}|${data.firstname}|${productinfo}|${amount}|${txnid}|${key}`
   const expectedHash = crypto.createHash('sha512').update(hashString).digest('hex')

   if (expectedHash !== hash) {
      return res.status(400).json({ error: 'Hash mismatch. Possible tampering.' })
   }

   if (status === 'success') {
      // Update Firestore user subscription
      const userRef = db.collection('users').doc(userId)
      await userRef.set(
         {
            subscription: {
               tier: productinfo.toLowerCase().includes('lifetime')
                  ? 'lifetime'
                  : productinfo.toLowerCase().includes('pro')
                  ? 'pro'
                  : productinfo.toLowerCase().includes('standard')
                  ? 'standard'
                  : 'free',
               paid: true,
               payu_txnid: txnid,
               payu_amount: amount,
               updated_at: new Date().toISOString(),
            },
         },
         { merge: true }
      )
      return res.status(200).json({ success: true })
   } else {
      return res.status(200).json({ success: false, message: 'Payment not successful.' })
   }
}
