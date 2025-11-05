import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FileText,
  BarChart3,
  Settings,
  Leaf
} from 'lucide-react'

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Equipment Inventory', path: '/equipment', icon: <Package size={20} /> },
  { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo and Title */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-blue-500 dark:to-blue-600 rounded-lg flex items-center justify-center">
            <Leaf className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white">Green Bio Compute</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Wet Lab Module</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">
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
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-emerald-500 dark:bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
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
