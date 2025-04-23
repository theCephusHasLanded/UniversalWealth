import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Settings, Trash2, AlertTriangle } from 'lucide-react';
import aiCounselorService, { 
  AIPersonalityType, 
  getSystemPrompt, 
  LLMConfig 
} from '../../services/hub/aiCounselorService';

interface AITrainingAdminProps {
  onClose: () => void;
}

const AITrainingAdmin: React.FC<AITrainingAdminProps> = ({ onClose }) => {
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonalityType>('rhythm');
  const [trainingData, setTrainingData] = useState<string>('');
  const [trainingHistory, setTrainingHistory] = useState<string[]>([]);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'training' | 'config'>('training');
  
  // LLM configuration
  const [llmConfig, setLLMConfig] = useState<LLMConfig>({
    apiKey: '',
    endpoint: '',
    modelName: 'gemma-7b',
    isConnected: false
  });

  // Personality display information
  const personalityInfo = {
    rhythm: {
      name: 'Rhythm (Dance Champion)',
      color: 'bg-purple-500',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500',
      description: 'The energetic, movement-focused AI that encourages physical expression'
    },
    nexus: {
      name: 'Nexus (Social Organizer)',
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500',
      description: 'The charismatic, connection-focused AI that builds community'
    },
    serenity: {
      name: 'Serenity (Introspective Guide)',
      color: 'bg-green-500',
      textColor: 'text-green-400',
      borderColor: 'border-green-500',
      description: 'The calm, reflection-focused AI that promotes mindfulness'
    }
  };
  
  // Load the current system prompt when personality changes
  useEffect(() => {
    try {
      const prompt = getSystemPrompt(selectedPersonality);
      setSystemPrompt(prompt);
      
      // Load training history
      const history = aiCounselorService.getTrainingData(selectedPersonality);
      setTrainingHistory(history);
    } catch (error) {
      console.error('Error loading system prompt:', error);
    }
  }, [selectedPersonality]);
  
  // Check if LLM is connected
  useEffect(() => {
    // Load current LLM config
    const currentConfig = aiCounselorService.getLLMConfig();
    setLLMConfig(currentConfig);
    
    // Check LLM connection
    checkLLMConnection();
  }, []);
  
  // Check LLM connection
  const checkLLMConnection = async () => {
    setIsChecking(true);
    try {
      const isConnected = await aiCounselorService.checkLLMConnection();
      setLLMConfig(prev => ({ ...prev, isConnected }));
    } catch (error) {
      console.error('Error checking LLM connection:', error);
    } finally {
      setIsChecking(false);
    }
  };
  
  // Handle saving new training data
  const handleSaveTraining = async () => {
    if (!trainingData.trim()) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // Add the training data to the selected personality
      aiCounselorService.addTrainingData(selectedPersonality, trainingData);
      
      // Refresh system prompt display
      const updatedPrompt = getSystemPrompt(selectedPersonality);
      setSystemPrompt(updatedPrompt);
      
      // Update training history
      const history = aiCounselorService.getTrainingData(selectedPersonality);
      setTrainingHistory(history);
      
      // Show success message
      setSaveStatus('success');
      
      // Clear the training data input
      setTrainingData('');
    } catch (error) {
      console.error('Error saving training data:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle clearing all training data for a personality
  const handleClearAllTraining = () => {
    if (window.confirm(`Are you sure you want to clear all training data for ${personalityInfo[selectedPersonality].name}?`)) {
      try {
        aiCounselorService.clearTrainingData(selectedPersonality);
        
        // Refresh system prompt display
        const updatedPrompt = getSystemPrompt(selectedPersonality);
        setSystemPrompt(updatedPrompt);
        
        // Update training history
        setTrainingHistory([]);
      } catch (error) {
        console.error('Error clearing training data:', error);
      }
    }
  };
  
  // Handle saving LLM configuration
  const handleSaveLLMConfig = async () => {
    setIsSaving(true);
    
    try {
      // Update LLM configuration
      aiCounselorService.configureLLM(llmConfig);
      
      // Check connection
      await checkLLMConnection();
      
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving LLM configuration:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">AI Counselor Training Admin</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${llmConfig.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-gray-400">
                {llmConfig.isConnected ? 'LLM Connected' : 'LLM Not Connected'}
              </span>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-lg hover:bg-gray-800 transition-colors text-sm px-3 py-1"
            >
              Close
            </button>
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'training' 
                ? 'border-b-2 border-purple-500 text-white' 
                : 'text-gray-400 hover:text-gray-300'}`}
          >
            Training Data
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'config' 
                ? 'border-b-2 border-purple-500 text-white' 
                : 'text-gray-400 hover:text-gray-300'}`}
          >
            LLM Configuration
          </button>
        </div>
        
        {/* Main content area */}
        {activeTab === 'training' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(90vh-110px)]">
            {/* Personality selector sidebar */}
            <div className="p-4 border-r border-gray-800 space-y-4 lg:h-full overflow-y-auto">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">Select AI Personality</h3>
              
              {/* Personality selector buttons */}
              {(Object.keys(personalityInfo) as AIPersonalityType[]).map((type) => (
                <div 
                  key={type}
                  onClick={() => setSelectedPersonality(type)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedPersonality === type 
                      ? personalityInfo[type].borderColor
                      : 'border-gray-800'
                  } ${
                    selectedPersonality === type 
                      ? 'bg-gray-800' 
                      : 'bg-gray-900 hover:bg-gray-850'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-4 w-4 rounded-full ${personalityInfo[type].color}`}></div>
                    <div>
                      <h4 className={`font-medium ${personalityInfo[type].textColor}`}>
                        {personalityInfo[type].name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {personalityInfo[type].description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* LLM connection status and info */}
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium mb-2">LLM Connection Status</h4>
                {llmConfig.isConnected ? (
                  <div className="text-xs text-gray-300">
                    <p className="text-green-400 mb-1">✓ Connected to Gemma LLM</p>
                    <p>Training data will be immediately utilized in AI responses.</p>
                    <p className="mt-2">Model: {llmConfig.modelName}</p>
                  </div>
                ) : (
                  <div className="text-xs text-gray-300">
                    <p className="text-red-400 mb-1">✗ Not connected to Gemma LLM</p>
                    <p>Training data will be saved for future use when LLM is connected.</p>
                    <p className="mt-2">Using simulated responses in the meantime.</p>
                  </div>
                )}
                <div className="mt-3">
                  <button
                    onClick={() => setActiveTab('config')}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
                  >
                    <Settings size={12} className="mr-1" />
                    Configure LLM Settings
                  </button>
                </div>
              </div>
            </div>
            
            {/* Training data input and system prompt display */}
            <div className="col-span-2 flex flex-col h-full">
              {/* Training data input */}
              <div className="p-4 border-b border-gray-800">
                <h3 className={`text-sm uppercase tracking-wider ${personalityInfo[selectedPersonality].textColor} mb-2`}>
                  Add Training Data for {personalityInfo[selectedPersonality].name}
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  Enter additional information, examples, or behaviors to train this AI counselor.
                  This will be added to the system prompt that guides the AI's responses.
                </p>
                
                <div className="relative">
                  <textarea
                    value={trainingData}
                    onChange={(e) => setTrainingData(e.target.value)}
                    className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gray-600"
                    placeholder={`Example: When users mention feeling tired, Rhythm should suggest energizing movement exercises...`}
                  ></textarea>
                  
                  <div className="flex justify-between mt-2">
                    <div>
                      {saveStatus === 'success' && activeTab === 'training' && (
                        <span className="text-xs text-green-400">Training data added successfully!</span>
                      )}
                      {saveStatus === 'error' && activeTab === 'training' && (
                        <span className="text-xs text-red-400">Error saving training data. Please try again.</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setTrainingData('')}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleSaveTraining}
                        disabled={isSaving || !trainingData.trim()}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs ${
                          isSaving || !trainingData.trim()
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save size={12} />
                            <span>Save Training Data</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Training data history */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm uppercase tracking-wider text-gray-400">Training Data History</h3>
                  {trainingHistory.length > 0 && (
                    <button
                      onClick={handleClearAllTraining}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center"
                    >
                      <Trash2 size={12} className="mr-1" />
                      Clear All
                    </button>
                  )}
                </div>
                
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {trainingHistory.length > 0 ? (
                    <div className="space-y-2">
                      {trainingHistory.map((item, index) => (
                        <div key={index} className="text-xs text-gray-300 p-2 bg-gray-900 rounded">
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 text-center py-4">
                      No training data has been added yet.
                    </div>
                  )}
                </div>
              </div>
              
              {/* System prompt display */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm uppercase tracking-wider text-gray-400">Current System Prompt</h3>
                  <div className="text-xs text-gray-500">Read-only</div>
                </div>
                
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 h-full overflow-y-auto">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                    {systemPrompt}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* LLM Configuration */
          <div className="p-6 h-[calc(90vh-110px)] overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4">LLM Configuration</h3>
              
              <div className="space-y-6">
                {/* Model selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LLM Model
                  </label>
                  <select
                    value={llmConfig.modelName}
                    onChange={(e) => setLLMConfig({ ...llmConfig, modelName: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm"
                  >
                    <option value="gemma-7b">Gemma 7B</option>
                    <option value="gemma-2b">Gemma 2B</option>
                  </select>
                </div>
                
                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={llmConfig.apiKey || ''}
                    onChange={(e) => setLLMConfig({ ...llmConfig, apiKey: e.target.value })}
                    placeholder="Enter your Gemma API key"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm"
                  />
                </div>
                
                {/* API Endpoint */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    API Endpoint
                  </label>
                  <input
                    type="text"
                    value={llmConfig.endpoint || ''}
                    onChange={(e) => setLLMConfig({ ...llmConfig, endpoint: e.target.value })}
                    placeholder="https://api.example.com/gemma"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Full URL to the Gemma API endpoint
                  </p>
                </div>
                
                {/* Connection info */}
                <div className="mt-4 p-3 bg-gray-800 rounded-lg flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${llmConfig.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-300">
                    {llmConfig.isConnected ? 'Connected to Gemma LLM' : 'Not connected to Gemma LLM'}
                  </span>
                </div>
                
                {/* Save buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={checkLLMConnection}
                    disabled={isChecking || !llmConfig.apiKey || !llmConfig.endpoint}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm ${
                      isChecking || !llmConfig.apiKey || !llmConfig.endpoint
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {isChecking ? (
                      <>
                        <RefreshCw size={14} className="animate-spin mr-1" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={14} className="mr-1" />
                        Test Connection
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleSaveLLMConfig}
                    disabled={isSaving || !llmConfig.apiKey || !llmConfig.endpoint}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm ${
                      isSaving || !llmConfig.apiKey || !llmConfig.endpoint
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={14} className="animate-spin mr-1" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} className="mr-1" />
                        Save Configuration
                      </>
                    )}
                  </button>
                </div>
                
                {saveStatus === 'success' && activeTab === 'config' && (
                  <div className="text-sm text-green-400 text-center mt-2">
                    Configuration saved successfully!
                  </div>
                )}
                {saveStatus === 'error' && activeTab === 'config' && (
                  <div className="text-sm text-red-400 text-center mt-2">
                    Error saving configuration. Please try again.
                  </div>
                )}
                
                {/* Information about LLM */}
                <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                    Important Information
                  </h4>
                  <div className="text-xs text-gray-300 space-y-2">
                    <p>
                      The Gemma LLM is an external service that enhances the AI counselor's responses.
                      When connected, the AI personalities will use Gemma's capabilities to generate more
                      natural and contextually relevant responses.
                    </p>
                    <p>
                      If not connected, the system will fall back to simulated responses that capture
                      the essence of each AI personality but are less dynamic.
                    </p>
                    <p>
                      All training data is stored locally and will be used when the LLM becomes
                      connected in the future.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITrainingAdmin;