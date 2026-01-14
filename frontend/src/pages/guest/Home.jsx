import { Link } from 'react-router-dom';
import { Button } from '../../components/common';
import {
  CalendarDaysIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Easy Resource Booking',
    description: 'Browse and book resources with our intuitive calendar interface. See real-time availability.',
    icon: CalendarDaysIcon
  },
  {
    name: 'Multiple Resource Types',
    description: 'Meeting rooms, offices, equipment, and more. Manage all your resources in one place.',
    icon: BuildingOfficeIcon
  },
  {
    name: 'Real-Time Availability',
    description: 'Check availability instantly and avoid double bookings with our smart scheduling system.',
    icon: ClockIcon
  },
  {
    name: 'Admin Dashboard',
    description: 'Powerful analytics and management tools for administrators to track usage and revenue.',
    icon: ChartBarIcon
  },
  {
    name: 'Secure & Reliable',
    description: 'Enterprise-grade security with role-based access control and complete audit logging.',
    icon: ShieldCheckIcon
  },
  {
    name: 'User Management',
    description: 'Manage users, permissions, and track all activities with comprehensive admin controls.',
    icon: UserGroupIcon
  }
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Resource & Booking Management
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Streamline your resource scheduling with our powerful, easy-to-use booking management system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/resources">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100">
                  Browse Resources
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage bookings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete solution for resource booking with powerful features for both users and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Create an account today and start managing your resources efficiently.
          </p>
          <Link to="/register">
            <Button size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
