// Automated Client Onboarding Workflow
// Triggered by Stripe webhook after successful payment

const automatedClientOnboarding = async (stripeWebhookData) => {
  
  // 1. Extract customer information from Stripe
  const customer = stripeWebhookData.customer;
  const subscription = stripeWebhookData.subscription;
  
  // 2. Create GHL sub-account automatically
  const subAccount = await createClientSubAccount({
    name: `${customer.name} - Email Marketing Pro`,
    email: customer.email,
    phone: customer.phone || '',
    companyId: '9s7Xe6Bg5w813StBjc6J' // Action Steps agency ID
  });
  
  // 3. Deploy email template library to sub-account
  await deployEmailTemplates(subAccount.id, {
    templatePackage: 'Sacred_Seductive_Marketing_Pro',
    customization: {
      businessName: customer.businessName,
      industry: customer.industry,
      targetAvatar: customer.targetAvatar
    }
  });
  
  // 4. Set up initial campaigns
  await setupInitialCampaigns(subAccount.id, {
    welcomeSeries: true,
    nurtureSequence: true,
    salesSequence: true
  });
  
  // 5. Send automated welcome email with credentials
  await sendWelcomeEmail({
    to: customer.email,
    subAccountId: subAccount.id,
    loginCredentials: subAccount.credentials,
    onboardingScheduleLink: 'https://calendly.com/actionsteps/onboarding'
  });
  
  // 6. Create support ticket for manual review
  await createSupportTicket({
    customerId: customer.id,
    subAccountId: subAccount.id,
    priority: 'normal',
    subject: 'New client onboarding - review required',
    assignedTo: 'chuck@actionsteps.biz'
  });
  
  return {
    success: true,
    subAccountId: subAccount.id,
    message: 'Client automatically onboarded'
  };
};

// Webhook endpoint for Stripe integration
const stripeWebhookHandler = async (req, res) => {
  try {
    const event = verifyStripeWebhook(req.body, req.headers);
    
    if (event.type === 'invoice.payment_succeeded') {
      await automatedClientOnboarding(event.data.object);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send('Webhook Error');
  }
};