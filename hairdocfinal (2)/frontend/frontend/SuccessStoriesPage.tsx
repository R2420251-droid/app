import React, { useState } from 'react';
import { salonReviewsData, academyReviewsData, Review } from './data';

interface SuccessStoriesPageProps {
  navigateToHome: () => void;
  navigateToBook: () => void;
}

type Tab = 'clients' | 'students';


const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex gap-0.5 text-yellow-500">
        {[...Array(5)].map((_, i) => (
            <span key={i} className={`material-symbols-outlined text-xl ${i < rating ? 'fill' : ''}`}>star</span>
        ))}
    </div>
);


const ReviewCard: React.FC<Review> = ({ name, time, service, rating, review, likes, dislikes, avatarUrl }) => (
    <div className="flex flex-col gap-3 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="size-10 shrink-0 rounded-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${avatarUrl}")` }} role="img" aria-label={`Portrait of ${name}`}></div>
            <div className="flex-1">
                <p className="text-base font-medium leading-normal text-text-light dark:text-text-dark">{name}</p>
                <p className="text-sm font-normal leading-normal text-text-light-secondary dark:text-text-dark-secondary">{time}</p>
            </div>
            <div className="rounded bg-primary/20 px-2 py-1">
                <p className="text-xs font-medium text-primary">{service}</p>
            </div>
        </div>
        <RatingStars rating={rating} />
        <p className="text-base font-normal leading-relaxed text-text-light dark:text-text-dark">{review}</p>
        <div className="flex gap-6 text-text-light-secondary dark:text-text-dark-secondary">
            <button className="flex items-center gap-2"><span className="material-symbols-outlined text-xl">thumb_up</span><p>{likes > 0 && likes}</p></button>
            <button className="flex items-center gap-2"><span className="material-symbols-outlined text-xl">thumb_down</span><p>{dislikes > 0 && dislikes}</p></button>
        </div>
    </div>
);

export const SuccessStoriesPage: React.FC<SuccessStoriesPageProps> = ({ navigateToHome, navigateToBook }) => {
    const [activeTab, setActiveTab] = useState<Tab>('clients');

    const reviews = activeTab === 'clients' ? salonReviewsData : academyReviewsData;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
                <div className="flex items-center p-4 pb-2">
                    <button onClick={navigateToHome} className="flex size-12 shrink-0 items-center justify-start text-text-light dark:text-text-dark" aria-label="Go back">
                        <span className="material-symbols-outlined text-2xl">arrow_back</span>
                    </button>
                    <h1 className="flex-1 text-center text-lg font-bold tracking-[-0.015em] text-text-light dark:text-text-dark">Success Stories</h1>
                    <div className="size-12 shrink-0"></div>
                </div>
            </header>

            <div className="sticky top-[60px] z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4">
                <div className="flex border-b border-border-light dark:border-border-dark">
                    <button onClick={() => setActiveTab('clients')} className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-3 pt-4 ${activeTab === 'clients' ? 'border-primary' : 'border-transparent'}`}>
                        <p className={`text-sm font-bold ${activeTab === 'clients' ? 'text-primary' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}>Salon Clients</p>
                    </button>
                    <button onClick={() => setActiveTab('students')} className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-3 pt-4 ${activeTab === 'students' ? 'border-primary' : 'border-transparent'}`}>
                        <p className={`text-sm font-bold ${activeTab === 'students' ? 'text-primary' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}>Academy Students</p>
                    </button>
                </div>
            </div>

            <main className="flex flex-col gap-6 bg-background-light dark:bg-background-dark p-4 pb-28">
                {reviews.map(review => <ReviewCard key={review.name} {...review} />)}
                <div className="flex pt-2">
                    <button className="flex h-10 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary/20 text-sm font-bold tracking-[0.015em] text-primary">
                        <span className="truncate">Load More</span>
                    </button>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 z-20 w-full bg-gradient-to-t from-background-light dark:from-background-dark to-transparent">
                <div className="px-4 py-6">
                    <button onClick={navigateToBook} className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-base font-bold tracking-[0.015em] text-white shadow-lg shadow-primary/30">
                        <span className="truncate">Book Your Appointment</span>
                    </button>
                </div>
            </footer>
        </div>
    );
};