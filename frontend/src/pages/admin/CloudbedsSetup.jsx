import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardBody, Button, Loading } from '../../components/common';
import toast from 'react-hot-toast';
import {
  CloudIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  LinkIcon,
  KeyIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function CloudbedsSetup() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

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

      {/* Setup Instructions */}
      <Card className="border-0 shadow-lg">
        <CardBody className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Instructions</h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
              <div>
                <h4 className="font-medium text-gray-900">Configure Cloudbeds App</h4>
                <p className="text-sm text-gray-600">Go to Cloudbeds Dashboard → API Settings → Your Application</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
              <div>
                <h4 className="font-medium text-gray-900">Add Redirect URI</h4>
                <p className="text-sm text-gray-600">Add this URL to your Cloudbeds app:</p>
                <code className="mt-1 block text-xs bg-gray-100 p-2 rounded text-gray-800">
                  {window.location.origin}/cloudbeds/callback
                </code>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
              <div>
                <h4 className="font-medium text-gray-900">Enable Permissions</h4>
                <p className="text-sm text-gray-600">Enable these scopes in Cloudbeds:</p>
                <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                  <li>read:hotel</li>
                  <li>read:reservation</li>
                  <li>read:room</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
              <div>
                <h4 className="font-medium text-gray-900">Authorize</h4>
                <p className="text-sm text-gray-600">Click "Authorize with Cloudbeds" button above and grant access</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

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
