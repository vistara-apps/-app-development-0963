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
  AlertCircle,
  Plus
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
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back, <span className="font-semibold text-gray-900">{state.user.name}</span>! Here's what's happening with your agency.</p>
        </div>
        <div className="mt-6 sm:mt-0">
          <Link to="/projects" className="btn-primary btn-lg flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Create New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.name} 
              className="card-elevated p-6 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-2xl shadow-soft`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className={`status-badge ${
                  stat.changeType === 'increase' ? 'status-success' : 'status-error'
                } flex items-center`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="card-elevated p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Performance Overview</h3>
              <p className="text-sm text-gray-600 mt-1">Monthly projects and revenue trends</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Projects</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="projects" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                name="Projects"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="revenue" 
                stroke="#22c55e" 
                strokeWidth={3} 
                name="Revenue ($)"
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Performance */}
        <div className="card-elevated p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Agent Accuracy</h3>
              <p className="text-sm text-gray-600 mt-1">Performance metrics for AI agents</p>
            </div>
            <span className="status-badge status-success">All Active</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={agentMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                domain={[80, 100]} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value}%`, 'Accuracy']}
              />
              <Bar 
                dataKey="accuracy" 
                fill="#8b5cf6" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Projects & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="card-elevated p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Projects</h3>
              <p className="text-sm text-gray-600 mt-1">Latest project activity</p>
            </div>
            <Link to="/projects" className="btn-ghost btn-sm">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project, index) => (
              <div 
                key={project.id} 
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full shadow-soft ${
                    project.status === 'Completed' ? 'bg-success-500' :
                    project.status === 'In Progress' ? 'bg-primary-500' : 'bg-warning-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{project.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{project.client}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 mb-1">{project.progress}%</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-elevated p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/projects" 
              className="card-interactive flex flex-col items-center p-6 group"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
                <FolderOpen className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">New Project</span>
            </Link>
            <Link 
              to="/prompts" 
              className="card-interactive flex flex-col items-center p-6 group"
            >
              <div className="w-12 h-12 bg-success-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-success-200 transition-colors">
                <FileText className="w-6 h-6 text-success-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Add Prompt</span>
            </Link>
            <Link 
              to="/agents" 
              className="card-interactive flex flex-col items-center p-6 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">Monitor Agents</span>
            </Link>
            <Link 
              to="/reports" 
              className="card-interactive flex flex-col items-center p-6 group"
            >
              <div className="w-12 h-12 bg-info-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-info-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-info-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">View Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
