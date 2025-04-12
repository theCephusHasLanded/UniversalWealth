import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Shield, Users } from 'lucide-react';

interface TrustNodeData {
  label: string;
  type: 'revocable' | 'irrevocable' | 'charitable' | 'other';
  assets: number;
  totalValue: number;
  beneficiaries?: string[];
}

const TrustNode: React.FC<NodeProps<TrustNodeData>> = ({ data, selected }) => {
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
  
  return (
    <div 
      className={`
        min-w-[140px] bg-navy-900 rounded-sm 
        border ${selected ? 'border-purple-400 ring-1 ring-purple-400' : 'border-navy-600'} 
        shadow-lg
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-purple-400/70"
      />
      
      <div className="p-2">
        <div className="flex items-center mb-2">
          <div className="w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-700">
            <Shield size={14} className="text-purple-300" />
          </div>
          
          <div className="ml-2">
            <div className="text-xs font-medium text-neutral-200">{data.label}</div>
            <div className="text-xs text-neutral-400 capitalize">{data.type}</div>
          </div>
        </div>
        
        <div className="px-2 py-1.5 bg-navy-800/50 rounded-sm mb-1">
          <div className="flex justify-between items-center">
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">Assets</div>
            <div className="text-xs text-neutral-300">{data.assets}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">Value</div>
            <div className="text-xs text-purple-300">{formatCurrency(data.totalValue)}</div>
          </div>
        </div>
        
        {data.beneficiaries && data.beneficiaries.length > 0 && (
          <div className="mt-2 flex items-center">
            <Users size={12} className="text-purple-400 mr-1.5" />
            <div className="text-[10px] text-neutral-300">
              {data.beneficiaries.length} {data.beneficiaries.length === 1 ? 'Beneficiary' : 'Beneficiaries'}
            </div>
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-purple-400/70"
      />
    </div>
  );
};

export default TrustNode;