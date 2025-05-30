// subscriptionServiceJs.js - JavaScript version without TypeScript
// This avoids the Vite React plugin preamble detection error

// Create the subscription service object
const subscriptionService = {
  // Mock subscription tiers data
  tiers: [
    {
      id: 'basic',
      name: 'Basic',
      price: 0.00,
      billingPeriod: 'monthly',
      features: [
        { id: 'basic-trading', name: 'Basic Trading Features', description: 'Access to essential trading tools', included: true },
        { id: 'market-data', name: 'Real-time Market Data', description: 'Basic market data and quotes', included: true },
        { id: 'basic-analysis', name: 'Basic Technical Analysis', description: 'Essential technical indicators', included: true },
        { id: 'portfolio', name: 'Portfolio Management', description: 'Basic portfolio tracking', included: true },
        { id: 'ai-basic', name: 'Basic AI Analysis', description: 'Limited AI-powered insights', included: true },
        { id: 'support', name: 'Email Support', description: '24/7 email support', included: true },
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 99.99,
      billingPeriod: 'monthly',
      recommended: true,
      features: [
        { id: 'advanced-trading', name: 'Advanced Trading Features', description: 'Full suite of trading tools', included: true },
        { id: 'premium-data', name: 'Premium Market Data', description: 'Advanced market data and analysis', included: true },
        { id: 'advanced-analysis', name: 'Advanced Technical Analysis', description: 'Full technical analysis suite', included: true },
        { id: 'portfolio-pro', name: 'Advanced Portfolio Tools', description: 'Advanced portfolio management', included: true },
        { id: 'ai-pro', name: 'Advanced AI Analysis', description: 'Full AI-powered trading insights', included: true },
        { id: 'priority-support', name: 'Priority Support', description: '24/7 priority support', included: true },
        { id: 'api-access', name: 'API Access', description: 'API integration capabilities', included: true },
        { id: 'custom-alerts', name: 'Custom Alerts', description: 'Personalized trading alerts', included: true },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299.99,
      billingPeriod: 'monthly',
      features: [
        { id: 'enterprise-trading', name: 'Enterprise Trading Suite', description: 'Full enterprise trading capabilities', included: true },
        { id: 'enterprise-data', name: 'Enterprise Market Data', description: 'Institutional-grade market data', included: true },
        { id: 'enterprise-analysis', name: 'Enterprise Analysis Tools', description: 'Advanced analysis and research tools', included: true },
        { id: 'portfolio-enterprise', name: 'Enterprise Portfolio Management', description: 'Advanced portfolio optimization', included: true },
        { id: 'ai-enterprise', name: 'Enterprise AI Solutions', description: 'Custom AI models and analysis', included: true },
        { id: 'dedicated-support', name: 'Dedicated Support Team', description: 'Personal account manager', included: true },
        { id: 'white-label', name: 'White Label Solutions', description: 'Customizable white-label options', included: true },
        { id: 'custom-integration', name: 'Custom Integrations', description: 'Custom API and system integrations', included: true },
        { id: 'advanced-security', name: 'Advanced Security', description: 'Enhanced security features', included: true },
      ],
    },
  ],
  
  currentSubscription: null,
  
  // Initialize the service
  initialize: function() {
    console.log('Subscription service initialized');
  },
  
  // Get current user's subscription
  getCurrentSubscription: function() {
    // Return a promise to match the TypeScript implementation
    return Promise.resolve(this.currentSubscription || {
      tierId: 'pro', // Default to Pro tier
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'active',
      autoRenew: true,
    });
  },
  
  // Get all subscription tiers
  getTiers: function() {
    return this.tiers;
  },
  
  // Subscribe to a tier
  subscribe: function(tierId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Set the current subscription
        this.currentSubscription = {
          tierId: tierId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          status: 'active',
          autoRenew: true,
        };
        resolve(true);
      }, 1000);
    });
  },
  
  // Check if user has access to a feature
  checkAccess: function(feature) {
    const currentTier = this.getCurrentSubscription().tier;
    return currentTier.features.includes(feature);
  },
  
  // Upgrade subscription
  upgradeSubscription: function(tierId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  },
  
  // Cancel subscription
  cancelSubscription: function() {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentSubscription) {
          this.currentSubscription.status = 'cancelled';
          this.currentSubscription.autoRenew = false;
        }
        resolve(true);
      }, 1000);
    });
  },
};

// Initialize the service
subscriptionService.initialize();

// Export both named and default exports
export { subscriptionService };
export default subscriptionService;
