'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import Sidebar from './components/Sidebar';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafb]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0d8b8b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

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
