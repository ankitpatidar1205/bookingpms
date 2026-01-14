import { useState, useEffect } from 'react';
import { resourceService } from '../../services/resourceService';
import {
  Card, CardBody, Button, Loading, Badge, Input, Select, Pagination, Modal
} from '../../components/common';
import { PlusIcon, PencilIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const initialFormState = {
  name: '',
  description: '',
  type: '',
  capacity: '',
  pricePerHour: '',
  status: 'AVAILABLE',
  imageUrl: ''
};

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '', status: '' });
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 1
  });
  const [modal, setModal] = useState({ open: false, mode: 'create', resource: null });
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, resource: null });

  useEffect(() => {
    loadResources();
  }, [filters, pagination.page]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const response = await resourceService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        type: filters.type || undefined,
        status: filters.status || undefined
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

  const handleCreate = () => {
    setForm(initialFormState);
    setModal({ open: true, mode: 'create', resource: null });
  };

  const handleEdit = (resource) => {
    setForm({
      name: resource.name,
      description: resource.description || '',
      type: resource.type,
      capacity: resource.capacity.toString(),
      pricePerHour: parseFloat(resource.pricePerHour).toString(),
      status: resource.status,
      imageUrl: resource.imageUrl || ''
    });
    setModal({ open: true, mode: 'edit', resource });
  };

  const handleSave = async () => {
    if (!form.name || !form.type || !form.capacity || !form.pricePerHour) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const data = {
        ...form,
        capacity: parseInt(form.capacity),
        pricePerHour: parseFloat(form.pricePerHour)
      };

      if (modal.mode === 'create') {
        await resourceService.create(data);
        toast.success('Resource created successfully');
      } else {
        await resourceService.update(modal.resource.id, data);
        toast.success('Resource updated successfully');
      }
      setModal({ open: false, mode: 'create', resource: null });
      loadResources();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.resource) return;
    setSaving(true);
    try {
      await resourceService.delete(deleteModal.resource.id);
      toast.success('Resource deleted successfully');
      setDeleteModal({ open: false, resource: null });
      loadResources();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSaving(false);
    }
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600">Manage bookable resources</p>
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <Input
              placeholder="Filter by type"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            />
            <Select
              placeholder="All Statuses"
              options={[
                { value: 'AVAILABLE', label: 'Available' },
                { value: 'BOOKED', label: 'Booked' },
                { value: 'MAINTENANCE', label: 'Maintenance' }
              ]}
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            />
            <Button
              variant="secondary"
              onClick={() => setFilters({ search: '', type: '', status: '' })}
            >
              Clear
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
        <Card>
          <CardBody className="text-center py-12">
            <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No resources found</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {resources.map((resource) => (
            <Card key={resource.id}>
              {resource.imageUrl && (
                <img
                  src={resource.imageUrl}
                  alt={resource.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardBody>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                  {getStatusBadge(resource.status)}
                </div>
                <p className="text-sm text-gray-500 mb-2">{resource.type}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {resource.description || 'No description'}
                </p>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Capacity: {resource.capacity}</span>
                  <span>${parseFloat(resource.pricePerHour).toFixed(2)}/hr</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(resource)}
                    className="flex-1"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteModal({ open: true, resource })}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {resources.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', resource: null })}
        title={modal.mode === 'create' ? 'Add Resource' : 'Edit Resource'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Name *"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Conference Room A"
          />
          <Input
            label="Type *"
            value={form.type}
            onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
            placeholder="Meeting Room"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capacity *"
              type="number"
              value={form.capacity}
              onChange={(e) => setForm(prev => ({ ...prev, capacity: e.target.value }))}
              placeholder="10"
            />
            <Input
              label="Price per Hour ($) *"
              type="number"
              step="0.01"
              value={form.pricePerHour}
              onChange={(e) => setForm(prev => ({ ...prev, pricePerHour: e.target.value }))}
              placeholder="50.00"
            />
          </div>
          <Select
            label="Status"
            options={[
              { value: 'AVAILABLE', label: 'Available' },
              { value: 'BOOKED', label: 'Booked' },
              { value: 'MAINTENANCE', label: 'Maintenance' }
            ]}
            value={form.status}
            onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
          />
          <Input
            label="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
            placeholder="https://..."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Resource description..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setModal({ open: false, mode: 'create', resource: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} className="flex-1">
              {modal.mode === 'create' ? 'Create Resource' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, resource: null })}
        title="Delete Resource"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{deleteModal.resource?.name}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ open: false, resource: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={saving}
              className="flex-1"
            >
              Delete Resource
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
