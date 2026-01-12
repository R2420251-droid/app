import React from 'react';
import { User } from '../frontend/data';

interface TopAppBarProps {
  currentUser: User | null;
  onMenuClick?: () => void;
  onAccountClick?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ currentUser, onMenuClick, onAccountClick }) => {
  return (
    <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
      <button onClick={onMenuClick} className="flex size-12 shrink-0 items-center justify-start" aria-label="Open menu">
        <span className="material-symbols-outlined text-text-light dark:text-text-dark text-[28px]">menu</span>
      </button>
      <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center animate-color-cycle-brand">Hair Doc</h1>
      <div className="flex w-12 items-center justify-end">
        <button 
          onClick={onAccountClick}
          className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-text-light dark:text-text-dark gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
          aria-label="Account"
        >
          {currentUser ? (
            <img src={currentUser.avatarUrl} alt="User Avatar" className="size-8 rounded-full object-cover border-2 border-primary" />
          ) : (
            <span className="material-symbols-outlined text-text-light dark:text-text-dark text-[28px]">person</span>
          )}
        </button>
      </div>
    </div>
  );
};