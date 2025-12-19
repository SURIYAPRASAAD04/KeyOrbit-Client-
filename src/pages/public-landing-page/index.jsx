import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ProductDemo from './components/ProductDemo';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import ResourcesSection from './components/ResourcesSection';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';
import DemoModal from './components/DemoModal';

const PublicLandingPage = () => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for navigation styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window?.scrollY > 50);
    };

    window?.addEventListener('scroll', handleScroll);
    return () => window?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleRequestDemo = () => {
    setShowDemoModal(true);
  };

  const handleContactSales = () => {
    setShowContactModal(true);
  };

  const scrollToSection = (sectionId) => {
    const element = document?.getElementById(sectionId);
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav shadow-orbital-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-lg font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-foreground">KeyOrbit KMS</span>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Demo
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('resources')}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Resources
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignIn}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="btn-glow bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="hero" className="pt-16">
          <HeroSection 
            onGetStarted={handleGetStarted}
            onRequestDemo={handleRequestDemo}
          />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <FeaturesSection />
        </section>

        {/* Product Demo Section */}
        <section id="demo" className="py-20">
          <ProductDemo onRequestDemo={handleRequestDemo} />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-muted/30">
          <TestimonialsSection />
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <PricingSection 
            onGetStarted={handleGetStarted}
            onContactSales={handleContactSales}
          />
        </section>

        {/* Resources Section */}
        <section id="resources" className="py-20 bg-muted/30">
          <ResourcesSection />
        </section>
      </main>

      {/* Footer */}
      <Footer 
        onGetStarted={handleGetStarted}
        onContactSales={handleContactSales}
      />

      {/* Modals */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}

      {showDemoModal && (
        <DemoModal onClose={() => setShowDemoModal(false)} />
      )}
    </div>
  );
};

export default PublicLandingPage;