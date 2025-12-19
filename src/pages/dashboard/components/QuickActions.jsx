import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'generate-key',
      title: 'Generate New Key',
      description: 'Create encryption keys for your applications',
      icon: 'Plus',
      color: 'success',
      onClick: () => navigate('/key-management')
    },
    {
      id: 'rotate-keys',
      title: 'Rotate Keys',
      description: 'Update existing keys with new versions',
      icon: 'RotateCcw',
      color: 'warning',
      onClick: () => navigate('/key-management')
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'Add or modify user access permissions',
      icon: 'Users',
      color: 'primary',
      onClick: () => navigate('/api-tokens')
    },
    {
      id: 'view-audit',
      title: 'View Audit Logs',
      description: 'Review security events and compliance',
      icon: 'FileText',
      color: 'accent',
      onClick: () => navigate('/audit-logs')
    }
  ];

  const getActionColor = (color) => {
    const colors = {
      success: 'bg-success/10 text-success hover:bg-success/20',
      warning: 'bg-warning/10 text-warning hover:bg-warning/20',
      error: 'bg-error/10 text-error hover:bg-error/20',
      primary: 'bg-primary/10 text-primary hover:bg-primary/20',
      accent: 'bg-accent/10 text-accent hover:bg-accent/20'
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">Common tasks and operations</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.onClick}
            className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/30 transition-all duration-300 group text-left"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${getActionColor(action?.color)}`}>
              <Icon name={action?.icon} size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                {action?.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {action?.description}
              </p>
            </div>
            <Icon 
              name="ArrowRight" 
              size={16} 
              className="text-muted-foreground group-hover:text-primary transition-colors duration-300 flex-shrink-0 mt-1" 
            />
          </button>
        ))}
      </div>
      {/* Additional Actions */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export Keys
          </Button>
          <Button variant="outline" size="sm" iconName="Settings">
            Policies
          </Button>
          <Button variant="outline" size="sm" iconName="Shield">
            Security
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;