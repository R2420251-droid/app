import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../App';

interface ToastProps {
  message: ToastMessage | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2700); // a bit less than the App's 3s timeout to allow fade out
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message) return null;

  const isSuccess = message.type === 'success';
  const bgColor = isSuccess ? 'bg-green-600' : 'bg-red-600';
  const icon = isSuccess ? 'check_circle' : 'error';

  return (
    <div 
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 rounded-full px-6 py-3 text-white shadow-lg transition-all duration-300 ${bgColor} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <p className="text-sm font-medium">{message.message}</p>
    </div>
  );
};