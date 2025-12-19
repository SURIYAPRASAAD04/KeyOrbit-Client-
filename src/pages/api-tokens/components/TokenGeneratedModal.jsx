import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { formatUTCDate } from '../../../utils/dateUtils';

const TokenGeneratedModal = ({ isOpen, onClose, token, tokenValue }) => {
  const [copied, setCopied] = useState(false);
  const [showFullToken, setShowFullToken] = useState(false);

  if (!isOpen || !token || !tokenValue) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(tokenValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const tokenInfo = {
      name: token?.name,
      token: tokenValue,
      permissions: token?.permissions,
      createdAt: new Date().toISOString(),
      expiresAt: token?.expiresAt || null,
      ipRestrictions: token?.ipRestrictions || [],
      rateLimit: token?.rateLimit || 1000,
      description: token?.description || ''
    };

    const blob = new Blob([JSON.stringify(tokenInfo, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyorbit-token-${token?.name?.toLowerCase()?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTokenDisplay = () => {
    if (showFullToken) {
      return tokenValue;
    }
    // Show first and last 20 characters
    const firstPart = tokenValue.substring(0, 20);
    const lastPart = tokenValue.substring(tokenValue.length - 20);
    return `${firstPart}...${lastPart}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
      <div className="glass-card rounded-lg border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Token Generated Successfully!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your API token has been created. Make sure to copy it now as you won't be able to see it again.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Token Display */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                API Token
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullToken(!showFullToken)}
                  iconName={showFullToken ? "EyeOff" : "Eye"}
                  iconPosition="left"
                  iconSize={14}
                >
                  {showFullToken ? 'Hide' : 'Show Full'}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="p-4 bg-muted/30 border border-border rounded-lg font-mono text-sm text-foreground break-all max-h-48 overflow-y-auto">
                {formatTokenDisplay()}
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  iconName={copied ? "Check" : "Copy"}
                  iconPosition="left"
                  iconSize={14}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>

          {/* Token Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Token Name
              </label>
              <p className="text-sm text-foreground font-medium">{token?.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Created
              </label>
              <p className="text-sm text-foreground">
                {formatUTCDate(new Date().toISOString(), {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Permissions
              </label>
              <div className="flex flex-wrap gap-1">
                {token?.permissions?.slice(0, 3)?.map((permission, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-primary/10 text-primary"
                  >
                    {permission}
                  </span>
                ))}
                {token?.permissions?.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted/50 text-muted-foreground">
                    +{token?.permissions?.length - 3}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Expires
              </label>
              <p className="text-sm text-foreground">
                {token?.expiresAt 
                  ? formatUTCDate(token.expiresAt, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Never expires'
                }
              </p>
            </div>
            {token?.description && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Description
                </label>
                <p className="text-sm text-foreground">{token?.description}</p>
              </div>
            )}
            {token?.ipRestrictions && token?.ipRestrictions?.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  IP Restrictions
                </label>
                <div className="flex flex-wrap gap-1">
                  {token?.ipRestrictions?.map((ip, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-secondary/10 text-secondary"
                    >
                      {ip}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Important Security Notice</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• This token will <strong className="text-error">NOT</strong> be shown again after you close this dialog</li>
                  <li>• Store it securely in your password manager or environment variables</li>
                  <li>• Never commit tokens to version control systems (like GitHub)</li>
                  <li>• Rotate tokens regularly (every 90 days recommended)</li>
                  <li>• Consider setting an expiration date for enhanced security</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Quick Start Example</h4>
            <div className="p-4 bg-muted/30 border border-border rounded-lg">
              <pre className="text-xs font-mono text-foreground overflow-x-auto">
{`curl -X GET "https://api.keyorbit.com/v1/keys" \\
  -H "Authorization: Bearer ${tokenValue.substring(0, 30)}..." \\
  -H "Content-Type: application/json"`}
              </pre>
              <div className="mt-2 text-xs text-muted-foreground">
                Replace <code className="px-1 bg-muted/50 rounded">${tokenValue.substring(0, 30)}...</code> with your full token
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-border gap-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="AlertCircle" size={16} />
            <span>Make sure to save this token securely</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleDownload}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
              className="w-full sm:w-auto"
            >
              Download Token Info
            </Button>
            <div className="flex space-x-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleCopy}
                iconName={copied ? "Check" : "Copy"}
                iconPosition="left"
                iconSize={16}
                className="flex-1 sm:flex-none"
              >
                {copied ? 'Copied!' : 'Copy Token'}
              </Button>
              <Button 
                variant="default" 
                onClick={onClose}
                className="flex-1 sm:flex-none"
              >
                I've Saved the Token
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenGeneratedModal;