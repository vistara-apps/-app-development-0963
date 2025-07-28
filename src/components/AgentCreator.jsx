/**
 * Component for creating new agents with tool selection and task definition
 */

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, AlertCircle, Search, X } from 'lucide-react';
import { useAgent } from '../context/AgentContext';

function AgentCreator({ onAgentCreated, onCancel }) {
  const { 
    tools, 
    loadTools, 
    searchTools, 
    saveAgent, 
    loading, 
    errors,
    searchQueries 
  } = useAgent();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tasks: [''],
    tools: [],
    argumentSchema: {}
  });

  const [showToolSearch, setShowToolSearch] = useState(false);
  const [toolSearchQuery, setToolSearchQuery] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Load tools on component mount
  useEffect(() => {
    loadTools();
  }, [loadTools]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...formData.tasks];
    newTasks[index] = value;
    setFormData(prev => ({
      ...prev,
      tasks: newTasks
    }));
  };

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, '']
    }));
  };

  const removeTask = (index) => {
    if (formData.tasks.length > 1) {
      const newTasks = formData.tasks.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        tasks: newTasks
      }));
    }
  };

  const handleToolSelect = (tool) => {
    if (!formData.tools.find(t => t.id === tool.id || t.name === tool.name)) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, tool]
      }));
    }
  };

  const handleToolDeselect = (tool) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter(t => t.id !== tool.id && t.name !== tool.name)
    }));
  };

  const handleToolSearch = async (query) => {
    setToolSearchQuery(query);
    if (query.trim()) {
      await searchTools(query);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Agent name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Agent name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Agent description is required';
    } else if (formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (formData.tasks.every(task => !task.trim())) {
      errors.tasks = 'At least one task is required';
    }

    if (formData.tools.length === 0) {
      errors.tools = 'At least one tool must be selected';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const agentData = {
        ...formData,
        tasks: formData.tasks.filter(task => task.trim()),
        argumentSchema: formData.argumentSchema || {}
      };

      const savedAgent = await saveAgent(agentData);
      
      if (onAgentCreated) {
        onAgentCreated(savedAgent);
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const filteredTools = tools.filter(tool => 
    !formData.tools.find(selected => selected.id === tool.id || selected.name === tool.name)
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Create New Agent</h2>
        <p className="text-sm text-gray-600 mt-1">
          Define your agent's capabilities and tasks using the z-agent framework
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter agent name"
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe what this agent does"
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.description}
              </p>
            )}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tasks *
          </label>
          <div className="space-y-3">
            {formData.tasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Task ${index + 1}`}
                />
                {formData.tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTask}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </button>
          </div>
          {validationErrors.tasks && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.tasks}
            </p>
          )}
        </div>

        {/* Tools Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tools * ({formData.tools.length} selected)
          </label>
          
          {/* Selected Tools */}
          {formData.tools.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Tools</h4>
              <div className="flex flex-wrap gap-2">
                {formData.tools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{tool.name}</span>
                    <button
                      type="button"
                      onClick={() => handleToolDeselect(tool)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tool Search */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={toolSearchQuery}
                onChange={(e) => handleToolSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search for tools..."
              />
            </div>

            {/* Available Tools */}
            {filteredTools.length > 0 && (
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredTools.map((tool, index) => (
                  <div
                    key={index}
                    className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleToolSelect(tool)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                        {tool.category && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tool.category}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToolSelect(tool);
                        }}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {loading.tools && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading tools...</span>
              </div>
            )}
          </div>

          {validationErrors.tools && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.tools}
            </p>
          )}
        </div>

        {/* Error Display */}
        {errors.saving && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error creating agent: {errors.saving}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading.saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading.saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Agent
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgentCreator;
