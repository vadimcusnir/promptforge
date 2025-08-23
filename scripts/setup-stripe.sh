#!/bin/bash

# Stripe Setup Script for PromptForge
# This script helps you create the necessary Stripe products and price IDs

set -e

echo "🔧 Stripe Setup Script for PromptForge"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    local status=$1
    local message=$2
    case $status in
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "error")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    print_status "error" "Stripe CLI is not installed. Please install it first:"
    echo "   https://stripe.com/docs/stripe-cli"
    exit 1
fi

# Check if user is logged in to Stripe
if ! stripe config --list &> /dev/null; then
    print_status "error" "You are not logged in to Stripe. Please run:"
    echo "   stripe login"
    exit 1
fi

print_status "success" "Stripe CLI is ready"

# Create products
echo ""
print_status "info" "Creating Stripe products..."

# Pilot Plan (Free)
echo "Creating Pilot plan..."
PILOT_PRODUCT=$(stripe products create \
  --name="Pilot" \
  --description="Perfect for individuals and small teams getting started with AI prompts" \
  --metadata="plan_type=pilot,free_tier=true" \
  --json | jq -r '.id')

print_status "success" "Pilot product created: $PILOT_PRODUCT"

# Creator Plan
echo "Creating Creator plan..."
CREATOR_PRODUCT=$(stripe products create \
  --name="Creator" \
  --description="Ideal for content creators and marketing teams" \
  --metadata="plan_type=creator,monthly_price=29,yearly_price=290" \
  --json | jq -r '.id')

print_status "success" "Creator product created: $CREATOR_PRODUCT"

# Pro Plan
echo "Creating Pro plan..."
PRO_PRODUCT=$(stripe products create \
  --name="Pro" \
  --description="For professional teams and agencies" \
  --metadata="plan_type=pro,monthly_price=99,yearly_price=990" \
  --json | jq -r '.id')

print_status "success" "Pro product created: $PRO_PRODUCT"

# Enterprise Plan
echo "Creating Enterprise plan..."
ENTERPRISE_PRODUCT=$(stripe products create \
  --name="Enterprise" \
  --description="Custom solutions for large organizations" \
  --metadata="plan_type=enterprise,custom_pricing=true" \
  --json | jq -r '.id')

print_status "success" "Enterprise product created: $ENTERPRISE_PRODUCT"

# Create prices for Creator plan
echo ""
print_status "info" "Creating prices for Creator plan..."

CREATOR_MONTHLY_PRICE=$(stripe prices create \
  --product="$CREATOR_PRODUCT" \
  --unit-amount=2900 \
  --currency=usd \
  --recurring-interval=month \
  --metadata="billing_cycle=monthly,plan_type=creator" \
  --json | jq -r '.id')

CREATOR_YEARLY_PRICE=$(stripe prices create \
  --product="$CREATOR_PRODUCT" \
  --unit-amount=29000 \
  --currency=usd \
  --recurring-interval=year \
  --metadata="billing_cycle=yearly,plan_type=creator" \
  --json | jq -r '.id')

print_status "success" "Creator prices created:"
echo "   Monthly: $CREATOR_MONTHLY_PRICE"
echo "   Yearly: $CREATOR_YEARLY_PRICE"

# Create prices for Pro plan
echo ""
print_status "info" "Creating prices for Pro plan..."

PRO_MONTHLY_PRICE=$(stripe prices create \
  --product="$PRO_PRODUCT" \
  --unit-amount=9900 \
  --currency=usd \
  --recurring-interval=month \
  --metadata="billing_cycle=monthly,plan_type=pro" \
  --json | jq -r '.id')

PRO_YEARLY_PRICE=$(stripe prices create \
  --product="$PRO_PRODUCT" \
  --unit-amount=99000 \
  --currency=usd \
  --recurring-interval=year \
  --metadata="billing_cycle=yearly,plan_type=pro" \
  --json | jq -r '.id')

print_status "success" "Pro prices created:"
echo "   Monthly: $PRO_MONTHLY_PRICE"
echo "   Yearly: $PRO_YEARLY_PRICE"

# Create webhook endpoint
echo ""
print_status "info" "Creating webhook endpoint..."

WEBHOOK_ENDPOINT=$(stripe webhook-endpoints create \
  --url="https://your-domain.com/api/webhooks/stripe" \
  --events="customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.payment_succeeded,invoice.payment_failed,customer.subscription.trial_will_end" \
  --json | jq -r '.id')

WEBHOOK_SECRET=$(stripe webhook-endpoints retrieve "$WEBHOOK_ENDPOINT" --json | jq -r '.secret')

print_status "success" "Webhook endpoint created: $WEBHOOK_ENDPOINT"
print_status "success" "Webhook secret: $WEBHOOK_SECRET"

# Generate environment variables
echo ""
print_status "info" "Generating environment variables..."

cat > .env.stripe << EOF
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Replace with your actual secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Replace with your actual publishable key
STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET

# Product IDs
STRIPE_PILOT_PRODUCT_ID=$PILOT_PRODUCT
STRIPE_CREATOR_PRODUCT_ID=$CREATOR_PRODUCT
STRIPE_PRO_PRODUCT_ID=$PRO_PRODUCT
STRIPE_ENTERPRISE_PRODUCT_ID=$ENTERPRISE_PRODUCT

# Price IDs
STRIPE_CREATOR_MONTHLY_PRICE_ID=$CREATOR_MONTHLY_PRICE
STRIPE_CREATOR_YEARLY_PRICE_ID=$CREATOR_YEARLY_PRICE
STRIPE_PRO_MONTHLY_PRICE_ID=$PRO_MONTHLY_PRICE
STRIPE_PRO_YEARLY_PRICE_ID=$PRO_YEARLY_PRICE
EOF

print_status "success" "Environment variables saved to .env.stripe"

# Update products configuration
echo ""
print_status "info" "Updating products configuration..."

cat > lib/stripe/products-updated.ts << EOF
// Updated Stripe Products Configuration with actual IDs
export const STRIPE_PRODUCTS_UPDATED = [
  {
    id: 'pilot',
    name: 'Pilot',
    description: 'Perfect for individuals and small teams getting started with AI prompts',
    priceId: '', // Free plan - no price ID needed
    monthlyPrice: 0,
    features: [
      'Up to 100 prompts per month',
      'Access to 5 core modules',
      'Basic export (TXT, MD)',
      'Community support',
      'Standard templates',
      'Basic analytics'
    ],
    limits: {
      promptsPerMonth: 100,
      modules: 5,
      exportFormats: ['txt', 'md'],
      apiCalls: 100,
      support: 'community'
    },
    entitlements: [
      'canUseBasicModules',
      'canExportBasic'
    ]
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Ideal for content creators and marketing teams',
    priceId: '$CREATOR_MONTHLY_PRICE_ID', // Replace with actual price ID
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      'Up to 1,000 prompts per month',
      'Access to 15 modules',
      'Advanced export (TXT, MD, JSON)',
      'Priority support',
      'Custom templates',
      'Advanced analytics',
      'Team collaboration (up to 3 users)',
      'Industry-specific packs'
    ],
    limits: {
      promptsPerMonth: 1000,
      modules: 15,
      exportFormats: ['txt', 'md', 'json'],
      apiCalls: 1000,
      support: 'priority'
    },
    entitlements: [
      'canUseAllModules',
      'canExportJSON',
      'canUseIndustryPacks',
      'canCollaborate'
    ],
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professional teams and agencies',
    priceId: '$PRO_MONTHLY_PRICE_ID', // Replace with actual price ID
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      'Up to 10,000 prompts per month',
      'Access to all modules',
      'Premium export (TXT, MD, JSON, PDF)',
      'Dedicated support',
      'Custom branding',
      'Advanced analytics & reporting',
      'Team collaboration (up to 10 users)',
      'API access',
      'White-label options',
      'Advanced security features'
    ],
    limits: {
      promptsPerMonth: 10000,
      modules: 999,
      exportFormats: ['txt', 'md', 'json', 'pdf'],
      apiCalls: 10000,
      support: 'dedicated'
    },
    entitlements: [
      'canUseAllModules',
      'canExportJSON',
      'canExportPDF',
      'canUseIndustryPacks',
      'canCollaborate',
      'hasAPI',
      'canWhiteLabel',
      'canUseAdvancedSecurity'
    ],
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    priceId: 'price_enterprise_custom', // Custom pricing
    monthlyPrice: 0, // Custom pricing
    features: [
      'Unlimited prompts per month',
      'Access to all modules + custom modules',
      'All export formats (TXT, MD, JSON, PDF, ZIP)',
      '24/7 dedicated support',
      'Custom branding & white-label',
      'Advanced analytics & custom reporting',
      'Unlimited team collaboration',
      'Full API access',
      'Custom integrations',
      'Advanced security & compliance',
      'SLA guarantees',
      'Custom training & onboarding'
    ],
    limits: {
      promptsPerMonth: 999999,
      modules: 999999,
      exportFormats: ['txt', 'md', 'json', 'pdf', 'zip'],
      apiCalls: 999999,
      support: '24/7'
    },
    entitlements: [
      'canUseAllModules',
      'canExportJSON',
      'canExportPDF',
      'canExportBundleZip',
      'canUseIndustryPacks',
      'canCollaborate',
      'hasAPI',
      'canWhiteLabel',
      'canUseAdvancedSecurity',
      'canUseCustomModules',
      'canUseCustomIntegrations'
    ]
  }
];
EOF

print_status "success" "Updated products configuration saved to lib/stripe/products-updated.ts"

# Summary
echo ""
echo "======================================"
print_status "info" "Stripe Setup Summary"
echo "======================================"

echo "Products Created:"
echo "  Pilot: $PILOT_PRODUCT"
echo "  Creator: $CREATOR_PRODUCT"
echo "  Pro: $PRO_PRODUCT"
echo "  Enterprise: $ENTERPRISE_PRODUCT"

echo ""
echo "Prices Created:"
echo "  Creator Monthly: $CREATOR_MONTHLY_PRICE"
echo "  Creator Yearly: $CREATOR_YEARLY_PRICE"
echo "  Pro Monthly: $PRO_MONTHLY_PRICE"
echo "  Pro Yearly: $PRO_YEARLY_PRICE"

echo ""
echo "Webhook:"
echo "  Endpoint: $WEBHOOK_ENDPOINT"
echo "  Secret: $WEBHOOK_SECRET"

echo ""
print_status "info" "Next steps:"
echo "1. Copy the webhook secret to your .env.local file"
echo "2. Update the price IDs in lib/stripe/products.ts"
echo "3. Test the webhook endpoint"
echo "4. Update your frontend to use the new price IDs"

echo ""
print_status "success" "Stripe setup completed! 🎉"
