import React, { useState, useRef, useEffect } from 'react';
import { useWealth } from '../../contexts/WealthContext';
import { 
  Send, 
  Zap, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Shield,
  Lightbulb,
  RefreshCw,
  Download
} from 'lucide-react';

// Define message types
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Define the AI models available in the UI
interface AIModel {
  id: string;
  name: string;
  description: string;
  specialization: string;
  icon: React.ReactNode;
}

const AIAssistant: React.FC = () => {
  const { wealthProfile } = useWealth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI Financial Assistant. I can help you with financial planning, budgeting, investment advice, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Define available AI models
  const availableModels: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'Financial GPT-4',
      description: 'Advanced financial planning and analysis',
      specialization: 'Comprehensive financial advice with deep reasoning',
      icon: <Zap className="text-blue-500" />
    },
    {
      id: 'financial-analyst',
      name: 'Investment Analyst',
      description: 'Expert in market analysis and investment strategies',
      specialization: 'Portfolio optimization and market insights',
      icon: <TrendingUp className="text-green-500" />
    },
    {
      id: 'budget-planner',
      name: 'Budget Planner',
      description: 'Specialized in personal budgeting and expense tracking',
      specialization: 'Debt reduction and savings strategies',
      icon: <DollarSign className="text-yellow-500" />
    },
    {
      id: 'retirement-planner',
      name: 'Retirement Planner',
      description: 'Long-term financial planning for retirement',
      specialization: 'Retirement accounts, pension planning, and tax strategies',
      icon: <Clock className="text-purple-500" />
    }
  ];
  
  // Suggested prompts for the user
  const suggestedPrompts = [
    "How can I improve my credit score?",
    "What's the best way to save for retirement?",
    "Should I pay off debt or invest first?",
    "How should I allocate my investments?",
    "How much should I save for an emergency fund?",
    "What tax strategies should I consider?",
    "How can I budget more effectively?"
  ];
  
  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle sending a message
  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // In a real implementation, you would call an API endpoint here
      // For now, we'll simulate a response with different financial advice
      // based on the user's question
      await simulateAIResponse(content);
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'system',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simulate AI response based on user input
  const simulateAIResponse = async (userInput: string): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    let responseContent = '';
    const userInputLower = userInput.toLowerCase();
    
    // Generate response based on user input keywords
    if (userInputLower.includes('credit score') || userInputLower.includes('credit rating')) {
      responseContent = "Based on your current financial profile, here are some ways to improve your credit score:\n\n" +
        "1. Pay all bills on time - this accounts for 35% of your FICO score\n" +
        "2. Reduce your credit utilization to under 30% of your available credit\n" +
        "3. Don't close old credit accounts (length of credit history matters)\n" +
        "4. Limit new credit applications to avoid hard inquiries\n" +
        "5. Regularly check your credit report for errors\n\n" +
        "Your current credit score is in the 'good' range. With these steps, you could potentially increase it by 30-50 points over the next 6 months.";
    } else if (userInputLower.includes('retirement') || userInputLower.includes('401k') || userInputLower.includes('ira')) {
      responseContent = "Here's my retirement savings analysis based on your financial profile:\n\n" +
        "Your current retirement savings rate is approximately 10% of your income. Financial experts typically recommend 15-20% for your age group.\n\n" +
        "Recommendations:\n" +
        "1. Increase your 401(k) contributions to at least match your employer's full match (currently you're leaving about $1,200/year on the table)\n" +
        "2. Consider opening a Roth IRA for tax diversification in retirement\n" +
        "3. Aim to increase your retirement savings by 1% each year until you reach 15%\n\n" +
        "Based on your current trajectory, you're on track to replace about 65% of your income in retirement. The recommended target is 80%.";
    } else if (userInputLower.includes('debt') || userInputLower.includes('loan') || userInputLower.includes('interest')) {
      responseContent = "I've analyzed your debt situation and recommend this prioritization strategy:\n\n" +
        "1. Focus on your high-interest credit card debt first ($4,850 at 18.99% APR)\n" +
        "2. Continue making minimum payments on your student loans ($15,500 at 4.5%)\n" +
        "3. Consider a balance transfer card with 0% intro APR for your credit card debt\n\n" +
        "By allocating an extra $300/month to your credit card debt, you could be debt-free in approximately 18 months, saving around $720 in interest payments.\n\n" +
        "Only after eliminating high-interest debt should you significantly increase your investments beyond retirement accounts.";
    } else if (userInputLower.includes('invest') || userInputLower.includes('portfolio') || userInputLower.includes('stock')) {
      responseContent = "Based on your financial profile and stated risk tolerance, here's my investment allocation recommendation:\n\n" +
        "• 60% Total US Stock Market Index Fund\n" +
        "• 25% International Stock Index Fund\n" +
        "• 10% US Bond Index Fund\n" +
        "• 5% REITs or Real Estate exposure\n\n" +
        "This allocation provides diversification while maintaining growth potential. Given your 15+ year time horizon before retirement, this slightly aggressive allocation is appropriate.\n\n" +
        "I'd recommend rebalancing annually and gradually increasing your bond allocation as you get closer to retirement.";
    } else if (userInputLower.includes('emergency fund') || userInputLower.includes('savings')) {
      responseContent = "For your emergency fund, I recommend:\n\n" +
        "Target: 3-6 months of essential expenses ($10,500-$21,000 based on your spending patterns)\n" +
        "Current savings: $5,250 (approximately 1.5 months of expenses)\n\n" +
        "Steps to build your emergency fund:\n" +
        "1. Allocate $400/month to your high-yield savings account (currently earning 3.5% APY)\n" +
        "2. Automatically transfer funds on payday to ensure consistency\n" +
        "3. Consider temporarily reducing retirement contributions to the employer match until you reach 3 months of expenses\n\n" +
        "At $400/month, you'll reach a 3-month emergency fund in approximately 13 months.";
    } else if (userInputLower.includes('tax') || userInputLower.includes('taxes')) {
      responseContent = "Based on your financial situation, here are tax optimization strategies to consider:\n\n" +
        "1. Maximize pre-tax retirement contributions to reduce taxable income\n" +
        "2. Consider tax-loss harvesting opportunities in your brokerage account\n" +
        "3. If you have a high-deductible health plan, maximize HSA contributions\n" +
        "4. Explore potential deductions: student loan interest, home office (if applicable), charitable donations\n\n" +
        "These strategies could potentially reduce your tax liability by $2,000-$3,500 annually based on your current income and tax bracket.";
    } else if (userInputLower.includes('budget') || userInputLower.includes('spending')) {
      responseContent = "I've analyzed your spending patterns over the last 3 months and identified potential areas for budget optimization:\n\n" +
        "Current monthly spending breakdown:\n" +
        "• Housing: $1,800 (35%)\n" +
        "• Transportation: $450 (9%)\n" +
        "• Food: $650 (12%)\n" +
        "• Utilities: $300 (6%)\n" +
        "• Entertainment: $550 (11%)\n" +
        "• Shopping: $600 (12%)\n" +
        "• Other: $800 (15%)\n\n" +
        "Opportunity areas:\n" +
        "1. Your entertainment and shopping categories are slightly higher than recommended (combined 23% vs. recommended 15%)\n" +
        "2. Consider a 50/30/20 budget: 50% needs, 30% wants, 20% savings/debt repayment\n" +
        "3. Setting specific $200 monthly savings target could significantly accelerate your emergency fund goal";
    } else {
      // Default response for other questions
      responseContent = "Thank you for your question. Based on your financial profile, I can provide the following insights:\n\n" +
        "Your current financial health shows some positive indicators: you're contributing to retirement accounts, maintaining a solid credit score, and have begun building emergency savings.\n\n" +
        "Areas for improvement include:\n" +
        "1. Increasing your emergency fund from the current 1.5 months to at least 3 months of expenses\n" +
        "2. Reducing high-interest debt more aggressively\n" +
        "3. Optimizing your investment allocation for better long-term growth\n\n" +
        "Would you like me to provide more specific recommendations in any of these areas?";
    }
    
    // Add assistant response
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: responseContent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, assistantMessage]);
  };
  
  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Clear conversation
  const clearConversation = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your AI Financial Assistant. I can help you with financial planning, budgeting, investment advice, and more. How can I assist you today?',
        timestamp: new Date()
      }
    ]);
  };
  
  // Download conversation as text file
  const downloadConversation = () => {
    const conversationText = messages
      .map(msg => `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flex flex-col h-[80vh] bg-gray-950 rounded-sm border border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center">
          <Zap className="text-green-500 mr-2" size={20} />
          <div>
            <h3 className="text-sm font-medium">AI Financial Assistant</h3>
            <p className="text-xs text-gray-400">Powered by {availableModels.find(m => m.id === selectedModel)?.name || 'AI'}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="p-2 text-gray-400 hover:text-white text-xs flex items-center mr-2"
          >
            <PieChart size={16} className="mr-1" />
            Change Model
          </button>
          <button 
            onClick={clearConversation}
            className="p-2 text-gray-400 hover:text-white text-xs flex items-center"
          >
            <RefreshCw size={16} className="mr-1" />
            New Chat
          </button>
        </div>
      </div>
      
      {/* Model Selector (shown when toggled) */}
      {showModelSelector && (
        <div className="p-4 border-b border-gray-800 bg-gray-900">
          <h4 className="text-sm mb-2">Select AI Financial Model</h4>
          <div className="grid grid-cols-2 gap-2">
            {availableModels.map(model => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model.id);
                  setShowModelSelector(false);
                }}
                className={`p-3 text-left rounded-sm ${
                  selectedModel === model.id 
                    ? 'bg-green-900 border border-green-700'
                    : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center mb-1">
                  {model.icon}
                  <span className="text-sm ml-2">{model.name}</span>
                </div>
                <p className="text-xs text-gray-400">{model.specialization}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-green-900 bg-opacity-50'
                  : message.role === 'system'
                  ? 'bg-red-900 bg-opacity-50'
                  : 'bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-gray-400">
                  {message.role === 'user' 
                    ? 'You' 
                    : message.role === 'system' 
                    ? 'System' 
                    : availableModels.find(m => m.id === selectedModel)?.name || 'AI Assistant'}
                </span>
                <span className="text-xs text-gray-500 ml-2">{formatTime(message.timestamp)}</span>
              </div>
              <div className="text-sm whitespace-pre-line">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-800">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-gray-400">
                  {availableModels.find(m => m.id === selectedModel)?.name || 'AI Assistant'}
                </span>
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
      
      {/* Suggested prompts - show only when few messages */}
      {messages.length < 3 && (
        <div className="p-4 border-t border-gray-800">
          <h4 className="text-xs text-gray-400 mb-2">Suggested Questions</h4>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about budgeting, investments, credit, or financial goals..."
            className="flex-1 bg-gray-800 rounded-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputValue.trim()}
            className="ml-2 bg-green-900 text-green-400 p-2 rounded-sm hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
          <button
            onClick={downloadConversation}
            className="ml-2 bg-gray-800 text-gray-400 p-2 rounded-sm hover:bg-gray-700"
            title="Download conversation"
          >
            <Download size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          <Shield size={12} className="inline mr-1" />
          Your financial information is secure and conversations are encrypted.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;