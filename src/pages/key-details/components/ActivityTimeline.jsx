import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityTimeline = ({ activities }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [filter, setFilter] = useState('all');

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'generated':
        return 'Plus';
      case 'rotated':
        return 'RotateCcw';
      case 'accessed':
        return 'Eye';
      case 'policy_updated':
        return 'FileText';
      case 'exported':
        return 'Download';
      case 'revoked':
        return 'Trash2';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'generated':
        return 'text-success';
      case 'rotated':
        return 'text-primary';
      case 'accessed':
        return 'text-secondary';
      case 'policy_updated':
        return 'text-warning';
      case 'exported':
        return 'text-accent';
      case 'revoked':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded?.has(id)) {
      newExpanded?.delete(id);
    } else {
      newExpanded?.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredActivities = activities?.filter(activity => 
    filter === 'all' || activity?.type?.toLowerCase() === filter
  );

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'generated', label: 'Generated' },
    { value: 'rotated', label: 'Rotated' },
    { value: 'accessed', label: 'Accessed' },
    { value: 'policy_updated', label: 'Policy Updates' },
    { value: 'exported', label: 'Exported' },
    { value: 'revoked', label: 'Revoked' }
  ];

  return (
    <div className="glass-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={20} className="text-accent" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Activity Timeline</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="text-sm bg-background border border-border rounded-lg px-3 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {filterOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredActivities?.map((activity, index) => (
          <div key={activity?.id} className="relative">
            {/* Timeline Line */}
            {index < filteredActivities?.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>
            )}
            
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg bg-muted/20 flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{activity?.title}</h4>
                    <p className="text-xs text-muted-foreground">{activity?.timestamp}</p>
                  </div>
                  {activity?.details && (
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={expandedItems?.has(activity?.id) ? 'ChevronUp' : 'ChevronDown'}
                      iconPosition="right"
                      onClick={() => toggleExpanded(activity?.id)}
                    >
                      Details
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>
                
                {activity?.user && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Icon name="User" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity?.user}</span>
                    {activity?.ipAddress && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-mono text-muted-foreground">{activity?.ipAddress}</span>
                      </>
                    )}
                  </div>
                )}
                
                {expandedItems?.has(activity?.id) && activity?.details && (
                  <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                    <pre className="text-xs text-foreground font-mono whitespace-pre-wrap">
                      {activity?.details}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredActivities?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Clock" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No activities found for the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;