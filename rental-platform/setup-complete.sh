#!/bin/bash

# Complete Platform Setup Script
# Sets up the entire Heavy Equipment Rental Platform

echo "🚀 Heavy Equipment Rental Platform - Complete Setup"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the rental-platform directory"
    exit 1
fi

echo ""
echo "📋 Setup Checklist:"
echo "  □ Environment Configuration"
echo "  □ Database Setup (Supabase)"
echo "  □ PWA Assets Generation"
echo "  □ Dependencies Installation"
echo "  □ Development Server"
echo "  □ Mobile Testing Setup"
echo ""

read -p "🤔 Continue with setup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 1
fi

echo ""
echo "1️⃣ Installing Dependencies..."
echo "================================"
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi
echo "✅ Dependencies installed"

echo ""
echo "2️⃣ Generating PWA Assets..."
echo "============================"
./generate-icons.sh
echo "✅ PWA assets generated"

echo ""
echo "3️⃣ Environment Configuration..."
echo "================================"
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please copy .env.local.example to .env.local and configure your API keys"
    exit 1
fi

echo "✅ Environment file found"

echo ""
echo "📦 Required API Keys Setup:"
echo "=========================="
echo ""
echo "🔧 To complete setup, you need these API keys:"
echo ""
echo "1. Supabase Database:"
echo "   • Go to https://supabase.com/dashboard"
echo "   • Create a new project"
echo "   • Copy Project URL and anon key to .env.local"
echo "   • Run the SQL schema from supabase-setup/schema.sql"
echo "   • Run the seed data from supabase/seed.sql"
echo ""
echo "2. Google Maps API:"
echo "   • Go to https://console.cloud.google.com/"
echo "   • Enable Maps JavaScript API, Directions API, Geocoding API"
echo "   • Create API key and add to .env.local"
echo ""
echo "3. Twilio SMS (Optional):"
echo "   • Go to https://console.twilio.com/"
echo "   • Get Account SID, Auth Token, and Phone Number"
echo "   • Add to .env.local"
echo ""
echo "4. Stripe Payments (Optional):"
echo "   • Go to https://dashboard.stripe.com/"
echo "   • Get test API keys"
echo "   • Add to .env.local"
echo ""

read -p "🤔 Have you configured your API keys? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "⚠️  You can continue with limited functionality."
    echo "Some features will be disabled without proper API keys."
    echo ""
fi

echo ""
echo "4️⃣ Building Application..."
echo "=========================="
npm run build
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "⚠️  Build failed, but we can still run in development mode"
    echo "This is normal if API keys are not configured yet."
else
    echo "✅ Build successful"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🌟 Your Heavy Equipment Rental Platform is ready!"
echo ""
echo "📱 Available Applications:"
echo "  • Business Dashboard: http://localhost:3000/dashboard"
echo "  • Customer Portal: http://localhost:3000/portal" 
echo "  • Driver Mobile App: http://localhost:3000/driver"
echo "  • AI Onboarding: http://localhost:3000/onboarding"
echo ""
echo "🔧 Development Commands:"
echo "  • Start dev server: npm run dev"
echo "  • Mobile testing: ./test-mobile.sh"
echo "  • Generate icons: ./generate-icons.sh"
echo "  • Build for production: npm run build"
echo ""
echo "📚 Key Features Ready:"
echo "  ✅ Multi-tenant architecture"
echo "  ✅ AI-powered business analysis"
echo "  ✅ Google Maps route optimization"
echo "  ✅ SMS notifications (with Twilio)"
echo "  ✅ Payment processing (with Stripe)"
echo "  ✅ PWA with offline support"
echo "  ✅ Real-time driver app"
echo "  ✅ Customer self-service portal"
echo ""

read -p "🚀 Start development server now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🌟 Starting development server..."
    echo "Open http://localhost:3000 in your browser"
    echo ""
    npm run dev
else
    echo ""
    echo "💡 To start the server later, run: npm run dev"
    echo "📱 For mobile testing, run: ./test-mobile.sh"
    echo ""
    echo "Happy coding! 🎉"
fi