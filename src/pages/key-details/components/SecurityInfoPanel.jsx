import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityInfoPanel = ({ securityData }) => {
  const getComplianceColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'compliant':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'non-compliant':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getComplianceIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'compliant':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'non-compliant':
        return 'XCircle';
      default:
        return 'HelpCircle';
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Security Information</h3>
      </div>
      <div className="space-y-6">
        {/* Usage Statistics */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Usage Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-foreground">{securityData?.dailyUsage}</div>
              <div className="text-xs text-muted-foreground">Daily Operations</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-foreground">{securityData?.monthlyUsage}</div>
              <div className="text-xs text-muted-foreground">Monthly Operations</div>
            </div>
          </div>
        </div>

        {/* Access Permissions */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Access Permissions</h4>
          <div className="space-y-2">
            {securityData?.permissions?.map((permission, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{permission?.user}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {permission?.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Associated Policies */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Associated Policies</h4>
          <div className="space-y-2">
            {securityData?.policies?.map((policy, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="FileText" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{policy?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getComplianceIcon(policy?.compliance)} 
                    size={16} 
                    className={getComplianceColor(policy?.compliance)} 
                  />
                  <span className={`text-xs font-medium ${getComplianceColor(policy?.compliance)}`}>
                    {policy?.compliance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IP Whitelist */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">IP Whitelist</h4>
          <div className="space-y-2">
            {securityData?.ipWhitelist?.map((ip, index) => (
              <div key={index} className="flex items-center space-x-3 py-2 px-3 bg-muted/20 rounded-lg">
                <Icon name="Globe" size={16} className="text-muted-foreground" />
                <span className="text-sm font-mono text-foreground">{ip?.address}</span>
                <span className="text-xs text-muted-foreground">{ip?.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfoPanel;