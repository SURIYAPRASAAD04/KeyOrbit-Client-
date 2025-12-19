import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const UserDetailsModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-success/10 text-success`;
      case 'Inactive':
        return `${baseClasses} bg-muted text-muted-foreground`;
      case 'Suspended':
        return `${baseClasses} bg-error/10 text-error`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (role) {
      case 'Administrator':
        return `${baseClasses} bg-primary/10 text-primary`;
      case 'Manager':
        return `${baseClasses} bg-secondary/10 text-secondary`;
      case 'Developer':
        return `${baseClasses} bg-accent/10 text-accent`;
      case 'Auditor':
        return `${baseClasses} bg-warning/10 text-warning`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getInitials = (name) => {
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase();
  };

  const mockActivityLogs = [
    {
      id: 1,
      action: 'Password Reset',
      timestamp: '2024-01-15 14:30:22',
      details: 'Password reset requested and completed',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      action: 'Login Success',
      timestamp: '2024-01-15 09:15:10',
      details: 'Successful login from Chrome browser',
      ip: '192.168.1.100'
    },
    {
      id: 3,
      action: 'Key Access',
      timestamp: '2024-01-14 16:45:33',
      details: 'Accessed encryption key: prod-db-key-001',
      ip: '192.168.1.100'
    },
    {
      id: 4,
      action: 'Profile Updated',
      timestamp: '2024-01-14 11:20:15',
      details: 'Phone number updated by user',
      ip: '192.168.1.100'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'permissions', label: 'Permissions', icon: 'Shield' },
    { id: 'activity', label: 'Activity Logs', icon: 'Activity' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-primary">
                {getInitials(user?.name)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="font-medium text-foreground">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email Address</label>
                    <p className="font-medium text-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone Number</label>
                    <p className="font-medium text-foreground">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Join Date</label>
                    <p className="font-medium text-foreground">
                      {new Date(user?.joinDate)?.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Role</label>
                    <div className="mt-1">
                      <span className={getRoleBadge(user?.role)}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <span className={getStatusBadge(user?.status)}>
                        {user?.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Department</label>
                    <p className="font-medium text-foreground">{user?.department}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Last Activity</label>
                    <p className="font-medium text-foreground">{user?.lastActivity}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-foreground mb-4">Current Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user?.permissions?.map((permission) => (
                    <div key={permission} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <Icon name="Check" size={16} className="text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{permission}</p>
                        <p className="text-sm text-muted-foreground">
                          {permission === 'Read' && 'View keys and data'}
                          {permission === 'Write' && 'Create and modify keys'}
                          {permission === 'Admin' && 'Full system administration'}
                          {permission === 'Audit' && 'Access audit logs and reports'}
                          {permission === 'Manage' && 'Manage team members'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-warning/5 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Permission Management</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permissions are automatically assigned based on the user's role. To modify permissions, you need to change the user's role in the edit dialog.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Logs Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground">Recent Activity</h4>
              <div className="space-y-4">
                {mockActivityLogs?.map((log) => (
                  <div key={log?.id} className="flex items-start space-x-4 p-4 bg-muted/20 rounded-lg">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <Icon name="Activity" size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground">{log?.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log?.timestamp)?.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log?.details}</p>
                      <p className="text-xs text-muted-foreground">IP: {log?.ip}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <button className="text-sm text-primary hover:text-primary/80 transition-colors duration-200">
                  View Complete Activity History
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;