import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GenerateTokenModal = ({ isOpen, onClose, onGenerate }) => {
  const [step, setStep] = useState(1);
  const [tokenData, setTokenData] = useState({
    name: '',
    description: '',
    permissions: [],
    expiresAt: '',
    ipRestrictions: [],
    rateLimit: 1000
  });
  const [newIp, setNewIp] = useState('');

  const permissionOptions = [
    { id: 'key:read', label: 'Read Keys', description: 'View key metadata and public keys' },
    { id: 'key:write', label: 'Write Keys', description: 'Create and update keys' },
    { id: 'key:delete', label: 'Delete Keys', description: 'Remove keys from the system' },
    { id: 'key:rotate', label: 'Rotate Keys', description: 'Perform key rotation operations' },
    { id: 'audit:read', label: 'Read Audit Logs', description: 'Access audit trail information' },
    { id: 'admin:all', label: 'Full Admin Access', description: 'Complete system administration' }
  ];

  const handlePermissionToggle = (permissionId) => {
    setTokenData(prev => ({
      ...prev,
      permissions: prev?.permissions?.includes(permissionId)
        ? prev?.permissions?.filter(p => p !== permissionId)
        : [...prev?.permissions, permissionId]
    }));
  };

  const handleAddIp = () => {
    if (newIp && !tokenData?.ipRestrictions?.includes(newIp)) {
      setTokenData(prev => ({
        ...prev,
        ipRestrictions: [...prev?.ipRestrictions, newIp]
      }));
      setNewIp('');
    }
  };

  const handleRemoveIp = (ip) => {
    setTokenData(prev => ({
      ...prev,
      ipRestrictions: prev?.ipRestrictions?.filter(i => i !== ip)
    }));
  };

  const handleGenerate = () => {
    onGenerate(tokenData);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setTokenData({
      name: '',
      description: '',
      permissions: [],
      expiresAt: '',
      ipRestrictions: [],
      rateLimit: 1000
    });
    setNewIp('');
    onClose();
  };

  const canProceedToStep2 = tokenData?.name?.trim() && tokenData?.permissions?.length > 0;
  const canGenerate = canProceedToStep2;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="glass-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Plus" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Generate API Token</h2>
              <p className="text-sm text-muted-foreground">
                Step {step} of 2: {step === 1 ? 'Basic Configuration' : 'Security Settings'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">Basic Info</span>
            </div>
            <div className={`flex-1 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">Security</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <Input
                  label="Token Name"
                  type="text"
                  placeholder="e.g., Production API Access"
                  value={tokenData?.name}
                  onChange={(e) => setTokenData(prev => ({ ...prev, name: e?.target?.value }))}
                  required
                />
                <Input
                  label="Description (Optional)"
                  type="text"
                  placeholder="Brief description of token usage"
                  value={tokenData?.description}
                  onChange={(e) => setTokenData(prev => ({ ...prev, description: e?.target?.value }))}
                />
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Permissions *
                </label>
                <div className="space-y-3">
                  {permissionOptions?.map((permission) => (
                    <div
                      key={permission?.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
                        tokenData?.permissions?.includes(permission?.id)
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handlePermissionToggle(permission?.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                          tokenData?.permissions?.includes(permission?.id)
                            ? 'border-primary bg-primary' :'border-muted-foreground'
                        }`}>
                          {tokenData?.permissions?.includes(permission?.id) && (
                            <Icon name="Check" size={12} className="text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{permission?.label}</div>
                          <div className="text-sm text-muted-foreground">{permission?.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Expiration */}
              <div>
                <Input
                  label="Expiration Date (Optional)"
                  type="datetime-local"
                  value={tokenData?.expiresAt}
                  onChange={(e) => setTokenData(prev => ({ ...prev, expiresAt: e?.target?.value }))}
                  description="Leave empty for tokens that never expire"
                />
              </div>

              {/* Rate Limiting */}
              <div>
                <Input
                  label="Rate Limit (requests per hour)"
                  type="number"
                  value={tokenData?.rateLimit}
                  onChange={(e) => setTokenData(prev => ({ ...prev, rateLimit: parseInt(e?.target?.value) || 1000 }))}
                  min="1"
                  max="10000"
                />
              </div>

              {/* IP Restrictions */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  IP Address Restrictions (Optional)
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="192.168.1.0/24 or 203.0.113.1"
                      value={newIp}
                      onChange={(e) => setNewIp(e?.target?.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleAddIp}
                      disabled={!newIp}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Add
                    </Button>
                  </div>
                  {tokenData?.ipRestrictions?.length > 0 && (
                    <div className="space-y-2">
                      {tokenData?.ipRestrictions?.map((ip, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <span className="text-sm font-mono text-foreground">{ip}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveIp(ip)}
                            className="h-6 w-6 text-error hover:text-error hover:bg-error/10"
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Security Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      The generated token will be displayed only once. Make sure to copy and store it securely. 
                      You won't be able to see the full token again after closing this dialog.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            {step < 2 ? (
              <Button
                variant="default"
                onClick={() => setStep(step + 1)}
                disabled={!canProceedToStep2}
                iconName="ArrowRight"
                iconPosition="right"
                iconSize={16}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleGenerate}
                disabled={!canGenerate}
                iconName="Key"
                iconPosition="left"
                iconSize={16}
              >
                Generate Token
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateTokenModal;