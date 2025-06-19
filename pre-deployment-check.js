// Pre-deployment checklist and tests
import fs from 'fs';
import path from 'path';

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: Found`);
    return true;
  } else {
    console.log(`❌ ${description}: Missing`);
    return false;
  }
}

function checkEnvVar(varName, description) {
  if (process.env[varName]) {
    console.log(`✅ ${description}: Set`);
    return true;
  } else {
    console.log(`❌ ${description}: Missing`);
    return false;
  }
}

async function runPreDeploymentCheck() {
  console.log('🚀 Pre-deployment checklist for DodoPayments integration\n');
  
  let allGood = true;

  // Check required files
  console.log('📁 Checking required files:');
  allGood &= checkFile('api/webhooks/dodo.js', 'Webhook handler');
  allGood &= checkFile('api/payment/create.js', 'Payment API');
  allGood &= checkFile('vercel.json', 'Vercel configuration');
  allGood &= checkFile('.env.local', 'Local environment file');
  allGood &= checkFile('package.json', 'Package.json');
  
  console.log('\n🔧 Checking package dependencies:');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = ['firebase-admin', 'standardwebhooks'];
  for (const dep of requiredDeps) {
    if (deps[dep]) {
      console.log(`✅ ${dep}: Installed (${deps[dep]})`);
    } else {
      console.log(`❌ ${dep}: Missing`);
      allGood = false;
    }
  }

  console.log('\n🌐 Checking environment variables:');
  // Load .env.local for checking
  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    // Temporarily set env vars for checking
    Object.assign(process.env, envVars);
  }
  
  allGood &= checkEnvVar('DODO_PAYMENTS_API_KEY', 'DodoPayments API Key');
  allGood &= checkEnvVar('DODO_WEBHOOK_KEY', 'DodoPayments Webhook Key');
  allGood &= checkEnvVar('DODO_API_BASE_URL', 'DodoPayments API Base URL');
  allGood &= checkEnvVar('FIREBASE_SERVICE_ACCOUNT_KEY', 'Firebase Service Account');
  allGood &= checkEnvVar('BASE_URL', 'Base URL');

  console.log('\n⚙️ Checking Vercel configuration:');
  if (fs.existsSync('vercel.json')) {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    
    const hasWebhookRewrite = vercelConfig.rewrites?.some(r => 
      r.source === '/api/webhooks/dodo' && r.destination === '/api/webhooks/dodo.js'
    );
    const hasPaymentRewrite = vercelConfig.rewrites?.some(r => 
      r.source === '/api/payment/create' && r.destination === '/api/payment/create.js'
    );
    
    if (hasWebhookRewrite) {
      console.log('✅ Webhook rewrite rule: Configured');
    } else {
      console.log('❌ Webhook rewrite rule: Missing');
      allGood = false;
    }
    
    if (hasPaymentRewrite) {
      console.log('✅ Payment rewrite rule: Configured');
    } else {
      console.log('❌ Payment rewrite rule: Missing');
      allGood = false;
    }
  }

  console.log('\n📋 Summary:');
  if (allGood) {
    console.log('🎉 All checks passed! Ready for deployment.');
    console.log('\nNext steps:');
    console.log('1. Deploy to Vercel: vercel --prod');
    console.log('2. Set environment variables in Vercel dashboard');
    console.log('3. Configure webhook URL in DodoPayments dashboard');
    console.log('4. Test webhook endpoint after deployment');
  } else {
    console.log('❌ Some checks failed. Please fix the issues above before deploying.');
  }

  return allGood;
}

runPreDeploymentCheck().catch(console.error);
