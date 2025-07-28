import React, { useState, useEffect } from 'react'
import { Bot, Activity, Zap, Server, MoreVertical, Play, Pause, RefreshCw, Plus, Settings, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'
import { useAgent } from '../context/AgentContext'
import AgentCreator from '../components/AgentCreator'
import AgentExecutor from '../components/AgentExecutor'
import useAgentObservability from '../hooks/useAgentObservability'

const performanceData = [
  { time: '00:00', accuracy: 94.5, speed: 1.2 },
  { time: '04:00', accuracy: 95.1, speed: 1.1 },
  { time: '08:00', accuracy: 93.8, speed: 1.3 },
  { time: '12:00', accuracy: 96.2, speed: 1.0 },
  { time: '16:00', accuracy: 94.9, speed: 1.2 },
  { time: '20:00', accuracy: 95.5, speed: 1.1 },
]

export default function Agents() {
  const { state } = useApp()
  const { 
    frameworkAgents, 
    loadFrameworkAgents, 
    loading, 
    errors,
    isHeliconeEnabled 
  } = useAgent()
  const { 
    metrics, 
    getSystemMetrics, 
    isEnabled: isObservabilityEnabled 
  } = useAgentObservability()
  
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [activeTab, setActiveTab] = useState('monitoring') // 'monitoring', 'framework', 'create', 'execute'
  const [selectedFrameworkAgent, setSelectedFrameworkAgent] = useState(null)

  // Load framework agents on component mount
  useEffect(() => {
    loadFrameworkAgents()
    if (isObservabilityEnabled()) {
      getSystemMetrics()
    }
  }, [loadFrameworkAgents, getSystemMetrics, isObservabilityEnabled])

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    return status === 'Active' ? 
      <div className="w-2 h-2 bg-green-500 rounded-full"></div> :
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600 mt-1">Monitor performance and manage z-agent framework</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={() => setActiveTab('create')}
            className="btn-secondary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Agent
          </button>
          <button 
            onClick={() => setActiveTab('execute')}
            className="btn-primary flex items-center"
            disabled={frameworkAgents.length === 0}
          >
            <Play className="w-5 h-5 mr-2" />
            Execute Agent
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'monitoring'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Performance Monitoring
          </button>
          <button
            onClick={() => setActiveTab('framework')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'framework'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Bot className="w-4 h-4 inline mr-2" />
            Z-Agent Framework
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'create'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create Agent
          </button>
          <button
            onClick={() => setActiveTab('execute')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'execute'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Execute Agent
          </button>
          {isObservabilityEnabled() && (
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'monitoring' && (
        <>
          {/* Agent Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {state.agents.map((agent) => (
          <div 
            key={agent.id} 
            className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Bot className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.model}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(agent.status)}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Activity className="w-4 h-4 text-green-500 mr-1" />
                </div>
                <p className="text-lg font-semibold text-gray-900">{agent.accuracy}%</p>
                <p className="text-xs text-gray-500">Accuracy</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4 text-blue-500 mr-1" />
                </div>
                <p className="text-lg font-semibold text-gray-900">{agent.inference_time}s</p>
                <p className="text-xs text-gray-500">Response</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Server className="w-4 h-4 text-purple-500 mr-1" />
                </div>
                <p className="text-lg font-semibold text-gray-900">{agent.resource_utilization}%</p>
                <p className="text-xs text-gray-500">CPU Usage</p>
              </div>
            </div>

            {selectedAgent === agent.id && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Performance Trend</h4>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={performanceData.slice(-6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                
                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 btn-secondary text-sm flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retrain
                  </button>
                  <button className={`flex-1 text-sm flex items-center justify-center ${
                    agent.status === 'Active' ? 'btn-secondary' : 'btn-primary'
                  }`}>
                    {agent.status === 'Active' ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Performance Dashboard */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Dashboard</h3>
          <div className="flex items-center space-x-4">
            <select className="input w-40">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accuracy Chart */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Accuracy Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[90, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Accuracy (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Response Time Chart */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Response Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Speed (s)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agent Logs */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">GPT-4 Customer Bot processed 1,247 queries</span>
            <span className="text-xs text-gray-500 ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Content Generator Pro completed training cycle</span>
            <span className="text-xs text-gray-500 ml-auto">15 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Document Analyzer went offline for maintenance</span>
            <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Z-Agent Framework Tab */}
      {activeTab === 'framework' && (
        <div className="space-y-6">
          {/* Framework Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading.agents ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading framework agents...</span>
              </div>
            ) : frameworkAgents.length > 0 ? (
              frameworkAgents.map((agent) => (
                <div 
                  key={agent.id} 
                  className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedFrameworkAgent(selectedFrameworkAgent === agent.id ? null : agent.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bot className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-500">{agent.description}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tools:</span>
                      <span className="font-medium">{agent.tools?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tasks:</span>
                      <span className="font-medium">{agent.tasks?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {agent.created_at ? new Date(agent.created_at).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {selectedFrameworkAgent === agent.id && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Tools</h4>
                          <div className="flex flex-wrap gap-2">
                            {agent.tools?.map((tool, index) => (
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
                            {agent.tasks?.map((task, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFrameworkAgent(agent.id);
                              setActiveTab('execute');
                            }}
                            className="flex-1 btn-primary text-sm flex items-center justify-center"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Execute
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Framework Agents</h3>
                <p className="text-gray-600 mb-4">
                  Create your first agent using the z-agent framework
                </p>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="btn-primary"
                >
                  Create Agent
                </button>
              </div>
            )}
          </div>

          {errors.agents && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">Error loading framework agents: {errors.agents}</p>
            </div>
          )}
        </div>
      )}

      {/* Create Agent Tab */}
      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto">
          <AgentCreator 
            onAgentCreated={(agent) => {
              setActiveTab('framework');
              loadFrameworkAgents();
            }}
            onCancel={() => setActiveTab('framework')}
          />
        </div>
      )}

      {/* Execute Agent Tab */}
      {activeTab === 'execute' && (
        <div className="max-w-4xl mx-auto">
          <AgentExecutor 
            selectedAgent={
              selectedFrameworkAgent 
                ? frameworkAgents.find(a => a.id === selectedFrameworkAgent)
                : null
            }
            onBack={() => setActiveTab('framework')}
          />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && isObservabilityEnabled() && (
        <div className="space-y-6">
          {/* System Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Executions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.totalExecutions || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.successRate?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.avgExecutionTime ? `${(metrics.avgExecutionTime / 1000).toFixed(1)}s` : '0s'}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.activeAgents || frameworkAgents.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Observability Status */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Observability Status</h3>
                <p className="text-gray-600 mt-1">
                  {isHeliconeEnabled() 
                    ? 'Helicone observability is active and monitoring agent executions'
                    : 'Helicone observability is not configured. Add your API key to enable detailed monitoring.'
                  }
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isHeliconeEnabled() 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isHeliconeEnabled() ? 'Active' : 'Not Configured'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
