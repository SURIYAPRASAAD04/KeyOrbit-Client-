import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const ActivityChart = ({ chartType, onChartTypeChange }) => {
  const activityData = [
    { date: '2025-01-13', keyOps: 45, userActions: 23, policyChanges: 5, total: 73 },
    { date: '2025-01-14', keyOps: 52, userActions: 31, policyChanges: 8, total: 91 },
    { date: '2025-01-15', keyOps: 38, userActions: 19, policyChanges: 3, total: 60 },
    { date: '2025-01-16', keyOps: 67, userActions: 42, policyChanges: 12, total: 121 },
    { date: '2025-01-17', keyOps: 55, userActions: 28, policyChanges: 7, total: 90 },
    { date: '2025-01-18', keyOps: 71, userActions: 35, policyChanges: 9, total: 115 },
    { date: '2025-01-19', keyOps: 48, userActions: 26, policyChanges: 4, total: 78 }
  ];

  const eventTypeData = [
    { name: 'Key Operations', value: 376, color: '#0056B3' },
    { name: 'User Actions', value: 204, color: '#F28C00' },
    { name: 'Policy Changes', value: 48, color: '#10B981' },
    { name: 'Access Events', value: 89, color: '#EF4444' }
  ];

  const outcomeData = [
    { name: 'Success', value: 645, color: '#10B981' },
    { name: 'Warning', value: 52, color: '#F59E0B' },
    { name: 'Failure', value: 20, color: '#EF4444' }
  ];

  const chartTypes = [
    { id: 'activity', label: 'Activity Trends', icon: 'TrendingUp' },
    { id: 'events', label: 'Event Types', icon: 'PieChart' },
    { id: 'outcomes', label: 'Outcomes', icon: 'Target' }
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card border border-border p-3 rounded-lg shadow-orbital-lg">
          <p className="text-sm font-medium text-foreground mb-2">{formatDate(label)}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'activity':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="keyOps" stackId="a" fill="#0056B3" name="Key Operations" />
              <Bar dataKey="userActions" stackId="a" fill="#F28C00" name="User Actions" />
              <Bar dataKey="policyChanges" stackId="a" fill="#10B981" name="Policy Changes" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'events':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={eventTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                labelLine={false}
              >
                {eventTypeData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'outcomes':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={outcomeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
                labelLine={false}
              >
                {outcomeData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-lg border border-border p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Activity Analytics</h3>
        </div>
        <div className="flex items-center space-x-2">
          {chartTypes?.map((type) => (
            <button
              key={type?.id}
              onClick={() => onChartTypeChange(type?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                chartType === type?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Icon name={type?.icon} size={16} />
              <span className="hidden sm:inline">{type?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Chart */}
      <div className="w-full">
        {renderChart()}
      </div>
      {/* Legend/Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        {chartType === 'activity' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">376</div>
              <div className="text-sm text-muted-foreground">Key Operations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">204</div>
              <div className="text-sm text-muted-foreground">User Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">48</div>
              <div className="text-sm text-muted-foreground">Policy Changes</div>
            </div>
          </div>
        )}
        
        {chartType === 'events' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {eventTypeData?.map((item) => (
              <div key={item?.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{item?.value}</div>
                  <div className="text-xs text-muted-foreground">{item?.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {chartType === 'outcomes' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {outcomeData?.map((item) => (
              <div key={item?.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{item?.value}</div>
                  <div className="text-xs text-muted-foreground">{item?.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityChart;