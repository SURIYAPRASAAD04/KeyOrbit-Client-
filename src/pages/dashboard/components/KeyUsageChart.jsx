import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KeyUsageChart = () => {
  const [chartType, setChartType] = useState('usage');
  const [timeRange, setTimeRange] = useState('7d');

  const usageData = [
    { name: 'Mon', operations: 1240, generation: 45, rotation: 12 },
    { name: 'Tue', operations: 1890, generation: 67, rotation: 8 },
    { name: 'Wed', operations: 2100, generation: 89, rotation: 15 },
    { name: 'Thu', operations: 1750, generation: 34, rotation: 6 },
    { name: 'Fri', operations: 2300, generation: 78, rotation: 22 },
    { name: 'Sat', operations: 980, generation: 23, rotation: 4 },
    { name: 'Sun', operations: 1200, generation: 31, rotation: 9 }
  ];

  const algorithmData = [
    { name: 'AES-256', value: 45, color: '#0B0B52' },
    { name: 'RSA-4096', value: 28, color: '#0056B3' },
    { name: 'Kyber-1024', value: 15, color: '#F28C00' },
    { name: 'Dilithium-3', value: 8, color: '#10B981' },
    { name: 'SPHINCS+', value: 4, color: '#EF4444' }
  ];

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card p-3 border border-border shadow-orbital-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              ></div>
              <span className="text-muted-foreground capitalize">{entry?.dataKey}:</span>
              <span className="text-foreground font-medium">{entry?.value?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0];
      return (
        <div className="glass-card p-3 border border-border shadow-orbital-lg">
          <div className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data?.payload?.color }}
            ></div>
            <span className="text-foreground font-medium">{data?.name}</span>
            <span className="text-muted-foreground">
              {data?.value}% ({Math.round(data?.value * 2.47)} keys)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Key Analytics</h2>
            <p className="text-sm text-muted-foreground">
              {chartType === 'usage' ? 'Operations and activity trends' : 'Algorithm distribution'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted/30 rounded-lg p-1">
            <button
              onClick={() => setChartType('usage')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-150 ${
                chartType === 'usage' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Usage
            </button>
            <button
              onClick={() => setChartType('algorithms')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-150 ${
                chartType === 'algorithms' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Algorithms
            </button>
          </div>
        </div>
      </div>
      {chartType === 'usage' && (
        <>
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-sm text-muted-foreground">Time Range:</span>
            {timeRanges?.map((range) => (
              <button
                key={range?.value}
                onClick={() => setTimeRange(range?.value)}
                className={`px-3 py-1 text-sm font-medium rounded-lg transition-all duration-150 ${
                  timeRange === range?.value
                    ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                {range?.label}
              </button>
            ))}
          </div>

          {/* Usage Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(107, 114, 128, 0.8)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(107, 114, 128, 0.8)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="operations" fill="#0B0B52" radius={[2, 2, 0, 0]} />
                <Bar dataKey="generation" fill="#0056B3" radius={[2, 2, 0, 0]} />
                <Bar dataKey="rotation" fill="#F28C00" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Operations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-sm text-muted-foreground">Generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm text-muted-foreground">Rotation</span>
            </div>
          </div>
        </>
      )}
      {chartType === 'algorithms' && (
        <>
          {/* Algorithm Distribution */}
          <div className="h-80 w-full flex items-center">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={algorithmData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {algorithmData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Algorithm Legend */}
            <div className="w-1/2 space-y-3">
              {algorithmData?.map((algorithm, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: algorithm?.color }}
                    ></div>
                    <span className="text-sm font-medium text-foreground">
                      {algorithm?.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">
                      {algorithm?.value}%
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(algorithm?.value * 2.47)} keys
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {/* Export Button */}
      <div className="mt-6 pt-4 border-t border-border">
        <Button variant="outline" size="sm" iconName="Download">
          Export Chart Data
        </Button>
      </div>
    </div>
  );
};

export default KeyUsageChart;