import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resourceService } from '../../services/resourceService';
import {
  CalendarDaysIcon,
  CubeIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ArrowRightIcon,
  UsersIcon,
  CheckCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await resourceService.getAll({ limit: 6 });
      setResources(response.data.resources || []);
    } catch (error) {
      console.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (resource) => {
    if (resource.status !== 'AVAILABLE') {
      toast.error('This resource is not available for booking');
      return;
    }

    if (!isAuthenticated) {
      sessionStorage.setItem('pendingBookingResource', JSON.stringify({
        id: resource.id,
        name: resource.name
      }));
      toast('Please login to book this resource', { icon: '🔐' });
      navigate('/login', { state: { from: { pathname: '/calendar' } } });
      return;
    }

    navigate('/calendar', { state: { selectedResource: resource.id } });
  };

  const features = [
    {
      icon: CalendarDaysIcon,
      title: 'Smart Scheduling',
      description: 'Intuitive calendar interface with drag-and-drop booking'
    },
    {
      icon: CubeIcon,
      title: 'Resource Management',
      description: 'Manage meeting rooms, equipment, and spaces efficiently'
    },
    {
      icon: ClockIcon,
      title: 'Real-time Availability',
      description: 'Instant updates on resource availability'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Conflict Prevention',
      description: 'Automatic detection of scheduling conflicts'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Track usage patterns and optimize resources'
    },
    {
      icon: UsersIcon,
      title: 'Multi-user Support',
      description: 'Role-based access for teams and admins'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Bookings Made' },
    { value: '500+', label: 'Resources' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-accent-500 text-white mb-6">
                <StarSolid className="h-4 w-4 mr-2" />
                #1 Resource Booking Platform
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6">
                Book Resources
                <span className="block text-accent-300">Effortlessly</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
                Streamline your workspace scheduling with our powerful booking management system.
                Save time, avoid conflicts, and maximize resource utilization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
                <Link
                  to="/resources"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200"
                >
                  View Resources
                </Link>
              </div>
            </div>

            {/* Hero Image/Illustration - Calendar Preview */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold">January 2026</span>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm">&lt;</div>
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm">&gt;</div>
                    </div>
                  </div>
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2 text-center text-xs text-white/60 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(35)].map((_, i) => {
                      const day = i - 2;
                      const isBooked = [5, 12, 15, 20, 25].includes(day);
                      const isToday = day === 14;
                      return (
                        <div
                          key={i}
                          className={`h-10 rounded-lg flex items-center justify-center text-sm ${
                            day < 1 || day > 31 ? 'text-white/20' :
                            isToday ? 'bg-accent-500 text-white font-bold' :
                            isBooked ? 'bg-white/30 text-white' :
                            'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          {day >= 1 && day <= 31 ? day : ''}
                        </div>
                      );
                    })}
                  </div>
                  {/* Stats */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-accent-500"></div>
                      <span className="text-white/70 text-xs">Today</span>
                      <div className="w-3 h-3 rounded-full bg-white/30 ml-3"></div>
                      <span className="text-white/70 text-xs">Booked</span>
                    </div>
                    <span className="text-white/60 text-xs">5 bookings this week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-8 sm:py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-500">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 mb-4">
              <CubeIcon className="h-4 w-4 mr-2" />
              Available Resources
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Browse Our Resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Explore available meeting rooms, equipment, and spaces ready for booking
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : resources.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    {/* Resource Image */}
                    <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary-500 to-primary-600 overflow-hidden">
                      {resource.imageUrl ? (
                        <img
                          src={resource.imageUrl}
                          alt={resource.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CubeIcon className="h-16 w-16 text-white/50" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          resource.status === 'AVAILABLE'
                            ? 'bg-accent-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}>
                          {resource.status}
                        </span>
                      </div>
                    </div>

                    {/* Resource Info */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg">{resource.name}</h3>
                          <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                            {resource.type}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {resource.description || 'No description available'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                        {resource.capacity && (
                          <span className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-1" />
                            {resource.capacity} people
                          </span>
                        )}
                        {resource.location && (
                          <span className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {resource.location}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {resource.pricePerHour ? (
                          <span className="text-lg font-bold text-primary-500">
                            ${resource.pricePerHour}<span className="text-sm text-gray-500 font-normal">/hr</span>
                          </span>
                        ) : (
                          <span className="text-sm text-accent-600 font-semibold">Free</span>
                        )}
                        <button
                          onClick={() => handleBookNow(resource)}
                          disabled={resource.status !== 'AVAILABLE'}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            resource.status === 'AVAILABLE'
                              ? 'bg-primary-500 text-white hover:bg-primary-600'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8 sm:mt-10">
                <Link
                  to="/resources"
                  className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all"
                >
                  View All Resources
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <CubeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No resources available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-700 mb-4">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Why Choose Us
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Everything you need to manage your resources effectively
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 hover:bg-primary-50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary-500 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8 text-sm sm:text-base max-w-2xl mx-auto">
            Join thousands of users who are already managing their resources efficiently with BookingPMS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-500 font-semibold rounded-xl hover:bg-gray-100 transition-all"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/calendar"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              View Calendar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
