import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  Bot, 
  BarChart3, 
  Users, 
  Settings,
  X,
  TrendingUp
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Prompt Repository', href: '/prompts', icon: FileText },
  { name: 'AI Agents', href: '/agents', icon: Bot },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Client Portal', href: '/client-portal', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar({ open, setOpen }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-large transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-20 px-8 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">AIency</span>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-6">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center px-4 py-4 text-sm font-semibold rounded-2xl mb-2 transition-all duration-200 group animate-slide-up
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 shadow-soft border border-primary-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-soft'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className={`mr-4 h-5 w-5 transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="gradient-primary rounded-2xl p-6 text-white shadow-medium">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-bold">Upgrade to Pro</h3>
            </div>
            <p className="text-xs opacity-90 mb-4 leading-relaxed">Unlock advanced features, unlimited projects, and priority support</p>
            <button className="w-full bg-white text-primary-700 text-sm font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-soft hover:shadow-medium">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
