import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FolderOpen, 
  FileText, 
  Bot, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useApp } from '../context/AppContext'

const performanceData = [
  { name: 'Jan', projects: 8, revenue: 24000 },
  { name: 'Feb', projects: 12, revenue: 36000 },
  { name: 'Mar', projects: 15, revenue: 45000 },
  { name: 'Apr', projects: 10, revenue: 30000 },
  { name: 'May', projects: 18, revenue: 54000 },
  { name: 'Jun', projects: 22, revenue: 66000 },
]

const agentMetrics = [
  { name: 'GPT-4 Bot', accuracy: 94.5 },
  { name: 'Content Gen', accuracy: 89.2 },
  { name: 'Doc Analyzer', accuracy: 96.1 },
  { name: 'Email Bot', accuracy: 91.8 },
]

export default function Dashboard() {
  const { state } = useApp()
  const { projects, prompts, agents } = state

  const activeProjects = projects.filter(p => p.status !== 'Completed').length
  const completedProjects = projects.filter(p => p.status === 'Completed').length
  const totalPrompts = prompts.length
  const activeAgents = agents.filter(a => a.status === 'Active').length

  const stats = [
    {
      name: 'Active Projects',
      value: activeProjects,
      icon: FolderOpen,
      color: 'bg-primary-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Total Prompts',
      value: totalPrompts,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      name: 'Active Agents',
      value: activeAgents,
      icon: Bot,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'increase'
    },
    {
      name: 'Completed Projects',
      value: completedProjects,
      icon: CheckCircle,
      color: 'bg-blue-500',
      change: '+15%',
      changeType: 'increase'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {state.user.name}! Here's what's happening with your agency.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/projects" className="btn-primary">
            Create New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 flex items-center text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={2} name="Projects" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Accuracy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[80, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <Link to="/projects" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    project.status === 'Completed' ? 'bg-green-500' :
                    project.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{project.name}</p>
                  <p className="text-xs text-gray-500">{project.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{project.progress}%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-primary-500 h-1.5 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/projects" 
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FolderOpen className="w-8 h-8 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">New Project</span>
            </Link>
            <Link 
              to="/prompts" 
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FileText className="w-8 h-8 text-green-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Add Prompt</span>
            </Link>
            <Link 
              to="/agents" 
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bot className="w-8 h-8 text-purple-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">Monitor Agents</span>
            </Link>
            <Link 
              to="/reports" 
              className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}