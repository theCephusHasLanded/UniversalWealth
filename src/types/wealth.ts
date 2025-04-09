export interface WealthProfile {
  userId: string;
  creditScore?: number;
  availableCredit?: number;
  savingsBalance?: number;
  investmentBalance?: number;
  linkedAccounts: LinkedAccount[];
  familyMembers: FamilyMember[];
  financialGoals: FinancialGoal[];
  assetAllocation?: AssetAllocation;
}

export interface LinkedAccount {
  id: string;
  institutionId: string;
  institutionName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment' | 'loan' | 'mortgage';
  accountName: string;
  accountNumber: string; // Masked account number
  balance: number;
  currency: string;
  lastUpdated: string; // ISO date string
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  date: string; // ISO date string
  description: string;
  category: string;
  merchantName?: string;
  pending: boolean;
}

export interface PaymentPlan {
  id: string;
  userId: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  installments: number;
  installmentsPaid: number;
  nextPaymentDate: string; // ISO date string
  nextPaymentAmount: number;
  interestRate: number;
  cashbackRate: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'active' | 'completed' | 'defaulted';
}

export interface CommunityInvestment {
  id: string;
  name: string;
  description: string;
  totalCapital: number;
  investorCount: number;
  startDate: string; // ISO date string
  performance: number; // Percentage
  userInvestment?: number;
  category: 'smallBusiness' | 'realEstate' | 'renewable' | 'education' | 'healthcare';
}

// New types for generational wealth management

export interface FamilyMember {
  id: string;
  relationship: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'grandparent' | 'grandchild' | 'other';
  name: string;
  birthdate?: string; // ISO date string
  email?: string;
  hasAccount: boolean;
  linkedUserId?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO date string
  priority: 'low' | 'medium' | 'high';
  category: 'retirement' | 'education' | 'homeownership' | 'emergency' | 'wealth_transfer' | 'other';
  status: 'active' | 'paused' | 'completed';
  sharedWith: string[]; // Array of family member IDs
}

export interface AssetAllocation {
  liquid: number; // Percentage
  investments: number; // Percentage
  realEstate: number; // Percentage
  alternatives: number; // Percentage
  other: number; // Percentage
}

export interface Estate {
  id: string;
  userId: string;
  hasWill: boolean;
  hasTrust: boolean;
  hasAdvanceDirective: boolean;
  hasPowerOfAttorney: boolean;
  lastReviewed?: string; // ISO date string
  documents: EstateDocument[];
  beneficiaries: Beneficiary[];
}

export interface EstateDocument {
  id: string;
  type: 'will' | 'trust' | 'advance_directive' | 'power_of_attorney' | 'other';
  title: string;
  uploadDate: string; // ISO date string
  fileUrl?: string;
  notes?: string;
}

export interface Beneficiary {
  id: string;
  familyMemberId?: string;
  name: string;
  relationship?: string;
  allocation: number; // Percentage
  notes?: string;
}

export interface EducationFund {
  id: string;
  beneficiaryId: string;
  type: '529' | 'esa' | 'utma' | 'savings' | 'other';
  balance: number;
  contributionFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'irregular';
  contributionAmount?: number;
  targetAmount?: number;
  startDate: string; // ISO date string
  notes?: string;
}

export interface WealthInsight {
  id: string;
  userId: string;
  type: 'tip' | 'alert' | 'recommendation' | 'milestone';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'saving' | 'investing' | 'credit' | 'tax' | 'estate' | 'education';
  dateGenerated: string; // ISO date string
  viewed: boolean;
  saved: boolean;
  actionable: boolean;
}

export interface LegacyLetter {
  id: string;
  userId: string;
  recipientId: string;
  title: string;
  content: string;
  createdDate: string; // ISO date string
  lastModified: string; // ISO date string
  status: 'draft' | 'finalized';
}