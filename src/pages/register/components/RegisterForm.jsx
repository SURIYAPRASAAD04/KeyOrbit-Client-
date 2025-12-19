import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { authAPI } from '../../../services/api';

const RegisterForm = ({ onComplete, onBack, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Update password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const requirements = [
      /.{8,}/, // At least 8 characters
      /[a-z]/, // Lowercase letter
      /[A-Z]/, // Uppercase letter
      /\d/, // Number
      /[^a-zA-Z\d]/ // Special character
    ];

    requirements?.forEach(regex => {
      if (regex?.test(password)) strength += 1;
    });

    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrength < 4) {
      newErrors.password = 'Password must meet all security requirements';
    }
    
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData?.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
  e?.preventDefault();
  
  if (!validateForm()) return;
  
  setIsLoading(true);
  
  try {
    // Store user data for next step (organization details)
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    };
    
    // Just pass data to next step - don't call API yet
    onComplete(userData);
  } catch (error) {
    if (error.response?.data?.error) {
      setErrors({ general: error.response.data.error });
    } else {
      setErrors({ general: 'Registration failed. Please try again.' });
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-muted-foreground">
          Enter your details to create your KeyOrbit account
        </p>
      </div>

      {errors.general && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={formData?.firstName}
            onChange={handleInputChange}
            error={errors?.firstName}
            required
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={formData?.lastName}
            onChange={handleInputChange}
            error={errors?.lastName}
            required
          />
        </div>

        {/* Contact Fields */}
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="+1 (555) 123-4567"
            value={formData?.phone}
            onChange={handleInputChange}
            error={errors?.phone}
            required
          />
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a secure password"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
            />
            <PasswordStrengthIndicator 
              password={formData?.password} 
              strength={passwordStrength} 
            />
          </div>

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            required
          />
        </div>

        {/* Terms Acceptance */}
        <div className="space-y-2">
          <Checkbox
            label={
              <span className="text-sm">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => console.log('Terms clicked')}
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => console.log('Privacy clicked')}
                >
                  Privacy Policy
                </button>
              </span>
            }
            name="acceptTerms"
            checked={formData?.acceptTerms}
            onChange={handleInputChange}
            error={errors?.acceptTerms}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="ArrowRight"
            iconPosition="right"
            className="btn-glow"
          >
            {isLoading ? 'Creating Account...' : 'Continue'}
          </Button>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
            >
              ← Back to Login
            </button>
            
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onBack}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;