import React, { useState } from 'react';
import { useLificosm } from '../contexts/LificosmContext';
import Card from '../components/common/Card';
import FloatingTabMenu, { TabItem } from '../components/common/FloatingTabMenu';
import { useTranslation } from '../contexts/TranslationContext';
import { Calendar, CreditCard, Landmark, ShoppingBag, Users, Receipt, Home, User } from 'lucide-react';

const LificosmPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser, wallet, events, businesses, marketplace, notifications } = useLificosm();
  const [activeTab, setActiveTab] = useState<'home' | 'wallet' | 'events' | 'marketplace'>('home');

  if (!currentUser || !wallet) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Lificosm</h2>
        <p>Please log in to access Lificosm services.</p>
        {/* Login form would go here */}
      </div>
    );
  }

  const renderHomeTab = () => (
    <div className="space-y-8">
      {/* Savings Goal */}
      <Card variant="elevated" className="bg-navy-800/80 backdrop-blur-sm">
        <div className="mb-4">
          <div className="flex items-center">
            <div className="h-px w-6 bg-gold mr-3"></div>
            <h3 className="text-sm uppercase tracking-widest text-gold">Savings Progress</h3>
          </div>
        </div>
        
        <div className="p-5 border-l border-gold/30 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-neutral-400 uppercase tracking-wider">Monthly Goal</span>
            <span className="text-sm text-white font-medium">${currentUser.savings.current} <span className="text-neutral-500">/ ${currentUser.savings.goal}</span></span>
          </div>
          <div className="h-1 bg-navy-700 overflow-hidden">
            <div 
              className="h-full bg-gold transition-all duration-1000" 
              style={{ width: `${(currentUser.savings.current / currentUser.savings.goal) * 100}%` }}
            ></div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-xs text-neutral-500">{Math.round((currentUser.savings.current / currentUser.savings.goal) * 100)}% Complete</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="h-px w-6 bg-gold mr-3"></div>
            <h4 className="text-xs uppercase tracking-widest text-gold">Member Perks</h4>
          </div>
          
          <div className="space-y-2 pl-6">
            {wallet.perks.map(perk => (
              <div key={perk.id} className="flex justify-between items-center p-4 bg-navy-700 border-l border-gold/40 hover:border-gold/70 transition-colors">
                <div>
                  <p className="text-sm text-white">{perk.name}</p>
                  {perk.expires && <p className="text-xs text-neutral-500 mt-1">Expires: {perk.expires}</p>}
                </div>
                <button 
                  className={`text-xs px-4 py-1.5 uppercase tracking-wider transition-colors ${
                    perk.used 
                      ? 'bg-navy-600 text-neutral-500 border border-navy-500' 
                      : 'bg-gold/10 text-gold border border-gold/30 hover:border-gold'
                  }`}
                  disabled={perk.used}
                >
                  {perk.used ? 'Used' : 'Redeem'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      {/* Upcoming Events */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="h-px w-6 bg-gold mr-3"></div>
          <h4 className="text-xs uppercase tracking-widest text-gold">Upcoming Events</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.slice(0, 2).map((event, idx) => (
            <Card 
              key={event.id} 
              variant="default" 
              hover
              className="group p-4 border-l-2 border-l-gold/50"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-gold transition-colors">{event.title}</p>
                  <p className="text-xs text-neutral-400 mt-2">{event.date} • {event.time}</p>
                  <p className="text-xs text-neutral-400">{event.location}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-navy-700 border border-navy-600 px-2 py-1 text-gold">+{event.pointsValue} pts</span>
                  <button className="text-xs text-gold mt-3 uppercase tracking-wider gold-underline">RSVP</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Local Businesses */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="h-px w-6 bg-gold mr-3"></div>
          <h4 className="text-xs uppercase tracking-widest text-gold">Featured Businesses</h4>
        </div>
        
        <div className="space-y-3">
          {businesses.map((business, idx) => (
            <Card 
              key={business.id} 
              variant={idx === 0 ? "bordered" : "default"} 
              hover
              className="p-4"
            >
              <div>
                <p className="text-sm font-medium text-white">{business.name}</p>
                <p className="text-xs text-neutral-400 mt-1">{business.address}</p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs bg-navy-700 border border-navy-600 px-2 py-1 text-gold">{business.pointsRate}x Points</span>
                  {business.cashbackRate && (
                    <span className="text-xs bg-navy-700 border border-navy-600 px-2 py-1 text-gold">
                      {business.cashbackRate * 100}% Cashback
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWalletTab = () => (
    <div className="space-y-8">
      <Card variant="glass" className="p-0 overflow-hidden">
        <div className="p-6 border-b border-navy-700">
          <div className="flex items-center mb-4">
            <div className="h-px w-6 bg-gold mr-3"></div>
            <h3 className="text-sm uppercase tracking-widest text-gold">Member Wallet</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-navy-700 p-5 border-l border-gold">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Lificredits</p>
              <p className="text-3xl font-light text-gold">{wallet.lificredits}</p>
              <p className="text-xs text-neutral-500 mt-1">Premium Points</p>
            </div>
            <div className="bg-navy-700 p-5 border-l border-neutral-500">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Cashback</p>
              <p className="text-3xl font-light text-white">${wallet.cashback.available.toFixed(2)}</p>
              {wallet.cashback.pending > 0 && (
                <p className="text-xs text-neutral-500 mt-1">
                  ${wallet.cashback.pending.toFixed(2)} pending
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="flex-1 bg-navy-700 hover:bg-navy-600 text-white text-xs uppercase tracking-wider py-3 border border-navy-600 transition-colors flex items-center justify-center">
              <Receipt size={16} className="mr-2" />
              Add Receipt
            </button>
            <button className="flex-1 bg-gold/10 hover:bg-gold/20 text-gold text-xs uppercase tracking-wider py-3 border border-gold/30 hover:border-gold/50 transition-colors">
              Transfer Points
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-navy-800/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-px w-6 bg-gold mr-3"></div>
              <h4 className="text-xs uppercase tracking-widest text-gold">Recent Activity</h4>
            </div>
            <button className="text-xs text-neutral-400 hover:text-gold transition-colors uppercase tracking-wider">
              View All
            </button>
          </div>
          
          <div className="space-y-4 pl-6">
            {wallet.transactions.map((transaction, idx) => (
              <div 
                key={transaction.id} 
                className={`flex justify-between pb-4 ${
                  idx < wallet.transactions.length - 1 ? 'border-b border-navy-700' : ''
                }`}
              >
                <div>
                  <p className="text-sm text-white">{transaction.description}</p>
                  <p className="text-xs text-neutral-500 mt-1">{transaction.date}</p>
                </div>
                <div className={`text-sm font-medium ${
                  transaction.type === 'earn' 
                    ? 'text-gold' 
                    : transaction.type === 'cashback' 
                      ? 'text-green-400' 
                      : 'text-neutral-400'
                }`}>
                  {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                  {transaction.type === 'cashback' && ' USD'}
                  {transaction.type === 'earn' && ' pts'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      
      <div className="p-5 border border-navy-700 bg-navy-800/50 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <p className="text-white text-sm">Membership Level</p>
          <span className="text-gold text-sm">{currentUser.tier}</span>
        </div>
        
        <div className="h-1 bg-navy-700 overflow-hidden mb-2">
          <div 
            className="h-full bg-gold transition-all duration-1000" 
            style={{ width: '65%' }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-neutral-500">You need 1,200 more points to reach Gold status</span>
          <button className="text-xs text-gold uppercase tracking-wider">
            Benefits
          </button>
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <div className="h-px w-6 bg-gold mr-3"></div>
        <h3 className="text-sm uppercase tracking-widest text-gold">{t('lificosm.events.title')}</h3>
      </div>
      
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-neutral-200">{t('lificosm.events.subtitle')}</p>
        <select className="bg-navy-700 text-xs text-white p-2 border border-navy-600 hover:border-gold/30 focus:border-gold/50 focus:outline-none transition-colors">
          <option>{t('lificosm.events.all')}</option>
          <option>{t('lificosm.events.education')}</option>
          <option>{t('lificosm.events.culture')}</option>
          <option>{t('lificosm.events.community')}</option>
        </select>
      </div>
      
      <div className="space-y-5">
        {events.map((event, idx) => (
          <Card 
            key={event.id} 
            variant={idx === 0 ? "bordered" : "default"}
            hover
            className="group p-5 overflow-hidden"
          >
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors">{event.title}</h4>
                  <div className="flex items-center mt-2">
                    <p className="text-xs text-neutral-400">{event.date} • {event.time}</p>
                    <div className="h-1 w-1 rounded-full bg-neutral-600 mx-2"></div>
                    <p className="text-xs text-neutral-400">{event.location}</p>
                  </div>
                </div>
                <span className="text-xs bg-navy-700 border border-navy-600 px-3 py-1 text-gold">+{event.pointsValue} pts</span>
              </div>
            </div>
            
            <p className="text-xs text-neutral-300 mb-4 border-l border-navy-600 pl-3 leading-relaxed">{event.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users size={14} className="text-neutral-400 mr-2" />
                <span className="text-xs text-neutral-400">
                  {event.attendees.length}{event.capacity ? `/${event.capacity}` : ''} {t('lificosm.events.attending')}
                </span>
              </div>
              <button className="text-xs text-gold uppercase tracking-wider px-4 py-1.5 border border-gold/30 hover:bg-gold/10 transition-colors">
                {event.attendees.includes(currentUser.id) ? t('lificosm.events.registered') : t('lificosm.events.rsvp')}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMarketplaceTab = () => (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <div className="h-px w-6 bg-gold mr-3"></div>
        <h3 className="text-sm uppercase tracking-widest text-gold">{t('lificosm.marketplace.title')}</h3>
      </div>
      
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-neutral-200">{t('lificosm.marketplace.subtitle')}</p>
        <button className="bg-gold/10 hover:bg-gold/20 text-gold text-xs px-4 py-2 border border-gold/30 hover:border-gold/50 transition-colors uppercase tracking-wider">
          + {t('lificosm.marketplace.newListing')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        {marketplace.map((item, idx) => (
          <Card 
            key={item.id} 
            variant={idx % 3 === 0 ? "bordered" : "default"}
            hover
            className="group p-5"
          >
            <div className="flex justify-between mb-3">
              <span className="text-xs text-neutral-400 uppercase tracking-wider">{item.category}</span>
              {item.isExchange ? (
                <span className="text-xs bg-navy-700 text-gold border border-gold/30 px-3 py-0.5">
                  {t('lificosm.marketplace.exchange')}
                </span>
              ) : (
                <span className="text-xs bg-navy-700 text-white border border-navy-600 px-3 py-0.5">
                  {t('lificosm.marketplace.forSale')}
                </span>
              )}
            </div>
            
            <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors mb-2">{item.title}</h4>
            <p className="text-xs text-neutral-300 mb-4 border-l border-navy-600 pl-3 leading-relaxed">{item.description}</p>
            
            <div className="flex justify-between items-center">
              <div>
                {item.price && (
                  <span className="text-sm font-medium text-white">${item.price.toFixed(2)}</span>
                )}
                {item.pointsValue && (
                  <span className="text-sm font-medium text-gold ml-3">{item.pointsValue} pts</span>
                )}
              </div>
              <button className="text-xs text-gold uppercase tracking-wider px-4 py-1.5 border border-gold/30 hover:bg-gold/10 transition-colors">
                {t('lificosm.marketplace.contact')}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return renderHomeTab();
      case 'wallet': return renderWalletTab();
      case 'events': return renderEventsTab();
      case 'marketplace': return renderMarketplaceTab();
      default: return renderHomeTab();
    }
  };

  // Define tabs for the floating menu
  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'wallet', label: 'Wallet', icon: <CreditCard size={20} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={20} /> },
    { id: 'marketplace', label: 'Market', icon: <ShoppingBag size={20} /> },
  ];

  return (
    <div className="pb-8 pr-20"> {/* Added right padding to accommodate the floating menu */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-1 h-12 mr-4 bg-gold"></div>
          <div>
            <h2 className="text-sm uppercase tracking-widest text-gold mb-1">LIFICOSM</h2>
            <p className="text-white text-sm font-light">Community-powered exclusive membership platform</p>
          </div>
        </div>
        
        {/* User profile summary - Enhanced version */}
        <div className="bg-navy-800 border border-navy-700 p-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="relative h-16 w-16 bg-navy-700 border-2 border-gold/50 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                {/* User avatar with gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-600 to-navy-900 opacity-50"></div>
                <User size={32} className="text-gold relative z-10" />
                {/* Elite tier indicator */}
                <div className="absolute bottom-0 left-0 right-0 bg-gold/80 text-[10px] text-navy-900 text-center font-semibold py-0.5">
                  ELITE
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{currentUser.name}</p>
                <div className="flex flex-col sm:flex-row sm:items-center text-xs mt-1">
                  <span className="inline-flex items-center text-gold">
                    <span className="inline-block w-2 h-2 bg-gold rounded-full mr-1.5"></span>
                    {currentUser.tier} Member
                  </span>
                  <div className="hidden sm:block h-1 w-1 rounded-full bg-neutral-500 mx-2"></div>
                  <span className="text-neutral-400 mt-1 sm:mt-0">{wallet.lificredits} Credits</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="text-center sm:text-right">
                <span className="text-xs text-neutral-400 block mb-1">Wealth Score</span>
                <span className="text-lg font-light text-gold">768</span>
                <span className="text-xs text-green-400 ml-2">+12%</span>
              </div>
              <button className="px-3 py-1.5 bg-gold/10 border border-gold/30 hover:border-gold/60 hover:bg-gold/20 text-xs text-gold uppercase tracking-wider transition-colors">
                View Profile
              </button>
            </div>
          </div>
          
          {/* User progress card */}
          <div className="mt-5 border-t border-navy-700 pt-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="h-px w-5 bg-gold mr-2"></div>
                <h3 className="text-xs uppercase tracking-wider text-gold">Personal Prosperity Plan</h3>
              </div>
              <span className="text-xs text-neutral-400">3 of 5 complete</span>
            </div>
            
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              <div className="h-1.5 bg-gold rounded-sm"></div>
              <div className="h-1.5 bg-gold rounded-sm"></div>
              <div className="h-1.5 bg-gold rounded-sm"></div>
              <div className="h-1.5 bg-navy-700 rounded-sm"></div>
              <div className="h-1.5 bg-navy-700 rounded-sm"></div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="px-2 py-0.5 text-2xs tracking-wide rounded-sm border border-gold/20 bg-gold/10 text-gold">
                <span className="mr-1.5">✓</span>Credit Score Boost
              </div>
              <div className="px-2 py-0.5 text-2xs tracking-wide rounded-sm border border-gold/20 bg-gold/10 text-gold">
                <span className="mr-1.5">✓</span>Emergency Fund
              </div>
              <div className="px-2 py-0.5 text-2xs tracking-wide rounded-sm border border-gold/20 bg-gold/10 text-gold">
                <span className="mr-1.5">✓</span>Investment Start
              </div>
              <div className="px-2 py-0.5 text-2xs tracking-wide rounded-sm border border-navy-700 bg-navy-800 text-neutral-400">
                Passive Income
              </div>
              <div className="px-2 py-0.5 text-2xs tracking-wide rounded-sm border border-navy-700 bg-navy-800 text-neutral-400">
                Asset Diversification
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderContent()}
      
      {/* Floating tab menu */}
      <FloatingTabMenu 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as any)}
        position="right"
      />
    </div>
  );
};

export default LificosmPage;