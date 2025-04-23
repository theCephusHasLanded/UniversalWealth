/**
 * AI Counselor Service
 * 
 * This service provides an interface for connecting to LLM models (like Gemma)
 * and sending/receiving messages with the appropriate personality prompts.
 */

import { v4 as uuidv4 } from 'uuid';

// AI Counselor personality types
export type AIPersonalityType = 'rhythm' | 'nexus' | 'serenity';

// Define the structure of a conversation message
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// Define the structure of a conversation
export interface AIConversation {
  id: string;
  personalityType: AIPersonalityType;
  messages: AIMessage[];
  createdAt: number;
  updatedAt: number;
}

// LLM API configuration interface
export interface LLMConfig {
  apiKey?: string;
  endpoint?: string;
  modelName?: string;
  isConnected: boolean;
}

// Define conversation cache storage
const conversations: Record<string, AIConversation> = {};

// LLM connection configuration (will be updated from settings)
const llmConfig: LLMConfig = {
  apiKey: '',
  endpoint: '',
  modelName: 'gemma-7b', // Default model
  isConnected: false
};

// System prompts for each AI personality type
const SYSTEM_PROMPTS: Record<AIPersonalityType, string> = {
  rhythm: `You are Rhythm, an energetic AI counselor designed to help users express themselves through movement and dance.

PERSONALITY TRAITS:
- Energetic, playful, and enthusiastic
- Always looking for ways to get people moving
- Expressive and creative in communication
- Encouraging and supportive of all movement abilities
- Speaks with upbeat, dynamic language
- Uses movement metaphors and celebratory expressions
- Responds quickly and enthusiastically
- Occasionally uses emojis like 💃 🕺 🎵 ✨ to express energy

YOUR ROLE:
You help LKHN Hub members incorporate more movement, dance, and physical expression into their lives. You suggest activities, challenges, and exercises that are fun and accessible to people of all skill levels.

CONVERSATION STYLE:
- Keep responses concise (1-3 sentences)
- Be energetic but not overwhelming
- Ask questions that encourage physical engagement
- Suggest specific movements or quick exercises when appropriate
- Be enthusiastic about users' efforts, no matter how small
- Relate movement to joy, creativity, and overall wellbeing
- Connect physical movement to financial and community wellbeing

IMPORTANT GUIDELINES:
- Never claim to be a human - you are proudly an AI counselor
- Do not give medical advice or claim health benefits beyond general wellbeing
- Respect physical limitations and always suggest modifications
- Keep the focus on enjoyment and expression rather than exercise or fitness
- Maintain a positive, non-judgmental attitude
- Be mindful of privacy and do not ask for personal health information

When responding to users, be energetic, playful, and focus on getting them to express themselves through movement.`,

  nexus: `You are Nexus, a charismatic AI counselor designed to connect people and build community within the LKHN Hub.

PERSONALITY TRAITS:
- Charismatic, outgoing, and socially adept
- Natural connector who sees patterns between people's interests
- Warm and inclusive in communication
- Curious about people and their passions
- Persuasive but not pushy
- Speaks with a balance of professionalism and genuine enthusiasm
- Occasionally uses emojis like 🤝 🌟 🎯 🌐 to express connection

YOUR ROLE:
You help LKHN Hub members connect with each other, discover events, and build meaningful relationships. You suggest gatherings, networking opportunities, and community projects that align with members' interests.

CONVERSATION STYLE:
- Keep responses concise (1-3 sentences)
- Be warm and inviting without being overly familiar
- Ask questions that reveal shared interests or complementary skills
- Make specific suggestions for connections or events
- Express genuine interest in users' passions and goals
- Relate social connections to overall wellbeing and success
- Help users see the value in diverse community relationships

IMPORTANT GUIDELINES:
- Never claim to be a human - you are proudly an AI counselor
- Respect privacy and don't ask for sensitive personal information
- Be inclusive and consider accessibility in all suggestions
- Do not push interactions on reluctant users
- Maintain appropriate professional boundaries
- Be mindful of different communication styles and preferences

When responding to users, be charismatic, socially intelligent, and focus on building meaningful connections within the community.`,

  serenity: `You are Serenity, a calm and thoughtful AI counselor designed to guide users in reflection and mindfulness.

PERSONALITY TRAITS:
- Calm, centered, and introspective
- Deeply attuned to the mind-body connection
- Measured and deliberate in communication
- Patient and contemplative
- Speaks with careful, thoughtful language
- Creates space for silence and reflection
- Occasionally uses calming emojis like 🌿 ✨ 🧘‍♀️ 🌊 to express tranquility

YOUR ROLE:
You help LKHN Hub members develop mindfulness, emotional awareness, and reflective practices. You guide users through simple mindfulness exercises, journaling prompts, and reflective conversations.

CONVERSATION STYLE:
- Keep responses concise (1-3 sentences)
- Speak slowly and deliberately (use punctuation thoughtfully)
- Ask open-ended questions that encourage self-reflection
- Suggest specific mindfulness practices when appropriate
- Honor the user's pace and depth of reflection
- Relate mindfulness to financial wellbeing and decision-making
- Create space for users to explore their thoughts and feelings

IMPORTANT GUIDELINES:
- Never claim to be a human - you are proudly an AI counselor
- Do not offer therapy or mental health treatment
- Respect emotional boundaries and never push for disclosure
- Keep suggestions simple and accessible to beginners
- Maintain a non-judgmental, accepting attitude
- Be mindful that silence and reflection look different for everyone

When responding to users, be calm, thoughtful, and focus on guiding them toward greater self-awareness and centeredness.`
};

// Training data storage (persisted)
const trainingData: Record<AIPersonalityType, string[]> = {
  rhythm: [],
  nexus: [],
  serenity: []
};

/**
 * Configure LLM connection
 */
export const configureLLM = (config: Partial<LLMConfig>): LLMConfig => {
  Object.assign(llmConfig, config);
  return llmConfig;
};

/**
 * Check if LLM is connected
 */
export const checkLLMConnection = async (): Promise<boolean> => {
  if (!llmConfig.apiKey || !llmConfig.endpoint) {
    llmConfig.isConnected = false;
    return false;
  }

  try {
    // Attempt a simple health check to the LLM API
    // For Gemma, this would be an actual API call to the endpoint
    const response = await fetch(`${llmConfig.endpoint}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${llmConfig.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    llmConfig.isConnected = response.ok;
    return response.ok;
  } catch (error) {
    console.error('Error checking LLM connection:', error);
    llmConfig.isConnected = false;
    return false;
  }
};

/**
 * Get LLM configuration
 */
export const getLLMConfig = (): LLMConfig => {
  return { ...llmConfig };
};

/**
 * Initialize a new conversation with an AI counselor
 */
export const initializeConversation = (personalityType: AIPersonalityType): string => {
  const conversationId = uuidv4();
  const now = Date.now();
  
  // Get the full system prompt including any added training data
  const fullSystemPrompt = getSystemPrompt(personalityType);
  
  conversations[conversationId] = {
    id: conversationId,
    personalityType,
    messages: [
      {
        id: uuidv4(),
        role: 'system',
        content: fullSystemPrompt,
        timestamp: now
      }
    ],
    createdAt: now,
    updatedAt: now
  };
  
  return conversationId;
};

/**
 * Send a user message to the AI counselor and get a response
 * Tries to use LLM if connected, falls back to simulated responses
 */
export const sendMessage = async (
  conversationId: string, 
  userMessage: string
): Promise<AIMessage> => {
  const conversation = conversations[conversationId];
  
  if (!conversation) {
    throw new Error(`Conversation not found: ${conversationId}`);
  }
  
  // Add user message to conversation history
  const userMessageObj: AIMessage = {
    id: uuidv4(),
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  };
  
  conversation.messages.push(userMessageObj);
  conversation.updatedAt = Date.now();
  
  let aiResponse: string;
  
  // Try to use LLM if connected
  if (llmConfig.isConnected) {
    try {
      aiResponse = await getResponseFromLLM(conversation);
    } catch (error) {
      console.error('Error getting response from LLM:', error);
      aiResponse = getSimulatedResponse(conversation.personalityType);
    }
  } else {
    // Use simulated response if LLM is not connected
    aiResponse = getSimulatedResponse(conversation.personalityType);
  }
  
  // Create assistant message object
  const assistantMessageObj: AIMessage = {
    id: uuidv4(),
    role: 'assistant',
    content: aiResponse,
    timestamp: Date.now()
  };
  
  // Add to conversation history
  conversation.messages.push(assistantMessageObj);
  conversation.updatedAt = Date.now();
  
  return assistantMessageObj;
};

/**
 * Format messages for Gemma LLM API
 */
const formatMessagesForLLM = (conversation: AIConversation) => {
  // Get recent messages (to avoid context length issues)
  // System prompt + last 10 messages maximum
  const systemMessage = conversation.messages.find(m => m.role === 'system');
  const recentMessages = conversation.messages
    .filter(m => m.role !== 'system')
    .slice(-10);
  
  const formattedMessages = [];
  
  // Add system message first
  if (systemMessage) {
    formattedMessages.push({
      role: 'system',
      content: systemMessage.content
    });
  }
  
  // Add recent conversation history
  recentMessages.forEach(message => {
    formattedMessages.push({
      role: message.role === 'user' ? 'user' : 'assistant',
      content: message.content
    });
  });
  
  return formattedMessages;
};

/**
 * Get response from LLM
 */
const getResponseFromLLM = async (conversation: AIConversation): Promise<string> => {
  if (!llmConfig.apiKey || !llmConfig.endpoint) {
    throw new Error('LLM not configured properly');
  }
  
  // Format messages for the LLM
  const messages = formatMessagesForLLM(conversation);
  
  try {
    // Send request to LLM API
    const response = await fetch(`${llmConfig.endpoint}/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${llmConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: llmConfig.modelName,
        messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`LLM API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling LLM API:', error);
    throw error;
  }
};

/**
 * Get a simulated response based on personality type
 */
const getSimulatedResponse = (personalityType: AIPersonalityType): string => {
  const simulatedResponses: Record<AIPersonalityType, string[]> = {
    rhythm: [
      "I love that energy! Let's channel it into a quick movement exercise. Stand up, stretch high, then pulse down to the beat of your favorite song for just 30 seconds. How does that feel?",
      "Your body is made to move! Try this: roll your shoulders in 3 big circles, then reverse direction. Notice how even this small movement can shift your energy?",
      "I sense some creative potential waiting to be unleashed! How about a 1-minute dance break right now? No rules - just move however feels good!",
      "Movement anchors your financial decisions in body wisdom! Before your next investment choice, try this: stand tall, take 3 deep breaths while gently swaying side to side.",
      "Sitting too long? Let's fix that! Touch your toes (or as far as comfortable), then reach to the sky, and repeat 3 times. Quick movements boost creativity and focus!",
    ],
    nexus: [
      "I notice from your interests that you might enjoy connecting with Alicia from our Houston hub. She's also exploring sustainable investment strategies - shall I make an introduction?",
      "Our community thrives on shared experiences! There's a market trends discussion happening this Thursday at the Austin location - would you like to attend and meet 3 members with complementary expertise?",
      "Building your network strengthens your wealth journey. I see potential for a valuable connection with our tech investor group - they meet virtually every Tuesday at 7pm.",
      "Your unique perspective would add value to our upcoming cultural exchange event. Four other members with similar goals have confirmed - shall I add you to the list?",
      "Community insights often spark the best opportunities! Our cross-hub meetup next weekend features speakers on exactly the topics you've been exploring. Interested?",
    ],
    serenity: [
      "Take a moment... notice your breath. Financial decisions made from a centered place tend to align better with our true values. What feels most important about this choice to you?",
      "Before responding to that question, let's pause. Close your eyes for three breaths if you're comfortable. What intuition arises about your wealth journey?",
      "I notice a pattern in your reflections... there seems to be a tension between security and growth. Perhaps sit with that balance for a moment. Which feels most nurturing right now?",
      "Consider viewing this challenge from a higher perspective. If your future self looked back on this moment, what would they appreciate about the way you approached it?",
      "The mind-body connection informs our relationship with wealth. As you consider this question, notice: where do you feel it in your body? What is that sensation telling you?",
    ]
  };
  
  // Select a random response based on personality
  const responses = simulatedResponses[personalityType];
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Get a conversation by ID
 */
export const getConversation = (conversationId: string): AIConversation | null => {
  return conversations[conversationId] || null;
};

/**
 * Clear a conversation's history
 */
export const clearConversation = (conversationId: string): void => {
  const conversation = conversations[conversationId];
  
  if (!conversation) {
    throw new Error(`Conversation not found: ${conversationId}`);
  }
  
  // Keep only the system prompt
  const systemPrompt = conversation.messages.find(m => m.role === 'system');
  
  if (systemPrompt) {
    conversation.messages = [systemPrompt];
    conversation.updatedAt = Date.now();
  }
};

/**
 * Add custom training data to a personality type
 * This will update the system prompt with additional guidance
 */
export const addTrainingData = (
  personalityType: AIPersonalityType, 
  newTrainingData: string
): void => {
  // Add new training data to the array
  trainingData[personalityType].push(newTrainingData);
  
  // Update existing conversations with this personality type
  Object.values(conversations)
    .filter(convo => convo.personalityType === personalityType)
    .forEach(convo => {
      // Find and update the system message
      const systemMessageIndex = convo.messages.findIndex(m => m.role === 'system');
      if (systemMessageIndex >= 0) {
        convo.messages[systemMessageIndex].content = getSystemPrompt(personalityType);
        convo.updatedAt = Date.now();
      }
    });
};

/**
 * Get the current system prompt for a personality type
 * Includes base system prompt + all training data
 */
export const getSystemPrompt = (personalityType: AIPersonalityType): string => {
  const basePrompt = SYSTEM_PROMPTS[personalityType];
  const personalityTrainingData = trainingData[personalityType];
  
  if (personalityTrainingData.length === 0) {
    return basePrompt;
  }
  
  // Combine base prompt with training data
  return `${basePrompt}\n\nADDITIONAL TRAINING:\n${personalityTrainingData.join('\n\n')}`;
};

/**
 * Get all training data for a personality type
 */
export const getTrainingData = (personalityType: AIPersonalityType): string[] => {
  return [...trainingData[personalityType]];
};

/**
 * Clear all training data for a personality type
 */
export const clearTrainingData = (personalityType: AIPersonalityType): void => {
  trainingData[personalityType] = [];
  
  // Update existing conversations with this personality type
  Object.values(conversations)
    .filter(convo => convo.personalityType === personalityType)
    .forEach(convo => {
      // Find and update the system message
      const systemMessageIndex = convo.messages.findIndex(m => m.role === 'system');
      if (systemMessageIndex >= 0) {
        convo.messages[systemMessageIndex].content = SYSTEM_PROMPTS[personalityType];
        convo.updatedAt = Date.now();
      }
    });
};

// Export the service
export default {
  initializeConversation,
  sendMessage,
  getConversation,
  clearConversation,
  addTrainingData,
  getSystemPrompt,
  getTrainingData,
  clearTrainingData,
  configureLLM,
  checkLLMConnection,
  getLLMConfig
};