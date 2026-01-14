import { Link } from 'react-router-dom';
import { Button } from '../../components/common';
import {
  CalendarDaysIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Smart Scheduling',
    description: 'AI-powered scheduling that prevents double bookings and optimizes resource utilization.',
    icon: CalendarDaysIcon,
    color: 'from-teal-500 to-emerald-500'
  },
  {
    name: 'Resource Management',
    description: 'Manage meeting rooms, workspaces, equipment, and more from a single dashboard.',
    icon: BuildingOfficeIcon,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Real-Time Updates',
    description: 'Instant availability updates and notifications keep everyone in sync.',
    icon: ClockIcon,
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Analytics Dashboard',
    description: 'Track usage patterns, revenue, and optimize your resources with data insights.',
    icon: ChartBarIcon,
    color: 'from-orange-500 to-amber-500'
  },
  {
    name: 'Enterprise Security',
    description: 'Role-based access, audit logs, and encrypted data keep your business secure.',
    icon: ShieldCheckIcon,
    color: 'from-red-500 to-rose-500'
  },
  {
    name: 'Team Collaboration',
    description: 'Multi-user support with permissions, notifications, and shared calendars.',
    icon: UserGroupIcon,
    color: 'from-indigo-500 to-violet-500'
  }
];

const stats = [
  { value: '10K+', label: 'Bookings Made' },
  { value: '500+', label: 'Resources Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' }
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-teal-400 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Trusted by 500+ Organizations
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Resource Booking
                <span className="block text-teal-200">Made Simple</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
                Streamline your workspace scheduling with our powerful booking management system.
                No more double bookings, just seamless reservations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 shadow-xl shadow-primary-900/20">
                    Start Free Trial
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/10 font-semibold px-8">
                    View Resources
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="hidden lg:block relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="space-y-4">
                  {/* Mock Calendar UI */}
                  <div className="bg-white rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800">January 2026</h3>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                        <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i}>{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                      {[...Array(31)].map((_, i) => (
                        <div
                          key={i}
                          className={`py-2 rounded-lg ${
                            i === 13 ? 'bg-primary-500 text-white font-bold' :
                            [5, 12, 19, 26].includes(i) ? 'bg-primary-100 text-primary-700' :
                            'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Mock Booking Card */}
                  <div className="bg-white rounded-xl p-4 shadow-lg flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-teal-400 rounded-xl flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Conference Room A</p>
                      <p className="text-sm text-gray-500">9:00 AM - 11:00 AM</p>
                    </div>
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Confirmed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-primary-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools to manage your resources, bookings, and team collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Book in 3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: '01', title: 'Browse Resources', desc: 'Explore available meeting rooms, workspaces, and equipment.' },
              { step: '02', title: 'Select Time Slot', desc: 'Choose your preferred date and time from the calendar.' },
              { step: '03', title: 'Confirm Booking', desc: 'Complete your reservation and receive instant confirmation.' }
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-teal-400 rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg shadow-primary-500/30">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Streamline Your Bookings?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already using BookingPMS to manage their resources efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 shadow-xl">
                Get Started Free
              </Button>
            </Link>
            <Link to="/calendar">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/10 font-semibold px-8">
                View Calendar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
