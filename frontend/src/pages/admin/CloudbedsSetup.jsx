import { useState, useEffect } from 'react';
import api from '../../services/api';
import cloudbedsService from '../../services/cloudbedsService';
import { Card, CardBody, Button, Loading } from '../../components/common';
import toast from 'react-hot-toast';
import {
  CloudIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  LinkIcon,
  KeyIcon,
  BuildingOfficeIcon,
  HomeIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function CloudbedsSetup() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [authUrl, setAuthUrl] = useState('');
  const [hotelInfo, setHotelInfo] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    // Load live data when connected
    if (status?.connected) {
      loadLiveData();
    }
  }, [status?.connected]);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cloudbeds/status');
      setStatus(response.data.data);
    } catch (err) {
      console.error('Error checking status:', err);
      setStatus({ connected: false, message: 'Failed to check connection status' });
    } finally {
      setLoading(false);
    }
  };

  const getAuthUrl = async () => {
    try {
      const response = await api.get('/cloudbeds/auth/url');
      if (response.data.success && response.data.data.authUrl) {
        setAuthUrl(response.data.data.authUrl);
        return response.data.data.authUrl;
      }
    } catch (err) {
      toast.error('Failed to get authorization URL');
      console.error(err);
    }
    return null;
  };

  const handleAuthorize = async () => {
    const url = await getAuthUrl();
    if (url) {
      window.location.href = url;
    }
  };

  const copyAuthUrl = async () => {
    const url = authUrl || await getAuthUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      toast.success('Authorization URL copied to clipboard');
    }
  };

  const loadLiveData = async () => {
    setLoadingData(true);
    try {
      const [hotelRes, roomTypesRes] = await Promise.all([
        cloudbedsService.getHotelDetails(),
        cloudbedsService.getRoomTypes()
      ]);

      if (hotelRes.success) setHotelInfo(hotelRes.data);
      if (roomTypesRes.success) setRoomTypes(roomTypesRes.data || []);
    } catch (err) {
      console.error('Error loading live data:', err);
      // Don't show toast - silently fail
    } finally {
      setLoadingData(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <CloudIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cloudbeds Integration</h1>
            <p className="text-gray-600">Connect your Cloudbeds account for live availability</p>
          </div>
        </div>
        <Button onClick={checkStatus} variant="secondary">
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Connection Status Card */}
      <Card className="border-0 shadow-lg">
        <CardBody className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-gray-500" />
            Connection Status
          </h2>

          <div className={`p-4 rounded-xl ${status?.connected ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
            <div className="flex items-center space-x-3">
              {status?.connected ? (
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              ) : (
                <ExclamationCircleIcon className="h-8 w-8 text-yellow-600" />
              )}
              <div>
                <h3 className={`font-semibold ${status?.connected ? 'text-green-800' : 'text-yellow-800'}`}>
                  {status?.connected ? 'Connected' : 'Not Connected'}
                </h3>
                <p className={`text-sm ${status?.connected ? 'text-green-600' : 'text-yellow-600'}`}>
                  {status?.message || (status?.connected ? 'Cloudbeds API is connected and working' : 'Authorization required')}
                </p>
              </div>
            </div>

            {status?.connected && status?.hotelName && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="flex items-center space-x-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">{status.hotelName}</span>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Authorization Card - Show only if not connected */}
      {!status?.connected && (
        <Card className="border-0 shadow-lg">
          <CardBody className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <KeyIcon className="h-5 w-5 mr-2 text-gray-500" />
              Authorization
            </h2>

            <div className="space-y-4">
              <p className="text-gray-600">
                Click the button below to authorize this application with your Cloudbeds account.
                You will be redirected to Cloudbeds to grant access.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleAuthorize}>
                  <CloudIcon className="h-5 w-5 mr-2" />
                  Authorize with Cloudbeds
                </Button>
                <Button variant="secondary" onClick={copyAuthUrl}>
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Copy Auth URL
                </Button>
              </div>

              {authUrl && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Authorization URL:</p>
                  <p className="text-xs text-gray-700 break-all">{authUrl}</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Live Data - Hotel Information */}
      {status?.connected && hotelInfo && (
        <Card className="border-0 shadow-lg">
          <CardBody className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-500" />
              Hotel Information
            </h2>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
              <div className="flex items-start space-x-4">
                {/* Hotel Logo */}
                {hotelInfo.propertyImage && hotelInfo.propertyImage.length > 0 && (
                  <div className="flex-shrink-0">
                    <img 
                      src={hotelInfo.propertyImage[0].image || hotelInfo.propertyImage[0].thumb} 
                      alt={hotelInfo.propertyName}
                      className="w-24 h-24 rounded-xl object-cover bg-white/20 p-2"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{hotelInfo.propertyName}</h3>
                  
                  {hotelInfo.propertyAddress && (
                    <div className="space-y-1 mb-3 opacity-90">
                      {hotelInfo.propertyAddress.propertyAddress1 && (
                        <p>{hotelInfo.propertyAddress.propertyAddress1}</p>
                      )}
                      {hotelInfo.propertyAddress.propertyCity && (
                        <p>
                          {hotelInfo.propertyAddress.propertyCity}
                          {hotelInfo.propertyAddress.propertyState && `, ${hotelInfo.propertyAddress.propertyState}`}
                          {hotelInfo.propertyAddress.propertyZip && ` ${hotelInfo.propertyAddress.propertyZip}`}
                          {hotelInfo.propertyAddress.propertyCountry && `, ${hotelInfo.propertyAddress.propertyCountry}`}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm mt-4 pt-4 border-t border-white/20">
                    {hotelInfo.propertyPhone && (
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="h-4 w-4" />
                        <span>{hotelInfo.propertyPhone}</span>
                      </div>
                    )}
                    {hotelInfo.propertyEmail && (
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="h-4 w-4" />
                        <span>{hotelInfo.propertyEmail}</span>
                      </div>
                    )}
                    {hotelInfo.propertyCurrency && (
                      <div className="flex items-center space-x-2">
                        <span>Currency: {hotelInfo.propertyCurrency.currencyCode} ({hotelInfo.propertyCurrency.currencySymbol})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Live Data - Room Types */}
      {status?.connected && roomTypes.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <HomeIcon className="h-5 w-5 mr-2 text-gray-500" />
                Room Types ({roomTypes.length})
              </h2>
              <Button variant="secondary" onClick={loadLiveData} disabled={loadingData}>
                <ArrowPathIcon className={`h-4 w-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomTypes.map((room, index) => (
                <Card key={room.roomTypeID || index} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardBody className="p-4">
                    {/* Room Image */}
                    {room.roomTypePhotos && room.roomTypePhotos.length > 0 && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img 
                          src={room.roomTypePhotos[0]} 
                          alt={room.roomTypeName}
                          className="w-full h-40 object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    <h3 className="font-semibold text-gray-900 mb-1">{room.roomTypeName}</h3>
                    
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
                        <p className="text-xs text-gray-500 mb-1">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(room.roomTypeFeatures) ? room.roomTypeFeatures : Object.values(room.roomTypeFeatures)).slice(0, 3).map((feature, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Status Info */}
      {status?.connected && (
        <Card className="border-0 shadow-lg bg-green-50">
          <CardBody className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">All Set!</h3>
                <p className="text-sm text-green-600">
                  Your Cloudbeds integration is active. Guests can now see live availability on the website.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
