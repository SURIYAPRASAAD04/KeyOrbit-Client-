import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Store the token and redirect to dashboard
      localStorage.setItem('keyorbit_token', token);
      
      // Fetch user info or decode from token
      // For now, redirect to dashboard
      navigate('/dashboard');
    } else {
      // Handle error case
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Icon name="Check" size={32} className="text-primary-foreground" />
        </div>
        <p className="text-muted-foreground">Completing Google authentication...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;