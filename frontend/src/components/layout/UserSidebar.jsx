import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarDaysIcon,
  CalendarIcon,
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  CubeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My Bookings', href: '/bookings', icon: CalendarDaysIcon },
  { name: 'Resources', href: '/resources', icon: CubeIcon },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon }
];

export default function UserSidebar({ onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="w-72 bg-primary-500 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center">
          <div className="bg-white/15 p-2 rounded-xl">
            <CalendarDaysIcon className="h-8 w-8 text-white" />
          </div>
          <div className="ml-3">
            <span className="text-xl font-bold text-white">BookingPMS</span>
            <span className="block text-xs text-white/60 font-medium">User Portal</span>
          </div>
        </div>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* User Profile Card */}
      <div className="mx-4 my-4 p-4 bg-white/10 rounded-xl border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-white">
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-white/60 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-3 pt-2 pb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
          Navigation
        </p>
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={handleNavClick}
            className={`
              flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive(item.href)
                ? 'bg-white text-primary-500 shadow-lg'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
              }
            `}
          >
            <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive(item.href) ? 'text-primary-500' : ''}`} />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
          className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
