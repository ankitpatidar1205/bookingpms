import { useState, useEffect } from 'react';
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
  const [searchParams, setSearchParams] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    minNights: 1
  });

  useEffect(() => {
    checkConnection();
  }, []);

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
      if (roomTypesRes.success) setRoomTypes(roomTypesRes.data || []);

      await searchAvailability();
    } catch (err) {
      console.error('Error loading data:', err);
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
      }
    } catch (err) {
      console.error('Error searching availability:', err);
    } finally {
      setLoading(false);
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
              <div className="p-3 bg-white/20 rounded-xl">
                <BuildingOfficeIcon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{hotelInfo.propertyName || 'Hotel'}</h2>
                {hotelInfo.propertyAddress && (
                  <p className="mt-1 opacity-90">{hotelInfo.propertyAddress}</p>
                )}
                {hotelInfo.propertyCity && hotelInfo.propertyCountry && (
                  <p className="mt-1 opacity-75">{hotelInfo.propertyCity}, {hotelInfo.propertyCountry}</p>
                )}
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
              <Card key={room.roomTypeID || index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardBody className="p-4">
                  <h3 className="font-semibold text-gray-900">{room.roomTypeName || room.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    {room.maxGuests && <p>Max Guests: {room.maxGuests}</p>}
                    {room.roomsTotal && <p>Total Rooms: {room.roomsTotal}</p>}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
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

      {/* Available Dates */}
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

      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Clicking "Book Now" will redirect you to the official Cloudbeds booking engine.</p>
        <p className="mt-1">All payments and reservations are handled securely by Cloudbeds.</p>
      </div>
    </div>
  );
}
