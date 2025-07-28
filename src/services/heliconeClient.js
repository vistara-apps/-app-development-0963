/**
 * Helicone observability client for agent execution monitoring
 */

import ApiClient from '../utils/apiClient';

const HELICONE_API_URL = import.meta.env.VITE_HELICONE_API_URL || 'https://api.helicone.ai';
const HELICONE_API_KEY = import.meta.env.VITE_HELICONE_API_KEY;

class HeliconeClient extends ApiClient {
  constructor() {
    super(HELICONE_API_URL);
    this.apiKey = HELICONE_API_KEY;
    this.enabled = !!HELICONE_API_KEY;
  }

  /**
   * Override request method to add Helicone authentication
   */
  async request(endpoint, options = {}) {
    if (!this.enabled) {
      throw new Error('Helicone API key not configured');
    }

    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    return super.request(endpoint, config);
  }

  /**
   * Log agent execution start
   * @param {Object} executionData - Execution metadata
   * @returns {Promise<Object>} Log response
   */
  async logExecutionStart(executionData) {
    if (!this.enabled) {
      console.log('Helicone not enabled, skipping execution start log');
      return { session_id: Date.now().toString() };
    }

    try {
      const response = await this.post('/v1/request', {
        model: executionData.agent_name || 'z-agent',
        messages: [
          {
            role: 'system',
            content: `Agent execution started: ${executionData.agent_name}`
          },
          {
            role: 'user',
            content: JSON.stringify(executionData.arguments || {})
          }
        ],
        metadata: {
          agent_id: executionData.agent_id,
          agent_name: executionData.agent_name,
          execution_type: 'agent_call',
          timestamp: new Date().toISOString(),
          ...executionData.metadata
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to log execution start:', error);
      return { session_id: Date.now().toString() };
    }
  }

  /**
   * Log agent execution completion
   * @param {Object} completionData - Completion metadata
   * @returns {Promise<Object>} Log response
   */
  async logExecutionComplete(completionData) {
    if (!this.enabled) {
      console.log('Helicone not enabled, skipping execution completion log');
      return {};
    }

    try {
      const response = await this.post('/v1/request', {
        model: completionData.agent_name || 'z-agent',
        messages: [
          {
            role: 'assistant',
            content: completionData.result || 'Execution completed'
          }
        ],
        metadata: {
          session_id: completionData.session_id,
          agent_id: completionData.agent_id,
          agent_name: completionData.agent_name,
          execution_time: completionData.execution_time,
          status: completionData.status,
          tokens_used: completionData.tokens_used,
          cost: completionData.cost,
          timestamp: new Date().toISOString(),
          ...completionData.metadata
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to log execution completion:', error);
      return {};
    }
  }

  /**
   * Log execution error
   * @param {Object} errorData - Error metadata
   * @returns {Promise<Object>} Log response
   */
  async logExecutionError(errorData) {
    if (!this.enabled) {
      console.log('Helicone not enabled, skipping error log');
      return {};
    }

    try {
      const response = await this.post('/v1/request', {
        model: errorData.agent_name || 'z-agent',
        messages: [
          {
            role: 'system',
            content: `Agent execution failed: ${errorData.error_message}`
          }
        ],
        metadata: {
          session_id: errorData.session_id,
          agent_id: errorData.agent_id,
          agent_name: errorData.agent_name,
          error_type: errorData.error_type,
          error_message: errorData.error_message,
          execution_time: errorData.execution_time,
          status: 'error',
          timestamp: new Date().toISOString(),
          ...errorData.metadata
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to log execution error:', error);
      return {};
    }
  }

  /**
   * Get agent execution metrics
   * @param {string} agentId - Agent ID
   * @param {string} timeRange - Time range (1h, 24h, 7d, 30d)
   * @returns {Promise<Object>} Metrics data
   */
  async getAgentMetrics(agentId, timeRange = '24h') {
    if (!this.enabled) {
      return this.getMockMetrics();
    }

    try {
      const response = await this.get('/v1/metrics', {
        filter: `metadata.agent_id = "${agentId}"`,
        timeRange,
        groupBy: 'agent_id'
      });

      return this.processMetrics(response);
    } catch (error) {
      console.error('Failed to get agent metrics:', error);
      return this.getMockMetrics();
    }
  }

  /**
   * Get system-wide metrics
   * @param {string} timeRange - Time range (1h, 24h, 7d, 30d)
   * @returns {Promise<Object>} System metrics
   */
  async getSystemMetrics(timeRange = '24h') {
    if (!this.enabled) {
      return this.getMockSystemMetrics();
    }

    try {
      const response = await this.get('/v1/metrics', {
        filter: 'metadata.execution_type = "agent_call"',
        timeRange,
        groupBy: 'model'
      });

      return this.processSystemMetrics(response);
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      return this.getMockSystemMetrics();
    }
  }

  /**
   * Get execution history
   * @param {string} agentId - Agent ID (optional)
   * @param {number} limit - Number of records to return
   * @returns {Promise<Array>} Execution history
   */
  async getExecutionHistory(agentId = null, limit = 50) {
    if (!this.enabled) {
      return this.getMockHistory();
    }

    try {
      const filter = agentId ? `metadata.agent_id = "${agentId}"` : 'metadata.execution_type = "agent_call"';
      const response = await this.get('/v1/requests', {
        filter,
        limit,
        orderBy: 'created_at DESC'
      });

      return this.processHistory(response);
    } catch (error) {
      console.error('Failed to get execution history:', error);
      return this.getMockHistory();
    }
  }

  /**
   * Search execution logs
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>} Search results
   */
  async searchLogs(query, filters = {}) {
    if (!this.enabled) {
      return [];
    }

    try {
      const response = await this.get('/v1/requests/search', {
        query,
        ...filters
      });

      return response.data || [];
    } catch (error) {
      console.error('Failed to search logs:', error);
      return [];
    }
  }

  /**
   * Log custom event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Log response
   */
  async logCustomEvent(eventData) {
    if (!this.enabled) {
      console.log('Helicone not enabled, skipping custom event log');
      return {};
    }

    try {
      const response = await this.post('/v1/events', {
        event_type: eventData.type,
        properties: eventData.properties,
        timestamp: new Date().toISOString(),
        ...eventData
      });

      return response;
    } catch (error) {
      console.error('Failed to log custom event:', error);
      return {};
    }
  }

  /**
   * Process metrics response
   * @param {Object} response - Raw metrics response
   * @returns {Object} Processed metrics
   */
  processMetrics(response) {
    // Process Helicone metrics response format
    return {
      totalExecutions: response.total_requests || 0,
      successRate: response.success_rate || 0,
      avgExecutionTime: response.avg_latency || 0,
      totalCost: response.total_cost || 0,
      tokensUsed: response.total_tokens || 0,
      errorRate: response.error_rate || 0
    };
  }

  /**
   * Process system metrics response
   * @param {Object} response - Raw system metrics response
   * @returns {Object} Processed system metrics
   */
  processSystemMetrics(response) {
    return {
      totalExecutions: response.total_requests || 0,
      activeAgents: response.unique_agents || 0,
      successRate: response.success_rate || 0,
      avgExecutionTime: response.avg_latency || 0,
      totalCost: response.total_cost || 0,
      errorRate: response.error_rate || 0
    };
  }

  /**
   * Process execution history response
   * @param {Object} response - Raw history response
   * @returns {Array} Processed history
   */
  processHistory(response) {
    return (response.data || []).map(record => ({
      id: record.id,
      agent_id: record.metadata?.agent_id,
      agent_name: record.metadata?.agent_name,
      status: record.metadata?.status || 'unknown',
      execution_time: record.metadata?.execution_time || 0,
      tokens_used: record.metadata?.tokens_used || 0,
      cost: record.metadata?.cost || 0,
      timestamp: record.created_at,
      result: record.response?.content || 'No result available'
    }));
  }

  /**
   * Get mock metrics for development
   * @returns {Object} Mock metrics
   */
  getMockMetrics() {
    return {
      totalExecutions: Math.floor(Math.random() * 100) + 50,
      successRate: Math.random() * 10 + 90,
      avgExecutionTime: Math.random() * 3000 + 1000,
      totalCost: Math.random() * 10 + 5,
      tokensUsed: Math.floor(Math.random() * 10000) + 5000,
      errorRate: Math.random() * 5 + 2
    };
  }

  /**
   * Get mock system metrics for development
   * @returns {Object} Mock system metrics
   */
  getMockSystemMetrics() {
    return {
      totalExecutions: Math.floor(Math.random() * 500) + 200,
      activeAgents: Math.floor(Math.random() * 10) + 5,
      successRate: Math.random() * 5 + 92,
      avgExecutionTime: Math.random() * 2000 + 1500,
      totalCost: Math.random() * 50 + 25,
      errorRate: Math.random() * 3 + 1
    };
  }

  /**
   * Get mock execution history for development
   * @returns {Array} Mock history
   */
  getMockHistory() {
    const history = [];
    for (let i = 0; i < 20; i++) {
      history.push({
        id: `exec_${Date.now()}_${i}`,
        agent_id: `agent_${Math.floor(Math.random() * 3) + 1}`,
        agent_name: ['Research Assistant', 'Data Analyst', 'Customer Support'][Math.floor(Math.random() * 3)],
        status: Math.random() > 0.1 ? 'success' : 'error',
        execution_time: Math.random() * 5000 + 500,
        tokens_used: Math.floor(Math.random() * 1000) + 100,
        cost: Math.random() * 0.1 + 0.01,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        result: 'Mock execution result'
      });
    }
    return history;
  }

  /**
   * Check if Helicone is enabled
   * @returns {boolean} Enabled status
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Get current session ID
   * @returns {string} Session ID
   */
  getCurrentSession() {
    return this.currentSession || Date.now().toString();
  }
}

export default new HeliconeClient();
