import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const InviteUserModal = ({ onClose, onInvite }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    permissions: [],
    phone: '',
    message: ''
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null); // 'success', 'error', 'info'

  const steps = [
    { id: 1, title: 'Basic Information', icon: 'User' },
    { id: 2, title: 'Role & Access', icon: 'Shield' },
    { id: 3, title: 'Review & Send', icon: 'Send' }
  ];

  const roles = [
    { value: 'admin', label: 'Administrator', permissions: ['Read', 'Write', 'Admin', 'Audit'] },
    { value: 'manager', label: 'Manager', permissions: ['Read', 'Write', 'Manage'] },
    { value: 'developer', label: 'Developer', permissions: ['Read', 'Write'] },
    { value: 'auditor', label: 'Auditor', permissions: ['Read', 'Audit'] },
    { value: 'viewer', label: 'Viewer', permissions: ['Read'] },
    { value: 'user', label: 'User', permissions: ['Read'] }
  ];

  const departments = [
    'Security', 'Engineering', 'Operations', 'Compliance', 'Marketing', 'Sales'
  ];

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    
    // Auto-set permissions based on role
    if (field === 'role') {
      const selectedRole = roles?.find(r => r?.value === value);
      setUserData(prev => ({
        ...prev,
        role: value,
        permissions: selectedRole?.permissions || []
      }));
    }
    
    // Clear any status messages when user starts typing
    if (statusMessage) {
      setStatusMessage(null);
      setStatusType(null);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    setStatusType(null);
    
    try {
      // Call the parent onInvite function which now returns a promise
      const result = await onInvite(userData);
      
      if (result && result.success === false) {
        // Show error message
        setStatusType('error');
        setStatusMessage(result.error || 'Failed to send invitation');
        setIsLoading(false);
        return;
      }
      
      // Show success message
      setStatusType('success');
      setStatusMessage('Invitation sent successfully!');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      // Show error message
      setStatusType('error');
      setStatusMessage(error.message || 'Failed to send invitation');
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return userData?.name && userData?.email && userData?.phone;
      case 2:
        return userData?.role && userData?.department;
      case 3:
        return true;
      default:
        return false;
    }
  };

  // Status message component
  const renderStatusMessage = () => {
    if (!statusMessage) return null;
    
    const getIcon = () => {
      switch (statusType) {
        case 'success': return 'CheckCircle';
        case 'error': return 'AlertCircle';
        case 'info': return 'Info';
        default: return 'Info';
      }
    };
    
    const getBgColor = () => {
      switch (statusType) {
        case 'success': return 'bg-success/10 border-success/20';
        case 'error': return 'bg-error/10 border-error/20';
        case 'info': return 'bg-primary/10 border-primary/20';
        default: return 'bg-muted/20 border-border';
      }
    };
    
    const getTextColor = () => {
      switch (statusType) {
        case 'success': return 'text-success';
        case 'error': return 'text-error';
        case 'info': return 'text-primary';
        default: return 'text-foreground';
      }
    };
    
    return (
      <div className={`rounded-lg p-4 mb-6 border ${getBgColor()} transition-all duration-300 animate-fadeIn`}>
        <div className="flex items-start space-x-3">
          <Icon name={getIcon()} size={20} className={`${getTextColor()} mt-0.5`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>{statusMessage}</p>
            {statusType === 'success' && (
              <p className="text-xs text-muted-foreground mt-1">
                The user will receive an email with instructions to join. Closing in 2 seconds...
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setStatusMessage(null);
              setStatusType(null);
            }}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <Icon name="X" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Invite New User</h2>
            <p className="text-sm text-muted-foreground">
              Add a new user to your KeyOrbit organization
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Status Message */}
        {renderStatusMessage()}

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {steps?.map((step, index) => (
              <div key={step?.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-200 ${
                  currentStep >= step?.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                }`}>
                  {currentStep > step?.id ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step?.icon} size={16} />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </span>
                {index < steps?.length - 1 && (
                  <div className={`flex-1 mx-4 h-px ${
                    currentStep > step?.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={userData?.name}
                  onChange={(e) => handleInputChange('name', e?.target?.value)}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={userData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={userData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Step 2: Role & Access */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role *
                </label>
                <select
                  value={userData?.role}
                  onChange={(e) => handleInputChange('role', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  disabled={isLoading}
                >
                  <option value="">Select a role</option>
                  {roles?.map((role) => (
                    <option key={role?.value} value={role?.value}>
                      {role?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department *
                </label>
                <select
                  value={userData?.department}
                  onChange={(e) => handleInputChange('department', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  disabled={isLoading}
                >
                  <option value="">Select department</option>
                  {departments?.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {userData?.role && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Permissions (Auto-assigned)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {userData?.permissions?.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Welcome Message (Optional)
                </label>
                <textarea
                  value={userData?.message}
                  onChange={(e) => handleInputChange('message', e?.target?.value)}
                  placeholder="Add a personal welcome message..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 resize-none"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Step 3: Review & Send */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="glass-card rounded-lg p-4">
                <h4 className="text-sm font-medium text-foreground mb-4">Review User Details</h4>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Name:</dt>
                    <dd className="text-sm font-medium text-foreground">{userData?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Email:</dt>
                    <dd className="text-sm font-medium text-foreground">{userData?.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Phone:</dt>
                    <dd className="text-sm font-medium text-foreground">{userData?.phone}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Role:</dt>
                    <dd className="text-sm font-medium text-foreground">
                      {roles.find(r => r.value === userData?.role)?.label || userData?.role}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">Department:</dt>
                    <dd className="text-sm font-medium text-foreground">{userData?.department}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">What happens next?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      An invitation email will be sent to {userData?.email} with instructions to set up their account and password. They will have 7 days to accept the invitation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            onClick={currentStep === 1 ? onClose : handlePrevious}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </button>

          <div className="flex items-center space-x-3">
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-orbital"></div>
                    <span>Sending Invite...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    <span>Send Invite</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;