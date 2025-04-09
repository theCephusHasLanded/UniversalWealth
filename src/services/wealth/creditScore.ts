/**
 * Get a user's credit score
 */
export const getCreditScore = async (userId: string): Promise<number> => {
  // In a real app, this would be an API call to get the credit score from a credit bureau API
  
  // For demonstration, we're returning a mock score between 300 and 850
  const minScore = 300;
  const maxScore = 850;
  
  // Generate a somewhat consistent score for the same user
  const userIdSum = userId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const seed = userIdSum % 100;
  
  // This will give a score between 580 and 800 based on the user ID
  const baseScore = 580 + Math.floor((seed / 100) * 220);
  
  // Add some randomness but keep it somewhat consistent
  const finalScore = Math.min(maxScore, Math.max(minScore, baseScore + Math.floor(Math.random() * 20) - 10));
  
  return finalScore;
};

/**
 * Get credit score factors that are affecting the score
 */
export const getCreditScoreFactors = async (userId: string): Promise<{ factor: string; impact: 'positive' | 'negative'; description: string }[]> => {
  // In a real app, this would be an API call to get credit score factors
  
  // For demonstration, we're returning mock factors
  return [
    {
      factor: 'Payment History',
      impact: 'positive',
      description: 'Your payment history shows consistently on-time payments.'
    },
    {
      factor: 'Credit Utilization',
      impact: 'negative',
      description: 'Your credit card balances are higher than recommended. Consider reducing utilization below 30%.'
    },
    {
      factor: 'Credit Age',
      impact: 'positive',
      description: 'The average age of your credit accounts is good.'
    },
    {
      factor: 'Recent Applications',
      impact: 'negative',
      description: 'You have several recent credit applications which may be impacting your score.'
    },
    {
      factor: 'Credit Mix',
      impact: 'positive',
      description: 'You have a good mix of different types of credit accounts.'
    }
  ];
};

/**
 * Get credit score improvement recommendations
 */
export const getCreditScoreRecommendations = async (userId: string): Promise<string[]> => {
  // In a real app, this would be an API call to get personalized recommendations
  
  // For demonstration, we're returning mock recommendations
  return [
    'Pay down credit card balances to below 30% of their limits',
    'Continue making all payments on time',
    'Avoid applying for new credit in the next 6 months',
    'Consider becoming an authorized user on a family member\'s long-standing credit card',
    'Dispute any inaccuracies found on your credit report'
  ];
};

/**
 * Track credit score history over time
 */
export const getCreditScoreHistory = async (userId: string, months: number = 12): Promise<{ date: string; score: number }[]> => {
  // In a real app, this would be an API call to get historical score data
  
  // For demonstration, we're generating mock history data
  const history: { date: string; score: number }[] = [];
  const currentScore = await getCreditScore(userId);
  
  // Generate data points for each month
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    // Generate a somewhat realistic score progression
    // More recent months are closer to current score
    const randomVariation = Math.floor(Math.random() * 20) - 10;
    const scoreTrend = Math.floor((i / months) * 40); // General upward trend over time
    const monthScore = Math.max(300, Math.min(850, currentScore - scoreTrend + randomVariation));
    
    history.push({
      date: date.toISOString().split('T')[0],
      score: monthScore
    });
  }
  
  // Sort by date, oldest first
  return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};