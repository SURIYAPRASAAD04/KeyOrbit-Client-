import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LogFilters from './components/LogFilters';
import LogTable from './components/LogTable';
import ActivityChart from './components/ActivityChart';
import ComplianceReports from './components/ComplianceReports';
import RealTimeStream from './components/RealTimeStream';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AuditLogs = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    eventType: 'all',
    user: 'all',
    outcome: 'all',
    ipAddress: '',
    resourceId: '',
    resultCount: 1247
  });
  const [expandedRows, setExpandedRows] = useState([]);
  const [chartType, setChartType] = useState('activity');
  const [isStreaming, setIsStreaming] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Mock audit log data
  const auditLogs = [
    {
      id: 'log_001',
      timestamp: '2025-01-19T16:45:23.074Z',
      eventType: 'key_generation',
      user: 'john.doe@company.com',
      action: 'Generated new AES-256 encryption key',
      resourceId: 'key_aes256_prod_001',
      ipAddress: '192.168.1.100',
      outcome: 'success',
      sessionId: 'sess_abc123def456',
      requestId: 'req_789xyz012',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      duration: 245,
      responseCode: 200,
      details: {
        keyType: 'AES-256',
        keyUsage: 'encryption',
        expirationDate: '2026-01-19T16:45:23.074Z',
        algorithm: 'AES-GCM',
        keySize: 256
      }
    },
    {
      id: 'log_002',
      timestamp: '2025-01-19T16:42:15.123Z',
      eventType: 'key_rotation',
      user: 'sarah.wilson@company.com',
      action: 'Rotated RSA-2048 signing key',
      resourceId: 'key_rsa2048_sign_005',
      ipAddress: '192.168.1.105',
      outcome: 'success',
      sessionId: 'sess_def456ghi789',
      requestId: 'req_345abc678',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      duration: 1850,
      responseCode: 200,
      details: {
        oldKeyId: 'key_rsa2048_sign_004',
        newKeyId: 'key_rsa2048_sign_005',
        rotationReason: 'scheduled_rotation',
        gracePeriod: '7_days'
      }
    },
    {
      id: 'log_003',
      timestamp: '2025-01-19T16:38:42.567Z',
      eventType: 'access_denied',
      user: 'mike.chen@company.com',
      action: 'Attempted to access revoked key',
      resourceId: 'key_aes256_dev_003',
      ipAddress: '192.168.1.110',
      outcome: 'failure',
      sessionId: 'sess_ghi789jkl012',
      requestId: 'req_901def234',
      userAgent: 'curl/7.68.0',
      duration: 15,
      responseCode: 403,
      details: {
        reason: 'key_revoked',
        revokedAt: '2025-01-18T10:30:00.000Z',
        accessAttemptType: 'api_call',
        endpoint: '/api/v1/keys/decrypt'
      }
    },
    {
      id: 'log_004',
      timestamp: '2025-01-19T16:35:18.890Z',
      eventType: 'user_login',
      user: 'admin@company.com',
      action: 'Administrator login successful',
      resourceId: 'user_admin_001',
      ipAddress: '192.168.1.50',
      outcome: 'success',
      sessionId: 'sess_jkl012mno345',
      requestId: 'req_567ghi890',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      duration: 320,
      responseCode: 200,
      details: {
        authMethod: 'password_mfa',
        mfaType: 'totp',
        loginLocation: 'New York, NY',
        deviceFingerprint: 'fp_abc123def456'
      }
    },
    {
      id: 'log_005',
      timestamp: '2025-01-19T16:30:05.234Z',
      eventType: 'policy_change',
      user: 'system',
      action: 'Updated key rotation policy',
      resourceId: 'policy_rotation_001',
      ipAddress: '127.0.0.1',
      outcome: 'success',
      sessionId: 'sess_system_001',
      requestId: 'req_policy_update_001',
      userAgent: 'KeyOrbit-System/1.0',
      duration: 125,
      responseCode: 200,
      details: {
        policyType: 'key_rotation',
        changes: {
          rotationInterval: '90_days',
          gracePeriod: '7_days',
          autoRotation: true
        },
        previousValues: {
          rotationInterval: '180_days',
          gracePeriod: '14_days',
          autoRotation: false
        }
      }
    },
    {
      id: 'log_006',
      timestamp: '2025-01-19T16:25:33.456Z',
      eventType: 'key_revocation',
      user: 'security@company.com',
      action: 'Emergency revocation of compromised key',
      resourceId: 'key_rsa4096_prod_002',
      ipAddress: '192.168.1.75',
      outcome: 'success',
      sessionId: 'sess_security_001',
      requestId: 'req_emergency_001',
      userAgent: 'Mozilla/5.0 (Linux; Ubuntu 20.04) AppleWebKit/537.36',
      duration: 95,
      responseCode: 200,
      details: {
        revocationReason: 'key_compromise',
        incidentId: 'inc_2025_001',
        notificationsSent: 15,
        affectedServices: ['payment_api', 'user_auth', 'data_encryption']
      }
    },
    {
      id: 'log_007',
      timestamp: '2025-01-19T16:20:12.789Z',
      eventType: 'api_access',
      user: 'service_account_001',
      action: 'API key used for bulk encryption',
      resourceId: 'api_token_bulk_001',
      ipAddress: '10.0.1.25',
      outcome: 'success',
      sessionId: 'sess_api_001',
      requestId: 'req_bulk_encrypt_001',
      userAgent: 'KeyOrbit-SDK-Python/2.1.0',
      duration: 2340,
      responseCode: 200,
      details: {
        operationType: 'bulk_encrypt',
        recordsProcessed: 10000,
        dataSize: '2.5GB',
        encryptionAlgorithm: 'AES-256-GCM'
      }
    },
    {
      id: 'log_008',
      timestamp: '2025-01-19T16:15:47.012Z',
      eventType: 'user_logout',
      user: 'jane.smith@company.com',
      action: 'User session terminated',
      resourceId: 'user_jane_001',
      ipAddress: '192.168.1.120',
      outcome: 'success',
      sessionId: 'sess_jane_001',
      requestId: 'req_logout_001',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
      duration: 45,
      responseCode: 200,
      details: {
        sessionDuration: '2h 35m',
        logoutType: 'manual',
        activitiesDuringSession: 12
      }
    }
  ];

  const tabs = [
    { id: 'logs', label: 'Audit Logs', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'compliance', label: 'Compliance', icon: 'Shield' },
    { id: 'realtime', label: 'Real-Time', icon: 'Radio' }
  ];

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      eventType: 'all',
      user: 'all',
      outcome: 'all',
      ipAddress: '',
      resourceId: '',
      resultCount: 1247
    });
  };

  const handleExport = (format) => {
    console.log('Exporting logs as:', format);
    // Implement export functionality
  };

  const handleRowExpand = (logId) => {
    setExpandedRows(prev => 
      prev?.includes(logId) 
        ? prev?.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const handleGenerateReport = (reportData) => {
    console.log('Generating compliance report:', reportData);
    // Implement report generation
  };

  const handleToggleStream = () => {
    setIsStreaming(!isStreaming);
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  // Request notification permission
  useEffect(() => {
    if (notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  return (
    <>
      <Helmet>
        <title>Audit Logs - KeyOrbit KMS</title>
        <meta name="description" content="Comprehensive security event tracking and compliance reporting with advanced filtering and export capabilities." />
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
                  <p className="text-muted-foreground mt-1">
                    Comprehensive security event tracking and compliance reporting
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    iconName="Download"
                    iconPosition="left"
                  >
                    Export All
                  </Button>
                  <Button
                    variant="default"
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="glass-card rounded-lg border border-border p-1">
                <div className="flex space-x-1">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  <LogFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onExport={handleExport}
                    onClearFilters={handleClearFilters}
                  />
                  <LogTable
                    logs={auditLogs}
                    onRowExpand={handleRowExpand}
                    expandedRows={expandedRows}
                  />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <ActivityChart
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                  />
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-card rounded-lg border border-border p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <Icon name="CheckCircle" size={20} className="text-success" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">645</p>
                          <p className="text-sm text-muted-foreground">Successful Events</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card rounded-lg border border-border p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                          <Icon name="AlertTriangle" size={20} className="text-warning" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">52</p>
                          <p className="text-sm text-muted-foreground">Warning Events</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card rounded-lg border border-border p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                          <Icon name="XCircle" size={20} className="text-error" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">20</p>
                          <p className="text-sm text-muted-foreground">Failed Events</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="glass-card rounded-lg border border-border p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="Activity" size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">717</p>
                          <p className="text-sm text-muted-foreground">Total Events</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'compliance' && (
                <ComplianceReports onGenerateReport={handleGenerateReport} />
              )}

              {activeTab === 'realtime' && (
                <RealTimeStream
                  isStreaming={isStreaming}
                  onToggleStream={handleToggleStream}
                  onNotificationToggle={handleNotificationToggle}
                  notificationsEnabled={notificationsEnabled}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AuditLogs;