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
    <div className="">
      
    </div>
  );
};

export default KeyUsageChart;