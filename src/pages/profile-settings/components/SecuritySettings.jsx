import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SecuritySettings = ({ userData }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: true,
    deviceTrust: false,
    loginNotifications: true
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e?.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSessionChange = (e) => {
    const { name, checked } = e?.target;
    setSessionSettings(prev => ({ ...prev, [name]: checked }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Show success message
    }, 1500);
  };

  const handleMfaToggle = () => {
    if (!mfaEnabled) {
      setShowMfaSetup(true);
    } else {
      setMfaEnabled(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Password Change Section */}
      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Lock" size={20} className="mr-2" />
            Change Password
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Update your password to keep your account secure
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            name="currentPassword"
            placeholder="Enter current password"
            value={passwordData?.currentPassword}
            onChange={handlePasswordChange}
            error={errors?.currentPassword}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={passwordData?.newPassword}
              onChange={handlePasswordChange}
              error={errors?.newPassword}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={passwordData?.confirmPassword}
              onChange={handlePasswordChange}
              error={errors?.confirmPassword}
              required
            />
          </div>

          <Button
            type="submit"
            variant="default"
            loading={isLoading}
            iconName="Save"
            className="btn-glow"
          >
            {isLoading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Shield" size={20} className="mr-2" />
            Two-Factor Authentication
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add an extra layer of security to your account
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                mfaEnabled ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon name={mfaEnabled ? 'Shield' : 'ShieldOff'} size={20} />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-muted-foreground">
                  {mfaEnabled ? 'Enabled - Your account is protected' : 'Disabled - Enable for better security'}
                </p>
              </div>
            </div>
            <Button
              variant={mfaEnabled ? 'outline' : 'default'}
              size="sm"
              onClick={handleMfaToggle}
              iconName={mfaEnabled ? 'Settings' : 'Shield'}
            >
              {mfaEnabled ? 'Configure' : 'Enable'}
            </Button>
          </div>

          {mfaEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="Smartphone" size={16} className="text-primary" />
                  <p className="font-medium text-foreground">Authenticator App</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Use Google Authenticator or similar app
                </p>
                <Button variant="outline" size="sm">
                  Reconfigure
                </Button>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="Key" size={16} className="text-primary" />
                  <p className="font-medium text-foreground">Backup Codes</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Download backup recovery codes
                </p>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session Management */}
      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Monitor" size={20} className="mr-2" />
            Session Management
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Control how your sessions are managed across devices
          </p>
        </div>

        <div className="space-y-4">
          <Checkbox
            label={
              <div>
                <div className="font-medium">Automatic Session Timeout</div>
                <div className="text-xs text-muted-foreground">
                  Automatically log out after 30 minutes of inactivity
                </div>
              </div>
            }
            name="sessionTimeout"
            checked={sessionSettings?.sessionTimeout}
            onChange={handleSessionChange}
          />

          <Checkbox
            label={
              <div>
                <div className="font-medium">Trust This Device</div>
                <div className="text-xs text-muted-foreground">
                  Skip MFA on this device for 30 days
                </div>
              </div>
            }
            name="deviceTrust"
            checked={sessionSettings?.deviceTrust}
            onChange={handleSessionChange}
          />

          <Checkbox
            label={
              <div>
                <div className="font-medium">Login Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Get notified of new login attempts via email
                </div>
              </div>
            }
            name="loginNotifications"
            checked={sessionSettings?.loginNotifications}
            onChange={handleSessionChange}
          />
        </div>
      </div>

      {/* API Tokens */}
      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Key" size={20} className="mr-2" />
            API Access Tokens
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal API tokens for system integration
          </p>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
          <div>
            <p className="font-medium text-foreground">Personal API Tokens</p>
            <p className="text-sm text-muted-foreground">2 active tokens</p>
          </div>
          <Button
            variant="outline"
            iconName="ExternalLink"
            onClick={() => window.open('/api-tokens', '_blank')}
          >
            Manage Tokens
          </Button>
        </div>
      </div>

      {/* Security Actions */}
      <div className="pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            iconName="Download"
            className="justify-start"
          >
            Export Security Data
          </Button>
          <Button
            variant="outline"
            iconName="LogOut"
            className="justify-start text-error hover:text-error-foreground hover:bg-error"
          >
            Sign Out All Devices
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;