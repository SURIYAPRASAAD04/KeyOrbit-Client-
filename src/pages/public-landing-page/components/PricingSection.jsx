import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PricingSection = ({ onGetStarted, onContactSales }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const pricingTiers = [
    {
      name: 'Starter',
      description: 'Perfect for small teams getting started with key management',
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        'Up to 1,000 keys',
        'Basic API access',
        'Email support',
        '99.9% uptime SLA',
        'Standard encryption',
        'Basic audit logs'
      ],
      limitations: [
        'No HSM support',
        'Limited integrations'
      ],
      cta: 'Start Free Trial',
      popular: false,
      action: () => onGetStarted()
    },
    {
      name: 'Professional',
      description: 'Advanced features for growing organizations',
      monthlyPrice: 299,
      annualPrice: 2990,
      features: [
        'Up to 10,000 keys',
        'Full API access',
        'Priority support',
        '99.95% uptime SLA',
        'HSM integration',
        'Advanced audit logs',
        'Role-based access',
        'Key rotation policies',
        'Multi-region support'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true,
      action: () => onGetStarted()
    },
    {
      name: 'Enterprise',
      description: 'Comprehensive solution for large organizations',
      monthlyPrice: null,
      annualPrice: null,
      features: [
        'Unlimited keys',
        'Custom integrations',
        '24/7 dedicated support',
        '99.99% uptime SLA',
        'Dedicated HSM',
        'Custom compliance reports',
        'Advanced RBAC',
        'Custom key policies',
        'Global distribution',
        'White-label options',
        'On-premises deployment'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      action: () => onContactSales()
    }
  ];

  const addOns = [
    {
      name: 'Additional Keys',
      description: 'Extra key storage beyond plan limits',
      price: '$0.10 per key/month'
    },
    {
      name: 'Premium Support',
      description: '24/7 phone and chat support',
      price: '$500/month'
    },
    {
      name: 'Professional Services',
      description: 'Migration and integration assistance',
      price: 'Custom pricing'
    },
    {
      name: 'Advanced Analytics',
      description: 'Enhanced reporting and insights',
      price: '$200/month'
    }
  ];

  const getPrice = (tier) => {
    if (tier?.monthlyPrice === null) return 'Custom';
    const price = billingPeriod === 'monthly' ? tier?.monthlyPrice : tier?.annualPrice;
    const period = billingPeriod === 'monthly' ? '/month' : '/year';
    return `$${price?.toLocaleString()}${period}`;
  };

  const getSavings = (tier) => {
    if (!tier?.monthlyPrice || !tier?.annualPrice) return null;
    const monthlyTotal = tier?.monthlyPrice * 12;
    const savings = monthlyTotal - tier?.annualPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return `Save ${percentage}%`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Transparent Pricing for Every Scale
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Choose the perfect plan for your organization. Start with a 30-day free trial, 
          no credit card required.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-muted/20 rounded-lg p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              billingPeriod === 'monthly' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              billingPeriod === 'annual' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Annual
            <span className="ml-2 text-xs text-accent">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pricingTiers?.map((tier, index) => (
          <div
            key={index}
            className={`glass-card rounded-lg p-8 transition-all duration-300 ${
              tier?.popular
                ? 'ring-2 ring-primary shadow-orbital-lg scale-105'
                : 'hover:shadow-orbital-lg hover:scale-102'
            }`}
          >
            {tier?.popular && (
              <div className="bg-primary text-primary-foreground text-center py-2 px-4 rounded-full text-sm font-medium mb-6">
                Most Popular
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">{tier?.name}</h3>
              <p className="text-muted-foreground mb-4">{tier?.description}</p>
              
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">
                  {getPrice(tier)}
                </span>
                {tier?.monthlyPrice && billingPeriod === 'annual' && (
                  <div className="text-sm text-accent mt-1">
                    {getSavings(tier)}
                  </div>
                )}
              </div>

              <button
                onClick={tier?.action}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                  tier?.popular
                    ? 'btn-glow bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted/20 text-foreground hover:bg-muted/30'
                }`}
              >
                {tier?.cta}
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Features included:</h4>
              <ul className="space-y-3">
                {tier?.features?.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {tier?.limitations?.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-muted-foreground text-sm mb-3">Limitations:</h4>
                  <ul className="space-y-2">
                    {tier?.limitations?.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start space-x-3">
                        <Icon name="X" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div className="glass-card rounded-lg p-8 mb-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">Add-on Services</h3>
          <p className="text-muted-foreground">
            Enhance your KeyOrbit KMS experience with optional add-on services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addOns?.map((addOn, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">{addOn?.name}</h4>
                <p className="text-sm text-muted-foreground">{addOn?.description}</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-foreground">{addOn?.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-8">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-left">
            <h4 className="font-semibold text-foreground mb-2">
              Can I change plans anytime?
            </h4>
            <p className="text-muted-foreground text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-foreground mb-2">
              Is there a free trial?
            </h4>
            <p className="text-muted-foreground text-sm">
              Yes, we offer a 30-day free trial with full access to Professional features.
            </p>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-foreground mb-2">
              What payment methods do you accept?
            </h4>
            <p className="text-muted-foreground text-sm">
              We accept all major credit cards, ACH transfers, and can accommodate wire transfers for enterprise accounts.
            </p>
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-foreground mb-2">
              Do you offer discounts for non-profits?
            </h4>
            <p className="text-muted-foreground text-sm">
              Yes, we offer special pricing for qualifying non-profit organizations. Contact our sales team for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;