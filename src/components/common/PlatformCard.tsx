import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
}

interface PlatformCardProps {
  name: string;
  description: string;
  color: string;
  metrics: Metric[];
  onClick?: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  name,
  description,
  color,
  metrics,
  onClick,
}) => {
  return (
    <div 
      className="group bg-navy-800 p-5 border border-navy-700 hover:border-gold/30 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-1 h-12 mr-4" style={{ backgroundColor: color }}></div>
          <div>
            <div className="text-sm uppercase tracking-wider text-white font-medium">{name}</div>
            <div className="text-xs text-neutral-400 mt-1 line-clamp-2">{description}</div>
          </div>
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-navy-700/50 group-hover:bg-navy-700 transition-colors">
          <ChevronRight size={16} className="text-neutral-400 group-hover:text-gold transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-navy-700">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-neutral-500 uppercase tracking-wider">{metric.label}</div>
            <div className="text-sm font-medium mt-1 text-white group-hover:text-gold transition-colors">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformCard;
