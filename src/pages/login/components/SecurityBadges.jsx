import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityBadges = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SOC 2 Type II',
      description: 'Certified secure infrastructure'
    },
    {
      icon: 'Lock',
      title: 'AES-256 Encryption',
      description: 'Military-grade security'
    },
    {
      icon: 'Eye',
      title: 'Zero-Knowledge',
      description: 'We never see your keys'
    },
    {
      icon: 'Globe',
      title: 'GDPR Compliant',
      description: 'Privacy by design'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Trusted by Enterprise Security Teams
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {securityFeatures?.map((feature, index) => (
          <div
            key={index}
            className="glass-card p-4 rounded-lg text-center space-y-2 hover:scale-105 transition-transform duration-150"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name={feature?.icon} size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{feature?.title}</p>
              <p className="text-xs text-muted-foreground">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">99.9% Uptime</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">24/7 Monitoring</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Protecting 10,000+ organizations worldwide
        </p>
      </div>
    </div>
  );
};

export default SecurityBadges;