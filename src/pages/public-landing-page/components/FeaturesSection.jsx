import React from 'react';
import Icon from '../../../components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'Enterprise Security',
      description: 'Hardware security modules (HSM) and quantum-resistant encryption protect your most sensitive keys.',
      benefits: ['FIPS 140-2 Level 3', 'Quantum-Safe Algorithms', 'Zero-Trust Architecture']
    },
    {
      icon: 'Zap',
      title: 'High Performance',
      description: 'Ultra-low latency key operations with global distribution and automatic scaling.',
      benefits: ['< 10ms Response Time', 'Auto-Scaling', 'Global Edge Network']
    },
    {
      icon: 'Users',
      title: 'Role-Based Access',
      description: 'Granular permissions and multi-factor authentication ensure only authorized access.',
      benefits: ['RBAC Controls', 'MFA Integration', 'Audit Trails']
    },
    {
      icon: 'Code',
      title: 'Developer Friendly',
      description: 'RESTful APIs, SDKs, and comprehensive documentation for seamless integration.',
      benefits: ['REST APIs', 'Multiple SDKs', 'Extensive Docs']
    },
    {
      icon: 'BarChart',
      title: 'Real-time Analytics',
      description: 'Monitor key usage, performance metrics, and security events in real-time.',
      benefits: ['Live Dashboards', 'Custom Alerts', 'Detailed Reports']
    },
    {
      icon: 'CheckCircle',
      title: 'Compliance Ready',
      description: 'Meet regulatory requirements with built-in compliance frameworks and reporting.',
      benefits: ['SOC 2 Type II', 'GDPR Compliant', 'HIPAA Ready']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Enterprise-Grade Key Management
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive security features designed for modern enterprises requiring the highest levels 
          of cryptographic key protection and regulatory compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="glass-card rounded-lg p-8 hover:shadow-orbital-lg transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              <Icon name={feature?.icon} size={32} className="text-primary" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-4">
              {feature?.title}
            </h3>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {feature?.description}
            </p>

            <div className="space-y-2">
              {feature?.benefits?.map((benefit, benefitIndex) => (
                <div key={benefitIndex} className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success flex-shrink-0" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Technical Specifications */}
      <div className="mt-20 glass-card rounded-lg p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-2">Technical Specifications</h3>
          <p className="text-muted-foreground">Built for enterprise scale and performance</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">AES-256</div>
            <div className="text-sm text-muted-foreground">Encryption Standard</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">RSA-4096</div>
            <div className="text-sm text-muted-foreground">Key Size Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">100K</div>
            <div className="text-sm text-muted-foreground">Ops/Second</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">5 Nines</div>
            <div className="text-sm text-muted-foreground">Availability SLA</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;