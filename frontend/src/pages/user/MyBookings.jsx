import { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import {
  Card, CardBody, CardHeader, Button, Loading, Badge, Select, Pagination, Modal
} from '../../components/common';
import { CalendarDaysIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [filter, pagination.page]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getUserBookings({
        page: pagination.page,
        limit: pagination.limit,
        status: filter || undefined
      });
      setBookings(response.data.bookings);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      }));
    } catch (error) {
      console.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelModal.booking) return;

    setCancelling(true);
    try {
      await bookingService.cancel(cancelModal.booking.id);
      toast.success('Booking cancelled successfully');
      setCancelModal({ open: false, booking: null });
      loadBookings();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setCancelling(false);
    }
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
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

  const canCancel = (booking) => {
    return booking.status === 'CONFIRMED' && new Date(booking.startTime) > new Date();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Manage your resource bookings</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="w-48">
              <Select
                placeholder="All Statuses"
                options={[
                  { value: 'CONFIRMED', label: 'Confirmed' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'CANCELLED', label: 'Cancelled' }
                ]}
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              />
            </div>
            {filter && (
              <Button variant="secondary" size="sm" onClick={() => setFilter('')}>
                Clear
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Bookings List */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      {booking.resource.imageUrl && (
                        <img
                          src={booking.resource.imageUrl}
                          alt={booking.resource.name}
                          className="w-20 h-20 rounded-lg object-cover mr-4"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.resource.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{booking.resource.type}</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Start:</span> {formatDateTime(booking.startTime)}
                          </p>
                          <p>
                            <span className="font-medium">End:</span> {formatDateTime(booking.endTime)}
                          </p>
                          <p>
                            <span className="font-medium">Total:</span> ${parseFloat(booking.totalPrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-2">
                        {getStatusBadge(booking.status)}
                      </div>
                      {canCancel(booking) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setCancelModal({ open: true, booking })}
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {bookings.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
        />
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, booking: null })}
        title="Cancel Booking"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to cancel this booking?
          </p>
          {cancelModal.booking && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{cancelModal.booking.resource?.name}</p>
              <p className="text-sm text-gray-500">
                {formatDateTime(cancelModal.booking.startTime)}
              </p>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setCancelModal({ open: false, booking: null })}
              className="flex-1"
            >
              Keep Booking
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              loading={cancelling}
              className="flex-1"
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
