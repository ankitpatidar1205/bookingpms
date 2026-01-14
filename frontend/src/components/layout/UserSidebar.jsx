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
  const { user, logout } = useAuth();

  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-primary-600 to-primary-700 min-h-screen flex flex-col shadow-xl">
      {/* Logo */}
      <div className="flex items-center px-6 py-5">
        <div className="bg-white/20 p-2 rounded-xl">
          <CalendarDaysIcon className="h-8 w-8 text-white" />
        </div>
        <span className="ml-3 text-xl font-bold text-white">BookingPMS</span>
      </div>

      {/* User Profile Card */}
      <div className="mx-4 mb-6 p-4 bg-white/10 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-white/70 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive(item.href)
                ? 'bg-white text-primary-600 shadow-lg'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            <item.icon className={`h-5 w-5 mr-3 ${isActive(item.href) ? 'text-primary-500' : ''}`} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
