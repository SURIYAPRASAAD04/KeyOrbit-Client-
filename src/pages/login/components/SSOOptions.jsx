import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { FcGoogle } from "react-icons/fc";
import { authAPI } from '../../../services/api';

const SSOOptions = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [error, setError] = useState('');

  // Check for error from Google OAuth redirect
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      
      // Clear error from URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleGoogleLogin = () => {
    setLoadingProvider('google');
    setError('');
    
    // Simple redirect to backend Google OAuth
    // The backend will handle everything and redirect back
    const backendAuthUrl = `${authAPI.googleLogin()}`;
    
    console.log('Redirecting to Google OAuth');
    window.location.href = backendAuthUrl;
  };

  const ssoProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: FcGoogle,
      color: 'text-red-500',
      bgColor: 'hover:bg-red-50'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Show Google OAuth error if any */}
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-10 h-10 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-error">
              {error.includes('No account found') 
                ? 'No account is associated with this Google email address. Please sign up to continue. We look forward to welcoming you on board.' 
                : error}
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {ssoProviders.map((provider) => {
          const IconComponent = provider.icon;
          return (
            <Button
              key={provider.id}
              variant="outline"
              size="lg"
              onClick={handleGoogleLogin}
              loading={loadingProvider === provider.id}
              disabled={loadingProvider && loadingProvider !== provider.id}
              className={`glass-card hover:bg-red-50 transition-all duration-150 hover:text-primary`}
            >
              <div className="flex items-center space-x-2">
                <IconComponent size={18} className="text-red-500" />
                <span className="font-medium">{provider.name}</span>
              </div>
            </Button>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
            onClick={() => navigate('/register')}
          >
            Sign up for free
          </button>
        </p>
      </div>
    </div>
  );
};

export default SSOOptions;