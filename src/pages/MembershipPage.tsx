import React, { useState, useEffect } from 'react';
import { Copy, Check, Gift, Users, CheckCircle, Clock, ArrowRight, Award, Star, Shield, Trophy, User } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useTranslation } from '../contexts/TranslationContext';
import { useUser } from '../contexts/UserContext';
import UserAvatar from '../components/common/UserAvatar';
import EyeLogo from '../components/common/EyeLogo';

const MembershipPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useUser();
  
  const [inviteCode, setInviteCode] = useState<string>('');
  const [codeCopied, setCodeCopied] = useState(false);
  const [invitesSent, setInvitesSent] = useState(0);
  const [invitesAccepted, setInvitesAccepted] = useState(0);
  const [avatars, setAvatars] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [membershipTier, setMembershipTier] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('silver');
  const [membershipPoints, setMembershipPoints] = useState(0);
  const [memberSince, setMemberSince] = useState('');
  
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
    
    // Mock data for membership
    setMembershipPoints(750 + Math.floor(Math.random() * 500));
    
    // Create member since date (random date in the past year)
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 365) + 30; // 30-395 days ago
    const memberSinceDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    setMemberSince(memberSinceDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    
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
  
  // Determine membership tier color
  const getTierColor = () => {
    switch (membershipTier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#C9A861';
      case 'platinum': return '#E5E4E2';
      default: return '#C0C0C0';
    }
  };
  
  // Benefits per tier
  const tierBenefits = {
    bronze: [
      'Access to community forums',
      'Basic credit-building tools',
      'Entry-level educational content'
    ],
    silver: [
      'All Bronze benefits',
      'AI-powered financial insights',
      'TrendCrypto market alerts',
      'Priority Hub space booking'
    ],
    gold: [
      'All Silver benefits',
      'Premium TrendCrypto analysis',
      'Exclusive investment opportunities',
      'VIP event access',
      'Personalized wealth strategy'
    ],
    platinum: [
      'All Gold benefits',
      'Concierge financial services',
      'Custom AI strategy modeling',
      'Invitation to private investment circles',
      'Priority access to limited offers',
      'Dedicated wealth advisor'
    ]
  };
  
  // Tier icons
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Trophy size={18} />;
      case 'silver': return <Shield size={18} />;
      case 'gold': return <Star size={18} />;
      case 'platinum': return <Award size={18} />;
      default: return <Shield size={18} />;
    }
  };
  
  // Points needed for next tier
  const getNextTierPoints = () => {
    switch (membershipTier) {
      case 'bronze': return 500;
      case 'silver': return 1500;
      case 'gold': return 5000;
      case 'platinum': return null; // Already at highest tier
      default: return 1500;
    }
  };
  
  const nextTierPoints = getNextTierPoints();
  const progress = nextTierPoints ? (membershipPoints / nextTierPoints) * 100 : 100;
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Membership Header */}
      <div className="relative">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <EyeLogo size={256} variant="gold" expressiveness="low" />
        </div>
        
        <div className="flex items-center mb-2">
          <div className="h-px w-6 bg-gold mr-2"></div>
          <h2 className="text-sm font-normal tracking-widest text-gold uppercase">MEMBERSHIP & INVITATION</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* Membership Status */}
          <Card variant="glass" className="p-6 flex-1 relative overflow-hidden">
            <div className="flex items-center mb-4">
              {getTierIcon(membershipTier)}
              <h3 className="ml-2 text-base uppercase tracking-wider font-medium" style={{ color: getTierColor() }}>
                {membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1)} Tier
              </h3>
            </div>
            
            <div className="text-xs text-neutral-400 mb-1">Member since</div>
            <div className="text-sm text-white mb-4">{memberSince}</div>
            
            <div className="text-xs text-neutral-400 mb-1">Membership Points</div>
            <div className="text-2xl text-white mb-2">{membershipPoints}</div>
            
            {nextTierPoints && (
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-400">Current</span>
                  <span className="text-neutral-400">Next Tier: {nextTierPoints}</span>
                </div>
                <div className="h-1.5 w-full bg-navy-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${progress}%`, 
                      background: `linear-gradient(90deg, ${getTierColor()}80, ${getTierColor()})` 
                    }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="mt-4 mb-2 text-xs text-neutral-400">TIER BENEFITS</div>
            <ul className="space-y-2">
              {tierBenefits[membershipTier].map((benefit, index) => (
                <li key={index} className="flex items-start text-sm">
                  <div className="h-4 w-4 bg-navy-700 border border-gold flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                    <div className="h-1.5 w-1.5 bg-gold"></div>
                  </div>
                  <span className="text-neutral-200">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
          
          {/* Invitation Code */}
          <div className="flex-1">
            <Card variant="glass" className="p-6 mb-6">
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
            </Card>
            
            <Card variant="glass" className="p-6">
              <div className="mb-3 flex items-center">
                <div className="h-px w-4 bg-gold/50 mr-2"></div>
                <h3 className="text-xs uppercase tracking-wider text-gold/80">Your Circle</h3>
              </div>
              
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
                Invite up to 10 people with your exclusive code. Every successful invitation earns you 25 LKHN points toward your next tier.
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Invitation Benefits */}
      <Card variant="bordered" className="p-6 animate-slide-up">
        <div className="flex items-center mb-5">
          <div className="h-px w-6 bg-gold mr-2"></div>
          <h2 className="text-sm font-normal tracking-widest text-gold uppercase">INVITATION BENEFITS</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
          <div className="border border-navy-700 p-5 rounded-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center mr-3">
                <Trophy size={16} className="text-gold" />
              </div>
              <div className="text-sm text-white">Tier Points</div>
            </div>
            <p className="text-xs text-neutral-400">
              Earn 25 membership points for each successful invitation, helping you reach the next tier faster.
            </p>
          </div>
          
          <div className="border border-navy-700 p-5 rounded-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center mr-3">
                <Users size={16} className="text-gold" />
              </div>
              <div className="text-sm text-white">Community Expansion</div>
            </div>
            <p className="text-xs text-neutral-400">
              Build your own circle within the LKHN ecosystem, creating a powerful network of trusted connections.
            </p>
          </div>
          
          <div className="border border-navy-700 p-5 rounded-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center mr-3">
                <Award size={16} className="text-gold" />
              </div>
              <div className="text-sm text-white">Exclusive Rewards</div>
            </div>
            <p className="text-xs text-neutral-400">
              Access special bonuses and limited opportunities when your invitation network reaches certain milestones.
            </p>
          </div>
        </div>
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

export default MembershipPage;