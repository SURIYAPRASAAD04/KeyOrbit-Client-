import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import SSOOptions from './components/SSOOptions';
import MFAVerification from './components/MFAVerification';
import SecurityBadges from './components/SecurityBadges';
import OrbitBackground from './components/OrbitBackground';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [currentStep, setCurrentStep] = useState('login'); // 'login' | 'mfa'
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  // Get the redirect location from state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      navigate(from, { replace: true });
      return;
    }

    // Check for session expiration or logout messages
    if (searchParams.get('session') === 'expired') {
      setSessionExpired(true);
    }
    
    if (searchParams.get('logout') === 'success') {
      setLogoutMessage('You have been successfully logged out.');
    }

    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, from, searchParams]);

  const handleMFARequired = () => {
    setCurrentStep('mfa');
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
  };

  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-orbital">
            <Icon name="Orbit" size={32} className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Initializing KeyOrbit KMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <OrbitBackground />
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Branding & Security Info */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-center px-12 xl:px-16">
          <div className="max-w-md space-y-8">
            {/* Logo & Branding */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Orbit" size={28} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">KeyOrbit</h1>
                  <p className="text-sm text-muted-foreground">KMS Enterprise</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Secure Key Management
                </h2>
                <p className="text-lg text-muted-foreground">
                  Enterprise-grade cryptographic key lifecycle management with post-quantum security
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Why KeyOrbit?</h3>
              <div className="space-y-3">
                {[
                  {
                    icon: 'Zap',
                    title: 'Quantum-Ready Security',
                    description: 'Future-proof encryption with Kyber and Dilithium algorithms'
                  },
                  {
                    icon: 'Shield',
                    title: 'Zero-Trust Architecture',
                    description: 'Complete key isolation with hardware security modules'
                  },
                  {
                    icon: 'Activity',
                    title: 'Real-time Monitoring',
                    description: 'Comprehensive audit trails and compliance reporting'
                  }
                ]?.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={feature?.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{feature?.title}</p>
                      <p className="text-sm text-muted-foreground">{feature?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <SecurityBadges />
          </div>
        </div>

        {/* Right Panel - Authentication */}
        <div className="flex-1 lg:w-1/2 xl:w-3/5 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Orbit" size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">KeyOrbit</h1>
                  <p className="text-xs text-muted-foreground">KMS Enterprise</p>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {sessionExpired && (
              <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <p className="text-sm text-warning">
                    Your session has expired. Please log in again.
                  </p>
                </div>
              </div>
            )}

            {logoutMessage && (
              <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <p className="text-sm text-success">
                    {logoutMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Authentication Panel */}
            <div className="glass-card p-8 rounded-2xl shadow-orbital-lg border border-border">
              {currentStep === 'login' ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
                    <p className="text-muted-foreground">
                      Sign in to your KeyOrbit account
                    </p>
                  </div>

                  <LoginForm onMFARequired={handleMFARequired} onLoginSuccess={handleLoginSuccess} />
                  <SSOOptions onLoginSuccess={handleLoginSuccess} />
                </div>
              ) : (
                <MFAVerification onBack={handleBackToLogin} onVerificationSuccess={handleLoginSuccess} />
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-8 space-y-4">
              <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                <a href="/privacy" className="hover:text-primary transition-colors duration-150">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-primary transition-colors duration-150">
                  Terms of Service
                </a>
                <a href="/support" className="hover:text-primary transition-colors duration-150">
                  Support
                </a>
              </div>
              
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} KeyOrbit KMS. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Indicator */}
      <div className="fixed bottom-4 right-4 z-20">
        <div className="glass-card px-3 py-2 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">System Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;