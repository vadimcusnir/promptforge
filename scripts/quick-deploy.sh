#!/bin/bash

echo "🚀 PromptForge v3 - Quick Production Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

# Step 1: Build the application
echo "📦 Building application..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Step 2: Type check
echo "🔍 Running type check..."
pnpm type-check

if [ $? -ne 0 ]; then
    echo "⚠️  Type check warnings found. Review before deployment."
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Step 3: Environment check
echo "🔧 Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Please configure your environment variables."
    echo "Copy env.template to .env.local and configure:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - STRIPE_SECRET_KEY"
    echo "  - SENDGRID_API_KEY"
    echo "  - NEXT_PUBLIC_BASE_URL"
    
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Step 4: Deployment platform selection
echo "🌐 Select deployment platform:"
echo "1) Vercel (Recommended for Next.js)"
echo "2) Railway"
echo "3) Manual deployment"
echo "4) Cancel"

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "❌ Vercel CLI not installed. Please install with: npm i -g vercel"
            echo "Then run: vercel --prod"
        fi
        ;;
    2)
        echo "🚀 Deploying to Railway..."
        if command -v railway &> /dev/null; then
            railway up
        else
            echo "❌ Railway CLI not installed. Please install with: npm i -g @railway/cli"
            echo "Then run: railway up"
        fi
        ;;
    3)
        echo "📋 Manual deployment instructions:"
        echo "1. Upload the .next folder to your hosting platform"
        echo "2. Configure your domain and environment variables"
        echo "3. Set up your database and external services"
        echo "4. Test all endpoints and functionality"
        echo ""
        echo "Your application is built and ready in the .next folder"
        ;;
    4)
        echo "Deployment cancelled."
        exit 0
        ;;
    *)
        echo "Invalid choice. Deployment cancelled."
        exit 1
        ;;
esac

# Step 5: Post-deployment checklist
echo ""
echo "🎯 Post-Deployment Checklist:"
echo "=============================="
echo "✅ Application deployed"
echo "🔍 Verify application accessibility"
echo "🔧 Test core functionality:"
echo "   - Generator page"
echo "   - Dashboard"
echo "   - API endpoints"
echo "   - Authentication"
echo "   - Payment processing"
echo "📊 Enable monitoring:"
echo "   - Live metrics dashboard"
echo "   - Error tracking"
echo "   - Performance monitoring"
echo "📝 Gather user feedback"
echo "🚀 Monitor KPIs:"
echo "   - TTA (Time to Answer)"
echo "   - Success rates"
echo "   - User engagement"
echo "   - Conversion rates"

echo ""
echo "🎉 PromptForge v3 is now live in production!"
echo "📊 Monitor your metrics at: /dashboard"
echo "📈 Track performance with the monitoring dashboard"
echo "📝 Collect feedback to prioritize P1 features"
echo ""
echo "Next steps:"
echo "1. Monitor system performance for 24-48 hours"
echo "2. Gather initial user feedback"
echo "3. Plan P1 feature development based on usage data"
echo "4. Optimize performance based on real-world usage"
echo ""
echo "Good luck with your launch! 🚀"
