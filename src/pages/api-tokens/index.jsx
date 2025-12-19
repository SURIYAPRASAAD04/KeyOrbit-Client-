import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import TokenTable from './components/TokenTable';
import TokenCard from './components/TokenCard';
import TokenFilters from './components/TokenFilters';
import GenerateTokenModal from './components/GenerateTokenModal';
import TokenDetailsModal from './components/TokenDetailsModal';
import TokenGeneratedModal from './components/TokenGeneratedModal';
import ConfirmationModal from './components/ConfirmationModal';
import { tokenAPI } from '../../services/api';
import { getTimezoneInfo, isTokenExpiringSoon } from '../../utils/dateUtils';

const APITokensPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [tokens, setTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    revoked: 0,
    expiringSoon: 0,
    expiredRecently: 0,
    totalApiCalls: 0,
    recentlyUsed: 0,
    successRate: 100,
    timezoneInfo: getTimezoneInfo()
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    usage: '',
    expiration: '',
    permissions: []
  });
  
  // Modal states
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isTokenGeneratedModalOpen, setIsTokenGeneratedModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  
  // Selected items
  const [selectedToken, setSelectedToken] = useState(null);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [generatedTokenValue, setGeneratedTokenValue] = useState('');
  const [confirmationAction, setConfirmationAction] = useState(null);

  // Fetch tokens on component mount
  useEffect(() => {
    fetchTokens();
    
    // Set up auto-refresh every 30 seconds to check for expired tokens
    const intervalId = setInterval(() => {
      fetchTokens(false); // Silent refresh
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Calculate statistics when tokens change
  useEffect(() => {
    calculateStats();
    applyFilters();
  }, [tokens, filters]);

  const fetchTokens = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const response = await tokenAPI.getTokens();
      const fetchedTokens = response.data.tokens || [];
      
      // Update tokens with server stats if available
      if (response.data.stats) {
        setStats(prev => ({
          ...prev,
          ...response.data.stats
        }));
      }
      
      setTokens(fetchedTokens);
      
    } catch (error) {
      console.error('Error fetching tokens:', error);
      // Fallback to empty array if API fails
      setTokens([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    let stats = {
      total: tokens.length,
      active: 0,
      expired: 0,
      revoked: 0,
      expiringSoon: 0,
      expiredRecently: 0,
      totalApiCalls: 0,
      recentlyUsed: 0,
      successRate: 100
    };
    
    tokens.forEach(token => {
      // Count by status
      const status = token?.status || 'active';
      stats[status] = (stats[status] || 0) + 1;
      
      // Count expiring soon (within 7 days)
      if (status === 'active' && token?.expiresAt) {
        try {
          const expiryDate = new Date(token.expiresAt);
          if (!isNaN(expiryDate.getTime()) && expiryDate <= sevenDaysFromNow && expiryDate > now) {
            stats.expiringSoon++;
          }
        } catch (error) {
          console.error('Error parsing expiry date:', error);
        }
      }
      
      // Count expired recently (within 30 days)
      if (status === 'expired' && token?.expiresAt) {
        try {
          const expiryDate = new Date(token.expiresAt);
          if (!isNaN(expiryDate.getTime()) && expiryDate >= thirtyDaysAgo) {
            stats.expiredRecently++;
          }
        } catch (error) {
          console.error('Error parsing expiry date:', error);
        }
      }
      
      // Count total API calls
      stats.totalApiCalls += token?.apiCalls || 0;
      
      // Count recently used (within 24 hours)
      if (token?.lastUsed) {
        try {
          const lastUsed = new Date(token.lastUsed);
          if (!isNaN(lastUsed.getTime()) && lastUsed >= oneDayAgo) {
            stats.recentlyUsed++;
          }
        } catch (error) {
          console.error('Error parsing last used date:', error);
        }
      }
    });
    
    // Calculate success rate
    if (stats.totalApiCalls > 0) {
      // Simulate success rate based on active tokens with usage
      const activeTokensWithUsage = tokens.filter(t => 
        t.status === 'active' && t.apiCalls > 0
      );
      
      if (activeTokensWithUsage.length > 0) {
        const recentTokens = activeTokensWithUsage.filter(token => {
          if (!token.lastUsed) return false;
          try {
            const lastUsed = new Date(token.lastUsed);
            const daysSinceLastUse = (now - lastUsed) / (1000 * 60 * 60 * 24);
            return daysSinceLastUse < 30;
          } catch (error) {
            return false;
          }
        });
        
        // Recent tokens: 99% success, older tokens: 95% success
        const recentSuccess = recentTokens.length * 99;
        const olderSuccess = (activeTokensWithUsage.length - recentTokens.length) * 95;
        stats.successRate = parseFloat(((recentSuccess + olderSuccess) / activeTokensWithUsage.length).toFixed(1));
      }
    }
    
    setStats(prev => ({
      ...prev,
      ...stats
    }));
  };

  const applyFilters = () => {
    let filtered = [...tokens];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(token =>
        token?.name?.toLowerCase()?.includes(searchTerm) ||
        token?.description?.toLowerCase()?.includes(searchTerm) ||
        token?.tokenPreview?.toLowerCase()?.includes(searchTerm) ||
        token?.permissions?.some(p => p.toLowerCase().includes(searchTerm))
      );
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(token => token?.status === filters?.status);
    }

    // Usage filter
    if (filters?.usage) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      filtered = filtered?.filter(token => {
        switch (filters?.usage) {
          case 'recent':
            if (!token?.lastUsed) return false;
            try {
              const lastUsed = new Date(token.lastUsed);
              return !isNaN(lastUsed.getTime()) && lastUsed > thirtyDaysAgo;
            } catch (error) {
              return false;
            }
          case 'unused':
            return !token?.lastUsed;
          case 'inactive':
            if (!token?.lastUsed) return false;
            try {
              const lastUsed = new Date(token.lastUsed);
              return !isNaN(lastUsed.getTime()) && lastUsed <= thirtyDaysAgo;
            } catch (error) {
              return false;
            }
          default:
            return true;
        }
      });
    }

    // Expiration filter
    if (filters?.expiration) {
      filtered = filtered?.filter(token => {
        switch (filters?.expiration) {
          case 'expiring':
            return token?.status === 'active' && token?.expiresAt && isTokenExpiringSoon(token.expiresAt, 7);
          case 'expired':
            return token?.status === 'expired';
          case 'never':
            return !token?.expiresAt;
          default:
            return true;
        }
      });
    }

    // Permissions filter
    if (filters?.permissions && filters?.permissions?.length > 0) {
      filtered = filtered?.filter(token =>
        filters?.permissions?.some(permission => token?.permissions?.includes(permission))
      );
    }

    setFilteredTokens(filtered);
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      usage: '',
      expiration: '',
      permissions: []
    });
  };

  const handleGenerateToken = async (tokenData) => {
    try {
      const response = await tokenAPI.createToken(tokenData);
      const { token } = response.data;
      
      setTokens(prev => [token, ...prev]);
      setGeneratedToken(token);
      setGeneratedTokenValue(token.token);
      setIsTokenGeneratedModalOpen(true);
      
      // Refresh tokens list
      fetchTokens(false);
    } catch (error) {
      console.error('Error generating token:', error);
      alert(error.response?.data?.error || 'Failed to generate token');
    }
  };

  const handleViewToken = async (token) => {
    try {
      const response = await tokenAPI.getTokenDetails(token.id);
      setSelectedToken(response.data.token);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error('Error fetching token details:', error);
      // Fallback to basic token info
      setSelectedToken(token);
      setIsDetailsModalOpen(true);
    }
  };

  const handleRegenerateToken = (token) => {
    setSelectedToken(token);
    setConfirmationAction({
      type: 'regenerate',
      title: 'Regenerate API Token',
      message: `Are you sure you want to regenerate the token "${token?.name}"? The current token will be invalidated immediately and all applications using it will need to be updated.`,
      confirmText: 'Regenerate Token',
      confirmVariant: 'warning'
    });
    setIsConfirmationModalOpen(true);
  };

  const handleRevokeToken = (token) => {
    setSelectedToken(token);
    setConfirmationAction({
      type: 'revoke',
      title: 'Revoke API Token',
      message: `Are you sure you want to revoke the token "${token?.name}"? This action cannot be undone and will immediately invalidate the token.`,
      confirmText: 'Revoke Token',
      confirmVariant: 'destructive'
    });
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedToken || !confirmationAction) return;

    try {
      switch (confirmationAction?.type) {
        case 'regenerate':
          const regenerateResponse = await tokenAPI.regenerateToken(selectedToken.id);
          const newToken = regenerateResponse.data.token;
          
          setGeneratedToken(newToken);
          setGeneratedTokenValue(newToken.token);
          setIsTokenGeneratedModalOpen(true);
          
          // Refresh tokens list
          fetchTokens(false);
          break;
          
        case 'revoke':
          await tokenAPI.revokeToken(selectedToken.id);
          
          // Update local state
          setTokens(prev => prev?.map(token => 
            token?.id === selectedToken?.id 
              ? { ...token, status: 'revoked' }
              : token
          ));
          break;
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert(error.response?.data?.error || 'Failed to perform action');
    } finally {
      setIsConfirmationModalOpen(false);
      setSelectedToken(null);
      setConfirmationAction(null);
    }
  };

  const handleRefreshTokens = () => {
    fetchTokens();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading API tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>API Tokens - KeyOrbit KMS</title>
        <meta name="description" content="Manage API tokens for programmatic access to KeyOrbit KMS. Generate, rotate, and monitor API tokens with comprehensive security controls." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={handleSidebarToggle}
        />
        
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
          <Header 
            onMenuToggle={handleSidebarToggle}
            isSidebarCollapsed={isSidebarCollapsed}
          />
          
          <main className="pt-16 lg:pt-16">
            <div className="p-6 space-y-6">
              <Breadcrumb />
              
              {/* Page Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    API Tokens
                  </h1>
                  <p className="text-muted-foreground">
                    Generate and manage programmatic access credentials for KMS integration
                    <span className="block text-xs mt-1">
                      Times displayed in {stats.timezoneInfo.timezone} ({stats.timezoneInfo.offset})
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefreshTokens}
                      disabled={refreshing}
                      iconName={refreshing ? "Loader2" : "RefreshCw"}
                      iconPosition="left"
                      iconSize={16}
                      className={refreshing ? 'animate-spin' : ''}
                    >
                      {refreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    <div className="flex items-center space-x-2 bg-muted/30 rounded-lg p-1">
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                        iconName="Table"
                        iconPosition="left"
                        iconSize={16}
                      >
                        Table
                      </Button>
                      <Button
                        variant={viewMode === 'cards' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('cards')}
                        iconName="Grid3X3"
                        iconPosition="left"
                        iconSize={16}
                      >
                        Cards
                      </Button>
                    </div>
                    <Button
                      variant="default"
                      onClick={() => setIsGenerateModalOpen(true)}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                      className="btn-glow"
                    >
                      Generate Token
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="glass-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Tokens</p>
                      <p className="text-xl font-bold text-foreground">{stats.total}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Database" size={18} className="text-primary" />
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Active</p>
                      <p className="text-xl font-bold text-success">{stats.active}</p>
                    </div>
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="CheckCircle" size={18} className="text-success" />
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Expiring Soon</p>
                      <p className="text-xl font-bold text-warning">{stats.expiringSoon}</p>
                    </div>
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Icon name="Clock" size={18} className="text-warning" />
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Expired (30d)</p>
                      <p className="text-xl font-bold text-error">{stats.expiredRecently}</p>
                    </div>
                    <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                      <Icon name="AlertTriangle" size={18} className="text-error" />
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">API Calls</p>
                      <p className="text-xl font-bold text-foreground">
                        {stats.totalApiCalls >= 1000 
                          ? (stats.totalApiCalls / 1000).toFixed(1) + 'k'
                          : stats.totalApiCalls.toLocaleString()
                        }
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon name="Activity" size={18} className="text-accent" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <TokenFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                resultCount={filteredTokens?.length}
              />

              {/* Tokens Display */}
              {filteredTokens?.length === 0 ? (
                <div className="glass-card rounded-lg border border-border p-12 text-center">
                  <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Key" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {tokens?.length === 0 ? 'No API tokens yet' : 'No tokens match your filters'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {tokens?.length === 0 
                      ? 'Generate your first API token to start integrating with KeyOrbit KMS programmatically.' 
                      : 'Try adjusting your filters to see more results.'
                    }
                  </p>
                  {tokens?.length === 0 && (
                    <Button
                      variant="default"
                      onClick={() => setIsGenerateModalOpen(true)}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Generate Your First Token
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {viewMode === 'table' ? (
                    <TokenTable
                      tokens={filteredTokens}
                      onView={handleViewToken}
                      onRegenerate={handleRegenerateToken}
                      onRevoke={handleRevokeToken}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTokens?.map((token) => (
                        <TokenCard
                          key={token?.id}
                          token={token}
                          onView={handleViewToken}
                          onRegenerate={handleRegenerateToken}
                          onRevoke={handleRevokeToken}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Quick Actions Footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Showing {filteredTokens?.length} of {tokens?.length} tokens
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsGenerateModalOpen(true)}
                        iconName="Plus"
                        iconPosition="left"
                        iconSize={14}
                      >
                        New Token
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefreshTokens}
                        disabled={refreshing}
                        iconName={refreshing ? "Loader2" : "RefreshCw"}
                        iconPosition="left"
                        iconSize={14}
                        className={refreshing ? 'animate-spin' : ''}
                      >
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <GenerateTokenModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onGenerate={handleGenerateToken}
      />
      <TokenDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        token={selectedToken}
      />
      <TokenGeneratedModal
        isOpen={isTokenGeneratedModalOpen}
        onClose={() => setIsTokenGeneratedModalOpen(false)}
        token={generatedToken}
        tokenValue={generatedTokenValue}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={confirmationAction?.title}
        message={confirmationAction?.message}
        confirmText={confirmationAction?.confirmText}
        confirmVariant={confirmationAction?.confirmVariant}
        icon={confirmationAction?.type === 'regenerate' ? 'RefreshCw' : 'AlertTriangle'}
        iconColor={confirmationAction?.type === 'regenerate' ? 'text-warning' : 'text-error'}
      />
    </>
  );
};

export default APITokensPage;