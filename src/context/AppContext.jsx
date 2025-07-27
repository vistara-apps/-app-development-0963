import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    id: 1,
    name: 'John Smith',
    email: 'john@aiagency.com',
    role: 'Agency Owner'
  },
  projects: [
    {
      id: 1,
      name: 'E-commerce Chatbot',
      description: 'AI chatbot for online retail customer support',
      status: 'In Progress',
      start_date: '2024-01-15',
      end_date: '2024-03-15',
      progress: 75,
      client: 'RetailCorp'
    },
    {
      id: 2,
      name: 'Content Generator',
      description: 'AI-powered content creation for marketing campaigns',
      status: 'Planning',
      start_date: '2024-02-01',
      end_date: '2024-04-01',
      progress: 25,
      client: 'MarketingPro'
    },
    {
      id: 3,
      name: 'Document Analysis',
      description: 'Automated document processing and analysis',
      status: 'Completed',
      start_date: '2023-12-01',
      end_date: '2024-01-31',
      progress: 100,
      client: 'LegalFirm Inc'
    }
  ],
  prompts: [
    {
      id: 1,
      name: 'Customer Support Bot',
      description: 'Handles common customer inquiries and support tickets',
      content: 'You are a helpful customer support assistant. Please help the customer with their inquiry in a friendly and professional manner.',
      tags: ['customer-support', 'chatbot', 'general'],
      created_at: '2024-01-10'
    },
    {
      id: 2,
      name: 'Content Summarizer',
      description: 'Summarizes long articles and documents',
      content: 'Please provide a concise summary of the following content, highlighting the key points and main ideas.',
      tags: ['summarization', 'content', 'analysis'],
      created_at: '2024-01-12'
    },
    {
      id: 3,
      name: 'Email Composer',
      description: 'Helps compose professional business emails',
      content: 'Please help compose a professional email with the following requirements. Ensure the tone is appropriate and the message is clear.',
      tags: ['email', 'business', 'communication'],
      created_at: '2024-01-14'
    }
  ],
  agents: [
    {
      id: 1,
      name: 'GPT-4 Customer Bot',
      model: 'GPT-4',
      accuracy: 94.5,
      inference_time: 1.2,
      resource_utilization: 78,
      status: 'Active',
      projects: [1]
    },
    {
      id: 2,
      name: 'Content Generator Pro',
      model: 'GPT-3.5-turbo',
      accuracy: 89.2,
      inference_time: 0.8,
      resource_utilization: 65,
      status: 'Active',
      projects: [2]
    },
    {
      id: 3,
      name: 'Document Analyzer',
      model: 'Claude-2',
      accuracy: 96.1,
      inference_time: 2.1,
      resource_utilization: 82,
      status: 'Inactive',
      projects: [3]
    }
  ]
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, { ...action.payload, id: Date.now() }]
      }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? { ...project, ...action.payload } : project
        )
      }
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      }
    case 'ADD_PROMPT':
      return {
        ...state,
        prompts: [...state.prompts, { ...action.payload, id: Date.now(), created_at: new Date().toISOString() }]
      }
    case 'UPDATE_PROMPT':
      return {
        ...state,
        prompts: state.prompts.map(prompt =>
          prompt.id === action.payload.id ? { ...prompt, ...action.payload } : prompt
        )
      }
    case 'DELETE_PROMPT':
      return {
        ...state,
        prompts: state.prompts.filter(prompt => prompt.id !== action.payload)
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = {
    state,
    dispatch,
    addProject: (project) => dispatch({ type: 'ADD_PROJECT', payload: project }),
    updateProject: (project) => dispatch({ type: 'UPDATE_PROJECT', payload: project }),
    deleteProject: (id) => dispatch({ type: 'DELETE_PROJECT', payload: id }),
    addPrompt: (prompt) => dispatch({ type: 'ADD_PROMPT', payload: prompt }),
    updatePrompt: (prompt) => dispatch({ type: 'UPDATE_PROMPT', payload: prompt }),
    deletePrompt: (id) => dispatch({ type: 'DELETE_PROMPT', payload: id })
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}