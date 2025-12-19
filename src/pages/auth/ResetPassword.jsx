import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PasswordStrengthIndicator from '../register/components/PasswordStrengthIndicator';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [validatingToken, setValidatingToken] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setValidatingToken(false);
        setError('Invalid reset link');
        return;
      }

      try {
        const response = await authAPI.validateResetToken(token);
        setTokenValid(response.data.valid);
        if (!response.data.valid) {
          setError(response.data.error || 'Invalid or expired reset link');
        }
      } catch (error) {
        setTokenValid(false);
        setError('Failed to validate reset link');
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const requirements = [
      /.{8,}/, // At least 8 characters
      /[a-z]/, // Lowercase letter
      /[A-Z]/, // Uppercase letter
      /\d/, // Number
      /[^a-zA-Z\d]/ // Special character
    ];

    requirements.forEach(regex => {
      if (regex.test(password)) strength += 1;
    });

    setPasswordStrength(strength);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }

    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }

    if (passwordStrength < 3) {
      setError('Password is too weak. Please use a stronger password.');
      return false;
    }

    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authAPI.resetPassword(token, formData.newPassword);
      
      if (response.status === 200) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login?reset=success');
        }, 2000);
      } else {
        setError(response.data.error || 'Failed to reset password');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-spin">
            <Icon name="Loader" size={32} className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
            <Icon name="XCircle" size={32} className="text-error" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Invalid Reset Link</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate('/forgot-password')} variant="default">
            Request New Reset Link
          </Button>
          <div className="ml-4">
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-150 space-x-10"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Create a new password for your account
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl shadow-orbital-lg border border-border">
          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg mb-6">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <p className="text-sm text-error">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg mb-6">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <p className="text-sm text-success">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              <PasswordStrengthIndicator 
                password={formData.newPassword} 
                strength={passwordStrength} 
              />
            </div>

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading || passwordStrength < 3}
              iconName="Check"
              iconPosition="right"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;