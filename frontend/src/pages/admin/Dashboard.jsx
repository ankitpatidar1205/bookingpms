import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { adminService } from '../../services/adminService';
import { Card, CardBody, CardHeader, StatCard, Loading } from '../../components/common';
import {
  UsersIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [revenueByType, setRevenueByType] = useState([]);
  const [recentActivity, setRecentActivity] = useState({ recentBookings: [], recentUsers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, monthlyRes, revenueRes, activityRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getMonthlyBookings(6),
        adminService.getRevenueByType(),
        adminService.getRecentActivity(5)
      ]);
      setStats(statsRes.data);
      setMonthlyData(monthlyRes.data);
      setRevenueByType(revenueRes.data);
      setRecentActivity(activityRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Chart data
  const monthlyChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Bookings',
        data: monthlyData.map(d => d.bookings),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const revenueChartData = {
    labels: revenueByType.map(d => d.type),
    datasets: [
      {
        data: revenueByType.map(d => d.revenue),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }
    ]
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your booking system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.users.total || 0}
          icon={UsersIcon}
          change={stats?.users.growth}
        />
        <StatCard
          title="Active Bookings"
          value={stats?.bookings.active || 0}
          icon={CalendarDaysIcon}
          change={stats?.bookings.growth}
        />
        <StatCard
          title="Revenue (This Month)"
          value={formatCurrency(stats?.revenue.thisMonth || 0)}
          icon={CurrencyDollarIcon}
          change={stats?.revenue.growth}
        />
        <StatCard
          title="Total Resources"
          value={stats?.resources.total || 0}
          icon={CubeIcon}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Bookings Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Monthly Bookings</h2>
          </CardHeader>
          <CardBody>
            <Bar
              data={monthlyChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </CardBody>
        </Card>

        {/* Revenue by Type Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Revenue by Resource Type</h2>
          </CardHeader>
          <CardBody className="flex justify-center">
            <div className="w-64">
              <Doughnut
                data={revenueChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-200">
              {recentActivity.recentBookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{booking.resource?.name}</p>
                      <p className="text-sm text-gray-500">
                        {booking.user?.firstName} {booking.user?.lastName || booking.user?.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatDate(booking.createdAt)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
            <Link to="/admin/users" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-200">
              {recentActivity.recentUsers.map((user) => (
                <div key={user.id} className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
