import React, { useState } from 'react'
import { Eye, MessageCircle, Download, Calendar, CheckCircle, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ClientPortal() {
  const { state } = useApp()
  const [selectedProject, setSelectedProject] = useState(state.projects[0])

  const mockMessages = [
    {
      id: 1,
      sender: 'client',
      message: 'How is the chatbot training progressing?',
      timestamp: '2024-01-22 10:30 AM',
      avatar: 'https://ui-avatars.io/api/?name=Client&background=3b82f6&color=fff'
    },
    {
      id: 2,
      sender: 'agency',
      message: 'Great progress! We\'ve achieved 94% accuracy and are now working on response optimization.',
      timestamp: '2024-01-22 11:15 AM',
      avatar: 'https://ui-avatars.io/api/?name=John+Smith&background=10b981&color=fff'
    },
    {
      id: 3,
      sender: 'client',
      message: 'That sounds excellent. When can we expect the first demo?',
      timestamp: '2024-01-22 2:45 PM',
      avatar: 'https://ui-avatars.io/api/?name=Client&background=3b82f6&color=fff'
    }
  ]

  const mockReports = [
    { id: 1, name: 'Week 1 Progress Report', date: '2024-01-15', type: 'Weekly Update' },
    { id: 2, name: 'Model Performance Analysis', date: '2024-01-20', type: 'Technical Report' },
    { id: 3, name: 'January Summary', date: '2024-01-31', type: 'Monthly Summary' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Planning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
          <p className="text-gray-600 mt-1">Collaborate with clients and share project updates</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select 
            value={selectedProject.id}
            onChange={(e) => setSelectedProject(state.projects.find(p => p.id === parseInt(e.target.value)))}
            className="input w-48"
          >
            {state.projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Overview */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{selectedProject.name}</h2>
            <p className="text-gray-600 mt-1">{selectedProject.description}</p>
            <div className="flex items-center space-x-4 mt-3">
              <span className="text-sm text-gray-500">Client: {selectedProject.client}</span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedProject.status)}`}>
                {selectedProject.status}
              </span>
            </div>
          </div>
          <button className="btn-primary flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Client View
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-lg font-semibold text-gray-900">{selectedProject.progress}%</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-semibold text-gray-900">
              {Math.ceil((new Date(selectedProject.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days
            </p>
            <p className="text-sm text-gray-600">Remaining</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-lg font-semibold text-gray-900">24h</p>
            <p className="text-sm text-gray-600">Response Time</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">{selectedProject.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-primary-500 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${selectedProject.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Communication & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Communication */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Client Communication</h3>
            <button className="btn-secondary flex items-center text-sm">
              <MessageCircle className="w-4 h-4 mr-1" />
              New Message
            </button>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {mockMessages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'agency' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.sender === 'agency' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <img 
                    src={message.avatar} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'agency' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'agency' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 input"
              />
              <button className="btn-primary">Send</button>
            </div>
          </div>
        </div>

        {/* Project Reports */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Project Reports</h3>
            <button className="btn-secondary flex items-center text-sm">
              <Download className="w-4 h-4 mr-1" />
              Generate Report
            </button>
          </div>

          <div className="space-y-3">
            {mockReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-900">{report.name}</h4>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{new Date(report.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Automated Reports</h4>
            <p className="text-sm text-gray-600 mb-3">Set up automatic report generation and delivery to your clients.</p>
            <button className="btn-primary text-sm">Configure Automation</button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Project milestone completed: AI model training phase</span>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Weekly progress report sent to {selectedProject.client}</span>
            <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Client feedback received and reviewed</span>
            <span className="text-xs text-gray-500 ml-auto">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}