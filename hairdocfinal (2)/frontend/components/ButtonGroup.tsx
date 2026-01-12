import React from 'react';

interface ButtonGroupProps {
  onBookServiceClick: () => void;
  onEnrollTrainingClick: () => void;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ onBookServiceClick, onEnrollTrainingClick }) => {
  return (
    <div className="flex justify-center -mt-8">
      <div className="flex w-full max-w-lg flex-col items-stretch gap-3 px-4 py-3">
        <button 
          onClick={onBookServiceClick}
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg">
          <span className="truncate">Book a Service</span>
        </button>
        <button 
          onClick={onEnrollTrainingClick}
          className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-6 bg-background-light dark:bg-background-dark/80 dark:backdrop-blur-sm text-text-light dark:text-text-dark text-base font-bold leading-normal tracking-[0.015em] border border-border-light dark:border-border-dark/50 shadow-lg">
          <span className="truncate">Enroll in Training</span>
        </button>
      </div>
    </div>
  );
};