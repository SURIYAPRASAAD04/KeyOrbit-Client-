import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PolicyTable = ({ 
  policies, 
  onView, 
  onEdit, 
  onClone, 
  onToggleEnforcement, 
  onDelete, 
  getStatusColor 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (policies?.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="FileText" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No policies found</h3>
        <p className="text-muted-foreground">
          No policies match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Policy Name</th>
            <th>Type</th>
            <th>Scope</th>
            <th>Status</th>
            <th>Enforcement</th>
            <th>Rules</th>
            <th>Affected Keys</th>
            <th>Compliance</th>
            <th>Last Modified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies?.map((policy) => (
            <tr 
              key={policy?.id} 
              className="hover:bg-muted/20 cursor-pointer"
              onClick={() => onView?.(policy)}
            >
              <td>
                <div>
                  <div className="font-medium text-foreground">{policy?.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-xs">
                    {policy?.description}
                  </div>
                </div>
              </td>
              <td>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {policy?.type}
                </span>
              </td>
              <td>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={policy?.scope === 'Organization' ? 'Building' : policy?.scope === 'Global' ? 'Globe' : 'Users'} 
                    size={14} 
                    className="text-muted-foreground" 
                  />
                  <span className="text-sm">{policy?.scope}</span>
                </div>
              </td>
              <td>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy?.status)}`}>
                  {policy?.status}
                </span>
              </td>
              <td>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${policy?.enforcement ? 'bg-success' : 'bg-muted-foreground'}`} />
                  <span className="text-sm">
                    {policy?.enforcement ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </td>
              <td>
                <span className="text-sm font-mono">{policy?.rulesCount}</span>
              </td>
              <td>
                <span className="text-sm font-mono">{policy?.affectedKeys?.toLocaleString()}</span>
              </td>
              <td>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-success"
                      style={{ width: `${policy?.complianceScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{policy?.complianceScore}%</span>
                </div>
              </td>
              <td>
                <div>
                  <div className="text-sm">{formatDate(policy?.lastModified)}</div>
                  <div className="text-xs text-muted-foreground">{policy?.modifiedBy}</div>
                </div>
              </td>
              <td onClick={(e) => e?.stopPropagation()}>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit?.(policy)}
                    className="p-1 h-8 w-8"
                  >
                    <Icon name="Edit" size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onClone?.(policy)}
                    className="p-1 h-8 w-8"
                  >
                    <Icon name="Copy" size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onToggleEnforcement?.(policy)}
                    className="p-1 h-8 w-8"
                  >
                    <Icon name={policy?.enforcement ? 'ShieldOff' : 'Shield'} size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(policy)}
                    className="p-1 h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PolicyTable;