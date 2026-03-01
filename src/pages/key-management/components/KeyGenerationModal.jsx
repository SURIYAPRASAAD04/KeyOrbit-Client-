import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { PQCkeyAPI as keyAPI } from '../../../services/api';

const KeyGenerationModal = ({ isOpen, onClose, onGenerate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [keyType, setKeyType] = useState('kem');
  const [algorithms, setAlgorithms] = useState({
    kem: [],
    signature: []
  });
  const [formData, setFormData] = useState({
    name: '',
    algorithm: '',
    kemAlgorithm: 'ml-kem-768',
    sigAlgorithm: 'ml-dsa-65',
    purpose: '',
    expirationDays: '365',
    description: '',
    tags: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAlgorithms();
    }
  }, [isOpen]);

  const fetchAlgorithms = async () => {
    try {
      const response = await keyAPI.getAlgorithms();
      setAlgorithms(response.data);
    } catch (error) {
      console.error('Failed to fetch algorithms:', error);
    }
  };

  const algorithmOptions = {
    kem: (algorithms.kem || []).map(alg => ({
      value: alg.id,
      label: alg.name,
      description: `${alg.name} - ${alg.security} security`
    })),
    signature: (algorithms.signature || []).map(alg => ({
      value: alg.id,
      label: alg.name,
      description: `${alg.name} - ${alg.security} security`
    }))
  };

  const purposeOptions = [
    { value: 'encryption', label: 'Data Encryption' },
    { value: 'signing', label: 'Digital Signing' },
    { value: 'authentication', label: 'Authentication' },
    { value: 'key-exchange', label: 'Key Exchange' },
    { value: 'hybrid', label: 'Hybrid (KEM + Signature)' }
  ];

  const keyTypeOptions = [
    { value: 'kem', label: 'KEM (Key Encapsulation)', description: 'ML-KEM algorithms for key exchange' },
    { value: 'signature', label: 'Digital Signature', description: 'ML-DSA algorithms for signing' },
    { value: 'hybrid', label: 'Hybrid', description: 'Both KEM and Signature keys' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleKeyTypeChange = (value) => {
    setKeyType(value);
    setFormData(prev => ({
      ...prev,
      algorithm: '',
      kemAlgorithm: 'ml-kem-768',
      sigAlgorithm: 'ml-dsa-65'
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
    setError('');

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        expirationDays: parseInt(formData.expirationDays),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        purpose: formData.purpose
      };

      let response;
      
      if (keyType === 'kem') {
        response = await keyAPI.generateMLKEMKey({
          ...payload,
          algorithm: formData.algorithm || 'ml-kem-768'
        });
      } else if (keyType === 'signature') {
        response = await keyAPI.generateMLDSAKey({
          ...payload,
          algorithm: formData.algorithm || 'ml-dsa-65'
        });
      } else if (keyType === 'hybrid') {
        response = await keyAPI.generateHybridKey({
          ...payload,
          kemAlgorithm: formData.kemAlgorithm,
          sigAlgorithm: formData.sigAlgorithm
        });
      }

      if (response.data) {
        onGenerate(response.data.key || response.data.keys);
        handleClose();
      }
    } catch (error) {
      console.error('Key generation failed:', error);
      setError(error.response?.data?.error || 'Failed to generate key');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setKeyType('kem');
    setFormData({
      name: '',
      algorithm: '',
      kemAlgorithm: 'ml-kem-768',
      sigAlgorithm: 'ml-dsa-65',
      purpose: '',
      expirationDays: '365',
      description: '',
      tags: ''
    });
    setError('');
    setIsGenerating(false);
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && keyType;
      case 2:
        if (keyType === 'kem') return formData.algorithm || formData.kemAlgorithm;
        if (keyType === 'signature') return formData.algorithm || formData.sigAlgorithm;
        if (keyType === 'hybrid') return true;
        return false;
      case 3:
        return formData.purpose && formData.expirationDays;
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
            <h2 className="text-xl font-semibold text-foreground">Generate Post-Quantum Key</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep} of 3 - {keyType === 'kem' ? 'KEM' : keyType === 'signature' ? 'Signature' : 'Hybrid'} Key
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
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

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-error/10 border border-error/30 rounded-lg">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

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
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                    
                    <Select
                      label="Key Type"
                      placeholder="Select key type"
                      options={keyTypeOptions}
                      value={keyType}
                      onChange={handleKeyTypeChange}
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
                  <h3 className="text-lg font-medium text-foreground mb-4">Algorithm Selection</h3>
                  <div className="space-y-4">
                    {keyType === 'kem' && (
                      <Select
                        label="KEM Algorithm"
                        placeholder="Select KEM algorithm"
                        options={algorithmOptions.kem}
                        value={formData.algorithm || formData.kemAlgorithm}
                        onChange={(value) => {
                          handleInputChange('algorithm', value);
                          handleInputChange('kemAlgorithm', value);
                        }}
                        required
                      />
                    )}

                    {keyType === 'signature' && (
                      <Select
                        label="Signature Algorithm"
                        placeholder="Select signature algorithm"
                        options={algorithmOptions.signature}
                        value={formData.algorithm || formData.sigAlgorithm}
                        onChange={(value) => {
                          handleInputChange('algorithm', value);
                          handleInputChange('sigAlgorithm', value);
                        }}
                        required
                      />
                    )}

                    {keyType === 'hybrid' && (
                      <>
                        <Select
                          label="KEM Algorithm"
                          placeholder="Select KEM algorithm"
                          options={algorithmOptions.kem}
                          value={formData.kemAlgorithm}
                          onChange={(value) => handleInputChange('kemAlgorithm', value)}
                          required
                        />
                        
                        <Select
                          label="Signature Algorithm"
                          placeholder="Select signature algorithm"
                          options={algorithmOptions.signature}
                          value={formData.sigAlgorithm}
                          onChange={(value) => handleInputChange('sigAlgorithm', value)}
                          required
                        />
                      </>
                    )}
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
                    <Select
                      label="Purpose"
                      placeholder="Select key purpose"
                      options={purposeOptions}
                      value={formData.purpose}
                      onChange={(value) => handleInputChange('purpose', value)}
                      required
                    />
                    
                    <Input
                      label="Expiration (Days)"
                      type="number"
                      placeholder="365"
                      value={formData.expirationDays}
                      onChange={(e) => handleInputChange('expirationDays', e.target.value)}
                      min="1"
                      max="3650"
                      required
                    />
                    
                    <Input
                      label="Description (Optional)"
                      type="text"
                      placeholder="Additional notes about this key"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                    
                    <Input
                      label="Tags (Optional)"
                      type="text"
                      placeholder="Comma-separated tags (e.g., production, critical)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Key Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-foreground font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-foreground font-medium">
                        {keyType === 'kem' ? 'KEM' : keyType === 'signature' ? 'Signature' : 'Hybrid'}
                      </span>
                    </div>
                    {keyType === 'hybrid' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">KEM Algorithm:</span>
                          <span className="text-foreground font-medium">{formData.kemAlgorithm.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Signature Algorithm:</span>
                          <span className="text-foreground font-medium">{formData.sigAlgorithm.toUpperCase()}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Algorithm:</span>
                        <span className="text-foreground font-medium">
                          {(formData.algorithm || formData.kemAlgorithm || formData.sigAlgorithm).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purpose:</span>
                      <span className="text-foreground font-medium">
                        {purposeOptions.find(p => p.value === formData.purpose)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span className="text-foreground font-medium">{formData.expirationDays} days</span>
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