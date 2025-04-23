import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User } from 'lucide-react';
import AIEye from './AIEye';
import aiCounselorService, { AIMessage, AIPersonalityType } from '../../services/hub/aiCounselorService';

// Map between counselor types
type CounselorType = 'rhythm' | 'nexus' | 'serenity';

interface AIConversationProps {
  type: CounselorType;
  initialMessage: string;
  onClose: () => void;
}

const AIConversation: React.FC<AIConversationProps> = ({ 
  type, 
  initialMessage, 
  onClose
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [userInput, setUserInput] = useState('');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // AI personality configurations
  const aiConfig = {
    rhythm: {
      name: 'Rhythm',
      color: '#7C3AED', // Purple
      bgColor: 'bg-purple-900/10',
      borderColor: 'border-purple-700',
      typingSpeed: 30, // Fast typing
    },
    nexus: {
      name: 'Nexus',
      color: '#3B82F6', // Blue
      bgColor: 'bg-blue-900/10',
      borderColor: 'border-blue-700',
      typingSpeed: 40, // Medium typing
    },
    serenity: {
      name: 'Serenity',
      color: '#10B981', // Green
      bgColor: 'bg-green-900/10',
      borderColor: 'border-green-700',
      typingSpeed: 60, // Slow, deliberate typing
    }
  };
  
  const selectedAI = aiConfig[type];
  
  // Initialize conversation
  useEffect(() => {
    // Initialize conversation with the LLM service
    const convoId = aiCounselorService.initializeConversation(type as AIPersonalityType);
    setConversationId(convoId);
    
    // Add simulated greeting based on the initial message
    setTimeout(() => {
      simulateAITyping(initialMessage);
    }, 500);
  }, [type, initialMessage]);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle AI response with typing effect
  const simulateAITyping = (text: string) => {
    setIsAISpeaking(true);
    setCurrentAIMessage('');
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setCurrentAIMessage(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsAISpeaking(false);
        
        // Add full message to history after typing is complete
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now().toString(),
            role: 'assistant', 
            content: text, 
            timestamp: Date.now() 
          }
        ]);
        setCurrentAIMessage('');
      }
    }, selectedAI.typingSpeed);
    
    return () => clearInterval(typingInterval);
  };
  
  // Handle user message submission
  const handleSendMessage = async () => {
    if (!userInput.trim() || isAISpeaking) return;
    
    // Add user message
    const newUserMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    
    // Get AI response from the LLM service
    try {
      setIsAISpeaking(true);
      
      // Send message to LLM service
      const response = await aiCounselorService.sendMessage(
        conversationId, 
        newUserMessage.content
      );
      
      // Simulate typing effect
      simulateAITyping(response.content);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback to basic response on error
      simulateAITyping("I'm having trouble connecting right now. Let's try again in a moment.");
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentAIMessage]);
  
  // Position the AI eye with a floating effect
  const [eyePosition, setEyePosition] = useState({ top: 20, left: 20 });
  
  useEffect(() => {
    // Create floating effect for the eye
    let animationFrameId: number;
    let angle = 0;
    
    const animateEye = () => {
      angle += 0.01;
      
      // Different movement patterns based on AI type
      const radius = type === 'rhythm' ? 20 : // Larger, more energetic movements
                     type === 'nexus' ? 15 : // Medium, social movements
                     10; // Small, calm movements for serenity
      
      const speed = type === 'rhythm' ? 0.015 :
                    type === 'nexus' ? 0.01 :
                    0.005;
                    
      angle += speed;
      
      setEyePosition({
        top: 20 + Math.sin(angle) * radius,
        left: 20 + Math.cos(angle * 1.3) * radius
      });
      
      animationFrameId = requestAnimationFrame(animateEye);
    };
    
    animateEye();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className={`bg-gray-900 border ${selectedAI.borderColor} rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden relative`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 ${selectedAI.bgColor} border-b ${selectedAI.borderColor}`}>
          <div className="flex items-center">
            <div className="w-1 h-10 mr-3" style={{ backgroundColor: selectedAI.color }}></div>
            <h3 className="font-medium" style={{ color: selectedAI.color }}>{selectedAI.name}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Conversation */}
        <div className="relative p-6 h-[50vh] overflow-y-auto">
          {/* Floating eye */}
          <div 
            className="absolute z-20 transition-all duration-1000"
            style={{ 
              top: `${eyePosition.top}%`, 
              left: `${eyePosition.left}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <AIEye 
              type={type} 
              size={80} 
              animated={true}
              speaking={isAISpeaking}
              following={false}
            />
          </div>
          
          <div className="space-y-6 relative z-10">
            {/* Message history */}
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-gray-800 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                    : `${selectedAI.bgColor} text-white rounded-tl-lg rounded-tr-lg rounded-br-lg`
                } p-3`}>
                  {message.content}
                </div>
              </div>
            ))}
            
            {/* Currently typing message */}
            {isAISpeaking && currentAIMessage && (
              <div className="flex justify-start">
                <div className={`max-w-[80%] ${selectedAI.bgColor} text-white rounded-tl-lg rounded-tr-lg rounded-br-lg p-3`}>
                  {currentAIMessage}
                  <span className="inline-block animate-pulse">|</span>
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              <div className="bg-gray-800 h-8 w-8 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
            <input 
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isAISpeaking}
              className={`ml-2 p-2 rounded-lg ${
                !userInput.trim() || isAISpeaking 
                  ? 'bg-gray-700 text-gray-500' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConversation;