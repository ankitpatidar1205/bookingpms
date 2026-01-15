import { useState, useEffect } from 'react';
import cloudbedsService from '../../services/cloudbedsService';
import toast from 'react-hot-toast';

/**
 * Cloudbeds Availability Calendar Component
 * Displays available dates and allows guests to book via Cloudbeds
 */
const CloudbedsCalendar = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [selectedGap, setSelectedGap] = useState(null);

  // Default date range: today + 90 days
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const endDate = new Date(today.setDate(today.getDate() + 90)).toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load all data in parallel
      const [hotelRes, roomTypesRes, gapsRes] = await Promise.all([
        cloudbedsService.getHotelDetails(),
        cloudbedsService.getRoomTypes(),
        cloudbedsService.getAvailableGaps(startDate, endDate, 1)
      ]);

      if (hotelRes.success) setHotelInfo(hotelRes.data);
      if (roomTypesRes.success) setRoomTypes(roomTypesRes.data || []);
      if (gapsRes.success) setGaps(gapsRes.data || []);
    } catch (err) {
      setError('Failed to load availability data');
      console.error('Calendar error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async (gap) => {
    try {
      setSelectedGap(gap);
      await cloudbedsService.redirectToBooking(gap.startDate, gap.endDate);
      toast.success('Opening booking page...');
    } catch (err) {
      toast.error('Failed to open booking page');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hotel Info */}
      {hotelInfo && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">{hotelInfo.propertyName}</h1>
          {hotelInfo.propertyAddress && (
            <p className="mt-2 opacity-90">{hotelInfo.propertyAddress}</p>
          )}
        </div>
      )}

      {/* Room Types */}
      {roomTypes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Room Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomTypes.map((room) => (
              <div key={room.roomTypeID} className="bg-white border rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-gray-900">{room.roomTypeName}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Max Guests: {room.maxGuests || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Gaps */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Dates</h2>
        {gaps.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-700">No available dates found in the next 90 days.</p>
            <p className="text-sm text-yellow-600 mt-2">Please check back later or contact us directly.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gaps.map((gap, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatDate(gap.startDate)} - {formatDate(gap.endDate)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {gap.nights} night{gap.nights > 1 ? 's' : ''} available
                    {gap.roomsAvailable && ` • ${gap.roomsAvailable} room${gap.roomsAvailable > 1 ? 's' : ''}`}
                  </div>
                </div>
                <button
                  onClick={() => handleBookNow(gap)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Clicking "Book Now" will redirect you to our secure booking page.</p>
        <p className="mt-1">All bookings are processed through Cloudbeds.</p>
      </div>
    </div>
  );
};

export default CloudbedsCalendar;
