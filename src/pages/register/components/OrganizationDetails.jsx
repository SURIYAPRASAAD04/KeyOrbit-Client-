import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { authAPI } from '../../../services/api';

const OrganizationDetails = ({ onComplete, onBack, registrationData, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    organizationName: '',
    domain: '',
    industry: '',
    companySize: '',
    role: ''
  });
  const [errors, setErrors] = useState({});

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
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'domain') {
      validateDomain(value);
    }
  };

  const handleSelectChange = (name, selectedValue) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateDomain = (domain) => {
    if (domain && !/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/.test(domain)) {
      setErrors(prev => ({ ...prev, domain: 'Please enter a valid domain (e.g., company.com)' }));
    } else {
      setErrors(prev => ({ ...prev, domain: '' }));
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
      // Combine registration data with organization data
      const completeData = {
        ...registrationData,
        organizationData: formData
      };
      
      // Send everything to backend in one go
      const response = await authAPI.register(completeData);
      
      if (response.data.pendingId) {
        // Store pending ID for verification step
        localStorage.setItem('pendingRegistrationId', response.data.pendingId);
        onComplete({
          ...registrationData,
          ...formData,
          pendingId: response.data.pendingId
        });
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: error.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Organization Details</h2>
        <p className="text-muted-foreground">
          Help us configure your enterprise environment
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
        {/* Organization Info */}
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

        {/* Business Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Industry"
            name="industry"
            value={formData.industry}
            onChange={(value) => handleSelectChange('industry', value)}
            error={errors.industry}
            options={industryOptions}
            required
          />

          <Select
            label="Company Size"
            name="companySize"
            value={formData.companySize}
            onChange={(value) => handleSelectChange('companySize', value)}
            error={errors.companySize}
            options={companySizeOptions}
            required
          />
        </div>

        {/* User Role */}
        <Select
          label="Your Role"
          name="role"
          value={formData.role}
          onChange={(value) => handleSelectChange('role', value)}
          error={errors.role}
          options={roleOptions}
          required
        />
        
        {/* Security Notice */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Security Notice</p>
              <p className="text-muted-foreground">
                Your organization will be configured with enterprise-grade security policies. 
                Domain verification enables automatic user approval for your domain.
              </p>
            </div>
          </div>
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
            {isLoading ? 'Sending Verification Email...' : 'Continue to Verification'}
          </Button>

          <button
            type="button"
            onClick={onBack}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors duration-150 py-2"
          >
            ← Back to Account Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationDetails;