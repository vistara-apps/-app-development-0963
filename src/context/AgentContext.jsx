/**
 * React context for managing z-agent framework state
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import agentApi from '../services/agentApi';
import heliconeClient from '../services/heliconeClient';

const AgentContext = createContext();

// Initial state
const initialState = {
  // Z-Agent Framework agents (different from existing monitoring agents)
  frameworkAgents: [],
  tools: [],
  currentAgent: null,
  executionResults: {},
  
  // UI state
  loading: {
    agents: false,
    tools: false,
    execution: false,
    saving: false
  },
  errors: {
    agents: null,
    tools: null,
    execution: null,
    saving: null
  },
  
  // Search state
  searchQueries: {
    agents: '',
    tools: ''
  },
  
  // Execution state
  activeExecutions: new Map(),
  executionHistory: []
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_FRAMEWORK_AGENTS: 'SET_FRAMEWORK_AGENTS',
  ADD_FRAMEWORK_AGENT: 'ADD_FRAMEWORK_AGENT',
  SET_TOOLS: 'SET_TOOLS',
  SET_CURRENT_AGENT: 'SET_CURRENT_AGENT',
  SET_EXECUTION_RESULT: 'SET_EXECUTION_RESULT',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  ADD_ACTIVE_EXECUTION: 'ADD_ACTIVE_EXECUTION',
  UPDATE_ACTIVE_EXECUTION: 'UPDATE_ACTIVE_EXECUTION',
  REMOVE_ACTIVE_EXECUTION: 'REMOVE_ACTIVE_EXECUTION',
  ADD_EXECUTION_HISTORY: 'ADD_EXECUTION_HISTORY',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
function agentReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.value
        }
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: null
        }
      };

    case ActionTypes.SET_FRAMEWORK_AGENTS:
      return {
        ...state,
        frameworkAgents: action.payload
      };

    case ActionTypes.ADD_FRAMEWORK_AGENT:
      return {
        ...state,
        frameworkAgents: [...state.frameworkAgents, action.payload]
      };

    case ActionTypes.SET_TOOLS:
      return {
        ...state,
        tools: action.payload
      };

    case ActionTypes.SET_CURRENT_AGENT:
      return {
        ...state,
        currentAgent: action.payload
      };

    case ActionTypes.SET_EXECUTION_RESULT:
      return {
        ...state,
        executionResults: {
          ...state.executionResults,
          [action.payload.agentId]: action.payload.result
        }
      };

    case ActionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQueries: {
          ...state.searchQueries,
          [action.payload.type]: action.payload.query
        }
      };

    case ActionTypes.ADD_ACTIVE_EXECUTION:
      const newActiveExecutions = new Map(state.activeExecutions);
      newActiveExecutions.set(action.payload.id, action.payload);
      return {
        ...state,
        activeExecutions: newActiveExecutions
      };

    case ActionTypes.UPDATE_ACTIVE_EXECUTION:
      const updatedActiveExecutions = new Map(state.activeExecutions);
      const existingExecution = updatedActiveExecutions.get(action.payload.id);
      if (existingExecution) {
        updatedActiveExecutions.set(action.payload.id, {
          ...existingExecution,
          ...action.payload.updates
        });
      }
      return {
        ...state,
        activeExecutions: updatedActiveExecutions
      };

    case ActionTypes.REMOVE_ACTIVE_EXECUTION:
      const filteredActiveExecutions = new Map(state.activeExecutions);
      filteredActiveExecutions.delete(action.payload);
      return {
        ...state,
        activeExecutions: filteredActiveExecutions
      };

    case ActionTypes.ADD_EXECUTION_HISTORY:
      return {
        ...state,
        executionHistory: [action.payload, ...state.executionHistory].slice(0, 100) // Keep last 100
      };

    default:
      return state;
  }
}

// Provider component
export function AgentProvider({ children }) {
  const [state, dispatch] = useReducer(agentReducer, initialState);

  // Helper function to set loading state
  const setLoading = useCallback((key, value) => {
    dispatch({
      type: ActionTypes.SET_LOADING,
      payload: { key, value }
    });
  }, []);

  // Helper function to set error state
  const setError = useCallback((key, value) => {
    dispatch({
      type: ActionTypes.SET_ERROR,
      payload: { key, value }
    });
  }, []);

  // Clear error
  const clearError = useCallback((key) => {
    dispatch({
      type: ActionTypes.CLEAR_ERROR,
      payload: key
    });
  }, []);

  // Load framework agents
  const loadFrameworkAgents = useCallback(async (query = '') => {
    setLoading('agents', true);
    setError('agents', null);

    try {
      const agents = await agentApi.searchAgents(query);
      dispatch({
        type: ActionTypes.SET_FRAMEWORK_AGENTS,
        payload: agents
      });
    } catch (error) {
      setError('agents', error.message);
    } finally {
      setLoading('agents', false);
    }
  }, [setLoading, setError]);

  // Load tools
  const loadTools = useCallback(async (query = '') => {
    setLoading('tools', true);
    setError('tools', null);

    try {
      const tools = await agentApi.searchTools(query);
      dispatch({
        type: ActionTypes.SET_TOOLS,
        payload: tools
      });
    } catch (error) {
      setError('tools', error.message);
    } finally {
      setLoading('tools', false);
    }
  }, [setLoading, setError]);

  // Search tools
  const searchTools = useCallback(async (query) => {
    dispatch({
      type: ActionTypes.SET_SEARCH_QUERY,
      payload: { type: 'tools', query }
    });

    if (query.trim()) {
      await loadTools(query);
    }
  }, [loadTools]);

  // Search agents
  const searchAgents = useCallback(async (query) => {
    dispatch({
      type: ActionTypes.SET_SEARCH_QUERY,
      payload: { type: 'agents', query }
    });

    if (query.trim()) {
      await loadFrameworkAgents(query);
    }
  }, [loadFrameworkAgents]);

  // Save agent
  const saveAgent = useCallback(async (agentData) => {
    setLoading('saving', true);
    setError('saving', null);

    try {
      const savedAgent = await agentApi.saveAgent(agentData);
      
      dispatch({
        type: ActionTypes.ADD_FRAMEWORK_AGENT,
        payload: savedAgent
      });

      // Log to Helicone
      if (heliconeClient.isEnabled()) {
        await heliconeClient.logCustomEvent({
          type: 'agent_created',
          properties: {
            agent_id: savedAgent.id,
            agent_name: savedAgent.name,
            tools_count: savedAgent.tools?.length || 0,
            tasks_count: savedAgent.tasks?.length || 0
          }
        });
      }

      return savedAgent;
    } catch (error) {
      setError('saving', error.message);
      throw error;
    } finally {
      setLoading('saving', false);
    }
  }, [setLoading, setError]);

  // Execute agent
  const executeAgent = useCallback(async (agentId, args = {}) => {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const agent = state.frameworkAgents.find(a => a.id === agentId) || state.currentAgent;
    
    setLoading('execution', true);
    setError('execution', null);

    // Add to active executions
    dispatch({
      type: ActionTypes.ADD_ACTIVE_EXECUTION,
      payload: {
        id: executionId,
        agentId,
        agentName: agent?.name || 'Unknown Agent',
        status: 'running',
        startTime: Date.now(),
        args
      }
    });

    try {
      // Log execution start to Helicone
      let heliconeSession = null;
      if (heliconeClient.isEnabled()) {
        heliconeSession = await heliconeClient.logExecutionStart({
          agent_id: agentId,
          agent_name: agent?.name,
          arguments: args,
          execution_id: executionId
        });
      }

      // Execute the agent
      const result = await agentApi.executeAgent(agentId, args);

      // Update active execution
      dispatch({
        type: ActionTypes.UPDATE_ACTIVE_EXECUTION,
        payload: {
          id: executionId,
          updates: {
            status: 'completed',
            result: result.result,
            endTime: Date.now(),
            executionTime: result.execution_time
          }
        }
      });

      // Set execution result
      dispatch({
        type: ActionTypes.SET_EXECUTION_RESULT,
        payload: {
          agentId,
          result
        }
      });

      // Add to execution history
      dispatch({
        type: ActionTypes.ADD_EXECUTION_HISTORY,
        payload: {
          id: executionId,
          agentId,
          agentName: agent?.name || 'Unknown Agent',
          status: 'completed',
          result: result.result,
          executionTime: result.execution_time,
          timestamp: new Date().toISOString(),
          args
        }
      });

      // Log completion to Helicone
      if (heliconeClient.isEnabled() && heliconeSession) {
        await heliconeClient.logExecutionComplete({
          session_id: heliconeSession.session_id,
          agent_id: agentId,
          agent_name: agent?.name,
          result: result.result,
          execution_time: result.execution_time,
          status: 'completed',
          tokens_used: result.tokens_used,
          cost: result.cost
        });
      }

      return result;
    } catch (error) {
      // Update active execution with error
      dispatch({
        type: ActionTypes.UPDATE_ACTIVE_EXECUTION,
        payload: {
          id: executionId,
          updates: {
            status: 'error',
            error: error.message,
            endTime: Date.now()
          }
        }
      });

      // Add error to execution history
      dispatch({
        type: ActionTypes.ADD_EXECUTION_HISTORY,
        payload: {
          id: executionId,
          agentId,
          agentName: agent?.name || 'Unknown Agent',
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString(),
          args
        }
      });

      // Log error to Helicone
      if (heliconeClient.isEnabled()) {
        await heliconeClient.logExecutionError({
          agent_id: agentId,
          agent_name: agent?.name,
          error_type: 'execution_error',
          error_message: error.message,
          execution_id: executionId
        });
      }

      setError('execution', error.message);
      throw error;
    } finally {
      setLoading('execution', false);
      
      // Remove from active executions after a delay
      setTimeout(() => {
        dispatch({
          type: ActionTypes.REMOVE_ACTIVE_EXECUTION,
          payload: executionId
        });
      }, 5000);
    }
  }, [state.frameworkAgents, state.currentAgent, setLoading, setError]);

  // Set current agent
  const setCurrentAgent = useCallback((agent) => {
    dispatch({
      type: ActionTypes.SET_CURRENT_AGENT,
      payload: agent
    });
  }, []);

  // Context value
  const value = {
    // State
    frameworkAgents: state.frameworkAgents,
    tools: state.tools,
    currentAgent: state.currentAgent,
    executionResults: state.executionResults,
    loading: state.loading,
    errors: state.errors,
    searchQueries: state.searchQueries,
    activeExecutions: Array.from(state.activeExecutions.values()),
    executionHistory: state.executionHistory,

    // Actions
    loadFrameworkAgents,
    loadTools,
    searchTools,
    searchAgents,
    saveAgent,
    executeAgent,
    setCurrentAgent,
    clearError,

    // Utilities
    isApiAvailable: agentApi.isApiAvailable.bind(agentApi),
    isHeliconeEnabled: heliconeClient.isEnabled.bind(heliconeClient)
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

// Hook to use the agent context
export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}

export default AgentContext;
