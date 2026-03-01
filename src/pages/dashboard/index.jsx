import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricCard from './components/MetricCard';
import QuickActions from './components/QuickActions';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

// Loading Component with Icon
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
      </div>
    </div>
  </div>
);

// Metric Card Loading State
const MetricCardLoader = () => (
  <div className="glass-card rounded-lg border border-border p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer"></div>
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-muted/30 rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
      </div>
      <div className="w-16 h-6 bg-muted/30 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-8 bg-muted/30 rounded w-20"></div>
      <div className="h-4 bg-muted/30 rounded w-32"></div>
      <div className="h-3 bg-muted/30 rounded w-40 mt-2"></div>
    </div>
  </div>
);

// Quick Actions Loading State
const QuickActionsLoader = () => (
  <div className="glass-card rounded-lg border border-border p-6">
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-5 h-5 bg-muted/30 rounded"></div>
      <div className="h-6 bg-muted/30 rounded w-32"></div>
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-start space-x-3 p-4 rounded-lg border border-border">
          <div className="w-8 h-8 bg-muted/30 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted/30 rounded w-32"></div>
            <div className="h-3 bg-muted/30 rounded w-48"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await dashboardAPI.getStats();
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDashboardData();
      toast.success('Dashboard refreshed');
    } catch (error) {
      toast.error('Failed to refresh');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Format metrics for MetricCard components
  const metrics = [
    {
      title: 'Total Keys',
      value: stats?.total_keys?.toLocaleString() || '0',
      change: stats?.active_keys ? `+${stats.active_keys} active` : '0',
      changeType: stats?.active_keys > 0 ? 'positive' : 'default',
      icon: 'Key',
      description: 'Total cryptographic keys',
      onClick: () => navigate('/key-management')
    },
    {
      title: 'Active Keys',
      value: stats?.active_keys?.toLocaleString() || '0',
      change: stats?.keys_by_type ? 
        `${stats.keys_by_type.kem || 0} KEM · ${stats.keys_by_type.signature || 0} DSA` : '',
      changeType: 'positive',
      icon: 'CheckCircle',
      description: 'Currently operational keys',
      onClick: () => navigate('/key-management?status=active')
    },
    {
      title: 'Expiring Soon',
      value: stats?.expiring_soon?.toLocaleString() || '0',
      change: 'Next 30 days',
      changeType: stats?.expiring_soon > 0 ? 'warning' : 'default',
      icon: 'AlertTriangle',
      description: 'Keys requiring attention',
      onClick: () => navigate('/key-management?filter=expiring')
    },
    {
      title: 'Operations Today',
      value: stats?.operations_today?.toLocaleString() || '0',
      change: `+${stats?.operations_week || 0} this week`,
      changeType: 'positive',
      icon: 'Activity',
      description: 'Cryptographic operations',
      onClick: () => navigate('/audit-logs')
    },
    {
      title: 'API Calls',
      value: stats?.total_api_calls?.toLocaleString() || '0',
      change: `${stats?.active_tokens || 0} active tokens`,
      changeType: 'positive',
      icon: 'Code',
      description: 'Total API requests processed',
      onClick: () => navigate('/api-tokens')
    },
    {
      title: 'Success Rate',
      value: `${stats?.success_rate || 100}%`,
      change: stats?.alerts?.failed_operations_24h ? 
        `${stats.alerts.failed_operations_24h} failed` : 'No failures',
      changeType: stats?.alerts?.failed_operations_24h > 0 ? 'warning' : 'positive',
      icon: 'TrendingUp',
      description: '7-day operation success rate',
      onClick: () => navigate('/audit-logs')
    }
  ];

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
                  Security Command Center
                </h1>
                <p className="text-muted-foreground">
                  {loading ? (
                    <span className="inline-block w-64 h-4 bg-muted/30 rounded animate-pulse"></span>
                  ) : (
                    `Welcome back, ${stats?.user?.name?.split(' ')[0] || 'User'}!`
                  )}
                </p>
              </div>
              
              {!loading && (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium text-foreground">
                      {currentTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                  
                  {/* Refresh Button with Loading State */}
                  <button 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    {refreshing ? (
                      <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </button>
                  
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            {/* Metrics Grid - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading 
                ? [1,2,3,4,5,6].map(i => <MetricCardLoader key={i} />)
                : metrics.map((metric, index) => (
                    <MetricCard
                      key={index}
                      title={metric.title}
                      value={metric.value}
                      change={metric.change}
                      changeType={metric.changeType}
                      icon={metric.icon}
                      description={metric.description}
                      onClick={metric.onClick}
                    />
                  ))
              }
            </div>

            {/* Quick Actions Section */}
            <div className="mt-8">
              {loading ? (
                <QuickActionsLoader />
              ) : (
                <QuickActions />
              )}
            </div>

            {/* Footer Info */}
            {!loading && (
              <div className="mt-12 pt-6 border-t border-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-bold">K</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {stats?.user?.organization || 'KeyOrbit KMS Enterprise'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stats?.user?.role ? `${stats.user.role} · ` : ''}
                        Joined {stats?.user?.joined ? new Date(stats.user.joined).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>⚡ Post-Quantum Ready</span>
                    <span>🔐 FIPS 203-204 Compliant</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;