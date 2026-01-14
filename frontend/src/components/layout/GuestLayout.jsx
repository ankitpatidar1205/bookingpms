import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function GuestLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-xl">
                <CalendarDaysIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">BookingPMS</span>
            </div>
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} BookingPMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
