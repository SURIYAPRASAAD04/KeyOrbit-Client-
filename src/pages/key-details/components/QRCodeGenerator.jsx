import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QRCodeGenerator = ({ keyData }) => {
  const [qrType, setQrType] = useState('public-key');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);

  const qrTypes = [
    { value: 'public-key', label: 'Public Key', description: 'Share public key for verification' },
    { value: 'key-info', label: 'Key Information', description: 'Basic key metadata' },
    { value: 'verification', label: 'Verification URL', description: 'Link to verify key authenticity' }
  ];

  const generateQRCode = async () => {
    setIsGenerating(true);
    
    // Simulate QR code generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let data;
    switch (qrType) {
      case 'public-key':
        data = {
          type: 'public-key',
          keyId: keyData?.keyId,
          algorithm: keyData?.algorithm,
          publicKey: keyData?.publicKey || 'PUBLIC_KEY_DATA_HERE',
          fingerprint: keyData?.fingerprint
        };
        break;
      case 'key-info':
        data = {
          type: 'key-info',
          keyId: keyData?.keyId,
          name: keyData?.name,
          algorithm: keyData?.algorithm,
          status: keyData?.status,
          createdAt: keyData?.createdAt
        };
        break;
      case 'verification':
        data = {
          type: 'verification',
          url: `https://keyorbit.company.com/verify/${keyData?.keyId}`,
          keyId: keyData?.keyId,
          fingerprint: keyData?.fingerprint
        };
        break;
      default:
        data = { keyId: keyData?.keyId };
    }
    
    // Mock QR code SVG - in real implementation, use a QR code library
    const qrCodeSvg = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="20" height="20" fill="black"/>
      <rect x="60" y="20" width="20" height="20" fill="black"/>
      <rect x="100" y="20" width="20" height="20" fill="black"/>
      <rect x="140" y="20" width="20" height="20" fill="black"/>
      <rect x="20" y="60" width="20" height="20" fill="black"/>
      <rect x="100" y="60" width="20" height="20" fill="black"/>
      <rect x="180" y="60" width="20" height="20" fill="black"/>
      <rect x="20" y="100" width="20" height="20" fill="black"/>
      <rect x="60" y="100" width="20" height="20" fill="black"/>
      <rect x="140" y="100" width="20" height="20" fill="black"/>
      <rect x="180" y="100" width="20" height="20" fill="black"/>
      <rect x="60" y="140" width="20" height="20" fill="black"/>
      <rect x="100" y="140" width="20" height="20" fill="black"/>
      <rect x="140" y="140" width="20" height="20" fill="black"/>
      <rect x="20" y="180" width="20" height="20" fill="black"/>
      <rect x="100" y="180" width="20" height="20" fill="black"/>
      <rect x="180" y="180" width="20" height="20" fill="black"/>
      <text x="100" y="195" text-anchor="middle" font-size="8" fill="gray">KeyOrbit QR</text>
    </svg>`;
    
    setQrCodeData({
      svg: qrCodeSvg,
      data: JSON.stringify(data, null, 2),
      type: qrType
    });
    
    setIsGenerating(false);
  };

  const downloadQRCode = () => {
    if (!qrCodeData) return;
    
    const blob = new Blob([qrCodeData.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyorbit-${keyData?.keyId}-${qrType}.svg`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyQRData = async () => {
    if (!qrCodeData) return;
    
    try {
      await navigator.clipboard?.writeText(qrCodeData?.data);
    } catch (err) {
      console.error('Failed to copy QR data: ', err);
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="QrCode" size={20} className="text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">QR Code Generator</h3>
      </div>
      <div className="space-y-4">
        {/* QR Type Selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">QR Code Type</label>
          <div className="space-y-2">
            {qrTypes?.map((type) => (
              <label key={type?.value} className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="qrType"
                  value={type?.value}
                  checked={qrType === type?.value}
                  onChange={(e) => setQrType(e?.target?.value)}
                  className="mt-1 text-primary focus:ring-primary/20"
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{type?.label}</div>
                  <div className="text-xs text-muted-foreground">{type?.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          variant="default"
          iconName="QrCode"
          iconPosition="left"
          loading={isGenerating}
          onClick={generateQRCode}
          fullWidth
        >
          {isGenerating ? 'Generating QR Code...' : 'Generate QR Code'}
        </Button>

        {/* QR Code Display */}
        {qrCodeData && (
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white rounded-lg border border-border">
              <div dangerouslySetInnerHTML={{ __html: qrCodeData?.svg }} />
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={downloadQRCode}
                className="flex-1"
              >
                Download SVG
              </Button>
              <Button
                variant="outline"
                iconName="Copy"
                iconPosition="left"
                onClick={copyQRData}
                className="flex-1"
              >
                Copy Data
              </Button>
            </div>
            
            {/* QR Data Preview */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">QR Code Data</label>
              <div className="mt-2 p-3 bg-muted/20 rounded-lg max-h-32 overflow-y-auto custom-scrollbar">
                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                  {qrCodeData?.data}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="p-4 bg-muted/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Mobile Integration</p>
              <p>
                Scan the QR code with the KeyOrbit mobile app or any QR scanner to quickly access key information 
                and verification details on mobile devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;