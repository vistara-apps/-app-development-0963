import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Users, MoreVertical, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ProjectDetail() {
  const { id } = useParams()
  const { state } = useApp()
  const project = state.projects.find(p => p.id === parseInt(id))

  // Mock tasks data
  const [tasks] = useState([
    { 
      id: 1, 
      name: 'Setup AI model configuration', 
      status: 'Completed', 
      due_date: '2024-01-20',
      time_spent: 8
    },
    { 
      id: 2, 
      name: 'Train customer support model', 
      status: 'In Progress', 
      due_date: '2024-01-25',
      time_spent: 12
    },
    { 
      id: 3, 
      name: 'Integration with client system', 
      status: 'Pending', 
      due_date: '2024-02-01',
      time_spent: 0
    },
    { 
      id: 4, 
      name: 'Testing and optimization', 
      status: 'Pending', 
      due_date: '2024-02-10',
      time_spent: 0
    }
  ])

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Project not found</h2>
        <Link to="/projects" className="btn-primary mt-4">
          Back to Projects
        </Link>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return CheckCircle
      case 'In Progress': return Clock
      default: return AlertCircle
    }
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'Completed').length
  const totalTimeSpent = tasks.reduce((sum, task) => sum + task.time_spent, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/projects" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-primary-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p className="text-lg font-semibold text-gray-900">{project.client}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="text-lg font-semibold text-gray-900">{project.progress}%</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Time Spent</p>
              <p className="text-lg font-semibold text-gray-900">{totalTimeSpent}h</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Tasks</p>
              <p className="text-lg font-semibold text-gray-900">{completedTasks}/{totalTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Start Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(project.start_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex-1 mx-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-1">{project.progress}% Complete</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">End Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(project.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
          <button className="btn-primary flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => {
            const StatusIcon = getStatusIcon(task.status)
            return (
              <div key={task.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <StatusIcon className={`w-5 h-5 ${
                  task.status === 'Completed' ? 'text-green-500' :
                  task.status === 'In Progress' ? 'text-blue-500' : 'text-yellow-500'
                }`} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{task.name}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    <span>Time: {task.time_spent}h</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Project Actions */}
      <div className="flex justify-end space-x-4">
        <button className="btn-secondary">
          Generate Report
        </button>
        <button className="btn-primary">
          Update Project
        </button>
      </div>
    </div>
  )
}