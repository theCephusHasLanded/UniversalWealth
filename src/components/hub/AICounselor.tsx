import React from 'react';
import { Zap, UserCircle2, Heart } from 'lucide-react';

export interface AICounselorProps {
  type: 'dance' | 'social' | 'introspective';
  onInteract?: (message: string) => void;
}

interface CounselorProfile {
  name: string;
  tagline: string;
  traits: string[];
  activities: string[];
  icon: React.ReactNode;
  color: string;
  interaction: string[];
}

const AICounselor: React.FC<AICounselorProps> = ({ type, onInteract }) => {
  // Counselor profiles
  const counselorProfiles: Record<string, CounselorProfile> = {
    dance: {
      name: "Rhythm",
      tagline: "Move, groove, and discover your joy",
      traits: ["Energetic", "Playful", "Expressive", "Encouraging", "Creative"],
      activities: [
        "Dance battles",
        "Movement games",
        "Physical challenges",
        "Flash mobs",
        "Choreography sessions"
      ],
      icon: <Zap size={24} />,
      color: "#7C3AED",
      interaction: [
        "Hey there! I noticed you've been sitting for a while. How about a quick 2-minute dance break to recharge? I've got the perfect beat for you!",
        "Congrats on meeting your goal! Let's celebrate with our signature victory dance. Ready to learn it?",
        "Challenge time! Can you create a 3-move sequence that represents how you're feeling today? I'll start with mine..."
      ]
    },
    social: {
      name: "Nexus",
      tagline: "Connecting paths, building moments",
      traits: ["Charismatic", "Outgoing", "Organized", "Curious", "Adventurous"],
      activities: [
        "Group outings",
        "Cultural experiences",
        "Community projects",
        "Travel planning",
        "Networking events"
      ],
      icon: <UserCircle2 size={24} />,
      color: "#3B82F6",
      interaction: [
        "I noticed you're interested in sustainable fashion! There's a workshop happening this weekend at the Austin Hub. Would you like to connect with 3 other members who are attending?",
        "Your financial goals align with several members in our Houston community. How about joining our 'Future Funding' dinner next Thursday?",
        "Based on your recent interactions, I think you'd really hit it off with Jamal and Sarah. Would you be open to a virtual coffee chat this week?"
      ]
    },
    introspective: {
      name: "Serenity",
      tagline: "Find your center, discover your path",
      traits: ["Calm", "Thoughtful", "Insightful", "Supportive", "Balanced"],
      activities: [
        "Mindfulness exercises",
        "Guided reflections",
        "Wellness practices",
        "Journaling prompts",
        "Meditation sessions"
      ],
      icon: <Heart size={24} />,
      color: "#10B981",
      interaction: [
        "I sense you might be feeling a bit overwhelmed today. Would you like to try a 3-minute breathing exercise designed specifically for financial clarity?",
        "What's one small goal you have for yourself today? Let's break it down into mindful steps and set an intention together.",
        "Before your upcoming investment decision, let's take a moment to check in with your values and long-term vision. I have a reflection exercise that might help."
      ]
    }
  };

  const profile = counselorProfiles[type];
  
  // Handle user click on an interaction
  const handleInteractionClick = (message: string) => {
    if (onInteract) {
      onInteract(message);
    }
  };

  return (
    <div className="bg-gray-800 rounded-sm overflow-hidden border border-gray-700">
      <div className="p-4 border-b border-gray-700" style={{ backgroundColor: `${profile.color}20` }}>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: `${profile.color}40` }}>
            <div style={{ color: profile.color }}>{profile.icon}</div>
          </div>
          <div>
            <h3 className="font-medium" style={{ color: profile.color }}>{profile.name}</h3>
            <p className="text-xs text-gray-400">{profile.tagline}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Core Traits</h4>
          <div className="flex flex-wrap gap-2">
            {profile.traits.map((trait, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 rounded-sm" 
                style={{ backgroundColor: `${profile.color}20`, color: profile.color }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Activities</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            {profile.activities.map((activity, index) => (
              <li key={index} className="flex items-center">
                <span className="h-1 w-1 rounded-full mr-2" style={{ backgroundColor: profile.color }}></span>
                {activity}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Try an Interaction</h4>
          <div className="space-y-2">
            {profile.interaction.map((interaction, index) => (
              <div 
                key={index} 
                className="text-xs p-3 rounded-sm cursor-pointer transition-colors" 
                style={{ backgroundColor: `${profile.color}10` }}
                onClick={() => handleInteractionClick(interaction)}
              >
                {interaction}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICounselor;