import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import MetricCard from './components/MetricCard';
import ActivityTimeline from './components/ActivityTimeline';
import QuickActions from './components/QuickActions';
import SecurityAlerts from './components/SecurityAlerts';
import SystemStatus from './components/SystemStatus';
import KeyUsageChart from './components/KeyUsageChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Mock metrics data
  const metrics = [
    {
      title: 'Total Keys',
      value: '247',
      change: '+12',
      changeType: 'positive',
      icon: 'Key',
      description: 'Active encryption keys across all environments',
      onClick: () => navigate('/key-management')
    },
    {
      title: 'Active Keys',
      value: '231',
      change: '+8',
      changeType: 'positive',
      icon: 'CheckCircle',
      description: 'Currently operational and valid keys',
      onClick: () => navigate('/key-management')
    },
    {
      title: 'Expiring Soon',
      value: '16',
      change: '+3',
      changeType: 'warning',
      icon: 'AlertTriangle',
      description: 'Keys expiring within the next 30 days',
      onClick: () => navigate('/key-management')
    },
    {
      title: 'Operations Today',
      value: '1,847',
      change: '+156',
      changeType: 'positive',
      icon: 'Activity',
      description: 'Cryptographic operations performed today',
      onClick: () => navigate('/audit-logs')
    },
    {
      title: 'API Requests',
      value: '12.4K',
      change: '+2.1K',
      changeType: 'positive',
      icon: 'Code',
      description: 'API calls processed in the last 24 hours',
      onClick: () => navigate('/api-tokens')
    },
    {
      title: 'Success Rate',
      value: '99.8%',
      change: '+0.2%',
      changeType: 'positive',
      icon: 'TrendingUp',
      description: 'Operation success rate over the last 7 days',
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
                  Welcome back! Here's an overview of your key management system.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium text-foreground">
                    {currentTime?.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </p>
                </div>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics?.map((metric, index) => (
                <MetricCard
                  key={index}
                  title={metric?.title}
                  value={metric?.value}
                  change={metric?.change}
                  changeType={metric?.changeType}
                  icon={metric?.icon}
                  description={metric?.description}
                  onClick={metric?.onClick}
                />
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Activity Timeline */}
              <div className="lg:col-span-2 space-y-6">
                <ActivityTimeline />
                <KeyUsageChart />
              </div>

              {/* Right Column - Quick Actions & Alerts */}
              <div className="space-y-6">
                <QuickActions />
                <SecurityAlerts />
                <SystemStatus />
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-12 pt-6 border-t border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">K</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">KeyOrbit KMS Enterprise</p>
                    <p className="text-xs text-muted-foreground">
                      Quantum-ready cryptographic key management
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                  <span>Version 2.1.0</span>
                  <span>SOC 2 Compliant</span>
                  <span>FIPS 140-2 Level 3</span>
                  <span>&copy; {new Date()?.getFullYear()} KeyOrbit Security</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;