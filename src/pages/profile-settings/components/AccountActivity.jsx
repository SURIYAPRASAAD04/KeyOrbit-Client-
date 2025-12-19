import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AccountActivity = ({ userData }) => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading activity data
    setTimeout(() => {
      setActivities([
        {
          id: 1,
          type: 'login',
          description: 'Successful login from Chrome on Windows',
          timestamp: '2025-09-20T05:30:00Z',
          ip: '192.168.1.100',
          location: 'New York, US',
          device: 'Windows PC',
          status: 'success'
        },
        {
          id: 2,
          type: 'password_change',
          description: 'Password changed successfully',
          timestamp: '2025-09-19T14:20:00Z',
          ip: '192.168.1.100',
          location: 'New York, US',
          device: 'Windows PC',
          status: 'success'
        },
        {
          id: 3,
          type: 'mfa_enabled',
          description: 'Two-factor authentication enabled',
          timestamp: '2025-09-19T10:15:00Z',
          ip: '192.168.1.100',
          location: 'New York, US',
          device: 'Windows PC',
          status: 'success'
        },
        {
          id: 4,
          type: 'failed_login',
          description: 'Failed login attempt - incorrect password',
          timestamp: '2025-09-18T22:45:00Z',
          ip: '203.0.113.1',
          location: 'Unknown',
          device: 'Unknown',
          status: 'warning'
        },
        {
          id: 5,
          type: 'api_token',
          description: 'API token "Production Keys" created',
          timestamp: '2025-09-18T16:30:00Z',
          ip: '192.168.1.100',
          location: 'New York, US',
          device: 'Windows PC',
          status: 'success'
        },
        {
          id: 6,
          type: 'profile_update',
          description: 'Profile information updated',
          timestamp: '2025-09-17T11:20:00Z',
          ip: '192.168.1.100',
          location: 'New York, US',
          device: 'Windows PC',
          status: 'success'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type, status) => {
    if (status === 'warning' || status === 'error') {
      return 'AlertTriangle';
    }

    switch (type) {
      case 'login':
        return 'LogIn';
      case 'logout':
        return 'LogOut';
      case 'password_change':
        return 'Lock';
      case 'mfa_enabled': case'mfa_disabled':
        return 'Shield';
      case 'api_token':
        return 'Key';
      case 'profile_update':
        return 'User';
      case 'failed_login':
        return 'AlertCircle';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const filterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'login', label: 'Login Events' },
    { value: 'security', label: 'Security Changes' },
    { value: 'profile', label: 'Profile Updates' },
    { value: 'api', label: 'API Activity' }
  ];

  const filteredActivities = activities?.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'login') return ['login', 'logout', 'failed_login']?.includes(activity?.type);
    if (filter === 'security') return ['password_change', 'mfa_enabled', 'mfa_disabled']?.includes(activity?.type);
    if (filter === 'profile') return activity?.type === 'profile_update';
    if (filter === 'api') return activity?.type === 'api_token';
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto animate-orbital">
            <Icon name="Activity" size={16} className="text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="LogIn" size={20} className="text-success" />
            <div>
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-sm text-muted-foreground">Successful Logins</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <div>
              <p className="text-2xl font-bold text-foreground">2</p>
              <p className="text-sm text-muted-foreground">Security Alerts</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="Key" size={20} className="text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">5</p>
              <p className="text-sm text-muted-foreground">API Tokens</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select
            name="filter"
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            options={filterOptions}
            className="w-48"
          />
          <p className="text-sm text-muted-foreground">
            Showing {filteredActivities?.length} of {activities?.length} activities
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          iconName="Download"
        >
          Export Activity
        </Button>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-1">
        {filteredActivities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No activity found for the selected filter</p>
          </div>
        ) : (
          filteredActivities?.map((activity) => {
            const timestamp = formatTimestamp(activity?.timestamp);
            return (
              <div
                key={activity?.id}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/10 transition-colors duration-150"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity?.status === 'success' ? 'bg-success/10' :
                  activity?.status === 'warning'? 'bg-warning/10' : 'bg-error/10'
                }`}>
                  <Icon 
                    name={getActivityIcon(activity?.type, activity?.status)} 
                    size={16} 
                    className={getActivityColor(activity?.status)}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {activity?.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Icon name="Clock" size={12} className="mr-1" />
                          {timestamp?.date} at {timestamp?.time}
                        </span>
                        <span className="flex items-center">
                          <Icon name="MapPin" size={12} className="mr-1" />
                          {activity?.location}
                        </span>
                        <span className="flex items-center">
                          <Icon name="Monitor" size={12} className="mr-1" />
                          {activity?.device}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-muted-foreground font-mono">
                        {activity?.ip}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      {filteredActivities?.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            iconName="MoreHorizontal"
          >
            Load More Activity
          </Button>
        </div>
      )}

      {/* Security Notice */}
      <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Security Notice</p>
            <p className="text-muted-foreground">
              If you notice any suspicious activity or unrecognized login attempts, 
              please change your password immediately and contact our security team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountActivity;