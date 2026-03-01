import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const ActivityChart = ({ chartType, onChartTypeChange, stats, dailyActivity }) => {
  const chartTypes = [
    { id: 'activity', label: 'Activity Trends', icon: 'TrendingUp' },
    { id: 'events', label: 'Event Types', icon: 'PieChart' },
    { id: 'outcomes', label: 'Outcomes', icon: 'Target' }
  ];

  const eventTypeData = (stats?.event_types || []).map(item => ({
    name: item.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: item.count,
    color: getEventColor(item.type)
  }));

  const outcomeData = [
    { name: 'Success', value: stats?.success || 0, color: '#10B981' },
    { name: 'Failure', value: stats?.failure || 0, color: '#EF4444' },
    { name: 'Warning', value: stats?.warning || 0, color: '#F59E0B' }
  ];

  function getEventColor(eventType) {
    const colors = {
      KEY_GENERATED: '#0056B3',
      KEY_ROTATED: '#F28C00',
      KEY_REVOKED: '#EF4444',
      USER_LOGIN: '#10B981',
      USER_LOGOUT: '#6B7280',
      ACCESS_DENIED: '#EF4444',
      POLICY_CHANGE: '#8B5CF6'
    };
    return colors[eventType] || '#0056B3';
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card border border-border p-3 rounded-lg shadow-orbital-lg">
          <p className="text-sm font-medium text-foreground mb-2">{formatDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
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
            <LineChart data={dailyActivity} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#0056B3" 
                strokeWidth={2}
                dot={{ fill: '#0056B3', r: 4 }}
                activeDot={{ r: 6 }}
                name="Events"
              />
            </LineChart>
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {eventTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {outcomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
    <div className="glass-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Activity Analytics</h3>
          <span className="text-sm text-muted-foreground">Last 30 days</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {chartTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => onChartTypeChange(type.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                chartType === type.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              <Icon name={type.icon} size={16} />
              <span className="hidden sm:inline">{type.label}</span>
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
              <div className="text-2xl font-bold text-primary">{stats?.total || 0}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats?.success || 0}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error">{stats?.failure || 0}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        )}
        
        {chartType === 'events' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {eventTypeData.slice(0, 4).map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[100px]">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {chartType === 'outcomes' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {outcomeData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.name}</div>
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