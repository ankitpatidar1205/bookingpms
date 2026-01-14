import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { adminService } from '../../services/adminService';
import { resourceService } from '../../services/resourceService';
import { bookingService } from '../../services/bookingService';
import { Card, CardBody, CardHeader, Select, Loading, Modal, Button, Input } from '../../components/common';
import toast from 'react-hot-toast';

export default function AdminCalendar() {
  const [events, setEvents] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [loading, setLoading] = useState(true);
  const [blockModal, setBlockModal] = useState({ open: false, data: null });
  const [blockForm, setBlockForm] = useState({ reason: '' });
  const [deleteBlockModal, setDeleteBlockModal] = useState({ open: false, block: null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    if (selectedResource) {
      loadCalendarData();
    }
  }, [selectedResource]);

  const loadResources = async () => {
    try {
      const response = await resourceService.getAll({ limit: 100 });
      setResources(response.data.resources);
      if (response.data.resources.length > 0) {
        setSelectedResource(response.data.resources[0].id);
      }
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

      const [bookingsRes, blocksRes] = await Promise.all([
        bookingService.getCalendarBookings(selectedResource, startDate, endDate),
        bookingService.getCalendarBlocks(selectedResource, startDate, endDate)
      ]);

      const bookingEvents = bookingsRes.data.map(booking => ({
        id: booking.id,
        title: `Booking - ${booking.resource?.name || 'Resource'}`,
        start: booking.startTime,
        end: booking.endTime,
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        extendedProps: { type: 'booking' }
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
      toast.error('Please select a resource first');
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
    const { type, blockId } = clickInfo.event.extendedProps;
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
    return new Date(date).toLocaleString();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Calendar Management</h1>
        <p className="text-gray-600">Block time slots and manage resource availability</p>
      </div>

      {/* Resource Selector */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Select
                label="Select Resource"
                options={resources.map(r => ({ value: r.id, label: r.name }))}
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Click and drag on the calendar to block a time slot
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Legend */}
      <div className="flex gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className="text-sm text-gray-600">Booking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-sm text-gray-600">Blocked (click to remove)</span>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardBody className="p-4">
          {loading && !selectedResource ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : !selectedResource ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Please select a resource to view calendar</p>
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={[...events, ...blocks]}
              selectable={true}
              selectMirror={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              height="auto"
              slotDuration="00:30:00"
            />
          )}
        </CardBody>
      </Card>

      {/* Create Block Modal */}
      <Modal
        isOpen={blockModal.open}
        onClose={() => setBlockModal({ open: false, data: null })}
        title="Block Time Slot"
      >
        {blockModal.data && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <p className="mt-1 text-gray-900">{formatDateTime(blockModal.data.startTime)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <p className="mt-1 text-gray-900">{formatDateTime(blockModal.data.endTime)}</p>
            </div>
            <Input
              label="Reason (optional)"
              value={blockForm.reason}
              onChange={(e) => setBlockForm({ reason: e.target.value })}
              placeholder="Maintenance, Holiday, etc."
            />
            <div className="flex gap-3 pt-4">
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{deleteBlockModal.block.title}</p>
              <p className="text-sm text-gray-500">
                {formatDateTime(deleteBlockModal.block.start)} - {formatDateTime(deleteBlockModal.block.end)}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
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
    </div>
  );
}
