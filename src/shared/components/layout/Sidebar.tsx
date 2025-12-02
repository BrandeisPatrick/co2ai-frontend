import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings
} from 'lucide-react'

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Equipment Inventory', path: '/equipment', icon: <Package size={20} /> },
  { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
]

interface SidebarProps {
  onCloseMobile?: () => void
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
  const location = useLocation()

  const handleNavClick = () => {
    onCloseMobile?.()
  }

  return (
    <aside className="w-64 glass-sidebar flex flex-col h-screen">
      {/* Logo and Title */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="text-white w-6 h-6">
              <path
                d="M12 2 L20 7 L20 17 L12 22 L4 17 L4 7 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="currentColor"
                fillOpacity="0.2"
              />
              <path
                d="M12 5 L17 8 L17 16 L12 19 L7 16 L7 8 Z"
                fill="currentColor"
                fillOpacity="0.4"
              />
              <path
                d="M12 10 L14.5 11.5 L14.5 13.5 L12 15 L9.5 13.5 L9.5 11.5 Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900 md:text-gray-700">Green Bio Compute</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Navigation
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={handleNavClick}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-emerald-500 text-white'
                      : 'text-gray-900 md:text-gray-700 hover:bg-white/20 hover:text-gray-900 md:hover:text-gray-700'
                    }
                  `}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
