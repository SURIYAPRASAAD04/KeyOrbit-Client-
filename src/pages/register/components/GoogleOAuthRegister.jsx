import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { authAPI } from '../../../../services/api';

const GoogleOAuthRegister = ({ userInfo, onComplete, onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    domain: '',
    industry: '',
    companySize: '',
    role: '',
    enableSSO: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const industryOptions = [
    { value: '', label: 'Select Industry' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Financial Services' },
    { value: 'education', label: 'Education' },
    { value: 'government', label: 'Government' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'other', label: 'Other' }
  ];

  const companySizeOptions = [
    { value: '', label: 'Select Company Size' },
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-1000', label: '201-1000 employees' },
    { value: '1000+', label: '1000+ employees' }
  ];

  const roleOptions = [
    { value: '', label: 'Select Your Role' },
    { value: 'admin', label: 'System Administrator' },
    { value: 'security', label: 'Security Officer' },
    { value: 'developer', label: 'Developer' },
    { value: 'manager', label: 'IT Manager' },
    { value: 'analyst', label: 'Security Analyst' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    if (!formData.domain.trim()) {
      newErrors.domain = 'Domain is required';
    } else if (!/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/.test(formData.domain)) {
      newErrors.domain = 'Please enter a valid domain';
    }
    
    if (!formData.industry) {
      newErrors.industry = 'Please select your industry';
    }
    
    if (!formData.companySize) {
      newErrors.companySize = 'Please select company size';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Get the Google OAuth code from session storage
      const oauthCode = sessionStorage.getItem('google_oauth_code');
      
      if (!oauthCode) {
        throw new Error('Google authentication session expired');
      }
      
      const response = await authAPI.googleRegister({
        code: oauthCode,
        organizationData: formData
      });
      
      if (response.data.user && response.data.token) {
        // Store user session
        localStorage.setItem('keyorbit_user', JSON.stringify(response.data.user));
        localStorage.setItem('keyorbit_token', response.data.token);
        
        // Clear the OAuth code
        sessionStorage.removeItem('google_oauth_code');
        
        onComplete(response.data.user);
      }
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
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="UserCheck" size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Complete Your Registration</h2>
        <p className="text-muted-foreground">
          Welcome, {userInfo.name}! Please provide your organization details
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
        <div className="space-y-4">
          <Input
            label="Organization Name"
            type="text"
            name="organizationName"
            placeholder="Enter your organization name"
            value={formData.organizationName}
            onChange={handleInputChange}
            error={errors.organizationName}
            required
          />

          <div>
            <Input
              label="Domain"
              type="text"
              name="domain"
              placeholder="company.com"
              value={formData.domain}
              onChange={handleInputChange}
              error={errors.domain}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be used for domain-based authentication and SSO setup
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            error={errors.industry}
            options={industryOptions}
            required
          />

          <Select
            label="Company Size"
            name="companySize"
            value={formData.companySize}
            onChange={handleInputChange}
            error={errors.companySize}
            options={companySizeOptions}
            required
          />
        </div>

        <Select
          label="Your Role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          error={errors.role}
          options={roleOptions}
          required
        />

        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="Check"
            iconPosition="right"
            className="btn-glow"
          >
            {isLoading ? 'Completing Registration...' : 'Complete Registration'}
          </Button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors duration-150 py-2"
          >
            ← Back to Google Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoogleOAuthRegister;