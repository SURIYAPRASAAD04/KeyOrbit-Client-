import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { authAPI } from '../../../services/api';

const EmailVerification = ({ email, userId, onComplete, onBack }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

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
  };

  const handleVerify = async (e) => {
    e?.preventDefault();
    
    if (verificationCode?.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authAPI.verifyEmail(userId, verificationCode);
      
      if (response.status === 200) {
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
    
    try {
      await authAPI.resendVerification(email);
      setTimeLeft(60);
      setCanResend(false);
      setVerificationCode('');
    } catch (error) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to resend verification code.');
      }
    } finally {
      setResendLoading(false);
    }
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
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-success">
          <Icon name="Check" size={16} />
          <span>Redirecting to login...</span>
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
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
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
            {isLoading ? 'Verifying...' : 'Verify Email'}
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