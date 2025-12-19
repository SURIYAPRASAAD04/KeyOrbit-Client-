import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.status === 200) {
        setSuccess(response.data.message);
      } else {
        setError(response.data.error || 'Failed to send reset email');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email to receive reset instructions
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
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              iconName="Mail"
              iconPosition="right"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
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

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Need help?{' '}
            <a
              href="/support"
              className="text-primary hover:text-primary/80 transition-colors duration-150"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;