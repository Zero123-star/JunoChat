import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAvailableModels, testAPIConnection, connectToAPI } from '@/api';

const APIConfigPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Load available models when component mounts
  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      // TODO BACKEND: Implement the get_available_models function in backend
      // Endpoint: GET /api/openrouter/models/
      // Returns: { models: string[] } - array of strings with model names
      // Example response: { models: ["ChatGPT-4", "Claude-Sonnet", "Gemini-Pro", ...] }
      const modelsList = await getAvailableModels();
      setModels(modelsList);
    } catch (error) {
      toast.error('Couldn\'t load models. Please try again later.');
      console.error('Error loading models:', error);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter the API Key');
      return;
    }

    setIsLoading(true);
    try {
      // TODO BACKEND: Implement the test_connection function in backend
      // Endpoint: POST /api/openrouter/test-connection/
      // Body: { api_key: string }
      // Returns: { success: boolean, message?: string }
      // The function will test if the API key is valid by making a simple request to OpenRouter
      const result = await testAPIConnection(apiKey);
      
      if (result.success) {
        toast.success('Connection tested successfully!', {
          description: 'API Key is valid',
          duration: 3000,
        });
      } else {
        toast.error('Connection failed', {
          description: result.message || 'Invalid or expired API Key',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Error testing connection', {
        description: 'Check if the backend is running',
        duration: 3000,
      });
      console.error('Test connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter the API Key');
      return;
    }

    if (!selectedModel) {
      toast.error('Please select a model');
      return;
    }

    setIsLoading(true);
    try {
      // TODO BACKEND: Implement the connect_api function in backend
      // Endpoint: POST /api/openrouter/connect/
      // Body: { api_key: string, model: string }
      // Returns: { success: boolean, message?: string }
      // The function will save the configuration (API key + model) in session/database for the current user
      const result = await connectToAPI(apiKey, selectedModel);
      
      if (result.success) {
        setIsConnected(true);
        toast.success('Connected successfully!', {
          description: `Selected model: ${selectedModel}`,
          duration: 3000,
        });
        
        // Save the configuration locally to persist between sessions
        localStorage.setItem('openrouter_configured', 'true');
        localStorage.setItem('selected_model', selectedModel);
      } else {
        toast.error('Connection failed', {
          description: result.message || 'Could not connect',
          duration: 3000,
        });
      }
    } catch (error) {
      toast.error('Error connecting', {
        description: 'Check if the backend is running',
        duration: 3000,
      });
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            API Configuration
          </h1>
          <p className="text-gray-600">
            Configure the connection to the OpenRouter API
          </p>
        </div>

        {/* Connection Status */}
        {isConnected && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <span className="text-green-700 font-medium">Connected successfully!</span>
          </div>
        )}

        {/* API Key Field */}
        <div className="mb-6">
          <label 
            htmlFor="apiKey" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            OpenRouter API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-gray-500">
            Get your key from{' '}
            <a 
              href="https://openrouter.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              OpenRouter
            </a>
          </p>
        </div>

        {/* Model Selection Dropdown */}
        <div className="mb-6">
          <label 
            htmlFor="model" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
            disabled={isLoading || models.length === 0}
          >
            <option value="">Select a model...</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          {models.length === 0 && (
            <p className="mt-2 text-xs text-gray-500">
              Loading available models..
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleTestConnection}
            disabled={isLoading || !apiKey.trim()}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg 
                     hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
                     transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Testing...
              </>
            ) : (
              <>
                Test Connection
              </>
            )}
          </button>

          <button
            onClick={handleConnect}
            disabled={isLoading || !apiKey.trim() || !selectedModel}
            className="flex-1 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg 
                     hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
                     transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                
                Connecting...
              </>
            ) : (
              <>
               
                Connect
              </>
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Info
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Test Connection checks if the API key is valid</li>
            <li>• Connect saves the configuration for app usage</li>
            <li>• The API key will not be shared or stored insecurely</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APIConfigPage;
