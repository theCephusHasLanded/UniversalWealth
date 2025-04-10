import React from 'react';
import { Lock } from 'lucide-react';

interface MembersOnlyTeaserProps {
  title: string;
  description: string;
  image?: string;
  className?: string;
}

const MembersOnlyTeaser: React.FC<MembersOnlyTeaserProps> = ({
  title,
  description,
  image,
  className = '',
}) => {
  return (
    <div 
      className={`group relative overflow-hidden border border-charcoal-400 ${className}`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-500 via-navy-500/70 to-transparent transition-opacity group-hover:opacity-90"></div>
      
      {/* Blurred backdrop for non-image version */}
      {!image && (
        <div className="absolute inset-0 bg-navy-500 bg-opacity-90 backdrop-blur-sm"></div>
      )}
      
      <div className="relative p-6 h-full flex flex-col justify-end">
        <div className="flex items-center mb-2">
          <Lock size={16} className="text-gold mr-2" />
          <p className="text-xs uppercase tracking-wider text-gold">Members Only</p>
        </div>
        
        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-gold transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-neutral-300 mb-3 line-clamp-2 group-hover:line-clamp-none transition-all">
          {description}
        </p>
        
        <div className="mt-auto">
          <span className="text-xs uppercase tracking-wider text-gold opacity-0 group-hover:opacity-100 transition-opacity">
            Join to Unlock
          </span>
        </div>
      </div>
    </div>
  );
};

export default MembersOnlyTeaser;