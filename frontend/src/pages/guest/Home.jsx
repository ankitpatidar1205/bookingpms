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
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const features = [
  {
    name: 'Smart Scheduling',
    description: 'Intelligent booking system that prevents double bookings and optimizes resource utilization automatically.',
    icon: CalendarDaysIcon
  },
  {
    name: 'Resource Management',
    description: 'Manage meeting rooms, workspaces, equipment, and services from one centralized dashboard.',
    icon: BuildingOfficeIcon
  },
  {
    name: 'Real-Time Availability',
    description: 'Instant updates on resource availability. Book confidently knowing the status is always current.',
    icon: ClockIcon
  },
  {
    name: 'Analytics & Reports',
    description: 'Track usage patterns, revenue, and generate detailed reports for informed decision making.',
    icon: ChartBarIcon
  },
  {
    name: 'Secure & Reliable',
    description: 'Enterprise-grade security with role-based access control and comprehensive audit logging.',
    icon: ShieldCheckIcon
  },
  {
    name: 'Team Collaboration',
    description: 'Multi-user support with permissions, real-time notifications, and shared calendars.',
    icon: UserGroupIcon
  }
];

const stats = [
  { value: '50K+', label: 'Bookings Made', icon: CalendarDaysIcon },
  { value: '1000+', label: 'Resources', icon: BuildingOfficeIcon },
  { value: '99.9%', label: 'Uptime', icon: ShieldCheckIcon },
  { value: '4.9/5', label: 'Rating', icon: StarIcon }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Operations Manager',
    company: 'TechCorp',
    content: 'BookingPMS transformed how we manage our meeting rooms. The intuitive interface and real-time updates have saved us countless hours.',
    avatar: 'S'
  },
  {
    name: 'Michael Chen',
    role: 'Facility Director',
    company: 'InnoSpace',
    content: 'The analytics dashboard gives us insights we never had before. We\'ve optimized our space utilization by 40%.',
    avatar: 'M'
  },
  {
    name: 'Emily Davis',
    role: 'Admin Lead',
    company: 'StartupHub',
    content: 'Simple to use, powerful features. Our team adopted it immediately without any training needed.',
    avatar: 'E'
  }
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-primary-500 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-500/10 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
                Trusted by 1000+ Organizations
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Resource Booking
                <span className="block text-accent-300">Made Effortless</span>
              </h1>

              <p className="text-lg text-white/80 mb-10 max-w-lg leading-relaxed">
                Streamline your workspace management with our powerful booking platform.
                Real-time availability, instant confirmations, and complete control.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 shadow-xl">
                    Start Free Trial
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8">
                    <PlayCircleIcon className="h-5 w-5 mr-2" />
                    View Resources
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {['A', 'B', 'C', 'D'].map((letter, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-white font-semibold text-sm">
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="text-white/80 text-sm">
                  <span className="font-semibold text-white">500+</span> users joined this month
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent-500/20 to-primary-400/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                  {/* Calendar Header */}
                  <div className="bg-primary-500 px-6 py-4">
                    <div className="flex items-center justify-between text-white">
                      <h3 className="font-bold text-lg">January 2026</h3>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-3">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <div key={d} className="py-2 font-medium">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {[...Array(31)].map((_, i) => (
                        <div
                          key={i}
                          className={`py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                            i === 13 ? 'bg-primary-500 text-white shadow-lg' :
                            [5, 12, 19, 26].includes(i) ? 'bg-accent-100 text-accent-700' :
                            'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Card */}
                  <div className="border-t p-4">
                    <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                          <BuildingOfficeIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">Conference Room A</p>
                          <p className="text-sm text-gray-500">Jan 14, 9:00 AM - 11:00 AM</p>
                        </div>
                        <div className="flex items-center text-accent-600 bg-accent-100 px-3 py-1 rounded-full">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs font-semibold">Booked</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 100L48 91.7C96 83.3 192 66.7 288 58.3C384 50 480 50 576 54.2C672 58.3 768 66.7 864 70.8C960 75 1056 75 1152 70.8C1248 66.7 1344 58.3 1392 54.2L1440 50V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4 group-hover:bg-primary-500 transition-colors">
                  <stat.icon className="h-7 w-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-primary-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Book in 3 Simple Steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a guest or registered user, booking is quick and easy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {[
              {
                step: '01',
                title: 'Browse & Select',
                desc: 'View available rooms and services. Check real-time availability on our interactive calendar.',
                color: 'from-primary-500 to-primary-600'
              },
              {
                step: '02',
                title: 'Choose Time Slot',
                desc: 'Pick your preferred date and time. Our system shows only available slots.',
                color: 'from-accent-500 to-accent-600'
              },
              {
                step: '03',
                title: 'Confirm Booking',
                desc: 'Login to confirm your booking. Get instant confirmation and notification.',
                color: 'from-primary-600 to-primary-700'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                )}
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-center relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl text-white text-2xl font-bold mb-6 shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/calendar">
              <Button size="lg" className="px-8">
                View Calendar & Book Now
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-4">
              FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools for seamless resource management and booking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-500 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary-600 group-hover:text-white transition-colors" />
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

      {/* Testimonials */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Loved by Teams Everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-primary-500 py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of organizations already using BookingPMS. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-50 font-semibold px-10 shadow-xl">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/calendar">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-10">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
