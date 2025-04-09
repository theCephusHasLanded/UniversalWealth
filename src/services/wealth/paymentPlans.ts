import { PaymentPlan } from '../../types/wealth';

/**
 * Get payment plans for a user
 */
export const getPaymentPlans = async (userId: string): Promise<PaymentPlan[]> => {
  // In a real app, this would be an API call to get payment plans from the database
  
  // For demonstration, we're returning mock data
  const mockPlans: PaymentPlan[] = [
    {
      id: 'plan-1',
      userId,
      name: 'Grocery Purchase',
      totalAmount: 235,
      remainingAmount: 117.5,
      installments: 4,
      installmentsPaid: 2,
      nextPaymentDate: '2023-05-15T00:00:00Z',
      nextPaymentAmount: 58.75,
      interestRate: 0,
      cashbackRate: 0.03,
      startDate: '2023-04-15T00:00:00Z',
      endDate: '2023-07-15T00:00:00Z',
      status: 'active'
    },
    {
      id: 'plan-2',
      userId,
      name: 'Medical Bill',
      totalAmount: 340,
      remainingAmount: 255,
      installments: 4,
      installmentsPaid: 1,
      nextPaymentDate: '2023-05-22T00:00:00Z',
      nextPaymentAmount: 85,
      interestRate: 0,
      cashbackRate: 0,
      startDate: '2023-04-22T00:00:00Z',
      endDate: '2023-07-22T00:00:00Z',
      status: 'active'
    }
  ];
  
  return mockPlans;
};

/**
 * Create a new payment plan
 */
export const createPaymentPlan = async (plan: Omit<PaymentPlan, 'id'>): Promise<PaymentPlan> => {
  // In a real app, this would be an API call to create a new payment plan
  
  // For demonstration, we're generating a new ID and returning the plan
  const newId = `plan-${Date.now()}`;
  const newPlan: PaymentPlan = { ...plan, id: newId };
  
  return newPlan;
};

/**
 * Update an existing payment plan
 */
export const updatePaymentPlan = async (planId: string, updates: Partial<PaymentPlan>): Promise<boolean> => {
  // In a real app, this would be an API call to update a payment plan
  
  // For demonstration, we're just logging and returning success
  console.log(`Updating plan ${planId} with:`, updates);
  return true;
};

/**
 * Make a payment on a payment plan
 */
export const makePayment = async (planId: string, amount: number): Promise<boolean> => {
  // In a real app, this would be an API call to record a payment
  
  // For demonstration, we're just logging and returning success
  console.log(`Recording payment of ${amount} for plan ${planId}`);
  return true;
};