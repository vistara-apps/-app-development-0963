import React from 'react'
import { Menu, Search, Bell, User } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Header({ onMenuClick }) {
  const { state } = useApp()

  return (
    <header className="bg-white border-b border-gray-100 shadow-soft">
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center space-x-6">
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, prompts, agents..."
              className="input pl-12 pr-6 py-3 w-96 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button className="relative text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-error-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{state.user.name}</p>
              <p className="text-xs text-gray-500 font-medium">{state.user.role}</p>
            </div>
            <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-soft cursor-pointer hover:shadow-medium transition-all duration-200">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
