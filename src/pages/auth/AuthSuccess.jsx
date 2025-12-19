import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { authAPI } from '../../services/api';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const redirect = searchParams.get('redirect') || '/dashboard';

    if (token) {
      // Store the token
      localStorage.setItem('keyorbit_token', token);
      
      // Fetch user data using the token
      const fetchUserData = async () => {
        try {
          // Use the token to get user profile
          const response = await authAPI.getProfile();
          
          if (response.data && response.data.user) {
            // Store user data
            localStorage.setItem('keyorbit_user', JSON.stringify(response.data.user));
            
            setIsLoading(false);
            navigate(redirect, { replace: true });
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to authenticate. Please try logging in again.');
          setIsLoading(false);
          
          // Clear invalid token
          localStorage.removeItem('keyorbit_token');
        }
      };

      fetchUserData();
    } else {
      setError('Authentication token missing');
      setIsLoading(false);
    }
  }, [navigate, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-spin">
            <Icon name="Loader" size={32} className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="XCircle" size={32} className="text-error" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Authentication Failed</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/login')} variant="default">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthSuccess;