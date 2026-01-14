import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { bookingService } from '../../services/bookingService';
import { resourceService } from '../../services/resourceService';
import { Card, CardBody, CardHeader, Select, Loading, Modal, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadResources();
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

      const [bookingsRes, blocksRes] = await Promise.all([
        bookingService.getCalendarBookings(selectedResource || undefined, startDate, endDate),
        bookingService.getCalendarBlocks(selectedResource || undefined, startDate, endDate)
      ]);

      // Format bookings as events
      const bookingEvents = bookingsRes.data.map(booking => ({
        id: booking.id,
        title: `${booking.resource.name} - Booked`,
        start: booking.startTime,
        end: booking.endTime,
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        extendedProps: {
          type: 'booking',
          resourceId: booking.resourceId
        }
      }));

      // Format blocks as events
      const blockEvents = blocksRes.data.map(block => ({
        id: `block-${block.id}`,
        title: block.reason || 'Blocked',
        start: block.startTime,
        end: block.endTime,
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        extendedProps: {
          type: 'block',
          resourceId: block.resourceId
        }
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
    if (!isAuthenticated) {
      toast.error('Please login to make a booking');
      navigate('/login');
      return;
    }

    if (!selectedResource) {
      toast.error('Please select a resource first');
      return;
    }

    setBookingData({
      resourceId: selectedResource,
      resourceName: resources.find(r => r.id === selectedResource)?.name,
      startTime: selectInfo.startStr,
      endTime: selectInfo.endStr
    });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async () => {
    if (!bookingData) return;

    setSubmitting(true);
    try {
      await bookingService.create({
        resourceId: bookingData.resourceId,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime
      });
      toast.success('Booking created successfully!');
      setShowBookingModal(false);
      setBookingData(null);
      loadCalendarData();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability Calendar</h1>
        <p className="text-gray-600">View resource availability and make bookings</p>
      </div>

      {/* Resource Filter */}
      <Card className="mb-8">
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <Select
                label="Filter by Resource"
                placeholder="All Resources"
                options={resources.map(r => ({ value: r.id, label: r.name }))}
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
              />
            </div>
            {isAuthenticated && selectedResource && (
              <p className="text-sm text-gray-500 mt-6">
                Click and drag on the calendar to create a booking
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Legend */}
      <div className="flex gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className="text-sm text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-sm text-gray-600">Blocked</span>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardBody className="p-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
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
              selectable={isAuthenticated && !!selectedResource}
              selectMirror={true}
              select={handleDateSelect}
              slotMinTime="06:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              height="auto"
              slotDuration="00:30:00"
              eventOverlap={false}
              selectOverlap={false}
            />
          )}
        </CardBody>
      </Card>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Confirm Booking"
      >
        {bookingData && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Resource</label>
              <p className="mt-1 text-gray-900">{bookingData.resourceName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Time</label>
              <p className="mt-1 text-gray-900">{formatDateTime(bookingData.startTime)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Time</label>
              <p className="mt-1 text-gray-900">{formatDateTime(bookingData.endTime)}</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowBookingModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookingSubmit}
                loading={submitting}
                className="flex-1"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
