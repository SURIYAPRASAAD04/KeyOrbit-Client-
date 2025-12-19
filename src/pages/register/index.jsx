import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import RegisterForm from './components/RegisterForm';
import OrganizationDetails from './components/OrganizationDetails';
import EmailVerification from './components/EmailVerification';
import SecurityBadges from '../login/components/SecurityBadges';
import OrbitBackground from '../login/components/OrbitBackground';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState({});

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('keyorbit_user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleStepComplete = (data, nextStep) => {
    setRegistrationData(prev => ({ ...prev, ...data }));
    if (nextStep) {
      setCurrentStep(nextStep);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <RegisterForm
            onComplete={(data) => handleStepComplete(data, 2)}
            onBack={handleBackToLogin}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 2:
        return (
          <OrganizationDetails
            onComplete={(data) => handleStepComplete({ ...registrationData, ...data }, 3)}
            onBack={() => setCurrentStep(1)}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 3:
        return (
          <EmailVerification
            email={registrationData?.email}
            userId={registrationData?.userId}
            onComplete={() => navigate('/login')}
            onBack={() => setCurrentStep(2)}
          />
        );
      default:
        return null;
    }
  };

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
                  Join the Future of Security
                </h2>
                <p className="text-lg text-muted-foreground">
                  Create your enterprise account and experience quantum-ready cryptographic management
                </p>
              </div>
            </div>

            {/* Registration Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">What you'll get:</h3>
              <div className="space-y-3">
                {[
                  {
                    icon: 'Shield',
                    title: 'Enterprise Security',
                    description: 'Advanced encryption with hardware security modules'
                  },
                  {
                    icon: 'Users',
                    title: 'Team Management',
                    description: 'Role-based access control and user administration'
                  },
                  {
                    icon: 'Activity',
                    title: 'Audit & Compliance',
                    description: 'Complete audit trails and regulatory reporting'
                  },
                  {
                    icon: 'Zap',
                    title: 'API Integration',
                    description: 'RESTful APIs for seamless system integration'
                  }
                ]?.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={benefit?.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{benefit?.title}</p>
                      <p className="text-sm text-muted-foreground">{benefit?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <SecurityBadges />
          </div>
        </div>

        {/* Right Panel - Registration */}
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

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3]?.map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                        ${currentStep >= step
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                        }`}
                    >
                      {currentStep > step ? (
                        <Icon name="Check" size={16} />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-1 mx-2 rounded-full
                          ${currentStep > step ? 'bg-primary' : 'bg-muted'}
                        `}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Account</span>
                <span>Organization</span>
                <span>Verification</span>
              </div>
            </div>

            {/* Registration Panel */}
            <div className="glass-card p-8 rounded-2xl shadow-orbital-lg border border-border">
              {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="text-center mt-8 space-y-4">
              <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
                <button className="hover:text-primary transition-colors duration-150">
                  Privacy Policy
                </button>
                <button className="hover:text-primary transition-colors duration-150">
                  Terms of Service
                </button>
                <button className="hover:text-primary transition-colors duration-150">
                  Support
                </button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                © {new Date()?.getFullYear()} KeyOrbit KMS. All rights reserved.
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

export default Register;