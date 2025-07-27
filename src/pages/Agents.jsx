import React, { useState } from 'react'
import { Bot, Activity, Zap, Server, MoreVertical, Play, Pause, RefreshCw } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'

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
  const [selectedAgent, setSelectedAgent] = useState(null)

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
          <p className="text-gray-600 mt-1">Monitor and manage your AI model performance</p>
        </div>
        <button className="btn-primary mt-4 sm:mt-0 flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          Deploy New Agent
        </button>
      </div>

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
    </div>
  )
}