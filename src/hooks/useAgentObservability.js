/**
 * Custom hook for agent observability using Helicone
 */

import { useState, useCallback, useEffect } from 'react';
import heliconeClient from '../services/heliconeClient';

function useAgentObservability() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if Helicone is enabled
  const isEnabled = useCallback(() => {
    return heliconeClient.isEnabled();
  }, []);

  // Start execution logging
  const startExecution = useCallback(async (executionData) => {
    if (!isEnabled()) {
      return { session_id: Date.now().toString() };
    }

    try {
      const session = await heliconeClient.logExecutionStart(executionData);
      return session;
    } catch (error) {
      console.error('Failed to start execution logging:', error);
      return { session_id: Date.now().toString() };
    }
  }, [isEnabled]);

  // Complete execution logging
  const completeExecution = useCallback(async (completionData) => {
    if (!isEnabled()) {
      return {};
    }

    try {
      const result = await heliconeClient.logExecutionComplete(completionData);
      return result;
    } catch (error) {
      console.error('Failed to complete execution logging:', error);
      return {};
    }
  }, [isEnabled]);

  // Log execution error
  const logExecutionError = useCallback(async (errorData) => {
    if (!isEnabled()) {
      return {};
    }

    try {
      const result = await heliconeClient.logExecutionError(errorData);
      return result;
    } catch (error) {
      console.error('Failed to log execution error:', error);
      return {};
    }
  }, [isEnabled]);

  // Get agent metrics
  const getAgentMetrics = useCallback(async (agentId, timeRange = '24h') => {
    setLoading(true);
    setError(null);

    try {
      const metricsData = await heliconeClient.getAgentMetrics(agentId, timeRange);
      setMetrics(metricsData);
      return metricsData;
    } catch (error) {
      setError(error.message);
      console.error('Failed to get agent metrics:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get execution history
  const getExecutionHistory = useCallback(async (agentId = null, limit = 50) => {
    setLoading(true);
    setError(null);

    try {
      const historyData = await heliconeClient.getExecutionHistory(agentId, limit);
      setHistory(historyData);
      return historyData;
    } catch (error) {
      setError(error.message);
      console.error('Failed to get execution history:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get system metrics
  const getSystemMetrics = useCallback(async (timeRange = '24h') => {
    setLoading(true);
    setError(null);

    try {
      const systemMetrics = await heliconeClient.getSystemMetrics(timeRange);
      setMetrics(systemMetrics);
      return systemMetrics;
    } catch (error) {
      setError(error.message);
      console.error('Failed to get system metrics:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search logs
  const searchLogs = useCallback(async (query, filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const searchResults = await heliconeClient.searchLogs(query, filters);
      setLogs(searchResults);
      return searchResults;
    } catch (error) {
      setError(error.message);
      console.error('Failed to search logs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Log custom event
  const logCustomEvent = useCallback(async (eventData) => {
    if (!isEnabled()) {
      return {};
    }

    try {
      const result = await heliconeClient.logCustomEvent(eventData);
      return result;
    } catch (error) {
      console.error('Failed to log custom event:', error);
      return {};
    }
  }, [isEnabled]);

  // Get current session
  const getCurrentSession = useCallback(() => {
    return heliconeClient.getCurrentSession();
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear data
  const clearData = useCallback(() => {
    setMetrics(null);
    setHistory([]);
    setLogs([]);
    setError(null);
  }, []);

  // Auto-refresh effect for real-time data
  useEffect(() => {
    if (!isEnabled()) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        // Refresh system metrics every 30 seconds
        await getSystemMetrics();
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isEnabled, getSystemMetrics]);

  return {
    // Data
    metrics,
    history,
    logs,
    loading,
    error,

    // Actions
    startExecution,
    completeExecution,
    logExecutionError,
    getAgentMetrics,
    getExecutionHistory,
    getSystemMetrics,
    searchLogs,
    logCustomEvent,

    // Utilities
    isEnabled,
    getCurrentSession,
    clearError,
    clearData,

    // State setters (for advanced usage)
    setMetrics,
    setHistory,
    setLogs,
    setLoading,
    setError
  };
}

export default useAgentObservability;
