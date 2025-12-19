import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreatePolicyModal = ({ policy, onClose, onPolicyCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'compliance',
    scope: 'organization',
    status: 'draft',
    enforcement: false,
    template: 'custom',
    rules: [],
    keyTypes: [],
    environments: []
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 4;

  useEffect(() => {
    if (policy) {
      setFormData({
        name: policy?.name || '',
        description: policy?.description || '',
        type: policy?.type?.toLowerCase() || 'compliance',
        scope: policy?.scope?.toLowerCase() || 'organization',
        status: policy?.status || 'draft',
        enforcement: policy?.enforcement || false,
        template: policy?.template || 'custom',
        rules: policy?.rules || [],
        keyTypes: policy?.keyTypes || [],
        environments: policy?.environments || []
      });
    }
  }, [policy]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData?.name) newErrors.name = 'Policy name is required';
      if (!formData?.description) newErrors.description = 'Description is required';
      if (!formData?.type) newErrors.type = 'Policy type is required';
    }

    if (step === 2) {
      if (!formData?.scope) newErrors.scope = 'Scope is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onPolicyCreated?.(formData);
      setIsLoading(false);
    }, 1000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <Input
                  label="Policy Name"
                  name="name"
                  value={formData?.name}
                  onChange={handleInputChange}
                  error={errors?.name}
                  placeholder="Enter policy name"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData?.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    placeholder="Describe the purpose and scope of this policy"
                  />
                  {errors?.description && (
                    <p className="text-sm text-destructive mt-1">{errors?.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Policy Type
                  </label>
                  <Select
                    value={formData?.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <option value="compliance">Compliance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="privacy">Privacy</option>
                    <option value="development">Development</option>
                    <option value="security">Security</option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Scope & Coverage</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Policy Scope
                  </label>
                  <Select
                    value={formData?.scope}
                    onValueChange={(value) => handleSelectChange('scope', value)}
                  >
                    <option value="organization">Organization</option>
                    <option value="department">Department</option>
                    <option value="global">Global</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Key Types
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['AES', 'RSA', 'ECDSA', 'ECDH', 'Kyber', 'Dilithium']?.map((keyType) => (
                      <label key={keyType} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border border-border text-primary focus:ring-primary"
                          checked={formData?.keyTypes?.includes(keyType)}
                          onChange={(e) => {
                            const checked = e?.target?.checked;
                            setFormData(prev => ({
                              ...prev,
                              keyTypes: checked 
                                ? [...prev?.keyTypes, keyType]
                                : prev?.keyTypes?.filter(t => t !== keyType)
                            }));
                          }}
                        />
                        <span className="text-sm">{keyType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Environments
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Production', 'Staging', 'Development', 'Testing']?.map((env) => (
                      <label key={env} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border border-border text-primary focus:ring-primary"
                          checked={formData?.environments?.includes(env)}
                          onChange={(e) => {
                            const checked = e?.target?.checked;
                            setFormData(prev => ({
                              ...prev,
                              environments: checked 
                                ? [...prev?.environments, env]
                                : prev?.environments?.filter(t => t !== env)
                            }));
                          }}
                        />
                        <span className="text-sm">{env}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Policy Rules</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Rule Builder</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select defaultValue="key_rotation">
                      <option value="key_rotation">Key Rotation</option>
                      <option value="key_expiry">Key Expiry</option>
                      <option value="access_control">Access Control</option>
                      <option value="encryption_strength">Encryption Strength</option>
                    </Select>
                    <Select defaultValue="every">
                      <option value="every">Every</option>
                      <option value="after">After</option>
                      <option value="before">Before</option>
                    </Select>
                    <Input placeholder="90 days" />
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline">
                      <Icon name="Plus" size={14} className="mr-1" />
                      Add Rule
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Sample Rules</h4>
                  {[
                    'Keys must be rotated every 90 days',
                    'Minimum key length: 2048 bits for RSA',
                    'Multi-factor authentication required for key access',
                    'Keys must be backed up to secure storage'
                  ]?.map((rule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <span className="text-sm">{rule}</span>
                      <Button size="sm" variant="ghost" className="p-1">
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Review & Deploy</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Policy Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{formData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{formData?.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scope:</span>
                      <span className="font-medium">{formData?.scope}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Key Types:</span>
                      <span className="font-medium">{formData?.keyTypes?.join(', ') || 'All'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Environments:</span>
                      <span className="font-medium">{formData?.environments?.join(', ') || 'All'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Initial Status
                    </label>
                    <Select
                      value={formData?.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                    </Select>
                  </div>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="enforcement"
                      checked={formData?.enforcement}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground">Enable enforcement immediately</span>
                      <p className="text-xs text-muted-foreground">
                        Policy rules will be actively enforced upon creation
                      </p>
                    </div>
                  </label>
                </div>

                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning">Impact Analysis</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        This policy will affect approximately 247 keys across your organization. 
                        Review the impact before enabling enforcement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-2xl rounded-2xl border border-border max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {policy ? 'Edit Policy' : 'Create New Policy'}
            </h2>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <Icon name="ChevronLeft" size={16} className="mr-1" />
            Previous
          </Button>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <Icon name="ChevronRight" size={16} className="ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={isLoading}>
                {policy ? 'Update Policy' : 'Create Policy'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePolicyModal;