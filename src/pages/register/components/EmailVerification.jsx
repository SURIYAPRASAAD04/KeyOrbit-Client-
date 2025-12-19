import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { authAPI } from '../../../services/api';

const EmailVerification = ({ email, onComplete, onBack, onResendEmail }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // New state for success messages
  const errorRef = useRef(error); // Ref to track error state

  // Update ref when error changes
  useEffect(() => {
    errorRef.current = error;
  }, [error]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !canResend) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, canResend]);

  const handleCodeChange = (e) => {
    const code = e?.target?.value?.replace(/\D/g, '')?.slice(0, 6);
    setVerificationCode(code);
    setError('');
    setSuccessMessage('');
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    
    if (verificationCode?.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authAPI.verifyEmail(verificationCode);
      
      if (response.status === 200 && response.data.user && response.data.token) {
        // Account created successfully after verification
        localStorage.setItem('keyorbit_user', JSON.stringify(response.data.user));
        localStorage.setItem('keyorbit_token', response.data.token);
        
        // Clear pending registration data
        localStorage.removeItem('pendingRegistrationId');
        
        setIsVerified(true);
        
        // Redirect after success
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Get pending registration ID from localStorage
      const pendingId = localStorage.getItem('pendingRegistrationId');
      
      console.log('Attempting to resend verification for pendingId:', pendingId);
      
      if (!pendingId) {
        // Try using email as fallback
        if (email) {
          console.log('No pendingId, using email instead:', email);
          const response = await authAPI.resendVerification({ email });
          
          if (response.data.success) {
            // Update pendingId if returned
            if (response.data.pendingId) {
              localStorage.setItem('pendingRegistrationId', response.data.pendingId);
            }
            
            handleResendSuccess();
            return;
          }
        }
        throw new Error('Registration session expired. Please start over.');
      }
      
      // Resend verification using pending ID
      console.log('Calling resendVerification API with pendingId:', pendingId);
      const response = await authAPI.resendVerification({ pendingId });
      
      console.log('Resend response:', response.data);
      
      if (response.data.success) {
        handleResendSuccess();
      } else {
        // Check if the backend returned success: false but still sent email
        if (response.data.message && response.data.message.includes('sent')) {
          // Still show success even if backend returned success: false
          handleResendSuccess();
          console.warn('Backend returned success: false but email was sent:', response.data.message);
        } else {
          throw new Error(response.data.error || response.data.message || 'Failed to resend verification');
        }
      }
      
    } catch (error) {
      console.error('Resend verification error:', error);
      
      let errorMessage = 'Failed to resend verification code.';
      
      // Check if it's actually a success (some backends return 200 with error in body)
      if (error.response?.status === 200 && error.response?.data?.message) {
        // The email was sent successfully, but backend structure is different
        if (error.response.data.message.includes('sent') || error.response.data.message.includes('success')) {
          handleResendSuccess();
          return;
        }
      }
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check if it's a network error
      if (!error.response && error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  // Helper function for successful resend
  const handleResendSuccess = () => {
    // Reset timer
    setTimeLeft(60);
    setCanResend(false);
    setVerificationCode('');
    
    // Show success message
    const successMsg = 'Verification code resent successfully!';
    setSuccessMessage(successMsg);
    setError(''); // Clear any error
    
    console.log('Resend successful, showing success message');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  if (isVerified) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Icon name="Check" size={32} className="text-success-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h2>
          <p className="text-muted-foreground">
            Your account has been successfully created and verified.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Welcome to KeyOrbit KMS Enterprise!
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-success">
          <Icon name="Check" size={16} />
          <span>Redirecting to dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Mail" size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Verify Your Email</h2>
        <p className="text-muted-foreground">
          We've sent a verification code to
        </p>
        <p className="font-medium text-foreground">{email}</p>
        <p className="text-sm text-muted-foreground">
          Check your inbox (and spam folder) for the 6-digit code
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <p className="text-sm text-success">{successMessage}</p>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <p className="text-sm text-error">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Verification Code
          </label>
          <Input
            type="text"
            name="verificationCode"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={handleCodeChange}
            className="text-center text-lg font-mono tracking-widest"
            maxLength={6}
            required
            autoFocus
          />
          <p className="text-xs text-muted-foreground text-center">
            Enter the 6-digit code from your email
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={verificationCode?.length !== 6}
            iconName="Check"
            iconPosition="right"
            className="btn-glow"
          >
            {isLoading ? 'Verifying...' : 'Verify & Create Account'}
          </Button>

          {/* Resend Code */}
          <div className="text-center">
            {canResend ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={resendLoading}
                onClick={handleResend}
                iconName="RefreshCw"
                iconPosition="left"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend code in {timeLeft} seconds
              </p>
            )}
          </div>
        </div>

        <div className="text-center space-y-4">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            ← Back to Organization Details
          </button>

          <div className="p-3 bg-muted/20 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground">
              <Icon name="Info" size={14} className="inline mr-1" />
              Didn't receive the email? Check your spam folder or contact support.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmailVerification;