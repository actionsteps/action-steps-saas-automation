# GoHighLevel SaaS Setup Automation

## Current Status
✅ Agency API access confirmed
✅ Action Steps, LLC designated as SaaS account
⏳ Product creation and billing setup

## Programmatic Setup Tasks

### 1. Product Creation
```javascript
// Create Email Marketing Automation Pro product
const product = await ghl.createProduct({
  name: "Email Marketing Automation Pro",
  type: "DIGITAL", 
  description: "Psychology-based email marketing templates with automation",
  locationId: "UfRzHgaNrCx1JfQP10xK" // Action Steps, LLC
});
```

### 2. Pricing Configuration
```javascript
// Set up $497/month recurring subscription
const pricing = await ghl.createPrice({
  productId: product.id,
  amount: 49700, // $497.00 in cents
  currency: "USD",
  type: "recurring",
  interval: "month"
});
```

### 3. SaaS Mode Activation
- **Manual Step:** Enable "Use as SaaS Product" toggle in GHL UI
- **Configuration:** Set trial period, usage limits, rebilling options
- **Integration:** Connect Stripe payment processing

### 4. Automated Client Onboarding
```javascript
// Webhook handler for new subscriptions
const handleNewSubscription = async (stripeEvent) => {
  // Create GHL sub-account
  const subAccount = await ghl.createLocation({
    name: `${customer.name} - Email Marketing`,
    companyId: AGENCY_COMPANY_ID
  });
  
  // Deploy email templates
  await deployEmailTemplates(subAccount.id);
  
  // Send welcome email with credentials
  await sendWelcomeEmail(customer.email, subAccount);
};
```

## Configuration Variables
```env
GHL_AGENCY_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ACTION_STEPS_LOCATION_ID=UfRzHgaNrCx1JfQP10xK
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Next Steps
1. Complete product creation via API
2. Configure Stripe integration  
3. Test automated sub-account creation
4. Deploy email template library