import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { authAPI } from '../../services/api';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Parse URL parameters
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const errorParam = params.get('error');

        // Check for OAuth errors
        if (errorParam) {
          throw new Error(`Google OAuth error: ${errorParam}`);
        }

        if (!code) {
          throw new Error('Authorization code not received from Google');
        }

        // Verify state to prevent CSRF
        const savedState = localStorage.getItem('google_oauth_state');
        if (state !== savedState) {
          throw new Error('Invalid state parameter. Possible CSRF attack.');
        }

        // Clear the state
        localStorage.removeItem('google_oauth_state');

        console.log('Google OAuth code received, exchanging for token...');

        // Send code to backend
        const response = await authAPI.googleLogin(code);

        if (response.data.user && response.data.token) {
          // Store session
          localStorage.setItem('keyorbit_user', JSON.stringify(response.data.user));
          localStorage.setItem('keyorbit_token', response.data.token);

          // Get redirect URL
          const redirectUrl = localStorage.getItem('oauth_redirect_url') || '/dashboard';
          localStorage.removeItem('oauth_redirect_url');

          console.log('Google login successful, redirecting to:', redirectUrl);
          
          // Redirect to dashboard or saved URL
          setTimeout(() => {
            navigate(redirectUrl, { replace: true });
          }, 1000);
        } else {
          throw new Error('Google login failed: No user data received');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        setError(error.message || 'Google login failed');
        
        // Redirect to login page after delay
        setTimeout(() => {
          navigate('/login', { 
            replace: true,
            state: { error: error.message }
          });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Icon name="Orbit" size={32} className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Completing Google sign in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 p-8 glass-card rounded-2xl">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="AlertCircle" size={32} className="text-error" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Google Sign In Failed</h2>
            <p className="text-error">{error}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Icon name="Check" size={32} className="text-success-foreground" />
        </div>
        <p className="text-muted-foreground">Google sign in successful! Redirecting...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;