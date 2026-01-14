import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { bookingService } from '../../services/bookingService';
import { resourceService } from '../../services/resourceService';
import { Card, CardBody, Select, Loading, Modal, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  CalendarDaysIcon,
  CubeIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingResourceName, setPendingResourceName] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadResources();
  }, []);

  // Check for pending booking from sessionStorage or navigation state
  useEffect(() => {
    if (resources.length > 0) {
      // Check navigation state first
      if (location.state?.selectedResource) {
        setSelectedResource(location.state.selectedResource);
        return;
      }

      // Then check sessionStorage for pending booking
      const pendingBooking = sessionStorage.getItem('pendingBookingResource');
      if (pendingBooking && isAuthenticated) {
        try {
          const resource = JSON.parse(pendingBooking);
          // Find the resource in the loaded resources
          const foundResource = resources.find(r => r.id === resource.id);
          if (foundResource) {
            setSelectedResource(resource.id);
            setPendingResourceName(resource.name);
            toast.success(`Resource "${resource.name}" selected. Choose your time slot on the calendar.`, {
              duration: 5000,
              icon: '📅'
            });
          }
          // Clear the pending booking
          sessionStorage.removeItem('pendingBookingResource');
        } catch (e) {
          sessionStorage.removeItem('pendingBookingResource');
        }
      }
    }
  }, [resources, isAuthenticated, location.state]);

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
        backgroundColor: '#2c3e40',
        borderColor: '#1f2c2e',
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
      // Store the selection for after login
      if (selectedResource) {
        const resource = resources.find(r => r.id === selectedResource);
        sessionStorage.setItem('pendingBookingResource', JSON.stringify({
          id: selectedResource,
          name: resource?.name
        }));
      }
      toast('Please login to make a booking', { icon: '🔐' });
      navigate('/login', { state: { from: { pathname: '/calendar' } } });
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
      setPendingResourceName(null);
      loadCalendarData();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const selectedResourceData = resources.find(r => r.id === selectedResource);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-primary-100 rounded-xl">
            <CalendarDaysIcon className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Availability Calendar</h1>
            <p className="text-gray-600">View resource availability and make bookings</p>
          </div>
        </div>
      </div>

      {/* Pending Booking Alert */}
      {pendingResourceName && (
        <div className="mb-6 bg-accent-50 border border-accent-200 rounded-xl p-4 flex items-start space-x-3">
          <CheckCircleIcon className="h-6 w-6 text-accent-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-accent-800">Resource Selected</h4>
            <p className="text-sm text-accent-700">
              You selected "{pendingResourceName}". Now click and drag on the calendar to choose your booking time.
            </p>
          </div>
        </div>
      )}

      {/* Resource Filter Card */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Resource
              </label>
              <Select
                placeholder="Choose a resource to book"
                options={resources.map(r => ({
                  value: r.id,
                  label: `${r.name} - ${r.type}`
                }))}
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
              />
            </div>

            {selectedResourceData && (
              <div className="flex items-center space-x-4 px-4 py-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <CubeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedResourceData.type}</span>
                </div>
                {selectedResourceData.capacity && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Capacity: {selectedResourceData.capacity}</span>
                  </div>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedResourceData.status === 'AVAILABLE'
                    ? 'bg-accent-100 text-accent-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {selectedResourceData.status}
                </span>
              </div>
            )}
          </div>

          {isAuthenticated && selectedResource && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-primary-600 bg-primary-50 px-4 py-2 rounded-lg">
              <InformationCircleIcon className="h-5 w-5" />
              <span>Click and drag on the calendar to create a booking</span>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
              <InformationCircleIcon className="h-5 w-5" />
              <span>Please login to make a booking</span>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-500"></div>
          <span className="text-sm text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-sm text-gray-600">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent-500"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
      </div>

      {/* Calendar */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loading size="lg" />
            </div>
          ) : (
            <div className="calendar-wrapper">
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
                nowIndicator={true}
                dayMaxEvents={3}
                eventClassNames="rounded-lg shadow-sm"
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Confirm Your Booking"
      >
        {bookingData && (
          <div className="space-y-6">
            {/* Resource Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <CubeIcon className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Resource</p>
                  <p className="font-semibold text-gray-900">{bookingData.resourceName}</p>
                </div>
              </div>
            </div>

            {/* Time Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-500">Start Time</p>
                </div>
                <p className="font-medium text-gray-900">{formatDateTime(bookingData.startTime)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-500">End Time</p>
                </div>
                <p className="font-medium text-gray-900">{formatDateTime(bookingData.endTime)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowBookingModal(false)}
                className="flex-1"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleBookingSubmit}
                loading={submitting}
                className="flex-1"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Custom Calendar Styles */}
      <style>{`
        .calendar-wrapper {
          padding: 1rem;
        }
        .fc {
          font-family: inherit;
        }
        .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
          color: #1f2937;
        }
        .fc-button {
          background-color: #2c3e40 !important;
          border-color: #2c3e40 !important;
          font-weight: 500 !important;
          padding: 0.5rem 1rem !important;
          border-radius: 0.5rem !important;
        }
        .fc-button:hover {
          background-color: #1f2c2e !important;
          border-color: #1f2c2e !important;
        }
        .fc-button-active {
          background-color: #131a1c !important;
          border-color: #131a1c !important;
        }
        .fc-today-button {
          background-color: #26a66d !important;
          border-color: #26a66d !important;
        }
        .fc-today-button:hover {
          background-color: #188556 !important;
          border-color: #188556 !important;
        }
        .fc-daygrid-day-number, .fc-col-header-cell-cushion {
          color: #374151;
          font-weight: 500;
        }
        .fc-day-today {
          background-color: #eefbf4 !important;
        }
        .fc-timegrid-slot {
          height: 3rem !important;
        }
        .fc-event {
          border-radius: 0.375rem !important;
          font-size: 0.75rem !important;
          padding: 2px 6px !important;
        }
        .fc-highlight {
          background-color: rgba(38, 166, 109, 0.2) !important;
        }
        .fc-timegrid-now-indicator-line {
          border-color: #26a66d !important;
        }
        .fc-timegrid-now-indicator-arrow {
          border-color: #26a66d !important;
          border-top-color: transparent !important;
          border-bottom-color: transparent !important;
        }
      `}</style>
    </div>
  );
}
