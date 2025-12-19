import React from 'react';
import Icon from '../../../components/AppIcon';

const Footer = ({ onGetStarted, onContactSales }) => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'API Documentation', href: '#' },
        { label: 'Integrations', href: '#' },
        { label: 'Security', href: '#' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Enterprise', href: '#' },
        { label: 'Financial Services', href: '#' },
        { label: 'Healthcare', href: '#' },
        { label: 'Government', href: '#' },
        { label: 'Cloud Providers', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#resources' },
        { label: 'Whitepapers', href: '#resources' },
        { label: 'Webinars', href: '#resources' },
        { label: 'Blog', href: '#' },
        { label: 'Case Studies', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'News', href: '#' },
        { label: 'Partners', href: '#' },
        { label: 'Contact', href: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'System Status', href: '#' },
        { label: 'Professional Services', href: '#' },
        { label: 'Training', href: '#' },
        { label: 'Community', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
    { name: 'GitHub', icon: 'Github', href: '#' },
    { name: 'YouTube', icon: 'Youtube', href: '#' }
  ];

  const handleLinkClick = (href) => {
    if (href?.startsWith('#')) {
      const element = document?.getElementById(href?.slice(1));
      if (element) {
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-primary/5 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-lg font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-foreground">KeyOrbit KMS</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Enterprise-grade key management for the quantum era. Secure your organization's 
              cryptographic keys with industry-leading security and compliance.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.href}
                  className="w-10 h-10 bg-muted/20 rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  title={social?.name}
                >
                  <Icon name={social?.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections?.map((section) => (
            <div key={section?.title}>
              <h4 className="font-semibold text-foreground mb-4">{section?.title}</h4>
              <ul className="space-y-3">
                {section?.links?.map((link) => (
                  <li key={link?.label}>
                    <button
                      onClick={() => handleLinkClick(link?.href)}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {link?.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="glass-card rounded-lg p-8 mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Secure Your Keys?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of organizations that trust KeyOrbit KMS to protect their most critical cryptographic assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="btn-glow bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200"
              >
                Start Free Trial
              </button>
              <button
                onClick={onContactSales}
                className="glass-card px-8 py-3 rounded-lg font-semibold text-foreground hover:shadow-orbital-lg transition-all duration-200"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date()?.getFullYear()} KeyOrbit Security. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <button className="hover:text-primary transition-colors duration-200">
                  Privacy Policy
                </button>
                <button className="hover:text-primary transition-colors duration-200">
                  Terms of Service
                </button>
                <button className="hover:text-primary transition-colors duration-200">
                  Cookie Policy
                </button>
              </div>
            </div>

            {/* Compliance Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Shield" size={16} className="text-success" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Lock" size={16} className="text-primary" />
                <span>FIPS 140-2</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Globe" size={16} className="text-secondary" />
                <span>GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;