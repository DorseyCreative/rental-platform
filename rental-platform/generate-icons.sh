#!/bin/bash

# PWA Icon Generation Script
# Generates PWA icons in multiple sizes

echo "🎨 Generating PWA icons..."

# Create icons directory if it doesn't exist
mkdir -p public

# Generate a simple SVG icon as base
cat > public/icon.svg << 'EOF'
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#3B82F6"/>
  <rect x="64" y="128" width="384" height="256" rx="32" fill="white"/>
  <rect x="96" y="160" width="120" height="80" rx="8" fill="#3B82F6"/>
  <rect x="232" y="160" width="120" height="80" rx="8" fill="#3B82F6"/>
  <rect x="368" y="160" width="80" height="80" rx="8" fill="#3B82F6"/>
  <rect x="96" y="256" width="200" height="32" rx="4" fill="#6B7280"/>
  <rect x="312" y="256" width="136" height="32" rx="4" fill="#6B7280"/>
  <circle cx="128" cy="350" r="24" fill="#10B981"/>
  <circle cx="256" cy="350" r="24" fill="#F59E0B"/>
  <circle cx="384" cy="350" r="24" fill="#EF4444"/>
</svg>
EOF

echo "✅ Base SVG icon created"

# If ImageMagick is available, generate PNG icons
if command -v convert &> /dev/null; then
    echo "🖼️  Converting to PNG formats..."
    
    # Generate different sizes
    convert public/icon.svg -resize 192x192 public/icon-192x192.png
    convert public/icon.svg -resize 512x512 public/icon-512x512.png
    convert public/icon.svg -resize 32x32 public/favicon-32x32.png
    convert public/icon.svg -resize 16x16 public/favicon-16x16.png
    convert public/icon.svg -resize 180x180 public/apple-touch-icon.png
    
    echo "✅ PNG icons generated"
else
    echo "⚠️  ImageMagick not found. Using placeholder PNGs."
    echo "   Install ImageMagick to generate proper icons: brew install imagemagick"
    
    # Create placeholder files
    echo "placeholder" > public/icon-192x192.png
    echo "placeholder" > public/icon-512x512.png
    echo "placeholder" > public/favicon-32x32.png
    echo "placeholder" > public/favicon-16x16.png
    echo "placeholder" > public/apple-touch-icon.png
fi

# Generate favicon.ico
if command -v convert &> /dev/null; then
    convert public/icon.svg -resize 32x32 public/favicon.ico
    echo "✅ Favicon generated"
else
    echo "placeholder" > public/favicon.ico
fi

echo ""
echo "🎉 Icon generation complete!"
echo ""
echo "Generated files:"
echo "  • public/icon.svg (base SVG)"
echo "  • public/icon-192x192.png"
echo "  • public/icon-512x512.png"
echo "  • public/favicon-32x32.png"
echo "  • public/favicon-16x16.png"
echo "  • public/apple-touch-icon.png"
echo "  • public/favicon.ico"