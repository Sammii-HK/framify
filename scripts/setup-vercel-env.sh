#!/bin/bash

# Script to push environment variables to Vercel
# Requires Vercel CLI: npm i -g vercel

set -e

echo "🚀 Setting up Vercel Environment Variables"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it with: npm i -g vercel"
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Run 'npm run setup:auth0' first"
    exit 1
fi

echo "Reading environment variables from .env.local..."
echo ""

# Read .env.local and extract Auth0 variables
while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    if [[ "$line" =~ ^[[:space:]]*# ]] || [[ -z "$line" ]]; then
        continue
    fi
    
    # Extract key=value pairs
    if [[ "$line" =~ ^[[:space:]]*([A-Z_]+)=(.*)$ ]]; then
        key="${BASH_REMATCH[1]}"
        value="${BASH_REMATCH[2]}"
        
        # Remove quotes if present
        value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
        
        # Skip APP_BASE_URL for production (we'll set it separately)
        if [ "$key" = "APP_BASE_URL" ]; then
            echo "⏭️  Skipping APP_BASE_URL (will set production URL separately)"
            continue
        fi
        
        echo "📤 Setting $key..."
        vercel env add "$key" production <<< "$value" || echo "⚠️  Failed to set $key (might already exist)"
    fi
done < .env.local

# Set production APP_BASE_URL
echo ""
read -p "Enter your production URL (default: https://framify-nine.vercel.app): " PROD_URL
PROD_URL=${PROD_URL:-https://framify-nine.vercel.app}

echo "📤 Setting APP_BASE_URL for production..."
vercel env add APP_BASE_URL production <<< "$PROD_URL" || echo "⚠️  APP_BASE_URL might already exist"

echo ""
echo "✅ Done! Environment variables have been added to Vercel"
echo ""
echo "To verify, run: vercel env ls"

