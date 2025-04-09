// Plaid API service for financial data aggregation
import { PlaidLinkOnSuccess, PlaidLinkOnEvent, PlaidLinkOnExit } from 'react-plaid-link';
import { LinkedAccount, Transaction } from '../../../types/wealth';

// These would normally be environment variables
const PLAID_ENV = 'sandbox'; // sandbox, development, or production
const PLAID_CLIENT_ID = 'YOUR_CLIENT_ID';
const PLAID_SECRET = 'YOUR_SECRET';

// Mock API endpoint - in a real app, this would be your backend API
const API_BASE_URL = '/api/plaid';

// Types to match Plaid API responses
interface PlaidLinkToken {
  link_token: string;
  expiration: string;
}

interface PlaidAccessToken {
  access_token: string;
  item_id: string;
}

/**
 * Get a link token from Plaid to initialize Plaid Link
 */
export const createLinkToken = async (userId: string): Promise<PlaidLinkToken> => {
  try {
    // In a real app, this would be an API call to your backend
    // which would then call Plaid's /link/token/create endpoint
    
    // For demonstration, we're returning a mock response
    return {
      link_token: 'mock_link_token',
      expiration: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
    };
  } catch (error) {
    console.error('Error creating Plaid Link token:', error);
    throw error;
  }
};

/**
 * Exchange a public token for an access token after the user links their account
 */
export const exchangePublicToken = async (
  publicToken: string
): Promise<PlaidAccessToken> => {
  try {
    // In a real app, this would be an API call to your backend
    // which would then call Plaid's /item/public_token/exchange endpoint
    
    // For demonstration, we're returning a mock response
    return {
      access_token: 'mock_access_token',
      item_id: 'mock_item_id'
    };
  } catch (error) {
    console.error('Error exchanging public token:', error);
    throw error;
  }
};

/**
 * Get account information for the user
 */
export const getAccounts = async (userId: string): Promise<LinkedAccount[]> => {
  try {
    // In a real app, this would be an API call to your backend
    // which would then call Plaid's /accounts/get endpoint
    
    // For demonstration, we're returning mock data
    return [
      {
        id: 'acct_1',
        institutionId: 'ins_1',
        institutionName: 'Chase',
        accountType: 'checking',
        accountName: 'Chase Checking',
        accountNumber: 'xxxx1234',
        balance: 2500.75,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'acct_2',
        institutionId: 'ins_1',
        institutionName: 'Chase',
        accountType: 'savings',
        accountName: 'Chase Savings',
        accountNumber: 'xxxx5678',
        balance: 10000.50,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'acct_3',
        institutionId: 'ins_2',
        institutionName: 'Vanguard',
        accountType: 'investment',
        accountName: 'Vanguard IRA',
        accountNumber: 'xxxx9012',
        balance: 45000.25,
        currency: 'USD',
        lastUpdated: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
};

/**
 * Get transactions for the user's accounts
 */
export const getTransactions = async (
  userId: string,
  startDate: string,
  endDate: string
): Promise<Transaction[]> => {
  try {
    // In a real app, this would be an API call to your backend
    // which would then call Plaid's /transactions/get endpoint
    
    // For demonstration, we're returning mock data
    return [
      {
        id: 'txn_1',
        accountId: 'acct_1',
        amount: 45.67,
        currency: 'USD',
        date: '2023-05-01T00:00:00Z',
        description: 'WALMART',
        category: 'Shopping',
        merchantName: 'Walmart',
        pending: false
      },
      {
        id: 'txn_2',
        accountId: 'acct_1',
        amount: 12.34,
        currency: 'USD',
        date: '2023-05-02T00:00:00Z',
        description: 'STARBUCKS',
        category: 'Food and Drink',
        merchantName: 'Starbucks',
        pending: false
      },
      {
        id: 'txn_3',
        accountId: 'acct_2',
        amount: 500.00,
        currency: 'USD',
        date: '2023-05-03T00:00:00Z',
        description: 'TRANSFER',
        category: 'Transfer',
        pending: false
      }
    ];
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

/**
 * Unlink an account
 */
export const unlinkAccount = async (accountId: string): Promise<boolean> => {
  try {
    // In a real app, this would be an API call to your backend
    // which would then call Plaid's /item/remove endpoint
    
    // For demonstration, we're returning a mock response
    return true;
  } catch (error) {
    console.error('Error unlinking account:', error);
    throw error;
  }
};

/**
 * Create Plaid Link handler functions
 */
export const createPlaidLinkHandlers = (
  userId: string,
  onSuccess: (accountId: string) => void,
  onExit?: () => void
) => {
  const handleSuccess: PlaidLinkOnSuccess = async (public_token, metadata) => {
    try {
      // Exchange the public token for an access token
      const accessToken = await exchangePublicToken(public_token);
      
      // In a real app, you would save the access token and item ID to your database
      // along with the user ID and institution information
      
      // Notify the caller of success
      onSuccess(accessToken.item_id);
    } catch (error) {
      console.error('Error in Plaid Link success handler:', error);
    }
  };

  const handleExit: PlaidLinkOnExit = (error, metadata) => {
    if (error) {
      console.error('Error in Plaid Link:', error);
    }
    
    if (onExit) {
      onExit();
    }
  };

  const handleEvent: PlaidLinkOnEvent = (eventName, metadata) => {
    // Log or track Plaid Link events if needed
    console.log('Plaid Link event:', eventName, metadata);
  };

  return {
    onSuccess: handleSuccess,
    onExit: handleExit,
    onEvent: handleEvent
  };
};

/**
 * Sync account and transaction data to keep it up to date
 */
export const syncAccountData = async (userId: string): Promise<void> => {
  try {
    // In a real app, this would be an API call to your backend
    // which would then call appropriate Plaid endpoints to refresh data
    
    // For demonstration, we're just logging
    console.log(`Syncing account data for user ${userId}`);
  } catch (error) {
    console.error('Error syncing account data:', error);
    throw error;
  }
};