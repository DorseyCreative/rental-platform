#!/bin/bash

# Mobile Testing Setup Script
# This script sets up ngrok tunnel for testing on real mobile devices

echo "🚀 Setting up mobile testing environment..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok is not installed. Please install it first:"
    echo "   • Download from: https://ngrok.com/download"
    echo "   • Or install via brew: brew install ngrok"
    exit 1
fi

# Start Next.js dev server in background
echo "📱 Starting Next.js development server..."
npm run dev &
DEV_PID=$!

# Wait for dev server to start
echo "⏳ Waiting for dev server to start..."
sleep 5

# Check if dev server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Dev server is running on http://localhost:3000"
else
    echo "❌ Failed to start dev server"
    kill $DEV_PID 2>/dev/null
    exit 1
fi

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
ngrok http 3000 --log=stdout &
NGROK_PID=$!

# Wait for ngrok to start
sleep 3

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok-free\.app')

if [ -n "$NGROK_URL" ]; then
    echo ""
    echo "🎉 Mobile testing setup complete!"
    echo ""
    echo "📱 Test on your mobile device:"
    echo "   📲 URL: $NGROK_URL"
    echo ""
    echo "🔧 Test scenarios:"
    echo "   • Driver App: $NGROK_URL/driver"
    echo "   • Customer Portal: $NGROK_URL/portal"
    echo "   • Dashboard: $NGROK_URL/dashboard"
    echo "   • Onboarding: $NGROK_URL/onboarding"
    echo ""
    echo "📋 PWA Testing Checklist:"
    echo "   □ Install PWA to home screen"
    echo "   □ Test offline functionality"
    echo "   □ Test push notifications"
    echo "   □ Test camera access (signature)"
    echo "   □ Test GPS/location services"
    echo "   □ Test responsive design"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Generate QR code for easy mobile access (if qrencode is available)
    if command -v qrencode &> /dev/null; then
        echo ""
        echo "📱 QR Code for mobile access:"
        qrencode -t ANSI "$NGROK_URL"
    fi
    
    # Keep script running
    trap "echo 'Stopping services...'; kill $DEV_PID $NGROK_PID 2>/dev/null; exit" INT
    wait
else
    echo "❌ Failed to get ngrok URL"
    kill $DEV_PID $NGROK_PID 2>/dev/null
    exit 1
fi