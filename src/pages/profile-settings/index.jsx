import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import PersonalInfo from './components/PersonalInfo';
import SecuritySettings from './components/SecuritySettings';
import NotificationPreferences from './components/NotificationPreferences';
import AccountActivity from './components/AccountActivity';
import OrbitBackground from '../login/components/OrbitBackground';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('keyorbit_user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Load user data
    setTimeout(() => {
      setUserData(JSON.parse(user));
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Information',
      icon: 'User',
      component: PersonalInfo
    },
    {
      id: 'security',
      label: 'Security Settings',
      icon: 'Shield',
      component: SecuritySettings
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      component: NotificationPreferences
    },
    {
      id: 'activity',
      label: 'Account Activity',
      icon: 'Activity',
      component: AccountActivity
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-orbital">
            <Icon name="User" size={32} className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading Profile Settings...</p>
        </div>
      </div>
    );
  }

  const ActiveComponent = tabs?.find(tab => tab?.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <OrbitBackground />
      
      {/* Navigation */}
      <div className="relative z-10">
        <div className="glass-nav border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-150"
                >
                  <Icon name="ArrowLeft" size={20} />
                  <span className="font-medium">Back to Dashboard</span>
                </button>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">Profile Settings</h1>
                    <p className="text-xs text-muted-foreground">Manage your account preferences</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{userData?.email}</p>
                  <p className="text-xs text-muted-foreground">{userData?.role}</p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="glass-card p-6 rounded-2xl shadow-orbital border border-border">
                <nav className="space-y-2">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`nav-item w-full text-left ${
                        activeTab === tab?.id ? 'active' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name={tab?.icon} size={20} className="nav-item-icon" />
                      <span className="hidden sm:block">{tab?.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Mobile Tab Pills */}
                <div className="block sm:hidden mt-6 border-t border-border pt-6">
                  <div className="grid grid-cols-2 gap-2">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`flex items-center justify-center p-3 rounded-lg border transition-all duration-150 ${
                          activeTab === tab?.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-border hover:border-primary'
                        }`}
                      >
                        <Icon name={tab?.icon} size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="mt-6 lg:mt-0 lg:col-span-9">
              <div className="glass-card p-8 rounded-2xl shadow-orbital border border-border">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    {tabs?.find(tab => tab?.id === activeTab)?.label}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {activeTab === 'personal' && 'Update your personal information and profile details'}
                    {activeTab === 'security' && 'Manage your account security and authentication settings'}
                    {activeTab === 'notifications' && 'Configure your notification preferences'}
                    {activeTab === 'activity' && 'View your recent account activity and security events'}
                  </p>
                </div>

                {ActiveComponent && <ActiveComponent userData={userData} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="fixed bottom-4 right-4 z-20">
        <div className="glass-card px-3 py-2 rounded-lg border border-border">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Settings Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;