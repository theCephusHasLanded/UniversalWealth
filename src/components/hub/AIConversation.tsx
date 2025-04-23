import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User } from 'lucide-react';
import AIEye from './AIEye';

interface AIConversationProps {
  type: 'rhythm' | 'nexus' | 'serenity';
  initialMessage: string;
  onClose: () => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

const AIConversation: React.FC<AIConversationProps> = ({ 
  type, 
  initialMessage, 
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
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
      responses: [
        "Let's get moving! I have a great 5-minute dance sequence we could try right now.",
        "Energy is flowing! How about a quick movement challenge to break up your day?",
        "I sense some creative potential! Would you like to try a rhythmic expression exercise?",
        "Movement is medicine! Let's schedule a community dance session at the Hub this week.",
        "Your energy feels a bit low today. A quick movement break could help rejuvenate you!",
      ],
      typingSpeed: 30, // Fast typing
    },
    nexus: {
      name: 'Nexus',
      color: '#3B82F6', // Blue
      bgColor: 'bg-blue-900/10',
      borderColor: 'border-blue-700',
      responses: [
        "I noticed your interest in sustainable investing - there are 3 other members online now with similar goals.",
        "Would you like me to arrange a gathering at the Austin hub this weekend? I can invite members with complementary skills.",
        "I see potential for a meaningful connection with our Houston community. Would you like an introduction?",
        "Your profile suggests you'd enjoy our upcoming cultural exchange event. Shall I add you to the guest list?",
        "Community building happens through shared experiences. How about joining our virtual coffee chat tomorrow?",
      ],
      typingSpeed: 40, // Medium typing
    },
    serenity: {
      name: 'Serenity',
      color: '#10B981', // Green
      bgColor: 'bg-green-900/10',
      borderColor: 'border-green-700',
      responses: [
        "Take a moment to breathe deeply. How are you truly feeling about your financial journey today?",
        "I sense some uncertainty in your words. Would a guided reflection help bring clarity to your decision?",
        "Sometimes the path forward becomes clear when we align our actions with our values. Shall we explore that together?",
        "The quiet space at our Hub location might provide the perfect environment for this inner work. Would you like to book time there?",
        "Consider this question: what would success in this area look like for you, beyond just the numbers?",
      ],
      typingSpeed: 60, // Slow, deliberate typing
    }
  };
  
  const selectedAI = aiConfig[type];
  
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
            sender: 'ai', 
            text, 
            timestamp: Date.now() 
          }
        ]);
        setCurrentAIMessage('');
      }
    }, selectedAI.typingSpeed);
    
    return () => clearInterval(typingInterval);
  };
  
  // Generate AI response based on user input
  const getAIResponse = () => {
    // Choose a random response from the AI's response pool
    const responseIndex = Math.floor(Math.random() * selectedAI.responses.length);
    return selectedAI.responses[responseIndex];
  };
  
  // Handle user message submission
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message
    const newUserMessage = {
      sender: 'user' as const,
      text: userInput,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    
    // Simulate AI thinking then respond
    setTimeout(() => {
      const aiResponse = getAIResponse();
      simulateAITyping(aiResponse);
    }, 1000);
  };
  
  // Initialize with AI greeting
  useEffect(() => {
    setTimeout(() => {
      simulateAITyping(initialMessage);
    }, 500);
  }, [initialMessage]);
  
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
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-gray-800 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                    : `${selectedAI.bgColor} text-white rounded-tl-lg rounded-tr-lg rounded-br-lg`
                } p-3`}>
                  {message.text}
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