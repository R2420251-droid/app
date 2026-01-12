import React, { useState } from 'react';
import { api } from '../api';

interface ResetPasswordPageProps {
  navigateToLogin: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  token: string;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ navigateToLogin, showToast, token }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('Password reset token is missing.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(token, password);
      showToast('Your password has been reset successfully!', 'success');
      navigateToLogin();
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light px-4 py-8 dark:bg-background-dark">
      <div className="flex w-full max-w-md flex-col items-center">
        <div className="flex flex-col items-center justify-center pb-8">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '64px' }}>spa</span>
          <p className="text-center font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Hair Doc</p>
        </div>
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter text-zinc-900 dark:text-zinc-50">Reset Password</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal pt-2">Enter your new password below</p>
        <form className="mt-8 flex w-full flex-col gap-6" onSubmit={handleResetPassword}>
          <div className="relative w-full">
            <label className="flex flex-col w-full">
              <p className="pb-2 text-base font-medium text-zinc-900 dark:text-zinc-50">New Password</p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 p-[15px] pr-12 text-base font-normal leading-normal"
                placeholder="Enter your new password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-4 top-12 text-zinc-500 dark:text-zinc-400">
              <span className="material-symbols-outlined text-2xl">{passwordVisible ? 'visibility' : 'visibility_off'}</span>
            </button>
          </div>
          <div className="relative w-full">
            <label className="flex flex-col w-full">
              <p className="pb-2 text-base font-medium text-zinc-900 dark:text-zinc-50">Confirm New Password</p>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-zinc-900 dark:text-zinc-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-zinc-300 dark:border-zinc-700 bg-background-light dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 p-[15px] pr-12 text-base font-normal leading-normal"
                placeholder="Confirm your new password"
                type={confirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute right-4 top-12 text-zinc-500 dark:text-zinc-400">
              <span className="material-symbols-outlined text-2xl">{confirmPasswordVisible ? 'visibility' : 'visibility_off'}</span>
            </button>
          </div>
          {error && <p className="text-red-500 text-center -mb-2 text-sm font-medium">{error}</p>}
          <button type="submit" className="flex h-14 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-base font-bold leading-normal tracking-wide text-white transition-colors hover:bg-primary/90" disabled={loading}>
            <span className="truncate">{loading ? 'Resetting...' : 'Reset Password'}</span>
          </button>
        </form>
        <p className="text-gray-600 dark:text-gray-400 text-center text-sm font-normal mt-4">
          Remember your password?{' '}
          <button onClick={navigateToLogin} className="font-bold text-primary underline">Log In</button>
        </p>
      </div>
    </div>
  );
};
