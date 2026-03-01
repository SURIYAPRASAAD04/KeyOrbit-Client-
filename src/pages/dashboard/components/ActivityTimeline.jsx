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
    <div className="">
      
    </div>
  );
};

export default ActivityTimeline;