import React, { useState, useEffect } from 'react';
import { useWealth } from '../../contexts/WealthContext';
import Card from '../common/Card';
import MetricDisplay from '../common/MetricDisplay';
import { 
  BookOpen, 
  Users, 
  Target, 
  GraduationCap, 
  FileText, 
  PieChart,
  ArrowRight,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

enum GenerationalTab {
  Overview = 'overview',
  Family = 'family',
  Goals = 'goals',
  Education = 'education',
  Estate = 'estate',
  Legacy = 'legacy'
}

const GenerationalWealthManager: React.FC = () => {
  const { 
    wealthProfile,
    isLoading,
    error,
    familyMembers,
    financialGoals,
    educationFunds,
    estate,
    legacyLetters,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    createFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
    createEducationFund,
    updateEducationFund,
    deleteEducationFund,
    updateEstate,
    createLegacyLetter,
    updateLegacyLetter,
    deleteLegacyLetter
  } = useWealth();

  const [activeTab, setActiveTab] = useState<GenerationalTab>(GenerationalTab.Overview);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddEducationFund, setShowAddEducationFund] = useState(false);
  const [showAddLegacyLetter, setShowAddLegacyLetter] = useState(false);

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-sm p-4 text-red-400">
        {error}
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetricDisplay 
          label="Family Members" 
          value={familyMembers.length.toString()} 
          icon={<Users className="h-4 w-4 text-green-500" />}
        />
        <MetricDisplay 
          label="Financial Goals" 
          value={financialGoals.length.toString()} 
          icon={<Target className="h-4 w-4 text-green-500" />}
        />
        <MetricDisplay 
          label="Education Funds" 
          value={educationFunds.length.toString()} 
          icon={<GraduationCap className="h-4 w-4 text-green-500" />}
        />
        <MetricDisplay 
          label="Estate Planning" 
          value={estate ? 'Active' : 'Inactive'} 
          icon={<FileText className="h-4 w-4 text-green-500" />}
        />
      </div>

      <Card className="mb-6">
        <h3 className="text-sm uppercase tracking-wider mb-3">Asset Allocation</h3>
        {wealthProfile?.assetAllocation ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">Liquid Assets</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-800 rounded-full mr-2">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${wealthProfile.assetAllocation.liquid}%` }}
                  ></div>
                </div>
                <span className="text-xs">{wealthProfile.assetAllocation.liquid}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Investments</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-800 rounded-full mr-2">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${wealthProfile.assetAllocation.investments}%` }}
                  ></div>
                </div>
                <span className="text-xs">{wealthProfile.assetAllocation.investments}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Real Estate</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-800 rounded-full mr-2">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${wealthProfile.assetAllocation.realEstate}%` }}
                  ></div>
                </div>
                <span className="text-xs">{wealthProfile.assetAllocation.realEstate}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Alternatives</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-800 rounded-full mr-2">
                  <div 
                    className="h-full bg-yellow-500 rounded-full" 
                    style={{ width: `${wealthProfile.assetAllocation.alternatives}%` }}
                  ></div>
                </div>
                <span className="text-xs">{wealthProfile.assetAllocation.alternatives}%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Other</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-800 rounded-full mr-2">
                  <div 
                    className="h-full bg-gray-500 rounded-full" 
                    style={{ width: `${wealthProfile.assetAllocation.other}%` }}
                  ></div>
                </div>
                <span className="text-xs">{wealthProfile.assetAllocation.other}%</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No asset allocation data available</p>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => setActiveTab(GenerationalTab.Family)}
          className="bg-gray-900 p-4 rounded-sm flex flex-col items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <Users size={24} className="mb-2 text-green-500" />
          <span className="text-xs">Family Management</span>
        </button>
        
        <button 
          onClick={() => setActiveTab(GenerationalTab.Goals)}
          className="bg-gray-900 p-4 rounded-sm flex flex-col items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <Target size={24} className="mb-2 text-green-500" />
          <span className="text-xs">Financial Goals</span>
        </button>
        
        <button 
          onClick={() => setActiveTab(GenerationalTab.Education)}
          className="bg-gray-900 p-4 rounded-sm flex flex-col items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <GraduationCap size={24} className="mb-2 text-green-500" />
          <span className="text-xs">Education Funds</span>
        </button>
        
        <button 
          onClick={() => setActiveTab(GenerationalTab.Estate)}
          className="bg-gray-900 p-4 rounded-sm flex flex-col items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <FileText size={24} className="mb-2 text-green-500" />
          <span className="text-xs">Estate Planning</span>
        </button>
        
        <button 
          onClick={() => setActiveTab(GenerationalTab.Legacy)}
          className="bg-gray-900 p-4 rounded-sm flex flex-col items-center justify-center hover:bg-gray-800 transition-colors col-span-2"
        >
          <BookOpen size={24} className="mb-2 text-green-500" />
          <span className="text-xs">Legacy Letters</span>
        </button>
      </div>
    </div>
  );

  const renderFamilyManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm uppercase tracking-wider">FAMILY MEMBERS</h3>
        <button 
          onClick={() => setActiveTab(GenerationalTab.Overview)}
          className="text-xs text-gray-400 hover:text-white"
        >
          Back
        </button>
      </div>
      
      <p className="text-xs text-gray-400">
        Add and manage family members to include in your wealth planning.
      </p>
      
      <div className="space-y-3">
        {familyMembers.length > 0 ? (
          familyMembers.map(member => (
            <Card key={member.id} className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">{member.name}</h4>
                  <p className="text-xs text-gray-400 capitalize">{member.relationship}</p>
                  {member.birthdate && (
                    <p className="text-xs text-gray-400">Born: {formatDate(member.birthdate)}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-white">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-red-500"
                    onClick={() => removeFamilyMember(member.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-sm text-center py-6 text-gray-500">No family members added yet</p>
        )}
      </div>
      
      <button 
        onClick={() => setShowAddFamily(true)}
        className="w-full bg-gray-900 p-3 rounded-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        <Plus size={16} className="mr-2" />
        <span className="text-sm">Add Family Member</span>
      </button>
      
      {/* Add Family Member Modal */}
      {showAddFamily && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-sm p-6 max-w-md w-full">
            <h3 className="text-lg mb-4">Add Family Member</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input type="text" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Relationship</label>
                <select className="w-full bg-gray-800 rounded-sm p-2">
                  <option value="spouse">Spouse</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="grandchild">Grandchild</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Birthdate (optional)</label>
                <input type="date" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Email (optional)</label>
                <input type="email" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2 text-sm border border-gray-700 hover:bg-gray-800"
                  onClick={() => setShowAddFamily(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="px-4 py-2 text-sm bg-green-900 text-green-100"
                  onClick={() => {
                    // Here you'd normally get the values from the form
                    // and call addFamilyMember with the data
                    setShowAddFamily(false);
                  }}
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderFinancialGoals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm uppercase tracking-wider">FINANCIAL GOALS</h3>
        <button 
          onClick={() => setActiveTab(GenerationalTab.Overview)}
          className="text-xs text-gray-400 hover:text-white"
        >
          Back
        </button>
      </div>
      
      <p className="text-xs text-gray-400">
        Set and track financial goals for yourself and your family.
      </p>
      
      <div className="space-y-3">
        {financialGoals.length > 0 ? (
          financialGoals.map(goal => (
            <Card key={goal.id} className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-1">
                    <h4 className="text-sm font-medium">{goal.name}</h4>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      goal.priority === 'high' ? 'bg-red-900 text-red-300' :
                      goal.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 capitalize mb-2">{goal.category.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-400">Target: {formatCurrency(goal.targetAmount)} by {formatDate(goal.targetDate)}</p>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{formatCurrency(goal.currentAmount)}</span>
                      <span>{((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full w-full">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-white">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-red-500"
                    onClick={() => deleteFinancialGoal(goal.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-sm text-center py-6 text-gray-500">No financial goals added yet</p>
        )}
      </div>
      
      <button 
        onClick={() => setShowAddGoal(true)}
        className="w-full bg-gray-900 p-3 rounded-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        <Plus size={16} className="mr-2" />
        <span className="text-sm">Add Financial Goal</span>
      </button>
      
      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-sm p-6 max-w-md w-full">
            <h3 className="text-lg mb-4">Add Financial Goal</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Goal Name</label>
                <input type="text" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select className="w-full bg-gray-800 rounded-sm p-2">
                  <option value="retirement">Retirement</option>
                  <option value="education">Education</option>
                  <option value="homeownership">Home Ownership</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="wealth_transfer">Wealth Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Target Amount</label>
                <input type="number" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Current Amount</label>
                <input type="number" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Target Date</label>
                <input type="date" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Priority</label>
                <select className="w-full bg-gray-800 rounded-sm p-2">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2 text-sm border border-gray-700 hover:bg-gray-800"
                  onClick={() => setShowAddGoal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 text-sm bg-green-900 text-green-100"
                  onClick={() => {
                    // Here you'd normally get the values from the form
                    // and call createFinancialGoal with the data
                    setShowAddGoal(false);
                  }}
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderEducationFunds = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm uppercase tracking-wider">EDUCATION FUNDS</h3>
        <button 
          onClick={() => setActiveTab(GenerationalTab.Overview)}
          className="text-xs text-gray-400 hover:text-white"
        >
          Back
        </button>
      </div>
      
      <p className="text-xs text-gray-400">
        Manage education funds for family members.
      </p>
      
      <div className="space-y-3">
        {educationFunds.length > 0 ? (
          educationFunds.map(fund => (
            <Card key={fund.id} className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium">
                    {familyMembers.find(m => m.id === fund.beneficiaryId)?.name || 'Unnamed'}'s Fund
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">
                    {fund.type === '529' ? '529 College Savings Plan' : 
                     fund.type === 'esa' ? 'Education Savings Account' :
                     fund.type === 'utma' ? 'UTMA/UGMA Account' :
                     fund.type === 'savings' ? 'Savings Account' : 'Other Fund'}
                  </p>
                  <p className="text-xs text-green-400">Balance: {formatCurrency(fund.balance)}</p>
                  
                  {fund.targetAmount && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{((fund.balance / fund.targetAmount) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full w-full">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${(fund.balance / fund.targetAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-white">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-red-500"
                    onClick={() => deleteEducationFund(fund.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-sm text-center py-6 text-gray-500">No education funds added yet</p>
        )}
      </div>
      
      <button 
        onClick={() => setShowAddEducationFund(true)}
        className="w-full bg-gray-900 p-3 rounded-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        <Plus size={16} className="mr-2" />
        <span className="text-sm">Add Education Fund</span>
      </button>
      
      {/* Add Education Fund Modal */}
      {showAddEducationFund && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-sm p-6 max-w-md w-full">
            <h3 className="text-lg mb-4">Add Education Fund</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Beneficiary</label>
                <select className="w-full bg-gray-800 rounded-sm p-2">
                  <option value="">Select Family Member</option>
                  {familyMembers
                    .filter(member => member.relationship === 'child' || member.relationship === 'grandchild')
                    .map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))
                  }
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Fund Type</label>
                <select className="w-full bg-gray-800 rounded-sm p-2">
                  <option value="529">529 College Savings Plan</option>
                  <option value="esa">Education Savings Account (ESA)</option>
                  <option value="utma">UTMA/UGMA Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Current Balance</label>
                <input type="number" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Target Amount (optional)</label>
                <input type="number" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Contribution Frequency</label>
                <select className="w-full bg-gray-800 rounded-sm p-2">
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                  <option value="irregular">Irregular</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Contribution Amount (optional)</label>
                <input type="number" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2 text-sm border border-gray-700 hover:bg-gray-800"
                  onClick={() => setShowAddEducationFund(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 text-sm bg-green-900 text-green-100"
                  onClick={() => {
                    // Here you'd normally get the values from the form
                    // and call createEducationFund with the data
                    setShowAddEducationFund(false);
                  }}
                >
                  Add Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderEstatePlanning = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm uppercase tracking-wider">ESTATE PLANNING</h3>
        <button 
          onClick={() => setActiveTab(GenerationalTab.Overview)}
          className="text-xs text-gray-400 hover:text-white"
        >
          Back
        </button>
      </div>
      
      <p className="text-xs text-gray-400">
        Manage your estate plan and important documents.
      </p>
      
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-4">Estate Planning Status</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${estate?.hasWill ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              <span className="text-sm">Will</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-white">
              {estate?.hasWill ? 'Update' : 'Create'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${estate?.hasTrust ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              <span className="text-sm">Trust</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-white">
              {estate?.hasTrust ? 'Update' : 'Create'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${estate?.hasAdvanceDirective ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              <span className="text-sm">Advance Directive</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-white">
              {estate?.hasAdvanceDirective ? 'Update' : 'Create'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${estate?.hasPowerOfAttorney ? 'bg-green-500' : 'bg-gray-700'}`}></div>
              <span className="text-sm">Power of Attorney</span>
            </div>
            <button className="text-xs text-gray-400 hover:text-white">
              {estate?.hasPowerOfAttorney ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
        
        {estate?.lastReviewed && (
          <p className="text-xs text-gray-400 mt-4">
            Last reviewed: {formatDate(estate.lastReviewed)}
          </p>
        )}
      </Card>
      
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium">Beneficiaries</h4>
          <button className="text-xs text-gray-400 hover:text-white">Add</button>
        </div>
        
        {estate && estate.beneficiaries.length > 0 ? (
          <div className="space-y-3">
            {estate.beneficiaries.map(ben => (
              <div key={ben.id} className="flex justify-between items-center p-2 border border-gray-800 rounded-sm">
                <div>
                  <p className="text-sm">{ben.name}</p>
                  {ben.relationship && <p className="text-xs text-gray-400">{ben.relationship}</p>}
                </div>
                <div className="text-sm text-green-400">{ben.allocation}%</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-4 text-gray-500">No beneficiaries added yet</p>
        )}
      </Card>
      
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium">Documents</h4>
          <label htmlFor="document-upload" className="text-xs text-gray-400 hover:text-white cursor-pointer">
            Upload
          </label>
          <input id="document-upload" type="file" className="hidden" />
        </div>
        
        {estate && estate.documents.length > 0 ? (
          <div className="space-y-3">
            {estate.documents.map(doc => (
              <div key={doc.id} className="flex justify-between items-center p-2 border border-gray-800 rounded-sm">
                <div className="flex items-center">
                  <FileText size={16} className="text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm">{doc.title}</p>
                    <p className="text-xs text-gray-400">Uploaded: {formatDate(doc.uploadDate)}</p>
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-white">View</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-center py-4 text-gray-500">No documents uploaded yet</p>
        )}
      </Card>
      
      <button className="w-full bg-gray-900 p-3 rounded-sm flex items-center justify-center hover:bg-gray-800 transition-colors">
        <span className="text-sm">Schedule Estate Review</span>
      </button>
    </div>
  );

  const renderLegacyLetters = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm uppercase tracking-wider">LEGACY LETTERS</h3>
        <button 
          onClick={() => setActiveTab(GenerationalTab.Overview)}
          className="text-xs text-gray-400 hover:text-white"
        >
          Back
        </button>
      </div>
      
      <p className="text-xs text-gray-400">
        Write letters to pass down your values, life lessons, and wishes to future generations.
      </p>
      
      <div className="space-y-3">
        {legacyLetters.length > 0 ? (
          legacyLetters.map(letter => (
            <Card key={letter.id} className="p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium">{letter.title}</h4>
                  <p className="text-xs text-gray-400 mb-1">
                    To: {familyMembers.find(m => m.id === letter.recipientId)?.name || 'Unknown'}
                  </p>
                  <div className="flex items-center">
                    <p className="text-xs text-gray-400 mr-2">
                      {formatDate(letter.lastModified)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      letter.status === 'draft' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'
                    }`}>
                      {letter.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-white">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-red-500"
                    onClick={() => deleteLegacyLetter(letter.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-sm text-center py-6 text-gray-500">No legacy letters created yet</p>
        )}
      </div>
      
      <button 
        onClick={() => setShowAddLegacyLetter(true)}
        className="w-full bg-gray-900 p-3 rounded-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        <Plus size={16} className="mr-2" />
        <span className="text-sm">Write Legacy Letter</span>
      </button>
      
      {/* Add Legacy Letter Modal */}
      {showAddLegacyLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-sm p-6 max-w-md w-full">
            <h3 className="text-lg mb-4">Write Legacy Letter</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <input type="text" className="w-full bg-gray-800 rounded-sm p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Recipient</label>
                <select className="w-full bg-gray-800 rounded-sm p-2">
                  <option value="">Select Family Member</option>
                  {familyMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Content</label>
                <textarea 
                  className="w-full bg-gray-800 rounded-sm p-2 h-40" 
                  placeholder="Share your wisdom, values, and life lessons with future generations..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2 text-sm border border-gray-700 hover:bg-gray-800"
                  onClick={() => setShowAddLegacyLetter(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 text-sm bg-gray-700 text-white"
                  onClick={() => {
                    // Here you'd normally save as draft
                    setShowAddLegacyLetter(false);
                  }}
                >
                  Save Draft
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 text-sm bg-green-900 text-green-100"
                  onClick={() => {
                    // Here you'd normally get the values from the form
                    // and call createLegacyLetter with the data
                    setShowAddLegacyLetter(false);
                  }}
                >
                  Finalize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <div className="w-1 h-10 mr-3 bg-green-500"></div>
        <div>
          <h2 className="text-sm font-medium tracking-wider">GENERATIONAL WEALTH</h2>
          <p className="text-sm text-gray-400">Build and preserve wealth across generations</p>
        </div>
      </div>

      {activeTab === GenerationalTab.Overview && renderOverview()}
      {activeTab === GenerationalTab.Family && renderFamilyManagement()}
      {activeTab === GenerationalTab.Goals && renderFinancialGoals()}
      {activeTab === GenerationalTab.Education && renderEducationFunds()}
      {activeTab === GenerationalTab.Estate && renderEstatePlanning()}
      {activeTab === GenerationalTab.Legacy && renderLegacyLetters()}
    </div>
  );
};

export default GenerationalWealthManager;