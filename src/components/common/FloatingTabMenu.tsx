import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FloatingTabMenuProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  position?: 'right' | 'left';
}

const FloatingTabMenu: React.FC<FloatingTabMenuProps> = ({
  tabs,
  activeTab,
  onTabChange,
  position = 'right'
}) => {
  return (
    <div 
      className={`fixed top-1/2 transform -translate-y-1/2 z-30 ${
        position === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      <div className="bg-navy-800/90 backdrop-blur-sm border-l border-t border-b border-navy-700 shadow-xl">
        <div className="py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center w-16 py-4 group relative ${
                activeTab === tab.id ? 'text-gold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold"></div>
              )}
              
              {/* Icon */}
              <div 
                className={`mb-2 transition-transform group-hover:scale-110 ${
                  activeTab === tab.id ? 'text-gold' : 'text-neutral-400 group-hover:text-white'
                }`}
              >
                {tab.icon}
              </div>
              
              {/* Label */}
              <span className="text-xs uppercase tracking-wider">{tab.label}</span>
              
              {/* Active indicator dot */}
              {activeTab === tab.id && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingTabMenu;