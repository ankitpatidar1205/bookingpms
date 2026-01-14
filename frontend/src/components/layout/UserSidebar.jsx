import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  CalendarIcon,
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My Bookings', href: '/bookings', icon: CalendarDaysIcon },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon }
];

export default function UserSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <CalendarIcon className="h-8 w-8 text-primary-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">BookingPMS</span>
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
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <item.icon className={`h-5 w-5 mr-3 ${isActive(item.href) ? 'text-primary-600' : ''}`} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
