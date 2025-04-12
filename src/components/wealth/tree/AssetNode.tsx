import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Home, BarChart2, DollarSign, Briefcase, Package } from 'lucide-react';

interface AssetNodeData {
  label: string;
  type: 'real_estate' | 'investment' | 'cash' | 'business' | 'other';
  value: number;
  ownerId?: string;
  planned: boolean;
}

const AssetNode: React.FC<NodeProps<AssetNodeData>> = ({ data, selected }) => {
  // Formatting for dollar values
  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };
  
  // Get icon based on asset type
  const getAssetIcon = () => {
    switch (data.type) {
      case 'real_estate':
        return <Home size={14} className="text-blue-300" />;
      case 'investment':
        return <BarChart2 size={14} className="text-green-300" />;
      case 'cash':
        return <DollarSign size={14} className="text-gold" />;
      case 'business':
        return <Briefcase size={14} className="text-purple-300" />;
      default:
        return <Package size={14} className="text-neutral-300" />;
    }
  };
  
  return (
    <div 
      className={`
        min-w-[130px] max-w-[180px] bg-navy-900 rounded-sm 
        border ${selected ? 'border-blue-400 ring-1 ring-blue-400' : data.planned ? 'border-dashed border-blue-400/50' : 'border-navy-600'} 
        shadow-lg 
        ${data.planned ? 'opacity-70' : 'opacity-100'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-blue-400/70"
      />
      
      <div className="p-2">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 rounded-sm bg-navy-800 flex items-center justify-center border border-navy-700">
            {getAssetIcon()}
          </div>
          
          <div className="ml-2 overflow-hidden">
            <div className="text-xs font-medium text-neutral-200 truncate max-w-[120px]">{data.label}</div>
            <div className="text-xs text-neutral-400 capitalize">{data.type.replace('_', ' ')}</div>
          </div>
        </div>
        
        <div className="mt-1 text-right">
          <div className="text-[10px] uppercase tracking-wider text-neutral-400">Value</div>
          <div className="text-sm font-medium text-blue-300">{formatCurrency(data.value)}</div>
        </div>
        
        {data.planned && (
          <div className="mt-1 px-1.5 py-0.5 bg-blue-900/30 rounded-sm text-[10px] text-center text-blue-300">
            Planned Transfer
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetNode;