import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardBody, Loading } from '../../components/common';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

/**
 * Cloudbeds OAuth Callback Page
 * Handles the redirect from Cloudbeds after user authorization
 */
export default function CloudbedsCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing authorization...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setStatus('error');
      setMessage(errorDescription || 'Authorization was denied or failed');
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received');
      return;
    }

    try {
      const response = await api.post('/cloudbeds/auth/callback', {
        code: code,
        redirect_uri: window.location.origin + '/cloudbeds/callback'
      });

      if (response.data.success) {
        setStatus('success');
        setMessage('Successfully connected to Cloudbeds!');
        toast.success('Cloudbeds authorization successful!');

        // Store tokens if needed (for demo - in production use secure storage)
        if (response.data.data.accessToken) {
          localStorage.setItem('cloudbeds_connected', 'true');
        }

        // Redirect to availability page after 2 seconds
        setTimeout(() => {
          navigate('/availability');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Failed to complete authorization');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to exchange authorization code');
      console.error('Callback error:', err);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-0 shadow-xl">
        <CardBody className="p-8 text-center">
          {status === 'processing' && (
            <>
              <Loading size="lg" className="mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting to Cloudbeds</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Connected!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to availability page...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationCircleIcon className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Authorization Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => navigate('/availability')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Availability
              </button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
