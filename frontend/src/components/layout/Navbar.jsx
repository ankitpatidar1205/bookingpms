import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  CalendarIcon
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
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <CalendarIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">BookingPMS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {!isAuthenticated && guestLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Dashboard
                </Link>

                {/* Notifications */}
                <Link to="/notifications" className="relative p-2 text-gray-500 hover:text-gray-700">
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <UserCircleIcon className="h-8 w-8" />
                    <span className="text-sm font-medium">
                      {user.firstName || user.email}
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
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block px-4 py-2 text-sm text-gray-700`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-1">
            {!isAuthenticated && guestLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/notifications"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
