import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Card, CardBody, CardHeader, Button, Input, Badge } from '../../components/common';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const response = await authService.updateProfile(profileForm);
      updateUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (passwordForm.newPassword.length < 8) {
      setErrors({ newPassword: 'Password must be at least 8 characters' });
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      setErrors({ newPassword: 'Password must contain uppercase, lowercase, and number' });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setSavingPassword(true);
    try {
      await authService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ currentPassword: error.response.data.message });
      }
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      {/* Profile Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <UserCircleIcon className="h-16 w-16 text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-gray-500">{user?.email}</p>
              <div className="mt-1">
                <Badge variant={user?.role === 'ADMIN' ? 'primary' : 'secondary'}>
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={profileForm.firstName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
              />
              <Input
                label="Last Name"
                value={profileForm.lastName}
                onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50"
            />
            <div className="pt-2">
              <Button type="submit" loading={savingProfile}>
                Save Profile
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              error={errors.currentPassword}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              error={errors.newPassword}
              placeholder="Min 8 characters"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={errors.confirmPassword}
              required
            />
            <div className="pt-2">
              <Button type="submit" loading={savingPassword}>
                Change Password
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
