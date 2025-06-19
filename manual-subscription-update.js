// Manual subscription update script for when webhook fails
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')),
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error.message);
    process.exit(1);
  }
}

const db = getFirestore();

function calculateSubscriptionExpiry(planType) {
  const now = new Date();
  
  switch (planType) {
    case 'lifetime':
      return 'lifetime';
    case 'pro':
      const proExpiry = new Date(now);
      proExpiry.setFullYear(proExpiry.getFullYear() + 1);
      return proExpiry.toISOString();
    case 'standard':
      const standardExpiry = new Date(now);
      standardExpiry.setMonth(standardExpiry.getMonth() + 1);
      return standardExpiry.toISOString();
    default:
      return null;
  }
}

async function manualSubscriptionUpdate(userId, planType, paymentId = null) {
  try {
    const expiry = calculateSubscriptionExpiry(planType);
    
    const userRef = db.collection('users').doc(userId);
    const updateData = {
      subscription: {
        tier: planType,
        paid: true,
        status: 'active',
        payment_method: 'dodo',
        updated_at: new Date().toISOString(),
        subscriptionExpiry: expiry,
        ...(paymentId && { dodo_payment_id: paymentId })
      }
    };

    await userRef.set(updateData, { merge: true });
    
    console.log(`✅ Successfully updated subscription for ${userId}:`);
    console.log(`   Plan: ${planType}`);
    console.log(`   Expiry: ${expiry}`);
    console.log(`   Payment ID: ${paymentId || 'N/A'}`);
    
    // Verify the update
    const docSnap = await userRef.get();
    if (docSnap.exists) {
      const data = docSnap.data();
      if (data.subscription && data.subscription.tier === planType) {
        console.log('✅ Update verified successfully');
      } else {
        console.log('⚠️ Warning: Update may not have been applied correctly');
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to update subscription:', error);
    throw error;
  }
}

async function listUserSubscriptions(userId) {
  try {
    const userRef = db.collection('users').doc(userId);
    const docSnap = await userRef.get();
    
    if (docSnap.exists) {
      const data = docSnap.data();
      console.log(`📋 Current subscription data for ${userId}:`);
      console.log(JSON.stringify(data.subscription || {}, null, 2));
    } else {
      console.log(`❌ No user found with ID: ${userId}`);
    }
  } catch (error) {
    console.error('❌ Failed to fetch subscription:', error);
  }
}

// Main script logic
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log(`
📖 Manual Subscription Update Script

Usage:
  node manual-subscription-update.js update USER_ID PLAN_TYPE [PAYMENT_ID]
  node manual-subscription-update.js list USER_ID
  node manual-subscription-update.js help

Commands:
  update    Update a user's subscription
  list      Show current subscription for a user
  help      Show this help message

Examples:
  node manual-subscription-update.js update abc123 pro pay_xyz789
  node manual-subscription-update.js update def456 standard
  node manual-subscription-update.js list abc123

Plan Types:
  - free (default)
  - standard (1 month)
  - pro (1 year)  
  - lifetime (permanent)
`);
    return;
  }

  switch (command) {
    case 'update':
      const [_, userId, planType, paymentId] = args;
      if (!userId || !planType) {
        console.error('❌ Missing required arguments for update command');
        console.log('Usage: node manual-subscription-update.js update USER_ID PLAN_TYPE [PAYMENT_ID]');
        return;
      }
      
      if (!['free', 'standard', 'pro', 'lifetime'].includes(planType)) {
        console.error('❌ Invalid plan type. Must be: free, standard, pro, or lifetime');
        return;
      }
      
      await manualSubscriptionUpdate(userId, planType, paymentId);
      break;
      
    case 'list':
      const [_2, listUserId] = args;
      if (!listUserId) {
        console.error('❌ Missing USER_ID for list command');
        console.log('Usage: node manual-subscription-update.js list USER_ID');
        return;
      }
      await listUserSubscriptions(listUserId);
      break;
      
    case 'help':
      // Help message already shown above
      break;
      
    default:
      console.error(`❌ Unknown command: ${command}`);
      console.log('Run without arguments to see help');
  }
}

main().then(() => {
  console.log('\n🏁 Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Script failed:', error);
  process.exit(1);
});
