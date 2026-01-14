import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PageLoading } from './components/common/Loading';

// Layouts
import GuestLayout from './components/layout/GuestLayout';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// Route Guards
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/auth/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Guest Pages
import Home from './pages/guest/Home';
import Resources from './pages/guest/Resources';
import Calendar from './pages/guest/Calendar';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import MyBookings from './pages/user/MyBookings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminResources from './pages/admin/Resources';
import AdminCalendar from './pages/admin/AdminCalendar';
import AuditLogs from './pages/admin/AuditLogs';

// Shared Pages
import Notifications from './pages/shared/Notifications';
import Profile from './pages/shared/Profile';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoading />;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute>
          <Register />
        </GuestRoute>
      } />

      {/* Guest/Public Routes */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/calendar" element={<Calendar />} />
      </Route>

      {/* User Dashboard Routes */}
      <Route element={
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="analytics" element={<AdminDashboard />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Profile />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
