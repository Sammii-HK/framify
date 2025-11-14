#!/usr/bin/env node

/**
 * Auth0 Setup Script
 * Automates the setup of Auth0 environment variables
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function generateSecret() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

async function main() {
  console.log('\n🔐 Auth0 Setup for Framify\n');
  console.log('This script will help you set up Auth0 environment variables.\n');

  // Get Auth0 credentials
  console.log('💡 Tip: Press Enter to use defaults (shown in parentheses)\n');
  const clientId = await question('Enter your Auth0 Client ID (default: oFVm4vy2hNm53uMeeUaUH88WHfElHJrV): ') || 'oFVm4vy2hNm53uMeeUaUH88WHfElHJrV';
  const clientSecret = await question('Enter your Auth0 Client Secret (REQUIRED - get from dashboard): ');
  const domain = await question('Enter your Auth0 Domain (default: dev-lji2ti0xxkebshe2.auth0.com): ') || 'dev-lji2ti0xxkebshe2.auth0.com';
  
  // Generate secret
  const useGenerated = await question('\nGenerate a new AUTH0_SECRET? (y/n, default: y): ') || 'y';
  let auth0Secret;
  if (useGenerated.toLowerCase() === 'y') {
    auth0Secret = await generateSecret();
    console.log(`✅ Generated secret: ${auth0Secret}\n`);
  } else {
    auth0Secret = await question('Enter your AUTH0_SECRET: ');
  }

  // Get base URLs
  const localUrl = await question('Local URL (default: http://localhost:3000): ') || 'http://localhost:3000';
  const prodUrl = await question('Production URL (default: https://framify-nine.vercel.app): ') || 'https://framify-nine.vercel.app';

  if (!clientSecret) {
    console.error('\n❌ Error: Client Secret is required!');
    console.log('\nTo get your Client Secret:');
    console.log('1. Go to https://manage.auth0.com');
    console.log('2. Applications → framify → Settings');
    console.log('3. Copy the Client Secret\n');
    rl.close();
    process.exit(1);
  }

  // Create .env.local content
  const envLocal = `# Auth0 Configuration
AUTH0_SECRET=${auth0Secret}
APP_BASE_URL=${localUrl}
AUTH0_DOMAIN=${domain}
AUTH0_CLIENT_ID=${clientId}
AUTH0_CLIENT_SECRET=${clientSecret}

# Add your other environment variables below
# DATABASE_URL=...
# OPENAI_API_KEY=...
# NEXT_PUBLIC_APP_URL=${localUrl}
`;

  // Create .env.production content
  const envProduction = `# Auth0 Configuration (Production)
AUTH0_SECRET=${auth0Secret}
APP_BASE_URL=${prodUrl}
AUTH0_DOMAIN=${domain}
AUTH0_CLIENT_ID=${clientId}
AUTH0_CLIENT_SECRET=${clientSecret}
`;

  // Write .env.local
  const envLocalPath = path.join(process.cwd(), '.env.local');
  fs.writeFileSync(envLocalPath, envLocal);
  console.log(`\n✅ Created ${envLocalPath}`);

  // Write .env.production.example
  const envProdExamplePath = path.join(process.cwd(), '.env.production.example');
  fs.writeFileSync(envProdExamplePath, envProduction);
  console.log(`✅ Created ${envProdExamplePath} (for reference)`);

  // Display Auth0 Dashboard URLs
  console.log('\n📋 Next Steps:\n');
  console.log('1. Update Auth0 Dashboard URLs:');
  console.log('   Go to: https://manage.auth0.com → Applications → framify → Settings\n');
  console.log('   Allowed Callback URLs:');
  console.log(`   ${prodUrl}/auth/callback,${localUrl}/auth/callback\n`);
  console.log('   Allowed Logout URLs:');
  console.log(`   ${prodUrl},${localUrl}\n`);
  console.log('   Allowed Web Origins:');
  console.log(`   ${prodUrl},${localUrl}\n`);

  console.log('2. Add these to Vercel:');
  console.log('   Go to: Vercel Dashboard → Your Project → Settings → Environment Variables\n');
  console.log('   Copy all variables from .env.local (except APP_BASE_URL should be production URL)\n');

  console.log('3. Test locally:');
  console.log('   npm run dev');
  console.log('   Visit http://localhost:3000 and click "Login"\n');

  console.log('✨ Setup complete!\n');

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});

