import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onMenuToggle, isSidebarCollapsed = false }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Key Expiration Alert',
      message: 'RSA-2048 key expires in 7 days',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Key Generated',
      message: 'New AES-256 key created successfully',
      time: '4 hours ago',
      unread: true
    },
    {
      id: 3,
      type: 'error',
      title: 'Access Denied',
      message: 'Failed authentication attempt detected',
      time: '6 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  const getPageTitle = () => {
    const pathMap = {
      '/dashboard': 'Dashboard',
      '/key-management': 'Key Management',
      '/key-details': 'Key Details',
      '/audit-logs': 'Audit Logs',
      '/api-tokens': 'API Tokens',
      '/policy-management': 'Policy Management',
      '/user-management': 'User Management',
      '/profile-settings': 'Profile Settings',
      '/login': 'Login',
      '/register': 'Register'
    };
    return pathMap?.[location?.pathname] || 'KeyOrbit KMS';
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setIsUserMenuOpen(false);
    }
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  // Get user initials from name or email
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email;
    }
    return 'User';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 glass-nav border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Menu Toggle & Title */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Icon name="Menu" size={20} />
          </Button>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-foreground">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right Section - Notifications & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notification Center */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative"
              aria-label="Notifications"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-card rounded-lg shadow-orbital-lg border border-border z-200">
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications?.map((notification) => (
                    <div
                      key={notification?.id}
                      className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors duration-150 ${
                        notification?.unread ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                          notification?.type === 'success' ? 'bg-success' :
                          notification?.type === 'warning' ? 'bg-warning' :
                          notification?.type === 'error' ? 'bg-error' : 'bg-primary'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {notification?.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification?.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification?.time}
                          </p>
                        </div>
                        {notification?.unread && (
                          <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 px-3"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {getUserInitials()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{getUserDisplayName()}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-card rounded-lg shadow-orbital-lg border border-border z-200">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'No email'}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <a href="/profile-settings" className="block">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors duration-150">
                      <Icon name="User" size={16} className="mr-3" />
                      Profile Settings
                    </button>
                  </a>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors duration-150">
                    <Icon name="Settings" size={16} className="mr-3" />
                    Preferences
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors duration-150">
                    <Icon name="Moon" size={16} className="mr-3" />
                    Dark Mode
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted/30 transition-colors duration-150">
                    <Icon name="HelpCircle" size={16} className="mr-3" />
                    Help & Support
                  </button>
                </div>
                <div className="border-t border-border py-2">
                  <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="LogOut" size={16} className="mr-3" />
                    {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Title */}
      <div className="lg:hidden px-6 pb-4">
        <h1 className="text-lg font-semibold text-foreground">
          {getPageTitle()}
        </h1>
      </div>
      {/* Click outside handlers */}
      {(isUserMenuOpen || isNotificationOpen) && (
        <div 
          className="fixed inset-0 z-50" 
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;