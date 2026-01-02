#!/bin/bash

echo "🚀 Setting up Flight Search Engine Integration..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm not found. Installing..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Backup original files
echo "💾 Backing up original files..."
if [ -f "app/page.tsx" ]; then
    mv app/page.tsx app/page-original-backup.tsx
    echo "   ✓ Backed up app/page.tsx"
fi

if [ -f "components/flight-search-form.tsx" ]; then
    mv components/flight-search-form.tsx components/flight-search-form-original-backup.tsx
    echo "   ✓ Backed up components/flight-search-form.tsx"
fi

# Replace with updated files
echo "🔄 Installing updated files..."
if [ -f "app/page-updated.tsx" ]; then
    mv app/page-updated.tsx app/page.tsx
    echo "   ✓ Installed updated app/page.tsx"
fi

if [ -f "components/flight-search-form-updated.tsx" ]; then
    mv components/flight-search-form-updated.tsx components/flight-search-form.tsx
    echo "   ✓ Installed updated components/flight-search-form.tsx"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Start the .NET backend:"
echo "   cd /Users/mohammedbelouarraq/Desktop/WebServices"
echo "   dotnet run"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd /Users/mohammedbelouarraq/Desktop/WebServices/flight-search-engine"
echo "   pnpm dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🎉 Enjoy your flight search engine!"

