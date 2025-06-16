#!/bin/bash

echo "🚀 Deploying Rental Platform to Production"
echo "========================================"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if build passes
echo "🔨 Testing build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Set up Supabase project at https://supabase.com"
echo "2. Run SQL schema from supabase-setup/schema.sql"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Test the live site"
echo ""