import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProductDemo = ({ onRequestDemo }) => {
  const [activeDemo, setActiveDemo] = useState('dashboard');

  const demoSections = [
    {
      id: 'dashboard',
      title: 'Security Dashboard',
      description: 'Real-time monitoring and analytics for all your cryptographic operations',
      icon: 'BarChart'
    },
    {
      id: 'keys',
      title: 'Key Management',
      description: 'Create, rotate, and manage encryption keys with advanced lifecycle controls',
      icon: 'Key'
    },
    {
      id: 'audit',
      title: 'Audit & Compliance',
      description: 'Comprehensive logging and reporting for regulatory compliance',
      icon: 'FileText'
    },
    {
      id: 'api',
      title: 'API Integration',
      description: 'Developer-friendly APIs for seamless application integration',
      icon: 'Code'
    }
  ];

  const getDemoContent = () => {
    switch (activeDemo) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-success/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-success">247</div>
                <div className="text-sm text-muted-foreground">Active Keys</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary">1.8K</div>
                <div className="text-sm text-muted-foreground">Daily Operations</div>
              </div>
            </div>
            <div className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-foreground">System Status: Operational</span>
              </div>
              <div className="text-xs text-muted-foreground">Last update: 2 seconds ago</div>
            </div>
          </div>
        );
      case 'keys':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Key" size={16} className="text-primary" />
                <span className="font-medium">prod-db-encryption-key</span>
              </div>
              <span className="text-xs text-success">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Key" size={16} className="text-primary" />
                <span className="font-medium">api-signing-key-2024</span>
              </div>
              <span className="text-xs text-warning">Expires in 30 days</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Key" size={16} className="text-primary" />
                <span className="font-medium">backup-storage-key</span>
              </div>
              <span className="text-xs text-success">Active</span>
            </div>
          </div>
        );
      case 'audit':
        return (
          <div className="space-y-3">
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Key Access</span>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
              <div className="text-xs text-muted-foreground">User: admin@company.com</div>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Key Rotation</span>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
              <div className="text-xs text-muted-foreground">Automated rotation completed</div>
            </div>
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Compliance Report</span>
                <span className="text-xs text-muted-foreground">6 hours ago</span>
              </div>
              <div className="text-xs text-muted-foreground">Monthly SOC 2 report generated</div>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="space-y-4">
            <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm">
              <div className="text-success mb-2">POST /api/v1/keys</div>
              <div className="text-muted-foreground">
                {`{
  "name": "my-encryption-key",
  "algorithm": "AES-256",
  "usage": ["encrypt", "decrypt"]
}`}
              </div>
            </div>
            <div className="bg-success/10 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-success">Key created successfully</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          See KeyOrbit KMS in Action
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Explore the intuitive interface and powerful features that make key management simple and secure.
        </p>
        <button
          onClick={onRequestDemo}
          className="btn-glow bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 inline-flex items-center space-x-2"
        >
          <Icon name="Play" size={20} />
          <span>Schedule Live Demo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Demo Navigation */}
        <div className="space-y-4">
          {demoSections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => setActiveDemo(section?.id)}
              className={`w-full text-left p-6 rounded-lg transition-all duration-300 ${
                activeDemo === section?.id
                  ? 'glass-card shadow-orbital-lg border-l-4 border-primary'
                  : 'bg-muted/20 hover:bg-muted/30'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  activeDemo === section?.id ? 'bg-primary/20' : 'bg-muted/20'
                }`}>
                  <Icon 
                    name={section?.icon} 
                    size={24} 
                    className={activeDemo === section?.id ? 'text-primary' : 'text-muted-foreground'} 
                  />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${
                    activeDemo === section?.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {section?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {section?.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Demo Preview */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-lg p-8 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">
                {demoSections?.find(s => s?.id === activeDemo)?.title}
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <div className="w-3 h-3 bg-success rounded-full"></div>
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 border border-border min-h-[300px]">
              {getDemoContent()}
            </div>

            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">Interactive Features</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a simplified preview. The actual platform includes advanced filtering, 
                    real-time updates, detailed analytics, and comprehensive management tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Demo Features */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Smartphone" size={32} className="text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Mobile Responsive</h4>
          <p className="text-sm text-muted-foreground">
            Access your key management system from any device with our responsive design.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Zap" size={32} className="text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Real-time Updates</h4>
          <p className="text-sm text-muted-foreground">
            Get instant notifications and live data updates across all your key operations.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Settings" size={32} className="text-primary" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Customizable</h4>
          <p className="text-sm text-muted-foreground">
            Configure workflows, alerts, and dashboards to match your organization's needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDemo;