import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { auditAPInew as auditAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const AuditLogs = () => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 50,
    total: 0,
    total_pages: 1
  });
  
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: '',
    eventType: 'all',
    userId: 'all',
    outcome: 'all',
    ipAddress: '',
    resourceId: '',
    resultCount: 0
  });
  
  const [filterOptions, setFilterOptions] = useState({
    event_types: [],
    users: []
  });
  
  const [expandedRows, setExpandedRows] = useState([]);
  const [chartType, setChartType] = useState('activity');
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failure: 0,
    success_rate: 0,
    event_types: [],
    daily_activity: []
  });
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [recentEvents, setRecentEvents] = useState([]);

  // Use refs to prevent infinite loops
  const isMounted = useRef(true);
  const fetchLogsRef = useRef(null);
  const prevFiltersRef = useRef(JSON.stringify({
    page: 1,
    ...filters
  }));

  const tabs = [
    { id: 'logs', label: 'Audit Logs', icon: 'List' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'compliance', label: 'Compliance Reports', icon: 'FileText' },
    { id: 'realtime', label: 'Real-Time Stream', icon: 'Activity' }
  ];

  // Define fetchLogs with useCallback
  const fetchLogs = useCallback(async (pageNum = pagination.page) => {
    if (!isMounted.current || isLoading) return;
    
    setIsLoading(true);
    try {
      const params = {
        page: pageNum,
        per_page: pagination.per_page,
        ...(filters.startDate && { start_date: filters.startDate }),
        ...(filters.endDate && { end_date: filters.endDate }),
        ...(filters.eventType && filters.eventType !== 'all' && { event_type: filters.eventType }),
        ...(filters.userId && filters.userId !== 'all' && { user_id: filters.userId }),
        ...(filters.outcome && filters.outcome !== 'all' && { outcome: filters.outcome }),
        ...(filters.search && { search: filters.search })
      };

      const response = await auditAPI.getLogs(params);
      
      if (isMounted.current) {
        setLogs(response.data.logs || []);
        setPagination({
          page: response.data.page,
          per_page: response.data.per_page,
          total: response.data.total,
          total_pages: response.data.total_pages
        });
        
        setFilterOptions({
          event_types: response.data.filters?.event_types || [],
          users: response.data.filters?.users || []
        });
        
        setFilters(prev => ({
          ...prev,
          resultCount: response.data.total
        }));
      }
      
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      if (isMounted.current) {
        toast.error('Failed to load audit logs');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [pagination.per_page, filters.startDate, filters.endDate, 
      filters.eventType, filters.userId, filters.outcome, filters.search]);

  // Store fetchLogs in ref to avoid dependency issues
  useEffect(() => {
    fetchLogsRef.current = fetchLogs;
  }, [fetchLogs]);

  // Initial load - ONLY ONCE
  useEffect(() => {
    isMounted.current = true;
    
    // Load initial data based on active tab
    if (activeTab === 'logs') {
      fetchLogs(1);
    } else if (activeTab === 'analytics') {
      fetchStats();
    } else if (activeTab === 'realtime') {
      fetchRecentEvents();
    }
    
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array - runs only once

  // Handle filter changes - but don't auto-fetch
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle apply filters button click
  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    // Use setTimeout to ensure state updates before fetching
    setTimeout(() => {
      if (fetchLogsRef.current) {
        fetchLogsRef.current(1);
      }
    }, 100);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      startDate: '',
      endDate: '',
      eventType: 'all',
      userId: 'all',
      outcome: 'all',
      ipAddress: '',
      resourceId: '',
      resultCount: 0
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    
    setTimeout(() => {
      if (fetchLogsRef.current) {
        fetchLogsRef.current(1);
      }
    }, 100);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    setTimeout(() => {
      if (fetchLogsRef.current) {
        fetchLogsRef.current(newPage);
      }
    }, 100);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Load data for the new tab
    setTimeout(() => {
      if (tabId === 'logs' && fetchLogsRef.current) {
        fetchLogsRef.current(1);
      } else if (tabId === 'analytics') {
        fetchStats();
      } else if (tabId === 'realtime') {
        fetchRecentEvents();
      }
    }, 100);
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await auditAPI.getStats(30);
      if (isMounted.current) {
        setStats(response.data || {});
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Fetch recent events
  const fetchRecentEvents = async () => {
    try {
      const response = await auditAPI.getRecentEvents(20);
      if (isMounted.current) {
        setRecentEvents(response.data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent events:', error);
    }
  };

  // Real-time streaming effect
  useEffect(() => {
    let interval;
    if (isStreaming && activeTab === 'realtime' && isMounted.current) {
      // Initial fetch
      fetchRecentEvents();
      
      // Poll every 10 seconds
      interval = setInterval(() => {
        if (isMounted.current) {
          fetchRecentEvents();
        }
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, activeTab]);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleExport = async (format) => {
    try {
      const exportFilters = {
        ...(filters.startDate && { start_date: filters.startDate }),
        ...(filters.endDate && { end_date: filters.endDate }),
        ...(filters.eventType && filters.eventType !== 'all' && { event_type: filters.eventType }),
        ...(filters.userId && filters.userId !== 'all' && { user_id: filters.userId }),
        ...(filters.outcome && filters.outcome !== 'all' && { outcome: filters.outcome })
      };

      const response = await auditAPI.exportLogs(format, exportFilters);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Logs exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export logs');
    }
  };

  const handleRowExpand = (logId) => {
    setExpandedRows(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const handleGenerateReport = async (reportData) => {
    toast.success('Report generation started');
  };

  const handleToggleStream = () => {
    setIsStreaming(!isStreaming);
  };

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success('Notifications enabled');
      }
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  return (
    <>
      <Helmet>
        <title>Audit Logs - KeyOrbit KMS</title>
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
                  <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
                  <p className="text-muted-foreground mt-1">
                    Comprehensive security event tracking and compliance reporting
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => handleExport('csv')}
                    disabled={isLoading}
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Export CSV
                  </Button>
                  
                  <Button
                    variant="default"
                    onClick={() => fetchLogs(pagination.page)}
                    loading={isLoading}
                  >
                    <Icon name="RefreshCw" size={16} className="mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="glass-card rounded-lg border border-border p-1">
                <div className="flex flex-wrap space-x-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
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
                    onApplyFilters={handleApplyFilters}
                    onExport={handleExport}
                    onClearFilters={handleClearFilters}
                    filterOptions={filterOptions}
                    isLoading={isLoading}
                  />
                  
                  <LogTable
                    logs={logs}
                    onRowExpand={handleRowExpand}
                    expandedRows={expandedRows}
                    isLoading={isLoading}
                  />
                  
                  {/* Pagination */}
                  {pagination.total_pages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {((pagination.page - 1) * pagination.per_page) + 1} to{' '}
                        {Math.min(pagination.page * pagination.per_page, pagination.total)} of{' '}
                        {pagination.total} results
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1 || isLoading}
                        >
                          <Icon name="ChevronLeft" size={16} />
                        </Button>
                        
                        <span className="px-3 py-1 text-sm">
                          Page {pagination.page} of {pagination.total_pages}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.total_pages || isLoading}
                        >
                          <Icon name="ChevronRight" size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <ActivityChart
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                    stats={stats}
                    dailyActivity={stats.daily_activity || []}
                  />
                </div>
              )}

              {activeTab === 'compliance' && (
                <ComplianceReports 
                  onGenerateReport={handleGenerateReport}
                  stats={stats}
                />
              )}

              {activeTab === 'realtime' && (
                <RealTimeStream
                  events={recentEvents}
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