import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import KeyGenerationModal from './components/KeyGenerationModal';
import KeyFilters from './components/KeyFilters';
import KeyTable from './components/KeyTable';
import BulkActionsBar from './components/BulkActionsBar';
import ConfirmationModal from './components/ConfirmationModal';

const KeyManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, type: '', data: null });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for cryptographic keys
  const [keys, setKeys] = useState([
    {
      id: "key_aes_001",
      name: "Production Database Encryption",
      algorithm: "AES-256",
      status: "active",
      purpose: "encryption",
      keySize: "256",
      createdAt: new Date("2024-01-15T10:30:00Z"),
      expiresAt: new Date("2025-01-15T10:30:00Z"),
      description: "Primary encryption key for customer database"
    },
    {
      id: "key_rsa_002",
      name: "API Authentication Key",
      algorithm: "RSA-2048",
      status: "active",
      purpose: "signing",
      keySize: "2048",
      createdAt: new Date("2024-02-20T14:15:00Z"),
      expiresAt: new Date("2025-02-20T14:15:00Z"),
      description: "JWT signing key for API authentication"
    },
    {
      id: "key_kyber_003",
      name: "Post-Quantum Secure Channel",
      algorithm: "Kyber-768",
      status: "active",
      purpose: "key-exchange",
      keySize: "768",
      createdAt: new Date("2024-03-10T09:45:00Z"),
      expiresAt: new Date("2025-03-10T09:45:00Z"),
      description: "Quantum-resistant key exchange for secure communications"
    },
    {
      id: "key_dilithium_004",
      name: "Document Signing Authority",
      algorithm: "Dilithium-3",
      status: "active",
      purpose: "signing",
      keySize: "3",
      createdAt: new Date("2024-04-05T16:20:00Z"),
      expiresAt: new Date("2025-04-05T16:20:00Z"),
      description: "Post-quantum digital signatures for legal documents"
    },
    {
      id: "key_aes_005",
      name: "Legacy File Encryption",
      algorithm: "AES-256",
      status: "expired",
      purpose: "encryption",
      keySize: "256",
      createdAt: new Date("2023-06-01T12:00:00Z"),
      expiresAt: new Date("2024-06-01T12:00:00Z"),
      description: "Expired key for legacy file system encryption"
    },
    {
      id: "key_rsa_006",
      name: "Code Signing Certificate",
      algorithm: "RSA-4096",
      status: "revoked",
      purpose: "signing",
      keySize: "4096",
      createdAt: new Date("2024-01-10T08:30:00Z"),
      expiresAt: new Date("2025-01-10T08:30:00Z"),
      description: "Revoked due to security incident - replaced with new key"
    },
    {
      id: "key_kyber_007",
      name: "Backup Encryption Key",
      algorithm: "Kyber-512",
      status: "pending",
      purpose: "encryption",
      keySize: "512",
      createdAt: new Date("2024-09-15T11:00:00Z"),
      expiresAt: new Date("2025-09-15T11:00:00Z"),
      description: "Pending activation for automated backup encryption"
    }
  ]);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    algorithm: '',
    status: '',
    purpose: '',
    dateFrom: '',
    dateTo: ''
  });

  // Filter keys based on current filters
  const filteredKeys = useMemo(() => {
    return keys?.filter(key => {
      const matchesSearch = !filters?.search || 
        key?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        key?.id?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        key?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase());

      const matchesAlgorithm = !filters?.algorithm || 
        key?.algorithm?.toLowerCase()?.includes(filters?.algorithm?.toLowerCase());

      const matchesStatus = !filters?.status || key?.status === filters?.status;

      const matchesPurpose = !filters?.purpose || key?.purpose === filters?.purpose;

      const matchesDateFrom = !filters?.dateFrom || 
        new Date(key.createdAt) >= new Date(filters.dateFrom);

      const matchesDateTo = !filters?.dateTo || 
        new Date(key.createdAt) <= new Date(filters.dateTo);

      return matchesSearch && matchesAlgorithm && matchesStatus && 
             matchesPurpose && matchesDateFrom && matchesDateTo;
    });
  }, [keys, filters]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleKeyGeneration = (newKey) => {
    setKeys(prevKeys => [newKey, ...prevKeys]);
    setIsGenerationModalOpen(false);
  };

  const handleKeyAction = (action, keyId) => {
    const key = keys?.find(k => k?.id === keyId);
    
    switch (action) {
      case 'rotate':
        setConfirmationModal({
          isOpen: true,
          type: 'warning',
          data: { action, keyId },
          title: 'Rotate Key',
          message: `Are you sure you want to rotate "${key?.name}"? This will generate a new version and mark the current one as rotated.`
        });
        break;
      case 'revoke':
        setConfirmationModal({
          isOpen: true,
          type: 'danger',
          data: { action, keyId },
          title: 'Revoke Key',
          message: `Are you sure you want to revoke "${key?.name}"? This action cannot be undone and will immediately invalidate the key.`
        });
        break;
      case 'download':
        handleDownloadKey(keyId);
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action, keyIds) => {
    const keyCount = keyIds?.length;
    
    switch (action) {
      case 'rotate':
        setConfirmationModal({
          isOpen: true,
          type: 'warning',
          data: { action, keyIds },
          title: 'Rotate Keys',
          message: `Are you sure you want to rotate ${keyCount} key${keyCount !== 1 ? 's' : ''}? This will generate new versions for all selected keys.`
        });
        break;
      case 'revoke':
        setConfirmationModal({
          isOpen: true,
          type: 'danger',
          data: { action, keyIds },
          title: 'Revoke Keys',
          message: `Are you sure you want to revoke ${keyCount} key${keyCount !== 1 ? 's' : ''}? This action cannot be undone.`
        });
        break;
      case 'export':
        handleExportKeys(keyIds);
        break;
      default:
        break;
    }
  };

  const handleConfirmAction = async () => {
    setIsLoading(true);
    const { action, keyId, keyIds } = confirmationModal?.data;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (keyIds) {
        // Bulk action
        switch (action) {
          case 'rotate':
            setKeys(prevKeys => 
              prevKeys?.map(key => 
                keyIds?.includes(key?.id) 
                  ? { ...key, status: 'rotated', rotatedAt: new Date() }
                  : key
              )
            );
            break;
          case 'revoke':
            setKeys(prevKeys => 
              prevKeys?.map(key => 
                keyIds?.includes(key?.id) 
                  ? { ...key, status: 'revoked', revokedAt: new Date() }
                  : key
              )
            );
            break;
        }
        setSelectedKeys([]);
      } else {
        // Single key action
        switch (action) {
          case 'rotate':
            setKeys(prevKeys => 
              prevKeys?.map(key => 
                key?.id === keyId 
                  ? { ...key, status: 'rotated', rotatedAt: new Date() }
                  : key
              )
            );
            break;
          case 'revoke':
            setKeys(prevKeys => 
              prevKeys?.map(key => 
                key?.id === keyId 
                  ? { ...key, status: 'revoked', revokedAt: new Date() }
                  : key
              )
            );
            break;
        }
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
      setConfirmationModal({ isOpen: false, type: '', data: null });
    }
  };

  const handleDownloadKey = (keyId) => {
    const key = keys?.find(k => k?.id === keyId);
    if (key) {
      // Simulate key download
      const blob = new Blob([`Public Key for ${key.name}\nKey ID: ${key.id}\nAlgorithm: ${key.algorithm}`], 
        { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key?.name?.replace(/\s+/g, '_')}_public_key.txt`;
      document.body?.appendChild(a);
      a?.click();
      document.body?.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportKeys = (keyIds) => {
    const selectedKeyData = keys?.filter(key => keyIds?.includes(key?.id));
    const exportData = selectedKeyData?.map(key => ({
      id: key?.id,
      name: key?.name,
      algorithm: key?.algorithm,
      status: key?.status,
      createdAt: key?.createdAt,
      expiresAt: key?.expiresAt
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported_keys_${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSelectedKeys([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
        <Header onMenuToggle={handleSidebarToggle} isSidebarCollapsed={isSidebarCollapsed} />
        
        <main className="pt-16 lg:pt-16">
          <div className="p-6 lg:p-8">
            <Breadcrumb />
            
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Key Management</h1>
                <p className="text-muted-foreground">
                  Manage cryptographic keys with support for classical and post-quantum algorithms
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={() => window.location?.reload()}
                >
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Refresh
                </Button>
                
                <Button
                  onClick={() => setIsGenerationModalOpen(true)}
                  className="btn-glow"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Generate New Key
                </Button>
              </div>
            </motion.div>

            {/* Key Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <div className="glass-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Keys</p>
                    <p className="text-2xl font-bold text-foreground">{keys?.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Key" size={24} className="text-primary" />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Keys</p>
                    <p className="text-2xl font-bold text-success">
                      {keys?.filter(k => k?.status === 'active')?.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-success" />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Post-Quantum</p>
                    <p className="text-2xl font-bold text-accent">
                      {keys?.filter(k => k?.algorithm?.toLowerCase()?.includes('kyber') || k?.algorithm?.toLowerCase()?.includes('dilithium'))?.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Shield" size={24} className="text-accent" />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Expiring Soon</p>
                    <p className="text-2xl font-bold text-warning">
                      {keys?.filter(k => {
                        const daysUntilExpiration = Math.ceil((new Date(k.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
                        return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
                      })?.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="AlertTriangle" size={24} className="text-warning" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <KeyFilters
                filters={filters}
                onFiltersChange={setFilters}
                totalKeys={keys?.length}
                filteredKeys={filteredKeys?.length}
              />
            </motion.div>

            {/* Key Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <KeyTable
                keys={filteredKeys}
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                onKeyAction={handleKeyAction}
              />
            </motion.div>
          </div>
        </main>
      </div>
      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedKeys={selectedKeys}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedKeys([])}
      />
      {/* Key Generation Modal */}
      <KeyGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleKeyGeneration}
      />
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal?.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, type: '', data: null })}
        onConfirm={handleConfirmAction}
        title={confirmationModal?.title}
        message={confirmationModal?.message}
        type={confirmationModal?.type}
        loading={isLoading}
      />
    </div>
  );
};

export default KeyManagement;