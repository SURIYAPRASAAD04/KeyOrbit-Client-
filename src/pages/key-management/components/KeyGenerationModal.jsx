import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const KeyGenerationModal = ({ isOpen, onClose, onGenerate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    algorithm: '',
    keySize: '',
    purpose: '',
    expirationDays: '365',
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const algorithmOptions = [
    { value: 'aes-256', label: 'AES-256', description: 'Advanced Encryption Standard' },
    { value: 'rsa-2048', label: 'RSA-2048', description: 'Rivest-Shamir-Adleman' },
    { value: 'rsa-4096', label: 'RSA-4096', description: 'RSA with 4096-bit key' },
    { value: 'kyber-512', label: 'Kyber-512', description: 'Post-quantum encryption' },
    { value: 'kyber-768', label: 'Kyber-768', description: 'Post-quantum encryption' },
    { value: 'dilithium-2', label: 'Dilithium-2', description: 'Post-quantum signatures' },
    { value: 'dilithium-3', label: 'Dilithium-3', description: 'Post-quantum signatures' }
  ];

  const purposeOptions = [
    { value: 'encryption', label: 'Data Encryption' },
    { value: 'signing', label: 'Digital Signing' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'key-exchange', label: 'Key Exchange' }
  ];

  const keySizeOptions = {
    'aes-256': [{ value: '256', label: '256 bits' }],
    'rsa-2048': [{ value: '2048', label: '2048 bits' }],
    'rsa-4096': [{ value: '4096', label: '4096 bits' }],
    'kyber-512': [{ value: '512', label: '512 bits' }],
    'kyber-768': [{ value: '768', label: '768 bits' }],
    'dilithium-2': [{ value: '2', label: 'Level 2' }],
    'dilithium-3': [{ value: '3', label: 'Level 3' }]
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'algorithm' && { keySize: '' })
    }));
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

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate key generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newKey = {
      id: `key_${Date.now()}`,
      name: formData?.name,
      algorithm: formData?.algorithm?.toUpperCase(),
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (parseInt(formData.expirationDays) * 24 * 60 * 60 * 1000)),
      purpose: formData?.purpose,
      keySize: formData?.keySize,
      description: formData?.description
    };

    onGenerate(newKey);
    setIsGenerating(false);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      algorithm: '',
      keySize: '',
      purpose: '',
      expirationDays: '365',
      description: ''
    });
    setIsGenerating(false);
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData?.name && formData?.algorithm;
      case 2:
        return formData?.keySize && formData?.purpose;
      case 3:
        return formData?.expirationDays;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl glass-card rounded-xl shadow-orbital-lg border border-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generate New Key</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep} of 3 - Create a new cryptographic key
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            {[1, 2, 3]?.map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <Input
                      label="Key Name"
                      type="text"
                      placeholder="Enter a descriptive name for your key"
                      value={formData?.name}
                      onChange={(e) => handleInputChange('name', e?.target?.value)}
                      required
                    />
                    
                    <Select
                      label="Algorithm"
                      placeholder="Select cryptographic algorithm"
                      options={algorithmOptions}
                      value={formData?.algorithm}
                      onChange={(value) => handleInputChange('algorithm', value)}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Key Configuration</h3>
                  <div className="space-y-4">
                    <Select
                      label="Key Size"
                      placeholder="Select key size"
                      options={keySizeOptions?.[formData?.algorithm] || []}
                      value={formData?.keySize}
                      onChange={(value) => handleInputChange('keySize', value)}
                      disabled={!formData?.algorithm}
                      required
                    />
                    
                    <Select
                      label="Purpose"
                      placeholder="Select key purpose"
                      options={purposeOptions}
                      value={formData?.purpose}
                      onChange={(value) => handleInputChange('purpose', value)}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Lifecycle Settings</h3>
                  <div className="space-y-4">
                    <Input
                      label="Expiration (Days)"
                      type="number"
                      placeholder="365"
                      value={formData?.expirationDays}
                      onChange={(e) => handleInputChange('expirationDays', e?.target?.value)}
                      min="1"
                      max="3650"
                      required
                    />
                    
                    <Input
                      label="Description (Optional)"
                      type="text"
                      placeholder="Additional notes about this key"
                      value={formData?.description}
                      onChange={(e) => handleInputChange('description', e?.target?.value)}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Key Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-foreground font-medium">{formData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Algorithm:</span>
                      <span className="text-foreground font-medium">{formData?.algorithm?.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Key Size:</span>
                      <span className="text-foreground font-medium">{formData?.keySize} bits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purpose:</span>
                      <span className="text-foreground font-medium">{purposeOptions?.find(p => p?.value === formData?.purpose)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="text-foreground font-medium">{formData?.expirationDays} days</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                <Icon name="ChevronLeft" size={16} className="mr-2" />
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
              >
                Next
                <Icon name="ChevronRight" size={16} className="ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleGenerate} 
                loading={isGenerating}
                disabled={!isStepValid()}
                className="btn-glow"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-orbital w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Icon name="Key" size={16} className="mr-2" />
                    Generate Key
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default KeyGenerationModal;