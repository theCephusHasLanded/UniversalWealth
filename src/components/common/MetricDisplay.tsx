import React from 'react';

export interface MetricDisplayProps {
  label: string;
  value: string;
  className?: string;
  icon?: React.ReactNode;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({
  label,
  value,
  className = '',
  icon,
}) => {
  return (
    <div className={`bg-gray-900 p-3 rounded-sm ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-gray-400">{label}</div>
        {icon && <div className="h-4 w-4">{icon}</div>}
      </div>
      <div className="text-base font-medium">{value}</div>
    </div>
  );
};

export default MetricDisplay;
