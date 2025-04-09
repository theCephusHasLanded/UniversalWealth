import { CommunityInvestment } from '../../types/wealth';

/**
 * Get community investments for a user
 */
export const getCommunityInvestments = async (userId: string): Promise<CommunityInvestment[]> => {
  // In a real app, this would be an API call to get community investments from the database
  
  // For demonstration, we're returning mock data
  const mockInvestments: CommunityInvestment[] = [
    {
      id: 'invest-1',
      name: 'Bronx Small Business Fund',
      description: 'Community investment fund supporting small businesses in the Bronx area.',
      totalCapital: 2500000,
      investorCount: 48,
      startDate: '2024-01-15T00:00:00Z',
      performance: 15.2,
      userInvestment: 2000,
      category: 'smallBusiness'
    },
    {
      id: 'invest-2',
      name: 'Community Solar Project',
      description: 'Renewable energy project bringing solar power to underserved communities.',
      totalCapital: 1300000,
      investorCount: 112,
      startDate: '2024-03-10T00:00:00Z',
      performance: 8.7,
      userInvestment: 3340,
      category: 'renewable'
    }
  ];
  
  return mockInvestments;
};

/**
 * Get details of a specific community investment
 */
export const getCommunityInvestmentDetails = async (
  investmentId: string
): Promise<CommunityInvestment | null> => {
  // In a real app, this would be an API call to get details for a specific investment
  
  // For demonstration, we're returning mock data
  const mockInvestments = await getCommunityInvestments('');
  return mockInvestments.find(i => i.id === investmentId) || null;
};

/**
 * Invest in a community fund
 */
export const investInCommunity = async (
  userId: string,
  investmentId: string,
  amount: number
): Promise<boolean> => {
  // In a real app, this would be an API call to record a new investment
  
  // For demonstration, we're just returning success
  console.log(`User ${userId} investing ${amount} in fund ${investmentId}`);
  return true;
};

/**
 * Withdraw from a community investment
 */
export const withdrawFromCommunity = async (
  userId: string,
  investmentId: string,
  amount: number
): Promise<boolean> => {
  // In a real app, this would be an API call to record a withdrawal
  
  // For demonstration, we're just returning success
  console.log(`User ${userId} withdrawing ${amount} from fund ${investmentId}`);
  return true;
};