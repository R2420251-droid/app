import React, { useState } from 'react';
import { api } from '../api';

interface ClientSignUpPageProps {
    onSignUp: () => void;
    navigateToLogin: () => void;
}

export const ClientSignUpPage: React.FC<ClientSignUpPageProps> = ({ onSignUp, navigateToLogin }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);

        try {
            await api.register(formData.fullName, formData.email, formData.username, formData.password);
            onSignUp(); // This will trigger toast and navigation in App.tsx
            navigateToLogin();
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="flex items-center p-4 pb-2 justify-between bg-background-light dark:bg-background-dark">
                <button onClick={navigateToLogin} className="flex size-12 shrink-0 items-center justify-start text-zinc-900 dark:text-zinc-50" aria-label="Back to login">
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </button>
                <div className="flex flex-1 items-center justify-center">
                   <span className="material-symbols-outlined text-primary" style={{ fontSize: '40px' }}>spa</span>
                </div>
                <div className="flex size-12 shrink-0 items-center"></div>
            </header>
            <main className="flex-1 flex flex-col">
                <div className="flex flex-col px-4 pt-6 pb-3">
                    <h1 className="text-zinc-900 dark:text-zinc-50 text-[32px] font-bold leading-tight tracking-tighter text-left">Create Account</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-base font-normal leading-normal pt-1">Start your journey with Hair Doc today.</p>
                </div>
                <form className="flex-1 flex flex-col gap-y-3 px-4 py-3" onSubmit={handleRegister}>
                    <label className="flex flex-col w-full">
                        <p className="text-zinc-900 dark:text-zinc-50 text-base font-medium leading-normal pb-2">Full Name</p>
                        <input name="fullName" onChange={handleChange} value={formData.fullName} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 p-[15px] text-base font-normal leading-normal" placeholder="Enter your full name" required />
                    </label>
                    <label className="flex flex-col w-full">
                        <p className="text-zinc-900 dark:text-zinc-50 text-base font-medium leading-normal pb-2">Email Address</p>
                        <input name="email" onChange={handleChange} value={formData.email} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 p-[15px] text-base font-normal leading-normal" placeholder="Enter your email address" type="email" required />
                    </label>
                    <label className="flex flex-col w-full">
                        <p className="text-zinc-900 dark:text-zinc-50 text-base font-medium leading-normal pb-2">Username</p>
                        <input name="username" onChange={handleChange} value={formData.username} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 p-[15px] text-base font-normal leading-normal" placeholder="Choose a username" required />
                    </label>
                    <div className="relative w-full">
                        <label className="flex flex-col w-full">
                            <p className="text-zinc-900 dark:text-zinc-50 text-base font-medium leading-normal pb-2">Password</p>
                            <input name="password" onChange={handleChange} value={formData.password} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 p-[15px] pr-12 text-base font-normal leading-normal" placeholder="Enter your password" type={passwordVisible ? "text" : "password"} required />
                        </label>
                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-4 top-12 text-zinc-500 dark:text-zinc-400">
                            <span className="material-symbols-outlined text-2xl">{passwordVisible ? 'visibility' : 'visibility_off'}</span>
                        </button>
                    </div>
                    <div className="relative w-full">
                        <label className="flex flex-col w-full">
                            <p className="text-zinc-900 dark:text-zinc-50 text-base font-medium leading-normal pb-2">Confirm Password</p>
                            <input name="confirmPassword" onChange={handleChange} value={formData.confirmPassword} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 p-[15px] pr-12 text-base font-normal leading-normal" placeholder="Confirm your password" type={confirmPasswordVisible ? "text" : "password"} required />
                        </label>
                        <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute right-4 top-12 text-zinc-500 dark:text-zinc-400">
                            <span className="material-symbols-outlined text-2xl">{confirmPasswordVisible ? 'visibility' : 'visibility_off'}</span>
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}
                    <div className="flex-grow"></div>
                    <div className="flex flex-col items-center gap-4 py-5">
                        <button type="submit" className="flex h-14 w-full items-center justify-center gap-x-2 rounded-xl bg-primary px-6 py-2.5 text-base font-bold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-background-dark" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                        <p className="text-center text-sm font-medium leading-normal text-zinc-600 dark:text-zinc-400">
                            Already have an account?{' '}
                            <button type="button" onClick={navigateToLogin} className="font-bold text-primary hover:underline">Log In</button>
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
};