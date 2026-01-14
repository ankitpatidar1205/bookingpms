import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Failed to load notification count');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const guestLinks = [
    { name: 'Home', href: '/' },
    { name: 'Resources', href: '/resources' },
    { name: 'Calendar', href: '/calendar' }
  ];

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
                <CalendarDaysIcon className="h-7 w-7 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">BookingPMS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {!isAuthenticated && guestLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* Dashboard Link */}
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Dashboard
                </Link>

                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-accent-500 rounded-full ring-2 ring-primary-500">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <Menu as="div" className="relative ml-2">
                  <Menu.Button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-all duration-200">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {user.firstName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium hidden lg:block">
                      {user.firstName || 'User'}
                    </span>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black/5 focus:outline-none">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${active ? 'bg-gray-50' : ''} flex items-center px-4 py-2.5 text-sm text-gray-700`}
                          >
                            <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                            Profile Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${active ? 'bg-gray-50' : ''} flex items-center w-full px-4 py-2.5 text-sm text-red-600`}
                          >
                            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 shadow-sm transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={mobileMenuOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        <div className="md:hidden bg-primary-700 border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {!isAuthenticated && guestLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block px-4 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="block px-4 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/notifications"
                  className="flex items-center justify-between px-4 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 text-base font-semibold bg-white text-primary-600 rounded-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  );
}
