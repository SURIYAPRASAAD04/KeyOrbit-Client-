import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityTimeline = () => {
  const [filter, setFilter] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const activities = [
    {
      id: 1,
      type: 'key_generated',
      title: 'AES-256 Key Generated',
      description: 'New encryption key created for production environment',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 300000),
      details: `Key ID: prod-aes-2024-001\nAlgorithm: AES-256-GCM\nEnvironment: Production\nPurpose: Database encryption`,
      icon: 'Key',
      color: 'success'
    },
    {
      id: 2,
      type: 'key_rotated',
      title: 'RSA Key Rotated',
      description: 'Scheduled rotation completed for API signing key',
      user: 'Sarah Wilson',
      timestamp: new Date(Date.now() - 900000),
      details: `Key ID: api-rsa-2024-003\nAlgorithm: RSA-4096\nRotation Type: Scheduled\nGrace Period: 30 days`,
      icon: 'RotateCcw',
      color: 'warning'
    },
    {
      id: 3,
      type: 'policy_updated',
      title: 'Key Policy Modified',
      description: 'Updated expiration policy for development keys',
      user: 'Michael Chen',
      timestamp: new Date(Date.now() - 1800000),
      details: `Policy: Development Key Lifecycle\nChanges: Expiration period updated from 90 to 60 days\nAffected Keys: 23 keys`,
      icon: 'Shield',
      color: 'primary'
    },
    {
      id: 4,
      type: 'user_added',
      title: 'New User Added',
      description: 'Developer access granted to key management system',
      user: 'Admin System',
      timestamp: new Date(Date.now() - 3600000),
      details: `User: alice.johnson@company.com\nRole: Developer\nPermissions: Read, Generate (Development only)\nInvited by: John Doe`,
      icon: 'UserPlus',
      color: 'accent'
    },
    {
      id: 5,
      type: 'key_expired',
      title: 'Key Expiration Alert',
      description: 'Legacy RSA key has expired and requires attention',
      user: 'System Alert',
      timestamp: new Date(Date.now() - 7200000),
      details: `Key ID: legacy-rsa-2023-012\nExpired: 2 hours ago\nStatus: Revoked automatically\nAction Required: Update dependent systems`,
      icon: 'AlertTriangle',
      color: 'error'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Activities', icon: 'Activity' },
    { value: 'key_generated', label: 'Key Operations', icon: 'Key' },
    { value: 'policy_updated', label: 'Policy Changes', icon: 'Shield' },
    { value: 'user_added', label: 'User Management', icon: 'Users' }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities?.filter(activity => activity?.type === filter);

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded?.has(id)) {
      newExpanded?.delete(id);
    } else {
      newExpanded?.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getActivityColor = (color) => {
    const colors = {
      success: 'text-success bg-success/10',
      warning: 'text-warning bg-warning/10',
      error: 'text-error bg-error/10',
      primary: 'text-primary bg-primary/10',
      accent: 'text-accent bg-accent/10'
    };
    return colors?.[color] || colors?.primary;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return timestamp?.toLocaleDateString();
    }
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">Real-time system events and operations</p>
          </div>
        </div>
        <Button variant="outline" size="sm" iconName="Filter">
          Filter
        </Button>
      </div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setFilter(option?.value)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              filter === option?.value
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            <Icon name={option?.icon} size={16} />
            <span>{option?.label}</span>
          </button>
        ))}
      </div>
      {/* Activity List */}
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredActivities?.map((activity, index) => (
          <div key={activity?.id} className="relative">
            {/* Timeline Line */}
            {index < filteredActivities?.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-16 bg-border"></div>
            )}
            
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/20 transition-colors duration-150">
              {/* Activity Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.color)}`}>
                <Icon name={activity?.icon} size={18} />
              </div>
              
              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {activity?.title}
                  </h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {formatTime(activity?.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {activity?.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    by {activity?.user}
                  </span>
                  
                  <button
                    onClick={() => toggleExpanded(activity?.id)}
                    className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors duration-150"
                  >
                    <span>{expandedItems?.has(activity?.id) ? 'Less' : 'Details'}</span>
                    <Icon 
                      name={expandedItems?.has(activity?.id) ? 'ChevronUp' : 'ChevronDown'} 
                      size={14} 
                    />
                  </button>
                </div>
                
                {/* Expanded Details */}
                {expandedItems?.has(activity?.id) && (
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {activity?.details}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="ghost" className="w-full" iconName="ArrowRight" iconPosition="right">
          View All Activity in Audit Logs
        </Button>
      </div>
    </div>
  );
};

export default ActivityTimeline;