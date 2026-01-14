import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  Card, CardBody, Button, Loading, Badge, Input, Select, Pagination, Modal,
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell
} from '../../components/common';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', role: '', isActive: '' });
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, totalPages: 1
  });
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        role: filters.role || undefined,
        isActive: filters.isActive || undefined
      });
      setUsers(response.data.users);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      isActive: user.isActive
    });
    setEditModal({ open: true, user });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.updateUser(editModal.user.id, editForm);
      toast.success('User updated successfully');
      setEditModal({ open: false, user: null });
      loadUsers();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      if (user.isActive) {
        await adminService.deactivateUser(user.id);
        toast.success('User deactivated');
      } else {
        await adminService.activateUser(user.id);
        toast.success('User activated');
      }
      loadUsers();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setSaving(true);
    try {
      await adminService.deleteUser(deleteModal.user.id);
      toast.success('User deleted successfully');
      setDeleteModal({ open: false, user: null });
      loadUsers();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    return <Badge variant={role === 'ADMIN' ? 'primary' : 'secondary'}>{role}</Badge>;
  };

  const getStatusBadge = (isActive) => {
    return <Badge variant={isActive ? 'success' : 'danger'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage system users and their permissions</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Select
              placeholder="All Roles"
              options={[
                { value: 'ADMIN', label: 'Admin' },
                { value: 'USER', label: 'User' }
              ]}
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            />
            <Select
              placeholder="All Statuses"
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' }
              ]}
              value={filters.isActive}
              onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
            />
            <Button
              variant="secondary"
              onClick={() => setFilters({ search: '', role: '', isActive: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <UserCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>User</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Bookings</TableHeader>
                  <TableHeader>Joined</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                    <TableCell>{user._count?.bookings || 0}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={user.isActive ? 'danger' : 'success'}
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {users.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        title="Edit User"
      >
        <div className="space-y-4">
          <Input
            label="First Name"
            value={editForm.firstName}
            onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
          />
          <Input
            label="Last Name"
            value={editForm.lastName}
            onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
          />
          <Select
            label="Role"
            options={[
              { value: 'USER', label: 'User' },
              { value: 'ADMIN', label: 'Admin' }
            ]}
            value={editForm.role}
            onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
          />
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setEditModal({ open: false, user: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
