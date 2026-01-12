import React from 'react';
import { Page } from './App';

interface AdminBottomNavBarProps {
  activePage: Page;
  navigateTo: (page: Page) => void;
}

const NavItem: React.FC<{ label: string; icon: string; isActive: boolean; onClick: () => void; }> = ({ label, icon, isActive, onClick }) => {
  const activeClass = "text-primary";
  const inactiveClass = "text-text-muted-light dark:text-text-muted-dark";

  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 p-2 w-20 ${isActive ? activeClass : inactiveClass}`}>
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export const AdminBottomNavBar: React.FC<AdminBottomNavBarProps> = ({ activePage, navigateTo }) => {
  const navItems: { page: Page; label: string; icon: string }[] = [
    { page: 'admin-dashboard', label: 'Dashboard', icon: 'dashboard' },
    { page: 'admin-bookings', label: 'Bookings', icon: 'calendar_month' },
    { page: 'admin-orders', label: 'Orders', icon: 'shopping_bag' },
    { page: 'admin-settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark p-2">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavItem
            key={item.page}
            label={item.label}
            icon={item.icon}
            isActive={activePage === item.page}
            onClick={() => navigateTo(item.page)}
          />
        ))}
      </div>
    </nav>
  );
};
