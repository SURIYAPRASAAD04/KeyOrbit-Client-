import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../hooks/useAuth';

const MFAVerification = ({ onBack, onVerificationSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError('Verification code is required');
      return;
    }
    
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Here you would typically verify the MFA code with your backend
      // For now, we'll simulate a successful verification
      setTimeout(() => {
        onVerificationSuccess();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setError('Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimeLeft(300);
    setCanResend(false);
    console.log('Resending MFA code...');
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
    if (error) setError('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="Shield" size={32} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Two-Factor Authentication</h2>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit verification code from your authenticator app
        </p>
      </div>
      
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-sm text-error">{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleVerify} className="space-y-4">
        <Input
          label="Verification Code"
          type="text"
          placeholder="000000"
          value={verificationCode}
          onChange={handleCodeChange}
          className="text-center text-2xl font-mono tracking-widest"
          maxLength={6}
          required
        />

        <div className="text-center space-y-2">
          {timeLeft > 0 ? (
            <p className="text-sm text-muted-foreground">
              Code expires in {formatTime(timeLeft)}
            </p>
          ) : (
            <p className="text-sm text-warning">
              Code has expired. Please request a new one.
            </p>
          )}
          
          {canResend && (
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-150"
            >
              Resend code
            </button>
          )}
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!verificationCode || verificationCode.length !== 6}
            iconName="Shield"
            iconPosition="right"
            className="btn-glow"
          >
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="lg"
            fullWidth
            onClick={onBack}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Login
          </Button>
        </div>
      </form>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Having trouble? Contact your system administrator
        </p>
      </div>
    </div>
  );
};

export default MFAVerification;