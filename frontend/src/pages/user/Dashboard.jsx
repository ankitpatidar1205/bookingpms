import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { notificationService } from '../../services/notificationService';
import { Card, CardBody, CardHeader, Button, Loading, Badge } from '../../components/common';
import {
  CalendarDaysIcon,
  BellIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookingsRes, notifCountRes] = await Promise.all([
        bookingService.getUserBookings({ upcoming: true, limit: 5 }),
        notificationService.getUnreadCount()
      ]);
      setUpcomingBookings(bookingsRes.data.bookings);
      setUnreadNotifications(notifCountRes.data.count);
    } catch (error) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      CONFIRMED: 'success',
      PENDING: 'warning',
      CANCELLED: 'danger'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.firstName || 'User'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your bookings.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg mr-4">
              <CalendarDaysIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <BellIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unread Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{unreadNotifications}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Quick Action</p>
              <p className="text-lg font-medium text-gray-900">Make a Booking</p>
            </div>
            <Link to="/calendar">
              <Button size="sm">
                <PlusIcon className="h-4 w-4 mr-1" />
                Book Now
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
          <Link to="/bookings">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardBody>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No upcoming bookings</p>
              <Link to="/calendar">
                <Button>Make Your First Booking</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    {booking.resource.imageUrl && (
                      <img
                        src={booking.resource.imageUrl}
                        alt={booking.resource.name}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{booking.resource.name}</p>
                      <p className="text-sm text-gray-500">{booking.resource.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(booking.startTime)}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
