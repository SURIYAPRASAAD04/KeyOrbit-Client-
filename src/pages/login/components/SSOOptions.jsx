import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { authAPI } from '../../../services/api';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const SSOOptions = () => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  const handleSSOLogin = async (provider) => {
    setLoadingProvider(provider);
    
    if (provider === 'google') {
      authAPI.googleLogin();
    }
    // Add other providers as needed
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
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1  gap-3">
        {ssoProviders.map((provider) => {
          const IconComponent = provider.icon;
          return (
            <Button
              key={provider.id}
              variant="outline"
              size="lg"
              onClick={() => handleSSOLogin(provider.id)}
              loading={loadingProvider === provider.id}
              disabled={loadingProvider && loadingProvider !== provider.id}
              className={`glass-card ${provider.bgColor} transition-all duration-150 hover:text-primary`}
            >
              <div className="flex items-center space-x-2">
                <IconComponent size={18} className={provider.color} />
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
