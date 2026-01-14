import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import {
  Card, CardBody, Loading, Input, Select, Pagination,
  Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Badge
} from '../../components/common';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ entity: '', action: '' });
  const [pagination, setPagination] = useState({
    page: 1, limit: 20, total: 0, totalPages: 1
  });

  useEffect(() => {
    loadLogs();
  }, [filters, pagination.page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAuditLogs({
        page: pagination.page,
        limit: pagination.limit,
        entity: filters.entity || undefined,
        action: filters.action || undefined
      });
      setLogs(response.data.logs);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const getActionBadge = (action) => {
    const colors = {
      CREATE: 'success',
      UPDATE: 'info',
      DELETE: 'danger',
      LOGIN: 'primary',
      LOGOUT: 'secondary',
      CANCEL: 'warning'
    };

    const variant = Object.keys(colors).find(key => action.includes(key)) || 'secondary';
    return <Badge variant={colors[variant] || 'secondary'}>{action}</Badge>;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600">Track all system activities and changes</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              placeholder="All Entities"
              options={[
                { value: 'User', label: 'User' },
                { value: 'Resource', label: 'Resource' },
                { value: 'Booking', label: 'Booking' },
                { value: 'ResourceBlock', label: 'Resource Block' }
              ]}
              value={filters.entity}
              onChange={(e) => setFilters(prev => ({ ...prev, entity: e.target.value }))}
            />
            <Input
              placeholder="Filter by action..."
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
            />
            <button
              onClick={() => setFilters({ entity: '', action: '' })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No audit logs found</p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Timestamp</TableHeader>
                  <TableHeader>User</TableHeader>
                  <TableHeader>Action</TableHeader>
                  <TableHeader>Entity</TableHeader>
                  <TableHeader>IP Address</TableHeader>
                  <TableHeader>Details</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(log.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {log.user?.firstName} {log.user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{log.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{log.entity}</span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {log.ipAddress || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {log.details && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-primary-600 hover:text-primary-700">
                            View Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto max-w-xs">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {logs.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}
    </div>
  );
}
