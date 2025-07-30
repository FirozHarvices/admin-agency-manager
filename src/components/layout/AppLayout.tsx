// src/components/layout/AppLayout.tsx (REVISED)
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="h-screen w-screen p-4">
      <div className="h-full w-full flex gap-4">

        {/* Panel 1: The Sidebar */}
        <Sidebar />

        {/* Panel 2: The Main Content Area */}
        <div className="flex-1 flex flex-col rounded-2xl bg-brand-background shadow-sm overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>

      </div>
    </div>
  );
}