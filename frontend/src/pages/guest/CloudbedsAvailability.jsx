import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import cloudbedsService from '../../services/cloudbedsService';
import { Card, CardBody, Loading } from '../../components/common';
import toast from 'react-hot-toast';
import {
  CalendarDaysIcon,
  BuildingOfficeIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function CloudbedsAvailability() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [calendarAvailability, setCalendarAvailability] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [searchParams, setSearchParams] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minNights: 1
  });

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (connectionStatus?.connected) {
      loadCalendarAvailability();
    }
  }, [searchParams.startDate, searchParams.endDate, connectionStatus]);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const status = await cloudbedsService.getStatus();
      setConnectionStatus(status.data);

      if (status.data?.connected) {
        await loadAllData();
      }
    } catch (err) {
      setError('Failed to connect to Cloudbeds API');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [hotelRes, roomTypesRes] = await Promise.all([
        cloudbedsService.getHotelDetails(),
        cloudbedsService.getRoomTypes()
      ]);

      if (hotelRes.success) setHotelInfo(hotelRes.data);
      if (roomTypesRes.success) {
        const rooms = roomTypesRes.data || [];
        setRoomTypes(rooms);
        if (rooms.length > 0 && !selectedRoomType) {
          setSelectedRoomType(rooms[0].roomTypeID || '');
        }
      }

      // Load availability data (non-blocking - don't crash if it fails)
      searchAvailability().catch(err => console.error('Availability search error:', err));
      loadCalendarAvailability().catch(err => console.error('Calendar load error:', err));
    } catch (err) {
      console.error('Error loading data:', err);
      // Don't crash - set empty arrays
      setGaps([]);
      setCalendarAvailability([]);
    }
  };

  const searchAvailability = async () => {
    setLoading(true);
    try {
      const gapsRes = await cloudbedsService.getAvailableGaps(
        searchParams.startDate,
        searchParams.endDate,
        searchParams.minNights
      );
      if (gapsRes.success) {
        setGaps(gapsRes.data || []);
      } else {
        setGaps([]);
      }
    } catch (err) {
      console.error('Error searching availability:', err);
      // Set empty array on error to prevent page crash
      setGaps([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarAvailability = async () => {
    try {
      const calendarRes = await cloudbedsService.getCalendarAvailability(
        searchParams.startDate,
        searchParams.endDate
      );
      if (calendarRes.success) {
        setCalendarAvailability(calendarRes.data || []);
      } else {
        // If API fails, set empty array instead of crashing
        setCalendarAvailability([]);
      }
    } catch (err) {
      console.error('Error loading calendar availability:', err);
      // Set empty array on error to prevent page crash
      setCalendarAvailability([]);
    }
  };

  const handleBookNow = async (gap) => {
    try {
      toast.loading('Opening Cloudbeds booking page...', { id: 'booking' });
      await cloudbedsService.redirectToBooking(gap.startDate, gap.endDate);
      toast.success('Booking page opened in new tab', { id: 'booking' });
    } catch (err) {
      toast.error('Failed to open booking page', { id: 'booking' });
    }
  };

  const handleDateClick = async (info) => {
    const clickedDate = info.dateStr;
    // Find if this date is available
    const dayAvailability = calendarAvailability.find(day => day.date === clickedDate);
    
    if (dayAvailability && dayAvailability.roomsAvailable > 0) {
      // Calculate end date (next day for booking)
      const endDate = new Date(clickedDate);
      endDate.setDate(endDate.getDate() + 1);
      const endDateStr = endDate.toISOString().split('T')[0];
      
      try {
        toast.loading('Opening Cloudbeds booking page...', { id: 'booking' });
        await cloudbedsService.redirectToBooking(clickedDate, endDateStr);
        toast.success('Booking page opened in new tab', { id: 'booking' });
      } catch (err) {
        toast.error('Failed to open booking page', { id: 'booking' });
      }
    } else {
      toast.error('No rooms available on this date');
    }
  };

  // Format calendar events from availability data
  const getCalendarEvents = () => {
    return calendarAvailability.map(day => {
      const isAvailable = day.roomsAvailable > 0;
      return {
        title: isAvailable ? `${day.roomsAvailable} room${day.roomsAvailable > 1 ? 's' : ''} available` : 'Sold Out',
        date: day.date,
        backgroundColor: isAvailable ? '#10b981' : '#ef4444',
        borderColor: isAvailable ? '#059669' : '#dc2626',
        textColor: '#ffffff',
        display: 'block',
        extendedProps: {
          roomsAvailable: day.roomsAvailable || 0,
          isAvailable: isAvailable
        }
      };
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatShortDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Connection not established - show friendly message to guests
  if (!loading && connectionStatus && !connectionStatus.connected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-gray-200 bg-gray-50">
          <CardBody className="p-8 text-center">
            <CalendarDaysIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              Availability Coming Soon
            </h2>
            <p className="text-gray-500 mb-6">
              Our live availability calendar is being set up. Please check back later or contact us directly for reservations.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={checkConnection}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-xl">
            <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Availability</h1>
            <p className="text-gray-600">Real-time room availability from Cloudbeds</p>
          </div>
        </div>

        {/* Connection Status Badge */}
        {connectionStatus?.connected && (
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Connected to Cloudbeds
          </div>
        )}
      </div>

      {/* Hotel Info Card */}
      {hotelInfo && (
        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardBody className="p-6">
            <div className="flex items-start space-x-4">
              {/* Hotel Logo/Image */}
              {hotelInfo.propertyImage && hotelInfo.propertyImage.length > 0 && (
                <div className="flex-shrink-0">
                  <img 
                    src={hotelInfo.propertyImage[0].image || hotelInfo.propertyImage[0].thumb} 
                    alt={hotelInfo.propertyName}
                    className="w-20 h-20 rounded-xl object-cover bg-white/20 p-2"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <BuildingOfficeIcon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold">{hotelInfo.propertyName || 'Hotel'}</h2>
                </div>
                
                {hotelInfo.propertyAddress && (
                  <div className="mt-2 space-y-1">
                    {hotelInfo.propertyAddress.propertyAddress1 && (
                      <p className="opacity-90">{hotelInfo.propertyAddress.propertyAddress1}</p>
                    )}
                    {hotelInfo.propertyAddress.propertyCity && (
                      <p className="opacity-75">
                        {hotelInfo.propertyAddress.propertyCity}
                        {hotelInfo.propertyAddress.propertyState && `, ${hotelInfo.propertyAddress.propertyState}`}
                        {hotelInfo.propertyAddress.propertyCountry && `, ${hotelInfo.propertyAddress.propertyCountry}`}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Hotel Description */}
                {hotelInfo.propertyDescription && (
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div 
                      className="text-sm opacity-90 line-clamp-2" 
                      dangerouslySetInnerHTML={{ __html: hotelInfo.propertyDescription.substring(0, 150) + '...' }} 
                    />
                  </div>
                )}
                
                {/* Contact Info */}
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center space-x-4 text-sm">
                  {hotelInfo.propertyPhone && (
                    <span className="opacity-90">📞 {hotelInfo.propertyPhone}</span>
                  )}
                  {hotelInfo.propertyEmail && (
                    <span className="opacity-90">✉️ {hotelInfo.propertyEmail}</span>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Room Types */}
      {roomTypes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <HomeIcon className="h-6 w-6 mr-2 text-gray-500" />
            Room Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomTypes.map((room, index) => (
              <Card 
                key={room.roomTypeID || index} 
                className={`border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedRoomType === (room.roomTypeID || '') ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRoomType(room.roomTypeID || '')}
              >
                <CardBody className="p-0">
                  {/* Room Image */}
                  {room.roomTypePhotos && room.roomTypePhotos.length > 0 && (
                    <div className="w-full h-48 rounded-t-lg overflow-hidden">
                      <img 
                        src={room.roomTypePhotos[0]} 
                        alt={room.roomTypeName}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {room.roomTypeName || room.name}
                    </h3>
                    
                    {room.roomTypeNameShort && (
                      <p className="text-xs text-gray-400 mb-2">Code: {room.roomTypeNameShort}</p>
                    )}
                    
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Max Guests:</span>
                        <span className="font-medium text-gray-900">{room.maxGuests || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Total Units:</span>
                        <span className="font-medium text-gray-900">{room.roomTypeUnits || room.roomsTotal || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Available:</span>
                        <span className={`font-medium ${room.roomsAvailable > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {room.roomsAvailable || 0}
                        </span>
                      </div>
                    </div>
                    
                    {/* Room Features */}
                    {room.roomTypeFeatures && (Array.isArray(room.roomTypeFeatures) ? room.roomTypeFeatures.length > 0 : Object.keys(room.roomTypeFeatures).length > 0) && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(room.roomTypeFeatures) ? room.roomTypeFeatures : Object.values(room.roomTypeFeatures)).slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <CalendarDaysIcon className="h-6 w-6 mr-2 text-gray-500" />
          Availability Calendar
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card className="mb-6 border-0 shadow-lg overflow-hidden">
          <CardBody className="p-0">
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-sm text-gray-600">Sold Out</span>
                </div>
                <p className="text-sm text-gray-500 ml-auto">
                  Click on available dates to book
                </p>
              </div>
            </div>
            <div className="calendar-wrapper p-4">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                events={getCalendarEvents()}
                dateClick={handleDateClick}
                height="auto"
                eventDisplay="block"
                dayMaxEvents={2}
                moreLinkClick="popover"
                eventClassNames="cursor-pointer rounded-lg text-xs font-medium"
              />
            </div>
          </CardBody>
        </Card>
      )}

      {/* Search Filters */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardBody className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-gray-500" />
            Search Availability
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
              <input
                type="date"
                value={searchParams.startDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <input
                type="date"
                value={searchParams.endDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. Nights</label>
              <select
                value={searchParams.minNights}
                onChange={(e) => setSearchParams(prev => ({ ...prev, minNights: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>1 Night</option>
                <option value={2}>2 Nights</option>
                <option value={3}>3 Nights</option>
                <option value={5}>5 Nights</option>
                <option value={7}>7 Nights</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={searchAvailability}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Available Dates - List View */}
      {viewMode === 'list' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarDaysIcon className="h-6 w-6 mr-2 text-gray-500" />
            Available Date Ranges
            {gaps.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                {gaps.length} found
              </span>
            )}
          </h2>

        {loading ? (
          <Card className="border-0 shadow-lg">
            <CardBody className="p-8">
              <div className="flex justify-center">
                <Loading size="lg" />
              </div>
            </CardBody>
          </Card>
        ) : gaps.length === 0 ? (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardBody className="p-8 text-center">
              <ExclamationCircleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Availability Found</h3>
              <p className="text-yellow-600">
                No available dates found for the selected criteria. Try adjusting your search dates or minimum nights.
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {gaps.map((gap, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all">
                <CardBody className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {formatShortDate(gap.startDate)} - {formatShortDate(gap.endDate)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="inline-flex items-center">
                            {gap.nights} night{gap.nights > 1 ? 's' : ''}
                            {gap.roomsAvailable && (
                              <>
                                <span className="mx-2">•</span>
                                {gap.roomsAvailable} room{gap.roomsAvailable > 1 ? 's' : ''} available
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookNow(gap)}
                      className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Book Now
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Clicking "Book Now" or available dates will redirect you to the official Cloudbeds booking engine.</p>
        <p className="mt-1">All payments and reservations are handled securely by Cloudbeds.</p>
      </div>

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
          background-color: #2563eb !important;
          border-color: #2563eb !important;
          font-weight: 500 !important;
          padding: 0.5rem 1rem !important;
          border-radius: 0.5rem !important;
        }
        .calendar-wrapper .fc-button:hover {
          background-color: #1d4ed8 !important;
          border-color: #1d4ed8 !important;
        }
        .calendar-wrapper .fc-button-active {
          background-color: #1e40af !important;
          border-color: #1e40af !important;
        }
        .calendar-wrapper .fc-today-button {
          background-color: #10b981 !important;
          border-color: #10b981 !important;
        }
        .calendar-wrapper .fc-today-button:hover {
          background-color: #059669 !important;
          border-color: #059669 !important;
        }
        .calendar-wrapper .fc-day-today {
          background-color: #ecfdf5 !important;
        }
        .calendar-wrapper .fc-daygrid-day {
          cursor: pointer;
        }
        .calendar-wrapper .fc-daygrid-day:hover {
          background-color: #f3f4f6 !important;
        }
        .calendar-wrapper .fc-event {
          border-radius: 0.375rem !important;
          font-size: 0.75rem !important;
          padding: 2px 6px !important;
          cursor: pointer;
        }
        .calendar-wrapper .fc-event:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
