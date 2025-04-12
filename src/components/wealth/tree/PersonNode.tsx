import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { User } from 'lucide-react';
import UserAvatar from '../../common/UserAvatar';

interface PersonNodeData {
  label: string;
  role: 'primary' | 'spouse' | 'child' | 'other';
  assets: number;
  totalValue: number;
  photoURL?: string;
}

const roleColors = {
  primary: 'border-gold',
  spouse: 'border-gold/70',
  child: 'border-blue-400/70',
  other: 'border-neutral-500',
};

const PersonNode: React.FC<NodeProps<PersonNodeData>> = ({ data, selected }) => {
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
    <div className={`min-w-[140px] bg-navy-800 rounded-sm border ${selected ? 'border-gold ring-1 ring-gold' : 'border-navy-700'} shadow-lg`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-gold/70"
      />
      
      <div className="p-2">
        <div className="flex items-center mb-2">
          <div className={`w-7 h-7 rounded-full overflow-hidden border-2 ${roleColors[data.role]}`}>
            {data.photoURL ? (
              <img src={data.photoURL} alt={data.label} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-navy-700">
                <User size={14} className="text-neutral-300" />
              </div>
            )}
          </div>
          
          <div className="ml-2">
            <div className="text-xs font-medium text-neutral-200">{data.label}</div>
            <div className="text-xs text-neutral-400">{data.role}</div>
          </div>
        </div>
        
        {data.totalValue > 0 && (
          <div className="px-2 py-1.5 bg-navy-900/50 rounded-sm mb-1">
            <div className="flex justify-between items-center">
              <div className="text-[10px] uppercase tracking-wider text-neutral-400">Assets</div>
              <div className="text-xs text-neutral-300">{data.assets}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-[10px] uppercase tracking-wider text-neutral-400">Value</div>
              <div className="text-xs text-gold/90">{formatCurrency(data.totalValue)}</div>
            </div>
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-gold/70"
      />
    </div>
  );
};

export default PersonNode;