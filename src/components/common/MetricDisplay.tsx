import React from 'react';

export interface MetricDisplayProps {
  label: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  className = '',
  icon,
  trend,
  color = '#C9A861', // Default to gold color
}) => {
  // Determine the trend color
  const trendColor = trend 
    ? trend === 'up' 
      ? 'text-green-500' 
      : trend === 'down' 
        ? 'text-red-500' 
        : 'text-neutral-400'
    : '';
    
  // Create custom border styling with the provided color
  const borderStyle = {
    borderLeft: `2px solid ${color}`
  };
  
  return (
    <div 
      className={`bg-navy-700 p-3 hover:bg-navy-600 transition-colors ${className}`}
      style={borderStyle}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-neutral-400 uppercase tracking-wider">{label}</div>
        {icon && <div className="h-4 w-4 text-neutral-300">{icon}</div>}
      </div>
      <div className={`text-base font-medium ${trendColor}`}>{value}</div>
    </div>
  );
};

export default MetricDisplay;
