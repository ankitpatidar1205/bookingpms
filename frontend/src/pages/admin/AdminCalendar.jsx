import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { adminService } from '../../services/adminService';
import { resourceService } from '../../services/resourceService';
import { bookingService } from '../../services/bookingService';
import { Card, CardBody, Select, Loading, Modal, Button, Input } from '../../components/common';
import toast from 'react-hot-toast';
import {
  CalendarDaysIcon,
  CubeIcon,
  ClockIcon,
  UserIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [loading, setLoading] = useState(true);
  const [blockModal, setBlockModal] = useState({ open: false, data: null });
  const [blockForm, setBlockForm] = useState({ reason: '' });
  const [deleteBlockModal, setDeleteBlockModal] = useState({ open: false, block: null });
  const [bookingDetailModal, setBookingDetailModal] = useState({ open: false, booking: null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadResources();
    loadCalendarData();
  }, []);

  useEffect(() => {
    loadCalendarData();
  }, [selectedResource]);

  const loadResources = async () => {
    try {
      const response = await resourceService.getAll({ limit: 100 });
      setResources(response.data.resources);
    } catch (error) {
      console.error('Failed to load resources');
    }
  };

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const endDate = new Date(now.getFullYear(), now.getMonth() + 3, 0).toISOString();

      // Load bookings - pass undefined if no resource selected to get all
      const resourceFilter = selectedResource || undefined;

      const [bookingsRes, blocksRes] = await Promise.all([
        bookingService.getCalendarBookings(resourceFilter, startDate, endDate),
        bookingService.getCalendarBlocks(resourceFilter, startDate, endDate)
      ]);

      const bookingEvents = bookingsRes.data.map(booking => ({
        id: booking.id,
        title: `${booking.resource?.name || 'Resource'} - ${booking.user?.firstName || 'User'}`,
        start: booking.startTime,
        end: booking.endTime,
        backgroundColor: '#2c3e40',
        borderColor: '#1f2c2e',
        extendedProps: {
          type: 'booking',
          booking: booking
        }
      }));

      const blockEvents = blocksRes.data.map(block => ({
        id: `block-${block.id}`,
        title: block.reason || 'Blocked',
        start: block.startTime,
        end: block.endTime,
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        extendedProps: { type: 'block', blockId: block.id }
      }));

      setEvents(bookingEvents);
      setBlocks(blockEvents);
    } catch (error) {
      console.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (selectInfo) => {
    if (!selectedResource) {
      toast.error('Please select a resource to block time slot');
      return;
    }

    setBlockForm({ reason: '' });
    setBlockModal({
      open: true,
      data: {
        resourceId: selectedResource,
        startTime: selectInfo.startStr,
        endTime: selectInfo.endStr
      }
    });
  };

  const handleEventClick = (clickInfo) => {
    const { type, blockId, booking } = clickInfo.event.extendedProps;

    if (type === 'block' && blockId) {
      setDeleteBlockModal({
        open: true,
        block: {
          id: blockId,
          title: clickInfo.event.title,
          start: clickInfo.event.start,
          end: clickInfo.event.end
        }
      });
    } else if (type === 'booking' && booking) {
      setBookingDetailModal({
        open: true,
        booking: booking
      });
    }
  };

  const handleCreateBlock = async () => {
    if (!blockModal.data) return;

    setSubmitting(true);
    try {
      await adminService.createBlock({
        resourceId: blockModal.data.resourceId,
        startTime: blockModal.data.startTime,
        endTime: blockModal.data.endTime,
        reason: blockForm.reason
      });
      toast.success('Time slot blocked successfully');
      setBlockModal({ open: false, data: null });
      loadCalendarData();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlock = async () => {
    if (!deleteBlockModal.block) return;

    setSubmitting(true);
    try {
      await adminService.deleteBlock(deleteBlockModal.block.id);
      toast.success('Block removed successfully');
      setDeleteBlockModal({ open: false, block: null });
      loadCalendarData();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-primary-100 rounded-xl">
            <CalendarDaysIcon className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar Management</h1>
            <p className="text-gray-600 text-sm">View all bookings and block time slots</p>
          </div>
        </div>
      </div>

      {/* Resource Selector */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FunnelIcon className="h-4 w-4 inline mr-1" />
                Filter by Resource
              </label>
              <Select
                placeholder="All Resources"
                options={resources.map(r => ({ value: r.id, label: r.name }))}
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
              />
            </div>
            {selectedResource && (
              <button
                onClick={() => setSelectedResource('')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Filter
              </button>
            )}
            <div className="flex-1 text-sm text-gray-500">
              {selectedResource
                ? 'Select time on calendar to block this resource'
                : 'Showing all bookings. Select a resource to block time slots.'
              }
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-500"></div>
          <span className="text-sm text-gray-600">Booking (click to view)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-sm text-gray-600">Blocked (click to remove)</span>
        </div>
      </div>

      {/* Calendar */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loading size="lg" />
            </div>
          ) : (
            <div className="calendar-wrapper p-4">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={[...events, ...blocks]}
                selectable={!!selectedResource}
                selectMirror={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}
                height="auto"
                slotDuration="00:30:00"
                nowIndicator={true}
                dayMaxEvents={3}
                eventClassNames="cursor-pointer"
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Booking Detail Modal */}
      <Modal
        isOpen={bookingDetailModal.open}
        onClose={() => setBookingDetailModal({ open: false, booking: null })}
        title="Booking Details"
      >
        {bookingDetailModal.booking && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <CubeIcon className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Resource</p>
                  <p className="font-semibold text-gray-900">{bookingDetailModal.booking.resource?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent-100 rounded-lg">
                  <UserIcon className="h-5 w-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Booked By</p>
                  <p className="font-semibold text-gray-900">
                    {bookingDetailModal.booking.user?.firstName} {bookingDetailModal.booking.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{bookingDetailModal.booking.user?.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <p className="text-xs text-gray-500">Start</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDateTime(bookingDetailModal.booking.startTime)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <p className="text-xs text-gray-500">End</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDateTime(bookingDetailModal.booking.endTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                bookingDetailModal.booking.status === 'CONFIRMED' ? 'bg-accent-100 text-accent-700' :
                bookingDetailModal.booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {bookingDetailModal.booking.status}
              </span>
            </div>

            {bookingDetailModal.booking.totalPrice && (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <span className="text-sm text-gray-600">Total Price</span>
                <span className="text-lg font-bold text-primary-500">
                  ${bookingDetailModal.booking.totalPrice}
                </span>
              </div>
            )}

            <Button
              variant="secondary"
              onClick={() => setBookingDetailModal({ open: false, booking: null })}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </Modal>

      {/* Create Block Modal */}
      <Modal
        isOpen={blockModal.open}
        onClose={() => setBlockModal({ open: false, data: null })}
        title="Block Time Slot"
      >
        {blockModal.data && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Time</p>
                  <p className="text-sm font-medium text-gray-900">{formatDateTime(blockModal.data.startTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Time</p>
                  <p className="text-sm font-medium text-gray-900">{formatDateTime(blockModal.data.endTime)}</p>
                </div>
              </div>
            </div>
            <Input
              label="Reason (optional)"
              value={blockForm.reason}
              onChange={(e) => setBlockForm({ reason: e.target.value })}
              placeholder="Maintenance, Holiday, etc."
            />
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setBlockModal({ open: false, data: null })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBlock}
                loading={submitting}
                className="flex-1"
              >
                Block Slot
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Block Modal */}
      <Modal
        isOpen={deleteBlockModal.open}
        onClose={() => setDeleteBlockModal({ open: false, block: null })}
        title="Remove Block"
      >
        {deleteBlockModal.block && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to remove this block?
            </p>
            <div className="bg-red-50 p-4 rounded-xl">
              <p className="font-medium text-red-800">{deleteBlockModal.block.title}</p>
              <p className="text-sm text-red-600">
                {formatDateTime(deleteBlockModal.block.start)} - {formatDateTime(deleteBlockModal.block.end)}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setDeleteBlockModal({ open: false, block: null })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteBlock}
                loading={submitting}
                className="flex-1"
              >
                Remove Block
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Custom Calendar Styles */}
      <style>{`
        .calendar-wrapper .fc {
          font-family: inherit;
        }
        .calendar-wrapper .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #1f2937;
        }
        .calendar-wrapper .fc-button {
          background-color: #2c3e40 !important;
          border-color: #2c3e40 !important;
          font-weight: 500 !important;
          padding: 0.5rem 1rem !important;
          border-radius: 0.5rem !important;
        }
        .calendar-wrapper .fc-button:hover {
          background-color: #1f2c2e !important;
          border-color: #1f2c2e !important;
        }
        .calendar-wrapper .fc-button-active {
          background-color: #131a1c !important;
          border-color: #131a1c !important;
        }
        .calendar-wrapper .fc-today-button {
          background-color: #26a66d !important;
          border-color: #26a66d !important;
        }
        .calendar-wrapper .fc-today-button:hover {
          background-color: #188556 !important;
          border-color: #188556 !important;
        }
        .calendar-wrapper .fc-day-today {
          background-color: #eefbf4 !important;
        }
        .calendar-wrapper .fc-event {
          border-radius: 0.375rem !important;
          font-size: 0.75rem !important;
          padding: 2px 6px !important;
          cursor: pointer;
        }
        .calendar-wrapper .fc-daygrid-event {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .calendar-wrapper .fc-highlight {
          background-color: rgba(38, 166, 109, 0.2) !important;
        }
      `}</style>
    </div>
  );
}
