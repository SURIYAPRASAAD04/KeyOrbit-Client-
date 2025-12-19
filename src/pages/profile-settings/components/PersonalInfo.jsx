import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PersonalInfo = ({ userData }) => {
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || 'John',
    lastName: userData?.lastName || 'Doe',
    email: userData?.email || '',
    phone: userData?.phone || '+1 (555) 123-4567',
    jobTitle: userData?.jobTitle || 'Security Administrator',
    department: userData?.department || 'IT Security',
    bio: userData?.bio || ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    setIsSaved(false);
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
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      
      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('keyorbit_user'));
      localStorage.setItem('keyorbit_user', JSON.stringify({
        ...currentUser,
        ...formData
      }));

      // Reset saved state after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon name="User" size={32} className="text-primary" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/80 transition-colors duration-150">
            <Icon name="Camera" size={14} />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Profile Picture</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Update your profile photo to help colleagues identify you
          </p>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" iconName="Upload">
              Upload Photo
            </Button>
            <Button variant="outline" size="sm" iconName="Trash">
              Remove
            </Button>
          </div>
        </div>
      </div>
      {/* Personal Information Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSaved && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Check" size={16} className="text-success" />
              <p className="text-sm text-success">Profile updated successfully!</p>
            </div>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData?.phone}
            onChange={handleInputChange}
          />
        </div>

        {/* Professional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Job Title"
            type="text"
            name="jobTitle"
            placeholder="Enter job title"
            value={formData?.jobTitle}
            onChange={handleInputChange}
          />
          <Input
            label="Department"
            type="text"
            name="department"
            placeholder="Enter department"
            value={formData?.department}
            onChange={handleInputChange}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            value={formData?.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Brief description for your profile (optional)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <Icon name="Info" size={14} className="inline mr-1" />
            Changes to your email may require verification
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location?.reload()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isLoading}
              iconName="Save"
              iconPosition="right"
              className="btn-glow"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;