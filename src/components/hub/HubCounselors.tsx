import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import AICounselor from './AICounselor';
import AIConversation from './AIConversation';
import AIEye from './AIEye';
import aiCounselorService from '../../services/hub/aiCounselorService';

// Map between counselor types
type CounselorType = 'dance' | 'social' | 'introspective';
type AIEyeType = 'rhythm' | 'nexus' | 'serenity';

const mapCounselorTypeToEyeType = (type: CounselorType): AIEyeType => {
  switch (type) {
    case 'dance': return 'rhythm';
    case 'social': return 'nexus';
    case 'introspective': return 'serenity';
  }
};

const HubCounselors: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<{
    type: CounselorType;
    message: string;
  } | null>(null);
  
  const [isLLMConnected, setIsLLMConnected] = useState(false);
  
  // Check if the LLM is connected on mount
  useEffect(() => {
    const checkLLMConnection = async () => {
      try {
        const isConnected = await aiCounselorService.checkLLMConnection();
        setIsLLMConnected(isConnected);
      } catch (error) {
        console.error('Error checking LLM connection:', error);
        setIsLLMConnected(false);
      }
    };
    
    checkLLMConnection();
  }, []);

  const handleInteraction = (type: CounselorType, message: string) => {
    setActiveConversation({ type, message });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center mb-3">
          <Bot size={18} className="mr-2 text-gray-400" />
          <h3 className="text-sm uppercase tracking-wider">HUB AI COUNSELORS</h3>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Digital companions that bridge physical and virtual interactions, enhancing your hub experience
        </p>
        
        {/* LLM Status Indicator */}
        <div className="mb-4 p-2 bg-gray-800 rounded-sm flex items-center justify-between">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${isLLMConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-xs text-gray-400">
              AI System Status: {isLLMConnected ? 'Connected to Gemma LLM' : 'Using simulated responses'}
            </span>
          </div>
          <span className="text-xs text-purple-400">
            {isLLMConnected ? 'Full intelligence active' : 'Basic response mode'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Each counselor card with eye avatar */}
        <div className="bg-gray-800 border border-purple-700/30 rounded-lg overflow-hidden">
          <div className="p-4 bg-purple-900/10 flex items-center space-x-3">
            <AIEye type="rhythm" size={50} />
            <div>
              <h3 className="font-medium text-purple-400">Rhythm</h3>
              <p className="text-xs text-gray-400">Move, groove, and discover your joy</p>
            </div>
          </div>
          <div className="p-4">
            <AICounselor 
              type="dance" 
              onInteract={(message) => handleInteraction('dance', message)} 
            />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-blue-700/30 rounded-lg overflow-hidden">
          <div className="p-4 bg-blue-900/10 flex items-center space-x-3">
            <AIEye type="nexus" size={50} />
            <div>
              <h3 className="font-medium text-blue-400">Nexus</h3>
              <p className="text-xs text-gray-400">Connecting paths, building moments</p>
            </div>
          </div>
          <div className="p-4">
            <AICounselor 
              type="social" 
              onInteract={(message) => handleInteraction('social', message)} 
            />
          </div>
        </div>
        
        <div className="bg-gray-800 border border-green-700/30 rounded-lg overflow-hidden">
          <div className="p-4 bg-green-900/10 flex items-center space-x-3">
            <AIEye type="serenity" size={50} />
            <div>
              <h3 className="font-medium text-green-400">Serenity</h3>
              <p className="text-xs text-gray-400">Find your center, discover your path</p>
            </div>
          </div>
          <div className="p-4">
            <AICounselor 
              type="introspective" 
              onInteract={(message) => handleInteraction('introspective', message)} 
            />
          </div>
        </div>
      </div>

      {/* Immersive conversation with moving eye avatar */}
      {activeConversation && (
        <AIConversation 
          type={mapCounselorTypeToEyeType(activeConversation.type)}
          initialMessage={activeConversation.message}
          onClose={() => setActiveConversation(null)}
        />
      )}
    </div>
  );
};

export default HubCounselors;