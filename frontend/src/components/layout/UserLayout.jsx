import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <UserSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
