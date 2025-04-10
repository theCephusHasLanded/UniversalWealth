import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Gift, Users, CheckCircle, Clock, ArrowRight, Globe } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useTranslation } from '../contexts/TranslationContext';
import { useUser } from '../contexts/UserContext';
import UserAvatar from '../components/common/UserAvatar';
import EyeLogo from '../components/common/EyeLogo';
import Logo from '../components/common/Logo';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  const [inviteCode, setInviteCode] = useState<string>('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [invitesSent, setInvitesSent] = useState(0);
  const [invitesAccepted, setInvitesAccepted] = useState(0);
  const [avatars, setAvatars] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  // Generate user invitation code on component mount
  useEffect(() => {
    // Generate a unique invitation code based on userId or random if no user
    const userId = currentUser?.uid || Math.random().toString(36).substring(2, 8);
    const codeBase = userId.substring(0, 6).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    setInviteCode(`${codeBase}-${randomPart}`);
    
    // Mock data for invites
    setInvitesSent(Math.floor(Math.random() * 10));
    setInvitesAccepted(Math.floor(Math.random() * 5));
    
    // Generate mock avatars for invited users
    generateMockAvatars();
  }, [currentUser]);
  
  // Function to generate mock avatars
  const generateMockAvatars = () => {
    const mockAvatars = [];
    const count = Math.floor(Math.random() * 5) + 3; // 3-7 avatars
    
    for (let i = 0; i < count; i++) {
      mockAvatars.push({
        id: `user-${i}`,
        name: `User ${i + 1}`,
        status: i < 3 ? 'active' : 'pending'
      });
    }
    
    setAvatars(mockAvatars);
  };
  
  // Copy invitation code to clipboard
  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCodeCopied(true);
    
    setTimeout(() => {
      setCodeCopied(false);
    }, 2000);
  };
  
  // Generate new invitation code
  const generateNewCode = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const userId = currentUser?.uid || Math.random().toString(36).substring(2, 8);
      const codeBase = userId.substring(0, 6).toUpperCase();
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      setInviteCode(`${codeBase}-${randomPart}`);
      setIsGenerating(false);
    }, 1500);
  };
  
  const platforms = [
    {
      id: 'wealth',
      name: 'WEALTH BY LKHN',
      description: 'Financial inclusion platform with AI assistant and Pay-in-4 credit building',
      color: '#45B26B',
      metrics: [
        { label: 'Users', value: '12,582' },
        { label: 'Avg. Credit Increase', value: '+58 pts' },
        { label: 'Total Capital Accessed', value: formatCurrency(8400000) }
      ]
    },
    {
      id: 'hub',
      name: 'LKHN HUB',
      description: 'Physical spaces for community, creation, and financial education',
      color: '#6E56CF',
      metrics: [
        { label: 'Active Locations', value: '2' },
        { label: 'Monthly Visitors', value: '3,450' },
        { label: 'Local Businesses Supported', value: '48' }
      ]
    },
    {
      id: 'trendcrypto',
      name: 'LKHN TRENDCRYPTO',
      description: 'AI-powered crypto analysis with focus on XRP and emerging coins',
      color: '#2D81FF',
      metrics: [
        { label: 'Premium Users', value: '4,218' },
        { label: 'Trend Detection Lead Time', value: '3.2 days' },
        { label: 'Avg. Portfolio Performance', value: '+32%' }
      ]
    }
  ];
  
  const communityImpact = {
    metrics: [
      { label: 'Community Investment', value: formatCurrency(12500000) },
      { label: 'Avg Credit Score Increase', value: '+72 points' },
      { label: 'Jobs Created', value: '185' },
      { label: 'Financial Literacy Workshops', value: '327' }
    ]
  };
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Welcome Card with Invitation Code */}
      <Card variant="glass" className="p-6 animate-slide-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
          <EyeLogo size={256} variant="gold" expressiveness="low" />
        </div>
        
        <div className="relative z-10 mb-8">
          <div className="flex items-center mb-2">
            <div className="h-px w-6 bg-gold mr-2"></div>
            <h2 className="text-sm font-normal tracking-widest text-gold uppercase">{t('dashboard.welcome') || 'WELCOME'}</h2>
          </div>
          
          <h1 className="text-2xl text-white mt-4 mb-2">
            Hello, {currentUser?.displayName?.split(' ')[0] || 'Member'}
          </h1>
          
          <p className="text-neutral-300 text-base leading-relaxed max-w-2xl">
            Welcome to the LKHN Universal Wealth ecosystem. Your unique invitation code allows you to bring others into this exclusive platform.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-1/2 bg-navy-800 border border-navy-700 p-5 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Gift size={16} className="text-gold mr-2" />
                <h3 className="text-sm uppercase tracking-wider text-white">Your Invitation Code</h3>
              </div>
              
              <div className="flex-shrink-0">
                <div className="px-2 py-1 bg-navy-700 border border-navy-600 rounded-sm">
                  <span className="text-xs text-neutral-400">Expiry: 30 days</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center bg-navy-900 border border-navy-700 p-4 mb-4 rounded-sm">
              <div className="text-lg font-mono text-gold tracking-wider flex-grow font-semibold">
                {inviteCode}
              </div>
              
              <button 
                className="ml-2 p-2 hover:bg-navy-700 transition-colors rounded-sm text-neutral-400 hover:text-gold"
                onClick={copyInviteCode}
                title="Copy invitation code"
              >
                {codeCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            
            <div className="flex justify-between">
              <div>
                <div className="text-xs text-neutral-400 mb-1">Invites Sent</div>
                <div className="flex items-center">
                  <Users size={14} className="text-gold mr-1" />
                  <span className="text-sm text-white">{invitesSent}</span>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-neutral-400 mb-1">Invites Accepted</div>
                <div className="flex items-center">
                  <CheckCircle size={14} className="text-green-500 mr-1" />
                  <span className="text-sm text-white">{invitesAccepted}</span>
                </div>
              </div>
              
              <div>
                <button 
                  className="text-xs text-gold hover:text-gold/70 flex items-center"
                  onClick={generateNewCode}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Clock size={12} className="mr-1 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={12} className="mr-1" />
                      Generate New
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="mb-3 flex items-center">
              <div className="h-px w-4 bg-gold/50 mr-2"></div>
              <h3 className="text-xs uppercase tracking-wider text-gold/80">Your Circle</h3>
            </div>
            
            <div className="bg-navy-800 border border-navy-700 p-5 rounded-sm">
              <div className="mb-4">
                <div className="text-sm text-white mb-2">People you've invited</div>
                <div className="flex flex-wrap -mx-1">
                  {avatars.map((avatar, index) => (
                    <div key={avatar.id} className={`p-1 transition-all ${avatar.status === 'pending' ? 'opacity-50' : 'opacity-100'}`}>
                      <div className="relative">
                        <UserAvatar 
                          userId={avatar.id} 
                          displayName={avatar.name}
                          size="md"
                          interactive={true}
                        />
                        {avatar.status === 'pending' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-navy-800 rounded-full border border-navy-700 flex items-center justify-center">
                            <Clock size={6} className="text-gold" />
                          </div>
                        )}
                        {avatar.status === 'active' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-navy-700"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="p-1">
                    <button className="w-10 h-10 rounded-full border border-dashed border-gold/30 flex items-center justify-center text-gold/50 hover:text-gold hover:border-gold/60 transition-all">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-neutral-400 mb-4">
                Invite up to 10 people with your exclusive code. Every successful invitation earns you 25 LKHN points.
              </div>
              
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard/main')}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Community Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {platforms.map(platform => (
          <div 
            key={platform.id} 
            className="bg-navy-800 border border-navy-700 hover:border-[color:var(--platform-color)] transition-colors p-5 cursor-pointer rounded-sm"
            style={{ '--platform-color': platform.color } as React.CSSProperties}
            onClick={() => navigate(`/${platform.id}`)}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: platform.color }}></div>
              <div className="text-sm uppercase tracking-wider text-white">{platform.name}</div>
            </div>
            
            <div className="text-xs text-neutral-400 mt-3 mb-4">{platform.description}</div>
            
            <div className="h-1 w-full bg-gradient-to-r rounded-sm" style={{ background: `linear-gradient(to right, ${platform.color}10, transparent)` }}></div>
          </div>
        ))}
      </div>
      
      {/* Features highlight */}
      <Card variant="bordered" className="p-6 animate-slide-up rounded-sm" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center mb-5">
          <div className="h-px w-6 bg-gold mr-2"></div>
          <h2 className="text-sm font-normal tracking-widest text-gold uppercase">UNIVERSAL WEALTH</h2>
        </div>
        
        <p className="text-neutral-300 mb-6">
          A new paradigm for wealth that integrates technological innovation with human connection, 
          curated experiences with democratized access, and exclusive insights with collective benefit.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {communityImpact.metrics.map((metric, index) => (
            <div key={index} className="border border-navy-700 p-4 rounded-sm">
              <div className="text-xs text-neutral-400 mb-2">{metric.label}</div>
              <div className="text-xl text-white font-light">{metric.value}</div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setShowIntegrationModal(true)}
          className="text-white text-xs uppercase tracking-wider flex items-center opacity-70 hover:opacity-100 transition-opacity"
        >
          EXPLORE QUANTUM INTEGRATION <ArrowRight size={14} className="ml-1" />
        </button>
      </Card>
    </div>
  );
};

// Plus icon component
const Plus = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default Dashboard;
