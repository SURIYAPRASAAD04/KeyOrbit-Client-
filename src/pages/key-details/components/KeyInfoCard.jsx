import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KeyInfoCard = ({ keyData, onRotate, onRevoke, onExportPublicKey }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'expired':
        return 'bg-error text-error-foreground';
      case 'revoked':
        return 'bg-error text-error-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAlgorithmIcon = (algorithm) => {
    switch (algorithm?.toLowerCase()) {
      case 'aes-256':
        return 'Shield';
      case 'rsa-2048': case'rsa-4096':
        return 'Key';
      case 'kyber-512': case'kyber-768': case'kyber-1024':
        return 'Orbit';
      case 'dilithium-2': case'dilithium-3': case'dilithium-5':
        return 'Zap';
      default:
        return 'Lock';
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 border border-border">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon 
              name={getAlgorithmIcon(keyData?.algorithm)} 
              size={24} 
              className="text-primary" 
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{keyData?.name}</h2>
            <p className="text-sm text-muted-foreground">{keyData?.keyId}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(keyData?.status)}`}>
          {keyData?.status}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Algorithm</label>
            <p className="text-sm text-foreground font-mono">{keyData?.algorithm}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Key Length</label>
            <p className="text-sm text-foreground">{keyData?.keyLength} bits</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created</label>
            <p className="text-sm text-foreground">{keyData?.createdAt}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Expires</label>
            <p className="text-sm text-foreground">{keyData?.expiresAt}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Created By</label>
            <p className="text-sm text-foreground">{keyData?.createdBy}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Usage Count</label>
            <p className="text-sm text-foreground">{keyData?.usageCount?.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onRotate}
          disabled={keyData?.status === 'revoked'}
        >
          Rotate Key
        </Button>
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
          onClick={onExportPublicKey}
        >
          Export Public Key
        </Button>
        <Button
          variant="destructive"
          iconName="Trash2"
          iconPosition="left"
          onClick={onRevoke}
          disabled={keyData?.status === 'revoked'}
        >
          Revoke Key
        </Button>
      </div>
    </div>
  );
};

export default KeyInfoCard;