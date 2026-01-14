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
  ArrowLeftOnRectangleIcon
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
  const { logout } = useAuth();

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-800">
        <CalendarIcon className="h-8 w-8 text-primary-500" />
        <span className="ml-2 text-xl font-bold text-white">BookingPMS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${isActive(item.href)
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
