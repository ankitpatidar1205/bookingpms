import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../../services/resourceService';
import { Card, CardBody, Loading, Badge, Button, Select, Input, Pagination } from '../../components/common';
import { MagnifyingGlassIcon, CurrencyDollarIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
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

  useEffect(() => {
    loadTypes();
  }, []);

  useEffect(() => {
    loadResources();
  }, [filters, pagination.page]);

  const loadTypes = async () => {
    try {
      const response = await resourceService.getTypes();
      setTypes(response.data.map(t => ({ value: t, label: t })));
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

  const getStatusBadge = (status) => {
    const variants = {
      AVAILABLE: 'success',
      BOOKED: 'warning',
      MAINTENANCE: 'danger'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources</h1>
        <p className="text-gray-600">Browse and book available resources</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              placeholder="All Types"
              options={types}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            />
            <Select
              placeholder="All Statuses"
              options={[
                { value: 'AVAILABLE', label: 'Available' },
                { value: 'BOOKED', label: 'Booked' },
                { value: 'MAINTENANCE', label: 'Maintenance' }
              ]}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={() => {
                setFilters({ search: '', type: '', status: '' });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" />
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No resources found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                {resource.imageUrl && (
                  <img
                    src={resource.imageUrl}
                    alt={resource.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardBody>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                    {getStatusBadge(resource.status)}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{resource.type}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {resource.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      <span>Capacity: {resource.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      <span>${parseFloat(resource.pricePerHour).toFixed(2)}/hr</span>
                    </div>
                  </div>
                  <Link to={`/resources/${resource.id}`}>
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          />
        </>
      )}
    </div>
  );
}
