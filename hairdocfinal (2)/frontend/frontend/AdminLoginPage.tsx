import React, { useState } from 'react';
import { api } from '../api';
import { User } from './data';

interface AdminLoginPageProps {
    onLogin: (user: User) => void;
    onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, onLoginSuccess }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { user } = await api.login(identifier, password);
            if (user.role !== 'Super Admin') {
                setError('You are not authorized to access this page.');
                return;
            }
            onLogin(user);
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleForgotPassword = () => {
        alert('Password recovery instructions have been sent to trevormhlanga505@gmail.com.');
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light px-4 py-8 dark:bg-background-dark">
            <div className="flex w-full max-w-md flex-col items-center">
                <div className="flex flex-col items-center justify-center pb-8">
                    <span className="material-symbols-outlined text-primary" style={{fontSize: '64px'}}>spa</span>
                    <p className="text-center font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Hair Doc</p>
                </div>
                <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter text-zinc-900 dark:text-zinc-50">Admin Login</h1>
                <form className="mt-8 flex w-full flex-col gap-6" onSubmit={handleLogin}>
                    <label className="flex flex-col">
                        <p className="pb-2 text-base font-medium text-zinc-900 dark:text-zinc-50">Username or Email</p>
                        <div className="flex w-full flex-1 items-stretch rounded-xl border border-zinc-300 bg-background-light ring-primary/20 focus-within:ring-2 dark:border-zinc-700 dark:bg-background-dark">
                            <input 
                                className="form-input h-14 min-w-0 flex-1 resize-none overflow-hidden rounded-l-xl border-0 bg-transparent p-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-0 focus:ring-0 dark:text-zinc-50 dark:placeholder:text-zinc-500" 
                                placeholder="Enter your username or email" 
                                type="text" 
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                            <div className="flex items-center justify-center pr-4">
                                <span className="material-symbols-outlined text-zinc-500 dark:text-zinc-400">person</span>
                            </div>
                        </div>
                    </label>
                    <label className="flex flex-col">
                        <p className="pb-2 text-base font-medium text-zinc-900 dark:text-zinc-50">Password</p>
                        <div className="flex w-full flex-1 items-stretch rounded-xl border border-zinc-300 bg-background-light ring-primary/20 focus-within:ring-2 dark:border-zinc-700 dark:bg-background-dark">
                            <input 
                                className="form-input h-14 min-w-0 flex-1 resize-none overflow-hidden rounded-l-xl border-0 bg-transparent p-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-0 focus:ring-0 dark:text-zinc-50 dark:placeholder:text-zinc-500" 
                                placeholder="Enter your password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="flex items-center justify-center pr-4">
                                <span className="material-symbols-outlined cursor-pointer text-zinc-500 dark:text-zinc-400">visibility</span>
                            </div>
                        </div>
                    </label>
                    <button type="submit" className="flex h-14 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-base font-bold leading-normal tracking-wide text-white transition-colors hover:bg-primary/90" disabled={loading}>
                        <span className="truncate">{loading ? 'Logging in...' : 'Login'}</span>
                    </button>
                </form>
                {error && <p className="text-red-500 text-center mt-4 text-sm font-medium">{error}</p>}
                <button type="button" onClick={handleForgotPassword} className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline">Forgot Password?</button>
            </div>
        </div>
    );
};