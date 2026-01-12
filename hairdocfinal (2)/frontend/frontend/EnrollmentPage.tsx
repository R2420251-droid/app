import React, { useState } from 'react';
import { Course } from './data';

interface EnrollmentPageProps {
    course: Course;
    onEnrollSubmit: (details: { name: string; email: string; phone: string; avatarUrl?: string; }) => void;
    onBack: () => void;
}

export const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ course, onEnrollSubmit, onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email && phone) {
            onEnrollSubmit({ name, email, phone, avatarUrl: avatar || undefined });
        } else {
            alert("Please fill out all fields.");
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 p-4 pb-2 justify-between backdrop-blur-sm">
                <button onClick={onBack} className="flex size-12 shrink-0 items-center justify-start -ml-2" aria-label="Go back">
                    <span className="material-symbols-outlined text-text-light dark:text-text-dark">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold tracking-tight text-text-light dark:text-text-dark">Enrollment</h1>
                <div className="flex size-12 shrink-0 items-center"></div>
            </header>

            <main className="flex-1 px-4 py-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">You are enrolling in:</h2>
                    <div className="mt-4 flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-card-light dark:bg-card-dark overflow-hidden">
                        <div className="w-full bg-center bg-no-repeat aspect-[16/8] bg-cover" role="img" aria-label={course.alt} style={{ backgroundImage: `url("${course.imageUrl}")` }}></div>
                        <div className="flex w-full grow flex-col items-stretch justify-center gap-2 p-4">
                            <p className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">{course.title}</p>
                            <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                                <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
                                <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                                <span className="material-symbols-outlined text-primary text-base">payments</span>
                                <span>R{course.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">Your Information</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Profile Picture (Optional)</label>
                        <div className="mt-2 flex items-center gap-x-3">
                            {avatar ? (
                                <img src={avatar} alt="Avatar Preview" className="h-16 w-16 object-cover rounded-full" />
                            ) : (
                                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">person</span>
                                </div>
                            )}
                            <label htmlFor="avatar-upload" className="cursor-pointer rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                                <span>Upload</span>
                                <input id="avatar-upload" name="avatar" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Full Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-3 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary/50" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-3 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary/50" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Phone Number</label>
                        <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" required className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-3 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary/50" />
                    </div>
                </form>
            </main>

            <footer className="sticky bottom-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark p-4">
                <button onClick={handleSubmit} className="w-full bg-primary text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-primary/90 transition-colors shadow-lg">Submit Application</button>
            </footer>
        </div>
    );
};