'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafb]">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={sidebarCollapsed}
        onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main className={`flex-1 overflow-auto transition-all duration-300 ${!sidebarOpen && 'lg:ml-0'} ${sidebarOpen || !sidebarCollapsed ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-4 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
