import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import PolicyFilters from './components/PolicyFilters';
import PolicyTable from './components/PolicyTable';
import CreatePolicyModal from './components/CreatePolicyModal';
import PolicyDetailsModal from './components/PolicyDetailsModal';
import ConfirmationModal from './components/ConfirmationModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PolicyManagement = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    scope: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock policy data
  const mockPolicies = [
    {
      id: 'pol_001',
      name: 'SOX Compliance Policy',
      type: 'Compliance',
      scope: 'Organization',
      status: 'active',
      enforcement: true,
      description: 'Sarbanes-Oxley compliance policy for financial key management',
      rulesCount: 12,
      affectedKeys: 247,
      lastModified: '2025-01-15T10:30:00Z',
      modifiedBy: 'admin@keyorbit.com',
      complianceScore: 98,
      template: 'sox'
    },
    {
      id: 'pol_002',
      name: 'HIPAA Healthcare Keys',
      type: 'Healthcare',
      scope: 'Department',
      status: 'active',
      enforcement: true,
      description: 'Healthcare key management policy for HIPAA compliance',
      rulesCount: 8,
      affectedKeys: 89,
      lastModified: '2025-01-12T14:20:00Z',
      modifiedBy: 'dev@keyorbit.com',
      complianceScore: 95,
      template: 'hipaa'
    },
    {
      id: 'pol_003',
      name: 'GDPR Data Protection',
      type: 'Privacy',
      scope: 'Global',
      status: 'active',
      enforcement: true,
      description: 'EU GDPR compliance policy for data protection keys',
      rulesCount: 15,
      affectedKeys: 156,
      lastModified: '2025-01-10T09:15:00Z',
      modifiedBy: 'audit@keyorbit.com',
      complianceScore: 97,
      template: 'gdpr'
    },
    {
      id: 'pol_004',
      name: 'Development Environment',
      type: 'Development',
      scope: 'Department',
      status: 'draft',
      enforcement: false,
      description: 'Key management policy for development environments',
      rulesCount: 6,
      affectedKeys: 0,
      lastModified: '2025-01-08T16:45:00Z',
      modifiedBy: 'dev@keyorbit.com',
      complianceScore: 0,
      template: 'custom'
    },
    {
      id: 'pol_005',
      name: 'Quantum-Ready Migration',
      type: 'Security',
      scope: 'Organization',
      status: 'inactive',
      enforcement: false,
      description: 'Policy for transitioning to post-quantum cryptography',
      rulesCount: 20,
      affectedKeys: 0,
      lastModified: '2025-01-05T11:00:00Z',
      modifiedBy: 'admin@keyorbit.com',
      complianceScore: 0,
      template: 'quantum'
    }
  ];

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('keyorbit_user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Load policies
    setIsLoading(true);
    setTimeout(() => {
      setPolicies(mockPolicies);
      setFilteredPolicies(mockPolicies);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  useEffect(() => {
    // Apply filters
    let filtered = policies;

    if (filters?.search) {
      filtered = filtered?.filter(policy => 
        policy?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        policy?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.type !== 'all') {
      filtered = filtered?.filter(policy => policy?.type?.toLowerCase() === filters?.type?.toLowerCase());
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(policy => policy?.status === filters?.status);
    }

    if (filters?.scope !== 'all') {
      filtered = filtered?.filter(policy => policy?.scope?.toLowerCase() === filters?.scope?.toLowerCase());
    }

    setFilteredPolicies(filtered);
  }, [policies, filters]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleCreatePolicy = () => {
    setShowCreateModal(true);
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowDetailsModal(true);
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setShowCreateModal(true);
  };

  const handleClonePolicy = (policy) => {
    const clonedPolicy = {
      ...policy,
      id: `pol_${Date.now()}`,
      name: `${policy?.name} (Copy)`,
      status: 'draft',
      enforcement: false,
      affectedKeys: 0,
      lastModified: new Date()?.toISOString(),
      modifiedBy: JSON.parse(localStorage.getItem('keyorbit_user'))?.email
    };

    setPolicies(prev => [clonedPolicy, ...prev]);
  };

  const handleToggleEnforcement = (policy) => {
    setSelectedPolicy(policy);
    setConfirmAction({
      type: 'toggleEnforcement',
      title: `${policy?.enforcement ? 'Disable' : 'Enable'} Policy Enforcement`,
      message: `Are you sure you want to ${policy?.enforcement ? 'disable' : 'enable'} enforcement for "${policy?.name}"?`,
      confirmText: policy?.enforcement ? 'Disable' : 'Enable',
      variant: policy?.enforcement ? 'destructive' : 'default'
    });
    setShowConfirmModal(true);
  };

  const handleDeletePolicy = (policy) => {
    setSelectedPolicy(policy);
    setConfirmAction({
      type: 'delete',
      title: 'Delete Policy',
      message: `Are you sure you want to delete "${policy?.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'destructive'
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction?.type === 'delete') {
      setPolicies(prev => prev?.filter(p => p?.id !== selectedPolicy?.id));
    } else if (confirmAction?.type === 'toggleEnforcement') {
      setPolicies(prev => prev?.map(p => 
        p?.id === selectedPolicy?.id 
          ? { ...p, enforcement: !p?.enforcement }
          : p
      ));
    }

    setShowConfirmModal(false);
    setSelectedPolicy(null);
    setConfirmAction(null);
  };

  const handlePolicyCreated = (newPolicy) => {
    const policy = {
      ...newPolicy,
      id: `pol_${Date.now()}`,
      lastModified: new Date()?.toISOString(),
      modifiedBy: JSON.parse(localStorage.getItem('keyorbit_user'))?.email,
      affectedKeys: 0,
      complianceScore: newPolicy?.status === 'active' ? 85 : 0
    };

    setPolicies(prev => [policy, ...prev]);
    setShowCreateModal(false);
    setSelectedPolicy(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      case 'inactive': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-orbital">
            <Icon name="Shield" size={32} className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading policy management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
        <Header onMenuToggle={handleSidebarToggle} isSidebarCollapsed={isSidebarCollapsed} />
        
        <main className="pt-16 lg:pt-16">
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <Breadcrumb />
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Policy Management
                </h1>
                <p className="text-muted-foreground">
                  Define and enforce cryptographic policies with granular control over key lifecycle and usage parameters.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleCreatePolicy}
                  className="btn-glow"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Create Policy
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Policies</p>
                    <p className="text-2xl font-bold text-foreground">{policies?.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                    <p className="text-2xl font-bold text-foreground">
                      {policies?.filter(p => p?.status === 'active')?.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-success" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Enforced Policies</p>
                    <p className="text-2xl font-bold text-foreground">
                      {policies?.filter(p => p?.enforcement)?.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Shield" size={24} className="text-accent" />
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Affected Keys</p>
                    <p className="text-2xl font-bold text-foreground">
                      {policies?.reduce((sum, p) => sum + p?.affectedKeys, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="Key" size={24} className="text-warning" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Table */}
            <div className="glass-card rounded-xl border border-border">
              <div className="p-6 border-b border-border">
                <PolicyFilters 
                  filters={filters}
                  onFiltersChange={setFilters}
                  policiesCount={filteredPolicies?.length}
                />
              </div>
              
              <PolicyTable
                policies={filteredPolicies}
                onView={handleViewPolicy}
                onEdit={handleEditPolicy}
                onClone={handleClonePolicy}
                onToggleEnforcement={handleToggleEnforcement}
                onDelete={handleDeletePolicy}
                getStatusColor={getStatusColor}
              />
            </div>

            {/* Template Library */}
            <div className="glass-card p-6 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Policy Templates</h2>
                  <p className="text-sm text-muted-foreground">
                    Pre-configured policies for common compliance frameworks
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'SOX Compliance',
                    description: 'Sarbanes-Oxley compliance template',
                    icon: 'Building',
                    color: 'bg-blue-500'
                  },
                  {
                    name: 'HIPAA Healthcare',
                    description: 'Healthcare key management template',
                    icon: 'Heart',
                    color: 'bg-red-500'
                  },
                  {
                    name: 'GDPR Privacy',
                    description: 'EU data protection template',
                    icon: 'Globe',
                    color: 'bg-green-500'
                  },
                  {
                    name: 'PCI DSS',
                    description: 'Payment card industry template',
                    icon: 'CreditCard',
                    color: 'bg-purple-500'
                  },
                  {
                    name: 'Quantum-Ready',
                    description: 'Post-quantum cryptography template',
                    icon: 'Zap',
                    color: 'bg-orange-500'
                  },
                  {
                    name: 'Custom Policy',
                    description: 'Create from scratch',
                    icon: 'Settings',
                    color: 'bg-gray-500'
                  }
                ]?.map((template, index) => (
                  <button
                    key={index}
                    onClick={handleCreatePolicy}
                    className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all duration-150 hover:scale-[1.02] group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 ${template?.color} rounded-lg flex items-center justify-center`}>
                        <Icon name={template?.icon} size={20} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-150">
                          {template?.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{template?.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreatePolicyModal
          policy={selectedPolicy}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedPolicy(null);
          }}
          onPolicyCreated={handlePolicyCreated}
        />
      )}

      {showDetailsModal && (
        <PolicyDetailsModal
          policy={selectedPolicy}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPolicy(null);
          }}
          onEdit={() => {
            setShowDetailsModal(false);
            setShowCreateModal(true);
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmationModal
          title={confirmAction?.title}
          message={confirmAction?.message}
          confirmText={confirmAction?.confirmText}
          variant={confirmAction?.variant}
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedPolicy(null);
            setConfirmAction(null);
          }}
        />
      )}
    </div>
  );
};

export default PolicyManagement;