'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapseToggle: () => void;
}

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const RequestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const ChevronLeftIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function Sidebar({
  isOpen,
  onToggle,
  isCollapsed,
  onCollapseToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (href: string) => pathname === href;

  const navItems = [
    { href: '/student/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { href: '/student/my-requests', label: 'My Requests', icon: RequestIcon },
    { href: '/student/request-form', label: 'New Request', icon: PlusIcon },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#0d8b8b] to-[#066b6b] text-white transition-all duration-300 z-50 flex flex-col ${
          isOpen ? 'w-64' : 'w-0'
        } ${!isOpen && 'lg:w-20'} ${isOpen && 'lg:w-64'} ${!isOpen && isCollapsed && 'lg:w-20'} ${
          !isOpen && !isCollapsed && 'lg:w-64'
        } overflow-hidden`}
      >
        {/* Top Section with Collapse Button and Logo */}
        <div className={`p-6 pb-4 ${isCollapsed ? 'px-3' : ''}`}>
          {/* Collapse Button */}
          <button
            onClick={onCollapseToggle}
            className="hidden lg:flex w-full items-center justify-center px-4 py-3 text-sm font-semibold rounded-lg bg-white/20 hover:bg-white/30 transition text-white mb-4 border border-white/30 hover:border-white/50 shadow-md hover:shadow-lg"
          >
            <ChevronLeftIcon collapsed={isCollapsed} />
          </button>

          {/* Logo */}
          <div className={`bg-white rounded-lg ${isCollapsed ? 'p-2' : 'p-4'}`}>
            {isCollapsed ? (
              <Image
                src="/images/sigma-logo-icon.png"
                alt="SIGMA Logo Icon"
                width={50}
                height={50}
                priority
                className="w-full h-auto object-cover"
              />
            ) : (
              <Image
                src="/images/sigma-logo.png"
                alt="SIGMA Logo"
                width={190}
                height={60}
                priority
                className="w-full h-auto object-cover"
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-4 space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition justify-center lg:justify-start ${
                  active
                    ? 'bg-white text-[#0d8b8b] shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <IconComponent />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - User Info */}
        <div className={`p-6 pt-4 border-t border-white/20 ${isCollapsed ? 'px-3' : ''} relative`}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            title={isCollapsed ? 'User Menu' : undefined}
            className={`w-full flex items-center gap-3 ${isCollapsed ? 'flex-col' : ''} px-4 py-3 rounded-lg hover:bg-white/10 transition group`}
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-white/30 transition">
              JD
            </div>
            {!isCollapsed && (
              <div className="text-sm text-left">
                <p className="font-semibold">John Doe</p>
                <p className="text-xs text-teal-100">Student</p>
              </div>
            )}
          </button>

          {/* Popup Menu */}
          {showUserMenu && (
            <div className={`absolute bottom-full ${isCollapsed ? 'left-1/2 -translate-x-1/2' : 'left-6 right-6'} mb-3 bg-white rounded-lg shadow-lg z-10`}>
              <button
                onClick={async () => {
                  setShowUserMenu(false);
                  await signOut();
                  router.push('/auth/login');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#0d8b8b] hover:bg-gray-100 rounded-lg transition first:rounded-t-lg last:rounded-b-lg"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 lg:hidden bg-[#0d8b8b] text-white p-2 rounded-lg hover:bg-[#066b6b] transition shadow-lg"
      >
        <MenuIcon />
      </button>
    </>
  );
}
