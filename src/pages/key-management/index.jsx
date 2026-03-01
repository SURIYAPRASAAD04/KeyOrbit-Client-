import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { useAuth } from '../../hooks/useAuth';
import { keyAPI } from '../../services/api';

const KeyManagement = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [keys, setKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    revoked: 0,
    kem_keys: 0,
    signature_keys: 0,
    hybrid_keys: 0,
    expiringSoon: 0
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    algorithm: '',
    status: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  });

  // Fetch keys
  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.algorithm) params.algorithm = filters.algorithm;
      
      const response = await keyAPI.getKeys(params);
      setKeys(response.data.keys || []);
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch keys:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.type, filters.algorithm]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await keyAPI.getKeyStats();
      setStats(response.data.stats || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchKeys();
    fetchStats();
  }, [fetchKeys, fetchStats]);

  // Filter keys based on current filters
  const filteredKeys = useMemo(() => {
    return keys?.filter(key => {
      const matchesSearch = !filters?.search || 
        key?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        key?.keyId?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        key?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase());

      const matchesAlgorithm = !filters?.algorithm || 
        key?.algorithm?.toLowerCase()?.includes(filters?.algorithm?.toLowerCase());

      const matchesStatus = !filters?.status || key?.status === filters?.status;

      const matchesType = !filters?.type || key?.type === filters?.type;

      const matchesDateFrom = !filters?.dateFrom || 
        new Date(key.createdAt) >= new Date(filters.dateFrom);

      const matchesDateTo = !filters?.dateTo || 
        new Date(key.createdAt) <= new Date(filters.dateTo);

      return matchesSearch && matchesAlgorithm && matchesStatus && 
             matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [keys, filters]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleKeyGeneration = (newKey) => {
    fetchKeys();
    fetchStats();
    setIsGenerationModalOpen(false);
  };

  const handleKeyAction = (action, keyId) => {
    console.log('Key action:', action, keyId);
  };

  const handleBulkAction = (action, keyIds) => {
    console.log('Bulk action:', action, keyIds);
  };

  const handleDownloadKey = async (keyId) => {
    try {
      const response = await keyAPI.downloadPublicKey(keyId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `public_key_${keyId}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
    }
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Post-Quantum Key Management</h1>
                <p className="text-muted-foreground">
                  Generate and manage post-quantum cryptographic keys with ML-KEM and ML-DSA algorithms
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={fetchKeys}
                  loading={isLoading}
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
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
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
                    <p className="text-2xl font-bold text-success">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-success" />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">KEM / Signature</p>
                    <p className="text-2xl font-bold text-accent">
                      {stats.kem_keys} / {stats.signature_keys}
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
                    <p className="text-2xl font-bold text-warning">{stats.expiringSoon || 0}</p>
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
                onKeysUpdate={fetchKeys}
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
        onKeysUpdate={fetchKeys}
      />

      {/* Key Generation Modal */}
      <KeyGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleKeyGeneration}
      />
    </div>
  );
};

export default KeyManagement;