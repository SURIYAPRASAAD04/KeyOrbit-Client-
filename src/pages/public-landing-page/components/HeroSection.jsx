import React from 'react';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ onGetStarted, onRequestDemo }) => {
  return (
    <div className="relative bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Orbital Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full animate-orbital"></div>
        <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-accent/10 rounded-full animate-orbital" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/6 w-16 h-16 bg-secondary/10 rounded-full animate-orbital" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="block">Quantum-Ready</span>
            <span className="text-primary">Key Management</span>
            <span className="block">for Enterprise</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Secure your organization's cryptographic keys with enterprise-grade key management. 
            Future-proof your security with quantum-resistant algorithms and seamless compliance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onGetStarted}
              className="btn-glow bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <Icon name="ArrowRight" size={20} />
            </button>
            <button
              onClick={onRequestDemo}
              className="glass-card px-8 py-4 rounded-lg font-semibold text-lg text-foreground hover:shadow-orbital-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Icon name="Play" size={20} />
              <span>Request Demo</span>
            </button>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
              <Icon name="Lock" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">FIPS 140-2 Level 3</span>
            </div>
            <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
              <Icon name="CheckCircle" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">Common Criteria</span>
            </div>
            <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-full">
              <Icon name="Globe" size={16} className="text-secondary" />
              <span className="text-sm font-medium text-foreground">GDPR Ready</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10M+</div>
              <div className="text-sm text-muted-foreground">Keys Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Enterprise Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Expert Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-16 fill-background">
          <path d="M0,120 C480,60 960,60 1440,120 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;