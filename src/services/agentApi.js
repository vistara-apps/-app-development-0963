/**
 * API client for z-agent framework integration
 */

import ApiClient from '../utils/apiClient';

const AGENT_API_URL = import.meta.env.VITE_AGENT_API_URL || 'http://localhost:8000';

class AgentApiClient extends ApiClient {
  constructor() {
    super(AGENT_API_URL);
  }

  /**
   * Search for available tools
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} List of tools
   */
  async searchTools(query = '', limit = 20) {
    try {
      const response = await this.get('/tool_search', { query, limit });
      return response.tools || [];
    } catch (error) {
      console.error('Failed to search tools:', error);
      // Return mock data for development
      return this.getMockTools().filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    }
  }

  /**
   * Search for existing agents
   * @param {string} query - Search query
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} List of agents
   */
  async searchAgents(query = '', limit = 20) {
    try {
      const response = await this.get('/agent_search', { query, limit });
      return response.agents || [];
    } catch (error) {
      console.error('Failed to search agents:', error);
      // Return mock data for development
      return this.getMockAgents().filter(agent => 
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        agent.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    }
  }

  /**
   * Save a new agent to the framework
   * @param {Object} agentData - Agent configuration
   * @returns {Promise<Object>} Created agent
   */
  async saveAgent(agentData) {
    try {
      const response = await this.post('/save_agent', agentData);
      return response.agent || response;
    } catch (error) {
      console.error('Failed to save agent:', error);
      // Return mock response for development
      return {
        id: Date.now().toString(),
        ...agentData,
        created_at: new Date().toISOString(),
        status: 'created'
      };
    }
  }

  /**
   * Execute an agent with given arguments
   * @param {string} agentId - Agent ID
   * @param {Object} args - Execution arguments
   * @returns {Promise<Object>} Execution result
   */
  async executeAgent(agentId, args = {}) {
    try {
      const response = await this.post('/agent_call', {
        agent_id: agentId,
        arguments: args
      });
      return response;
    } catch (error) {
      console.error('Failed to execute agent:', error);
      // Return mock response for development
      return {
        execution_id: Date.now().toString(),
        status: 'completed',
        result: 'Mock execution result for development',
        execution_time: Math.random() * 5000 + 1000,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get agent execution status
   * @param {string} executionId - Execution ID
   * @returns {Promise<Object>} Execution status
   */
  async getExecutionStatus(executionId) {
    try {
      const response = await this.get(`/execution/${executionId}/status`);
      return response;
    } catch (error) {
      console.error('Failed to get execution status:', error);
      // Return mock status for development
      return {
        execution_id: executionId,
        status: 'completed',
        progress: 100,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get mock tools for development
   * @returns {Array} Mock tools
   */
  getMockTools() {
    return [
      {
        id: 'web_search',
        name: 'Web Search',
        description: 'Search the web for information using Serper API',
        category: 'search',
        parameters: {
          query: { type: 'string', required: true, description: 'Search query' },
          num_results: { type: 'number', default: 10, description: 'Number of results' }
        }
      },
      {
        id: 'file_reader',
        name: 'File Reader',
        description: 'Read and process various file formats',
        category: 'file',
        parameters: {
          file_path: { type: 'string', required: true, description: 'Path to file' },
          format: { type: 'string', default: 'auto', description: 'File format' }
        }
      },
      {
        id: 'calculator',
        name: 'Calculator',
        description: 'Perform mathematical calculations',
        category: 'math',
        parameters: {
          expression: { type: 'string', required: true, description: 'Mathematical expression' }
        }
      },
      {
        id: 'email_sender',
        name: 'Email Sender',
        description: 'Send emails via SMTP',
        category: 'communication',
        parameters: {
          to: { type: 'string', required: true, description: 'Recipient email' },
          subject: { type: 'string', required: true, description: 'Email subject' },
          body: { type: 'string', required: true, description: 'Email body' }
        }
      },
      {
        id: 'database_query',
        name: 'Database Query',
        description: 'Execute SQL queries on databases',
        category: 'database',
        parameters: {
          query: { type: 'string', required: true, description: 'SQL query' },
          database: { type: 'string', required: true, description: 'Database name' }
        }
      }
    ];
  }

  /**
   * Get mock agents for development
   * @returns {Array} Mock agents
   */
  getMockAgents() {
    return [
      {
        id: 'research_assistant',
        name: 'Research Assistant',
        description: 'Helps with research tasks and information gathering',
        tools: ['web_search', 'file_reader'],
        tasks: ['Research topics', 'Summarize findings', 'Generate reports'],
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'data_analyst',
        name: 'Data Analyst',
        description: 'Analyzes data and generates insights',
        tools: ['database_query', 'calculator', 'file_reader'],
        tasks: ['Query databases', 'Analyze trends', 'Create visualizations'],
        created_at: '2024-01-20T14:30:00Z'
      },
      {
        id: 'customer_support',
        name: 'Customer Support Bot',
        description: 'Handles customer inquiries and support tickets',
        tools: ['email_sender', 'database_query'],
        tasks: ['Answer questions', 'Escalate issues', 'Send follow-ups'],
        created_at: '2024-01-25T09:15:00Z'
      }
    ];
  }

  /**
   * Check if the agent API is available
   * @returns {Promise<boolean>} API availability status
   */
  async isApiAvailable() {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AgentApiClient();
