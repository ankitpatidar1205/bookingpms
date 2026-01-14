import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Resources', href: '/admin/resources', icon: CubeIcon },
  { name: 'Calendar', href: '/admin/calendar', icon: CalendarIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardDocumentListIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon }
];

export default function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center px-6 py-5 border-b border-gray-700/50">
        <div className="bg-primary-500/20 p-2 rounded-xl">
          <CalendarDaysIcon className="h-8 w-8 text-primary-400" />
        </div>
        <div className="ml-3">
          <span className="text-xl font-bold text-white">BookingPMS</span>
          <span className="block text-xs text-primary-400 font-medium">Admin Panel</span>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="mx-4 my-4 p-4 bg-gray-700/30 rounded-xl border border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-400 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {user?.firstName?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Main Menu
        </p>
        {navigation.slice(0, 4).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive(item.href)
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }
            `}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}

        <p className="px-3 pt-6 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Management
        </p>
        {navigation.slice(4).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive(item.href)
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }
            `}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
