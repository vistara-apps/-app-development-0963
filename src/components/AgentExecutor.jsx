/**
 * Component for executing agents with custom arguments and real-time status
 */

import React, { useState, useEffect } from 'react';
import { Play, ArrowLeft, AlertCircle, CheckCircle, Clock, Loader } from 'lucide-react';
import { useAgent } from '../context/AgentContext';

function AgentExecutor({ selectedAgent, onBack }) {
  const { 
    frameworkAgents, 
    executeAgent, 
    executionResults, 
    activeExecutions,
    loading, 
    errors 
  } = useAgent();

  const [currentAgent, setCurrentAgent] = useState(selectedAgent);
  const [executionArgs, setExecutionArgs] = useState({});
  const [executionHistory, setExecutionHistory] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Update current agent when selectedAgent changes
  useEffect(() => {
    if (selectedAgent) {
      setCurrentAgent(selectedAgent);
      setExecutionArgs({});
      setShowResults(false);
    }
  }, [selectedAgent]);

  const handleAgentSelect = (agent) => {
    setCurrentAgent(agent);
    setExecutionArgs({});
    setShowResults(false);
  };

  const handleArgChange = (key, value) => {
    setExecutionArgs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExecute = async () => {
    if (!currentAgent) return;

    try {
      const result = await executeAgent(currentAgent.id, executionArgs);
      setExecutionHistory(prev => [
        {
          id: Date.now(),
          agent: currentAgent,
          args: executionArgs,
          result,
          timestamp: new Date().toISOString(),
          status: 'completed'
        },
        ...prev.slice(0, 9) // Keep last 10 executions
      ]);
      setShowResults(true);
    } catch (error) {
      setExecutionHistory(prev => [
        {
          id: Date.now(),
          agent: currentAgent,
          args: executionArgs,
          error: error.message,
          timestamp: new Date().toISOString(),
          status: 'error'
        },
        ...prev.slice(0, 9)
      ]);
      setShowResults(true);
    }
  };

  const getExecutionStatus = (agentId) => {
    return activeExecutions.find(exec => exec.agentId === agentId);
  };

  const formatDuration = (ms) => {
    if (!ms) return '0ms';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const currentExecution = currentAgent ? getExecutionStatus(currentAgent.id) : null;
  const currentResult = currentAgent ? executionResults[currentAgent.id] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Agents
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Execute Agent</h2>
            <p className="text-sm text-gray-600">
              Run agents with custom arguments and view results
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Selection */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-medium text-gray-900 mb-4">Select Agent</h3>
            <div className="space-y-2">
              {frameworkAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    currentAgent?.id === agent.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{agent.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{agent.description}</div>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>{agent.tools?.length || 0} tools</span>
                    <span className="mx-2">•</span>
                    <span>{agent.tasks?.length || 0} tasks</span>
                  </div>
                </button>
              ))}
            </div>

            {frameworkAgents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No agents available</p>
                <p className="text-sm mt-1">Create an agent first</p>
              </div>
            )}
          </div>
        </div>

        {/* Execution Panel */}
        <div className="lg:col-span-2">
          {currentAgent ? (
            <div className="space-y-6">
              {/* Agent Details */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{currentAgent.name}</h3>
                    <p className="text-gray-600 mt-1">{currentAgent.description}</p>
                  </div>
                  {currentExecution && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentExecution.status === 'running' 
                        ? 'bg-blue-100 text-blue-800' 
                        : currentExecution.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentExecution.status === 'running' && <Loader className="w-3 h-3 inline mr-1 animate-spin" />}
                      {currentExecution.status === 'completed' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {currentExecution.status === 'error' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                      {currentExecution.status}
                    </div>
                  )}
                </div>

                {/* Tools and Tasks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tools</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentAgent.tools?.map((tool, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {typeof tool === 'string' ? tool : tool.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tasks</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {currentAgent.tasks?.map((task, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Execution Arguments */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Execution Arguments</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Description
                      </label>
                      <textarea
                        value={executionArgs.task || ''}
                        onChange={(e) => handleArgChange('task', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe what you want the agent to do..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Context
                      </label>
                      <textarea
                        value={executionArgs.context || ''}
                        onChange={(e) => handleArgChange('context', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any additional context or constraints..."
                      />
                    </div>
                  </div>

                  {/* Custom Arguments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Arguments (JSON)
                    </label>
                    <textarea
                      value={executionArgs.custom ? JSON.stringify(executionArgs.custom, null, 2) : ''}
                      onChange={(e) => {
                        try {
                          const parsed = e.target.value ? JSON.parse(e.target.value) : {};
                          handleArgChange('custom', parsed);
                        } catch (error) {
                          // Invalid JSON, keep the string value for editing
                          handleArgChange('custom', e.target.value);
                        }
                      }}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder='{"key": "value"}'
                    />
                  </div>
                </div>

                {/* Execute Button */}
                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={handleExecute}
                    disabled={loading.execution || !executionArgs.task?.trim()}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading.execution ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Execute Agent
                      </>
                    )}
                  </button>
                </div>

                {/* Error Display */}
                {errors.execution && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">Execution failed: {errors.execution}</p>
                  </div>
                )}
              </div>

              {/* Results */}
              {(currentResult || currentExecution) && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Results</h3>
                  
                  {currentExecution && currentExecution.status === 'running' && (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Agent is running...</p>
                        <p className="text-sm text-gray-600">
                          Started {formatDuration(Date.now() - currentExecution.startTime)} ago
                        </p>
                      </div>
                    </div>
                  )}

                  {currentResult && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium text-gray-900">Execution Completed</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {currentResult.execution_time && formatDuration(currentResult.execution_time)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Result</h4>
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {typeof currentResult.result === 'string' 
                            ? currentResult.result 
                            : JSON.stringify(currentResult.result, null, 2)
                          }
                        </pre>
                      </div>

                      {currentResult.metadata && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
                          <pre className="text-sm text-gray-700">
                            {JSON.stringify(currentResult.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Execution History */}
              {executionHistory.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Executions</h3>
                  <div className="space-y-3">
                    {executionHistory.slice(0, 5).map((execution) => (
                      <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            execution.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{execution.agent.name}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(execution.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {execution.status === 'completed' ? 'Success' : 'Failed'}
                          </p>
                          {execution.result?.execution_time && (
                            <p className="text-sm text-gray-600">
                              {formatDuration(execution.result.execution_time)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Agent</h3>
              <p className="text-gray-600">
                Choose an agent from the list to configure and execute it
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentExecutor;
