import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TechnicalDetails = ({ technicalData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes?.[i];
  };

  return (
    <div className="glass-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Code" size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Technical Details</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      <div className="space-y-4">
        {/* Basic Technical Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Format</label>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-mono text-foreground">{technicalData?.keyFormat}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(technicalData?.keyFormat, 'format')}
                  className="h-6 w-6"
                >
                  <Icon 
                    name={copiedField === 'format' ? 'Check' : 'Copy'} 
                    size={12} 
                    className={copiedField === 'format' ? 'text-success' : 'text-muted-foreground'} 
                  />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Size</label>
              <p className="text-sm text-foreground mt-1">{formatBytes(technicalData?.keySize)}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Encoding</label>
              <p className="text-sm font-mono text-foreground mt-1">{technicalData?.encoding}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hash Algorithm</label>
              <p className="text-sm font-mono text-foreground mt-1">{technicalData?.hashAlgorithm}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Signature Algorithm</label>
              <p className="text-sm font-mono text-foreground mt-1">{technicalData?.signatureAlgorithm}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Usage</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {technicalData?.keyUsage?.map((usage, index) => (
                  <span key={index} className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded">
                    {usage}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Technical Details */}
        {isExpanded && (
          <div className="border-t border-border pt-4 space-y-4">
            {/* Key Fingerprint */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Fingerprint (SHA-256)</label>
              <div className="flex items-center justify-between mt-1 p-3 bg-muted/20 rounded-lg">
                <p className="text-sm font-mono text-foreground break-all">{technicalData?.fingerprint}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(technicalData?.fingerprint, 'fingerprint')}
                  className="h-6 w-6 ml-2 flex-shrink-0"
                >
                  <Icon 
                    name={copiedField === 'fingerprint' ? 'Check' : 'Copy'} 
                    size={12} 
                    className={copiedField === 'fingerprint' ? 'text-success' : 'text-muted-foreground'} 
                  />
                </Button>
              </div>
            </div>

            {/* Algorithm Parameters */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Algorithm Parameters</label>
              <div className="mt-2 space-y-2">
                {Object.entries(technicalData?.algorithmParams)?.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded-lg">
                    <span className="text-sm text-muted-foreground">{key}</span>
                    <span className="text-sm font-mono text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Public Key Preview */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Public Key (PEM Format)</label>
              <div className="mt-2 relative">
                <div className="p-3 bg-muted/20 rounded-lg max-h-32 overflow-y-auto custom-scrollbar">
                  <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                    {technicalData?.publicKeyPem}
                  </pre>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(technicalData?.publicKeyPem, 'publicKey')}
                  className="absolute top-2 right-2 h-6 w-6"
                >
                  <Icon 
                    name={copiedField === 'publicKey' ? 'Check' : 'Copy'} 
                    size={12} 
                    className={copiedField === 'publicKey' ? 'text-success' : 'text-muted-foreground'} 
                  />
                </Button>
              </div>
            </div>

            {/* Quantum Resistance Info */}
            {technicalData?.quantumResistant && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Quantum Resistant</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This key uses post-quantum cryptography algorithms that are believed to be secure against quantum computer attacks.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicalDetails;