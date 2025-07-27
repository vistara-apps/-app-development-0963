import React, { useState } from 'react'
import { Plus, Search, Tags, Copy, Edit, Trash, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import PromptForm from '../components/PromptForm'

export default function PromptRepository() {
  const { state, deletePrompt } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('All')

  const allTags = ['All', ...new Set(state.prompts.flatMap(prompt => prompt.tags))]

  const filteredPrompts = state.prompts.filter(prompt => {
    const matchesSearch = prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === 'All' || prompt.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt)
    setShowForm(true)
  }

  const handleDelete = (promptId) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      deletePrompt(promptId)
    }
  }

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingPrompt(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prompt Repository</h1>
          <p className="text-gray-600 mt-1">Curated collection of high-performing AI prompts</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Prompt
        </button>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Tags className="w-5 h-5 text-gray-400" />
              <select 
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="input w-40"
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="card p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{prompt.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{prompt.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => copyToClipboard(prompt.content)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleEdit(prompt)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title="Edit prompt"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(prompt.id)}
                  className="text-gray-400 hover:text-red-600 p-1"
                  title="Delete prompt"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {prompt.content.length > 200 
                  ? `${prompt.content.substring(0, 200)}...` 
                  : prompt.content
                }
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(prompt.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-4 flex space-x-3">
              <button 
                onClick={() => copyToClipboard(prompt.content)}
                className="flex-1 btn-secondary text-sm"
              >
                Use Prompt
              </button>
              <button className="text-gray-400 hover:text-yellow-500 p-2">
                <Star className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or add a new prompt</p>
        </div>
      )}

      {/* Prompt Form Modal */}
      {showForm && (
        <PromptForm 
          onClose={closeForm} 
          prompt={editingPrompt}
        />
      )}
    </div>
  )
}