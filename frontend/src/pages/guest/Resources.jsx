import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resourceService } from '../../services/resourceService';
import { Card, CardBody, Loading, Badge, Button, Select, Input, Pagination } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import {
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  UsersIcon,
  Squares2X2Icon,
  TableCellsIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or table
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTypes();
  }, []);

  useEffect(() => {
    loadResources();
  }, [filters, pagination.page]);

  const loadTypes = async () => {
    try {
      const response = await resourceService.getTypes();
      setTypes(response.data.map(t => ({ value: t, label: t.replace('_', ' ') })));
    } catch (error) {
      console.error('Failed to load types');
    }
  };

  const loadResources = async () => {
    setLoading(true);
    try {
      const response = await resourceService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        type: filters.type || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined
      });
      setResources(response.data.resources);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBookNow = (resource) => {
    if (resource.status !== 'AVAILABLE') {
      toast.error('This resource is not available for booking');
      return;
    }

    if (!isAuthenticated) {
      // Store the intended resource for after login
      sessionStorage.setItem('pendingBookingResource', JSON.stringify({
        id: resource.id,
        name: resource.name
      }));
      toast('Please login to book this resource', { icon: '🔐' });
      navigate('/login', { state: { from: { pathname: '/calendar' } } });
      return;
    }

    // Navigate to calendar with resource selected
    navigate('/calendar', { state: { selectedResource: resource.id } });
  };

  const getStatusBadge = (status) => {
    const config = {
      AVAILABLE: { variant: 'success', label: 'Available', dot: 'bg-green-500' },
      UNAVAILABLE: { variant: 'danger', label: 'Unavailable', dot: 'bg-red-500' },
      MAINTENANCE: { variant: 'warning', label: 'Maintenance', dot: 'bg-yellow-500' }
    };
    const { variant, label, dot } = config[status] || { variant: 'secondary', label: status, dot: 'bg-gray-500' };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        variant === 'success' ? 'bg-green-100 text-green-700' :
        variant === 'danger' ? 'bg-red-100 text-red-700' :
        variant === 'warning' ? 'bg-yellow-100 text-yellow-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
          <p className="text-white/80">Browse available rooms, spaces, and services. Click "Book Now" to make a reservation.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Types</option>
                {types.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
              <button
                onClick={() => {
                  setFilters({ search: '', type: '', status: '' });
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium"
              >
                Clear Filters
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <TableCellsIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{resources.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{pagination.total}</span> resources
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loading size="lg" />
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  {resource.imageUrl ? (
                    <img
                      src={resource.imageUrl}
                      alt={resource.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <CalendarDaysIcon className="h-16 w-16 text-primary-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(resource.status)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <span className="text-xs text-white/80 font-medium">{resource.type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {resource.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4 text-gray-400" />
                      <span>{resource.capacity} people</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary-600 font-semibold">
                      <span>${parseFloat(resource.pricePerHour).toFixed(0)}</span>
                      <span className="text-gray-400 font-normal">/hour</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookNow(resource)}
                    disabled={resource.status !== 'AVAILABLE'}
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      resource.status === 'AVAILABLE'
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {resource.status === 'AVAILABLE' ? (
                      <>
                        Book Now
                        <ArrowRightIcon className="h-4 w-4" />
                      </>
                    ) : (
                      'Not Available'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Resource</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {resources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            {resource.imageUrl ? (
                              <img src={resource.imageUrl} alt={resource.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                                <CalendarDaysIcon className="h-6 w-6 text-primary-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{resource.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">{resource.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                          {resource.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <UsersIcon className="h-4 w-4" />
                          <span>{resource.capacity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-semibold text-primary-600">
                          ${parseFloat(resource.pricePerHour).toFixed(0)}
                        </span>
                        <span className="text-gray-400 text-sm">/hr</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(resource.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleBookNow(resource)}
                          disabled={resource.status !== 'AVAILABLE'}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            resource.status === 'AVAILABLE'
                              ? 'bg-primary-500 text-white hover:bg-primary-600'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {resource.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-sm px-4 py-2 flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      pagination.page === page
                        ? 'bg-primary-500 text-white'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CalendarDaysIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Want to see availability?</h3>
                <p className="text-white/80 text-sm">Check our calendar for real-time availability and make bookings</p>
              </div>
            </div>
            <Link to="/calendar">
              <button className="px-6 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
                View Calendar
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
