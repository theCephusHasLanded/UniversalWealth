import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import AICounselor from './AICounselor';

const HubCounselors: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<{
    type: 'dance' | 'social' | 'introspective';
    message: string;
  } | null>(null);

  const handleInteraction = (type: 'dance' | 'social' | 'introspective', message: string) => {
    setActiveConversation({ type, message });
  };

  const getBotName = (type: 'dance' | 'social' | 'introspective') => {
    switch (type) {
      case 'dance': return 'Rhythm';
      case 'social': return 'Nexus';
      case 'introspective': return 'Serenity';
    }
  };

  const getBotColor = (type: 'dance' | 'social' | 'introspective') => {
    switch (type) {
      case 'dance': return '#7C3AED'; // purple
      case 'social': return '#3B82F6'; // blue
      case 'introspective': return '#10B981'; // green
    }
  };

  const getResponseMessage = (type: 'dance' | 'social' | 'introspective') => {
    switch (type) {
      case 'dance':
        return "I'd love to help you get moving! Let's schedule a time for this activity. Would you prefer to do this at the Austin or Houston hub location, or would you rather connect virtually?";
      case 'social':
        return "That sounds like a great opportunity to connect! I can help arrange this and send invitations to community members. Would you like me to help you set this up?";
      case 'introspective':
        return "I'm here to support your journey. This reflective exercise can be done in a quiet space at any of our hub locations or from the comfort of your home. When would be a good time to begin?";
    }
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AICounselor 
          type="dance" 
          onInteract={(message) => handleInteraction('dance', message)} 
        />
        <AICounselor 
          type="social" 
          onInteract={(message) => handleInteraction('social', message)} 
        />
        <AICounselor 
          type="introspective" 
          onInteract={(message) => handleInteraction('introspective', message)} 
        />
      </div>

      {activeConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 border border-gray-700 rounded-sm max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700" style={{ backgroundColor: `${getBotColor(activeConversation.type)}20` }}>
              <div className="flex items-center">
                <div className="w-2 h-10 mr-3" style={{ backgroundColor: getBotColor(activeConversation.type) }}></div>
                <h3 className="font-medium">{getBotName(activeConversation.type)} Interaction</h3>
              </div>
              <button 
                onClick={() => setActiveConversation(null)} 
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${getBotColor(activeConversation.type)}40` }}>
                  <Bot size={16} style={{ color: getBotColor(activeConversation.type) }} />
                </div>
                <div className="p-3 rounded-sm bg-gray-700 text-sm max-w-[80%]">
                  {activeConversation.message}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${getBotColor(activeConversation.type)}40` }}>
                  <Bot size={16} style={{ color: getBotColor(activeConversation.type) }} />
                </div>
                <div className="p-3 rounded-sm bg-gray-700 text-sm max-w-[80%]">
                  {getResponseMessage(activeConversation.type)}
                </div>
              </div>
              
              <div className="flex items-center pt-4 mt-4 border-t border-gray-700">
                <input 
                  type="text" 
                  placeholder="Type your response..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gray-500" 
                />
                <button 
                  className="ml-2 px-3 py-2 rounded-sm text-sm"
                  style={{ backgroundColor: getBotColor(activeConversation.type), color: '#fff' }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HubCounselors;