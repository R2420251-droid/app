import React from 'react';
import { User } from './data';

interface ClientAccountPageProps {
    currentUser: User | null;
    onLogout: () => void;
}

export const ClientAccountPage: React.FC<ClientAccountPageProps> = ({ currentUser, onLogout }) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 dark:bg-background-dark">
            <div className="flex w-full max-w-md flex-col items-center gap-6">
                 <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter text-zinc-900 dark:text-zinc-50">My Account</h1>
                 <p className="text-gray-600 dark:text-gray-400 text-lg">Welcome, {currentUser ? currentUser.name : 'Valued Client'}!</p>
                 {/* Future content like booking history can go here */}
                 <div className="h-40 w-full rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark flex items-center justify-center text-text-muted-light dark:text-text-muted-dark">
                    <p>Booking history coming soon...</p>
                 </div>
                 <button 
                    onClick={onLogout}
                    className="flex h-12 w-full max-w-xs items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-5 py-3 text-base font-semibold leading-6 text-white shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark">
                    Logout
                </button>
            </div>
        </div>
    );
};