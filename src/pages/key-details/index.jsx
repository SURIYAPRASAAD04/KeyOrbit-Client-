import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import KeyInfoCard from './components/KeyInfoCard';
import SecurityInfoPanel from './components/SecurityInfoPanel';
import ActivityTimeline from './components/ActivityTimeline';
import TechnicalDetails from './components/TechnicalDetails';
import RelatedKeysPanel from './components/RelatedKeysPanel';
import QRCodeGenerator from './components/QRCodeGenerator';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const KeyDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const keyId = searchParams?.get('id') || 'key_aes256_prod_001';

  // Mock key data
  const keyData = {
    keyId: 'key_aes256_prod_001',
    name: 'Production Database Encryption Key',
    algorithm: 'AES-256',
    keyLength: 256,
    status: 'Active',
    createdAt: 'December 15, 2024 at 2:30 PM',
    expiresAt: 'December 15, 2025 at 2:30 PM',
    createdBy: 'Sarah Chen (Security Engineer)',
    usageCount: 45672,
    publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...',
    fingerprint: 'SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8'
  };

  const securityData = {
    dailyUsage: 1247,
    monthlyUsage: 38542,
    permissions: [
      { user: 'Sarah Chen', role: 'Admin' },
      { user: 'Database Service', role: 'Read' },
      { user: 'Backup Service', role: 'Read' },
      { user: 'Analytics Team', role: 'Read' }
    ],
    policies: [
      { name: 'Production Key Policy', compliance: 'Compliant' },
      { name: 'GDPR Compliance Policy', compliance: 'Compliant' },
      { name: 'SOX Audit Policy', compliance: 'Warning' }
    ],
    ipWhitelist: [
      { address: '10.0.1.0/24', description: 'Production Network' },
      { address: '10.0.2.15', description: 'Database Server' },
      { address: '10.0.3.0/24', description: 'Backup Network' }
    ]
  };

  const activities = [
    {
      id: 1,
      type: 'generated',
      title: 'Key Generated',
      description: 'AES-256 encryption key created for production database',
      timestamp: 'December 15, 2024 at 2:30 PM',
      user: 'Sarah Chen',
      ipAddress: '192.168.1.100',
      details: `Key Generation Parameters:\n- Algorithm: AES-256-GCM\n- Key Length: 256 bits\n- Entropy Source: Hardware RNG\n- Compliance: FIPS 140-2 Level 3`
    },
    {
      id: 2,
      type: 'policy_updated',
      title: 'Policy Applied',
      description: 'Production Key Policy attached to key',
      timestamp: 'December 15, 2024 at 2:35 PM',
      user: 'Sarah Chen',
      ipAddress: '192.168.1.100',
      details: `Policy Details:\n- Max Usage: 100,000 operations\n- Rotation Period: 365 days\n- Access Control: Role-based\n- Audit Level: Full`
    },
    {
      id: 3,
      type: 'accessed',
      title: 'Key Access',
      description: 'Database service accessed key for encryption operation',
      timestamp: 'December 19, 2024 at 10:15 AM',
      user: 'db-service-prod',
      ipAddress: '10.0.2.15'
    },
    {
      id: 4,
      type: 'accessed',
      title: 'Key Access',
      description: 'Backup service accessed key for data backup',
      timestamp: 'December 19, 2024 at 3:00 AM',
      user: 'backup-service',
      ipAddress: '10.0.3.10'
    },
    {
      id: 5,
      type: 'exported',
      title: 'Public Key Exported',
      description: 'Public key exported for client verification',
      timestamp: 'December 18, 2024 at 4:20 PM',
      user: 'Mike Johnson',
      ipAddress: '192.168.1.105',
      details: `Export Details:\n- Format: PEM\n- Purpose: Client verification\n- Exported by: DevOps Team\n- Download count: 1`
    }
  ];

  const technicalData = {
    keyFormat: 'PKCS#8',
    keySize: 32,
    encoding: 'Base64',
    hashAlgorithm: 'SHA-256',
    signatureAlgorithm: 'HMAC-SHA256',
    keyUsage: ['Encryption', 'Decryption', 'Key Wrapping'],
    fingerprint: 'SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8',
    algorithmParams: {
      'Block Size': '128 bits',
      'Key Schedule': 'AES Key Expansion',
      'Mode': 'GCM (Galois/Counter Mode)',
      'IV Length': '96 bits',
      'Tag Length': '128 bits'
    },
    publicKeyPem: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4f5wg5l2hKsTeNem/V41
fGnJm6gOdrj8ym3rFkEjWT2btf02uBMnBjUakLvn2bNVRUz2C0gQn2lYuYB4xzK0
V1avnHHpqJ0zVykjofmFXjO8Yl5Sh5L6JMnUzSgjmC3h5irQmHRjOfHRVYmcXqyD
5sVXYKGsHmk+Vhz4bK0/v7FRNz9YQ62YDpNBjjn1aC/+R9lqEcC1JllyxVLvjWmP
DGFvuMbmtFohEdgITMhDcpJBfqiJ7behs2OP9S5yD3WqSAHEEpHWtJN8aCJLuMGH
86aWWp7gjM1Fw1MF9nqBG9SL52upwFkdbkNNG08EzFNB9bQS2WfVQr4HdqtBmhRz
jQIDAQAB
-----END PUBLIC KEY-----`,
    quantumResistant: false
  };

  const relatedKeys = [
    {
      id: 'key_aes256_prod_000',
      name: 'Production Database Encryption Key (Previous)',
      keyId: 'key_aes256_prod_000',
      algorithm: 'AES-256',
      status: 'Revoked',
      relationship: 'Predecessor',
      createdAt: 'November 15, 2023',
      rotationDate: 'December 15, 2024'
    },
    {
      id: 'key_aes256_backup_001',
      name: 'Backup Encryption Key',
      keyId: 'key_aes256_backup_001',
      algorithm: 'AES-256',
      status: 'Active',
      relationship: 'Backup',
      createdAt: 'December 15, 2024'
    },
    {
      id: 'key_derived_001',
      name: 'Derived Application Key',
      keyId: 'key_derived_001',
      algorithm: 'AES-256',
      status: 'Active',
      relationship: 'Derived',
      createdAt: 'December 16, 2024'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'activity', label: 'Activity', icon: 'Clock' },
    { id: 'technical', label: 'Technical', icon: 'Code' },
    { id: 'related', label: 'Related Keys', icon: 'GitBranch' },
    { id: 'qr-code', label: 'QR Code', icon: 'QrCode' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [keyId]);

  const handleRotateKey = () => {
    console.log('Rotating key:', keyId);
    // Implement key rotation logic
  };

  const handleRevokeKey = () => {
    console.log('Revoking key:', keyId);
    // Implement key revocation logic
  };

  const handleExportPublicKey = () => {
    console.log('Exporting public key:', keyId);
    // Implement public key export logic
  };

  const handleViewRelatedKey = (relatedKeyId) => {
    navigate(`/key-details?id=${relatedKeyId}`);
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Key Management', path: '/key-management' },
    { label: keyData?.name, path: `/key-details?id=${keyId}` }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed} 
        />
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        <main className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
        } pt-16 lg:pt-16`}>
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading key details...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed} 
      />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      } pt-16 lg:pt-16`}>
        <div className="p-6">
          <Breadcrumb customItems={breadcrumbItems} />
          
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Key Details</h1>
              <p className="text-muted-foreground">
                Comprehensive information and management for cryptographic key
              </p>
            </div>
            <Button
              variant="outline"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate('/key-management')}
            >
              Back to Keys
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-150 ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <KeyInfoCard
                    keyData={keyData}
                    onRotate={handleRotateKey}
                    onRevoke={handleRevokeKey}
                    onExportPublicKey={handleExportPublicKey}
                  />
                </div>
                <div>
                  <SecurityInfoPanel securityData={securityData} />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-4xl">
                <SecurityInfoPanel securityData={securityData} />
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="max-w-4xl">
                <ActivityTimeline activities={activities} />
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="max-w-4xl">
                <TechnicalDetails technicalData={technicalData} />
              </div>
            )}

            {activeTab === 'related' && (
              <div className="max-w-4xl">
                <RelatedKeysPanel
                  relatedKeys={relatedKeys}
                  onViewKey={handleViewRelatedKey}
                />
              </div>
            )}

            {activeTab === 'qr-code' && (
              <div className="max-w-md">
                <QRCodeGenerator keyData={keyData} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default KeyDetailsPage;