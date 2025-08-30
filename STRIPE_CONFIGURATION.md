# Stripe Configuration for PromptForge

⚠️ **IMPORTANT**: This file contains placeholder values. Replace them with your actual Stripe API keys from your Stripe dashboard.

## Environment Variables Setup

Copy these environment variables to your `.env.local` file or deployment platform:

```bash
# Stripe Configuration
STRIPE_SECRET=your_stripe_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Stripe Product IDs
STRIPE_PILOT_PRODUCT_ID=prod_Sv2lfPu3n8I60C
STRIPE_CREATOR_PRODUCT_ID=prod_Sv2ltjDHaEmOeQ
STRIPE_PRO_PRODUCT_ID=prod_Sv2llM3qBLhjQI
STRIPE_ENTERPRISE_PRODUCT_ID=prod_Sv2lDontWa54g8

# Stripe Price IDs for different plans
# Pilot Plan (Free)
STRIPE_PILOT_MONTHLY_PRICE_ID=price_1S1tNIGcCmkUZPV6CC6FCcz5
STRIPE_PILOT_ANNUAL_PRICE_ID=price_1S1tNNGcCmkUZPV6Ch89hhxw

# Creator Plan
STRIPE_CREATOR_MONTHLY_PRICE_ID=price_1RzCg4GcCmkUZPV64xBL3k7Z
STRIPE_CREATOR_ANNUAL_PRICE_ID=price_1RzCg9GcCmkUZPV6WVOnfEkS

# Pro Plan
STRIPE_PRO_MONTHLY_PRICE_ID=price_1RzCgDGcCmkUZPV617YU0ATE
STRIPE_PRO_ANNUAL_PRICE_ID=price_1RzCgIGcCmkUZPV6zAZb8mJM

# Enterprise Plan
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_1RzF8RGcCmkUZPV6K6UcsMn7
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=price_1RzF8UGcCmkUZPV6mZy21Pp2
```

## Plan Details

### Pilot Plan (Free)
- **Monthly**: $0.00/month - `price_1S1tNIGcCmkUZPV6CC6FCcz5`
- **Annual**: $0.00/year - `price_1S1tNNGcCmkUZPV6Ch89hhxw`

### Creator Plan
- **Monthly**: $29.00/month - `price_1RzCg4GcCmkUZPV64xBL3k7Z`
- **Annual**: $290.00/year - `price_1RzCg9GcCmkUZPV6WVOnfEkS`

### Pro Plan
- **Monthly**: $99.00/month - `price_1RzCgDGcCmkUZPV617YU0ATE`
- **Annual**: $990.00/year - `price_1RzCgIGcCmkUZPV6zAZb8mJM`

### Enterprise Plan
- **Monthly**: $299.00/month - `price_1RzF8RGcCmkUZPV6K6UcsMn7`
- **Annual**: $2,990.00/year - `price_1RzF8UGcCmkUZPV6mZy21Pp2`

## Setup Instructions

1. **For Local Development**: Copy the environment variables above to your `.env.local` file
2. **For Production Deployment**: Add these variables to your deployment platform (Vercel, Netlify, etc.)
3. **For Docker**: Add these variables to your docker-compose.yml or Docker environment

## Security Notes

- ⚠️ These are LIVE Stripe keys - handle with care
- Never commit these values to version control
- Use environment variables for all deployments
- Rotate keys regularly for security

## Testing the Configuration

After setting up the environment variables, run:

```bash
pnpm build
```

This should now complete successfully without the Stripe configuration errors.
