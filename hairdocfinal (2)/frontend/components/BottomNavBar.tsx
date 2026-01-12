import React from 'react';
import { Page } from '../App';
import { User } from '../frontend/data';

interface BottomNavBarProps {
  currentUser: User | null;
  activePage: Page;
  navigateTo: (page: Page) => void;
  onAccountClick: () => void;
}

interface NavItemProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick }) => {
  const activeClass = 'text-primary dark:text-primary';
  const inactiveClass = 'text-text-muted-light dark:text-text-muted-dark';
  const textFont = isActive ? 'font-bold' : 'font-medium';
  
  return (
    <button onClick={onClick} className={`flex flex-1 flex-col items-center justify-end gap-1 ${isActive ? activeClass : inactiveClass}`}>
      <div className="flex h-8 items-center justify-center">
        <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill' : ''}`}>{icon}</span>
      </div>
      <p className={`text-xs leading-normal tracking-[0.015em] ${textFont}`}>{label}</p>
    </button>
  );
};

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentUser, activePage, navigateTo, onAccountClick }) => {
  
  const getAccountPage = (): Page => {
      if (!currentUser) return 'client-login';
      if (currentUser.role === 'Super Admin') return 'admin-dashboard';
      return 'client-account';
  };
  
  const navItems: { page: Page, label: string, icon: string, action?: () => void }[] = [
    { page: 'home', label: 'Home', icon: 'home' },
    { page: 'services', label: 'Services', icon: 'cut' },
    { page: 'shop', label: 'Shop', icon: 'storefront' },
    { page: 'book', label: 'Book', icon: 'calendar_month' },
    { page: getAccountPage(), label: 'Account', icon: 'person', action: onAccountClick },
  ];

  return (
    <nav className="sticky bottom-0 z-10 w-full">
      <div className="flex gap-2 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark px-4 pb-3 pt-2">
        {navItems.map(item => (
          <NavItem 
            key={item.page}
            label={item.label}
            icon={item.icon}
            isActive={activePage === item.page}
            onClick={item.action || (() => navigateTo(item.page))}
          />
        ))}
      </div>
    </nav>
  );
};