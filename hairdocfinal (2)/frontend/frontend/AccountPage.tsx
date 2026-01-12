import React from 'react';

interface AccountPageProps {
  navigateToAdminServices: () => void;
  navigateToAdminBookings: () => void;
  navigateToAdminProducts: () => void;
  navigateToAdminEnrollments: () => void;
  navigateToAdminGallery: () => void;
  navigateToAdminOrders: () => void;
  navigateToAdminSettings: () => void;
}

const OverviewCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
    <div className="flex flex-col gap-2 rounded-xl p-4 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
        <p className="text-text-light dark:text-text-dark text-sm font-medium leading-normal">{title}</p>
        <p className="text-text-light dark:text-text-dark tracking-light text-3xl font-bold leading-tight">{value}</p>
    </div>
);

const QuickLink: React.FC<{ icon: string; title: string; onClick: () => void; }> = ({ icon, title, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark aspect-square text-center">
        <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
        <p className="text-text-light dark:text-text-dark text-sm font-semibold">{title}</p>
    </button>
);

export const AccountPage: React.FC<AccountPageProps> = ({
    navigateToAdminServices,
    navigateToAdminBookings,
    navigateToAdminProducts,
    navigateToAdminEnrollments,
    navigateToAdminGallery,
}) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 p-4 pb-2 justify-between backdrop-blur-sm">
                <div className="flex size-12 shrink-0 items-center">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/50" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjOoU7THM5h7iAh1YucW9CBbQHpTIfro1l_eAxirIMnEkH9jRLPLZkrcB6cd8nzi2r7MgMjnXum3iZi_UG6PKGP5nPzx6KdsofWCOXEGFQ0547boDtAoW5XEGU7mtbkXeF5PPOcKI5pziUelI57ifmtkQp5od-v9hn7Vqk9im0MGnOnP7MaIrdFNN9Vje929SlB8HsoY4ycT7krHMevpcPk426o_w__KwRNo3C1Vuub_7QtudxE4M2ud6RXmLBPRhqegGlnLGf1ahs")` }}></div>
                </div>
                <div className="flex-1 text-center">
                    <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">Welcome, Jane!</h2>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Hair Doc Dashboard</p>
                </div>
                <div className="flex w-12 items-center justify-end">
                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-text-light dark:text-text-dark">
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                    </button>
                </div>
            </header>
            <main className="flex-1 pb-24 px-4">
                <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] pt-4 pb-3">Today's Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                    <OverviewCard title="New Bookings" value="8" />
                    <OverviewCard title="Pending Orders" value="5" />
                    <OverviewCard title="New Enrollments" value="3" />
                    <OverviewCard title="Total Sales" value="$1,250" />
                </div>

                <div className="flex flex-wrap gap-4 py-6">
                    <div className="flex w-full flex-1 flex-col gap-2 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
                        <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">Sales Trend</p>
                        <p className="text-text-light dark:text-text-dark tracking-light text-4xl font-bold leading-tight truncate">$8,750</p>
                        <div className="flex gap-2 items-center">
                            <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">Last 7 Days</p>
                            <p className="text-green-600 dark:text-green-400 text-sm font-medium leading-normal">+5.2%</p>
                        </div>
                        <div className="grid min-h-[160px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center pt-4">
                            <div className="bg-primary/20 dark:bg-primary/40 w-full rounded-t" style={{ height: '10%' }}></div><p className="text-text-muted-light dark:text-text-muted-dark text-xs font-bold leading-normal">Mon</p>
                            <div className="bg-primary/20 dark:bg-primary/40 w-full rounded-t" style={{ height: '70%' }}></div><p className="text-text-muted-light dark:text-text-muted-dark text-xs font-bold leading-normal">Tue</p>
                            <div className="bg-primary/20 dark:bg-primary/40 w-full rounded-t" style={{ height: '40%' }}></div><p className="text-text-muted-light dark:text-text-muted-dark text-xs font-bold leading-normal">Wed</p>
                            <div className="bg-primary w-full rounded-t" style={{ height: '100%' }}></div><p className="text-primary text-xs font-bold leading-normal">Thu</p>
                            <div className="bg-primary/20 dark:bg-primary/40 w-full rounded-t" style={{ height: '60%' }}></div><p className="text-text-muted-light dark:text-text-muted-dark text-xs font-bold leading-normal">Fri</p>
                            <div className="bg-primary/20 dark:bg-primary/40 w-full rounded-t" style={{ height: '30%' }}></div><p className="text-text-muted-light dark:text-text-muted-dark text-xs font-bold leading-normal">Sat</p>
                            <div className="bg-primary/20 dark:bg-primary/40 w-full rounded-t" style={{ height: '50%' }}></div><p className="text-text-muted-light dark:text-text-muted-dark text-xs font-bold leading-normal">Sun</p>
                        </div>
                    </div>
                </div>

                <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] pt-0 pb-3">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                    <QuickLink icon="cut" title="Services" onClick={navigateToAdminServices} />
                    <QuickLink icon="school" title="Courses" onClick={navigateToAdminEnrollments} />
                    <QuickLink icon="shopping_bag" title="Products" onClick={navigateToAdminProducts} />
                    <QuickLink icon="calendar_month" title="Bookings" onClick={navigateToAdminBookings} />
                    <QuickLink icon="assignment_ind" title="Enrollments" onClick={navigateToAdminEnrollments} />
                    <QuickLink icon="photo_library" title="Gallery" onClick={navigateToAdminGallery} />
                </div>

                <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] pt-6 pb-3">Upcoming Activity</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 rounded-xl p-4 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                        <div className="flex flex-col items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary w-14 h-14 rounded-lg shrink-0">
                            <span className="font-bold text-lg leading-none">10:00</span>
                            <span className="text-xs font-medium uppercase">AM</span>
                        </div>
                        <div className="flex-1"><p className="font-semibold text-text-light dark:text-text-dark">Luxury Manicure</p><p className="text-sm text-text-muted-light dark:text-text-muted-dark">Client: Olivia Chen</p></div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl p-4 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                         <div className="flex flex-col items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary w-14 h-14 rounded-lg shrink-0">
                            <span className="font-bold text-lg leading-none">11:30</span>
                            <span className="text-xs font-medium uppercase">AM</span>
                        </div>
                        <div className="flex-1"><p className="font-semibold text-text-light dark:text-text-dark">Pro Makeup Course</p><p className="text-sm text-text-muted-light dark:text-text-muted-dark">Student: Ava Smith</p></div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl p-4 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                        <div className="flex flex-col items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary w-14 h-14 rounded-lg shrink-0">
                            <span className="font-bold text-lg leading-none">01:00</span>
                            <span className="text-xs font-medium uppercase">PM</span>
                        </div>
                        <div className="flex-1"><p className="font-semibold text-text-light dark:text-text-dark">Balayage & Style</p><p className="text-sm text-text-muted-light dark:text-text-muted-dark">Client: Maya Patel</p></div>
                    </div>
                </div>
            </main>
        </div>
    );
};