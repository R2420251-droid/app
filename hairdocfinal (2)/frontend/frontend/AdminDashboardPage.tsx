import React from 'react';
import { Booking, Order, User } from './data';

interface AdminDashboardPageProps {
  currentUser: User | null;
  bookings: Booking[];
  orders: Order[];
  navigateToHome: () => void;
  navigateToAdminServices: () => void;
  navigateToAdminTraining: () => void;
  navigateToAdminBookings: () => void;
  navigateToAdminProducts: () => void;
  navigateToAdminEnrollments: () => void;
  navigateToAdminGallery: () => void;
  navigateToAdminOrders: () => void;
  navigateToAdminSettings: () => void;
}

const QuickLink: React.FC<{ icon: string; title: string; onClick: () => void; }> = ({ icon, title, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark aspect-square text-center transition-transform hover:scale-[1.02] active:scale-[0.98]">
        <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
        <p className="text-text-light dark:text-text-dark text-sm font-semibold">{title}</p>
    </button>
);

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
    currentUser,
    bookings,
    orders,
    navigateToHome,
    navigateToAdminServices,
    navigateToAdminTraining,
    navigateToAdminBookings,
    navigateToAdminProducts,
    navigateToAdminEnrollments,
    navigateToAdminGallery,
    navigateToAdminOrders,
    navigateToAdminSettings,
}) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const todayStr = today.toISOString().split('T')[0];

    const last7DaysSales: number[] = Array(7).fill(0);
    let last7DaysTotal = 0;
    let previous7DaysTotal = 0;
    
    orders
      .filter(o => o.status === 'Delivered' || o.status === 'Shipped')
      .forEach(order => {
        const orderDate = new Date(order.date);
        orderDate.setHours(0, 0, 0, 0);
        if (isNaN(orderDate.getTime())) return;

        const diffTime = today.getTime() - orderDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

        if (diffDays >= 0 && diffDays < 7) {
          const dayIndex = 6 - diffDays;
          if (dayIndex >= 0 && dayIndex < 7) {
            last7DaysSales[dayIndex] += order.total;
          }
          last7DaysTotal += order.total;
        } else if (diffDays >= 7 && diffDays < 14) {
          previous7DaysTotal += order.total;
        }
      });

    const salesTrendPercentage = previous7DaysTotal > 0
        ? ((last7DaysTotal - previous7DaysTotal) / previous7DaysTotal) * 100
        : last7DaysTotal > 0 ? 100 : 0;
        
    const maxDailySale = Math.max(...last7DaysSales, 1);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7DaysLabels = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return daysOfWeek[d.getDay()];
    });
    
    const parseTime = (timeStr: string): { hours: number, minutes: number, display: string } => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
        return { hours, minutes, display: timeStr };
    };

    const upcomingActivities = bookings
      .filter(b => b.status === 'Confirmed' && b.date === todayStr)
      .sort((a, b) => {
        const timeA = parseTime(a.time);
        const timeB = parseTime(b.time);
        return timeA.hours * 60 + timeA.minutes - (timeB.hours * 60 + timeB.minutes);
      })
      .slice(0, 3);


    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 p-4 pb-2 justify-between backdrop-blur-sm">
                <button onClick={navigateToHome} className="flex size-12 shrink-0 items-center justify-start text-text-light dark:text-text-dark" aria-label="Back to site">
                    <span className="material-symbols-outlined text-2xl">exit_to_app</span>
                </button>
                <div className="flex-1 text-center">
                    <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">Welcome, {currentUser ? currentUser.name.split(' ')[0] : 'Admin'}!</h2>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Hair Doc Dashboard</p>
                </div>
                <div className="flex w-12 items-center justify-end">
                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-text-light dark:text-text-dark">
                        <span className="material-symbols-outlined text-2xl">notifications</span>
                    </button>
                </div>
            </header>
            <main className="flex-1 pb-24 px-4 pt-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex w-full flex-1 flex-col gap-2 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
                        <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal">Sales Trend</p>
                        <p className="text-text-light dark:text-text-dark tracking-light text-4xl font-bold leading-tight truncate">R{last7DaysTotal.toFixed(2)}</p>
                        <div className="flex gap-2 items-center">
                            <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">Last 7 Days</p>
                            <p className={`${salesTrendPercentage >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} text-sm font-medium leading-normal`}>
                                {salesTrendPercentage >= 0 ? '+' : ''}{salesTrendPercentage.toFixed(1)}%
                            </p>
                        </div>
                        <div className="grid min-h-[160px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center pt-4">
                            {last7DaysSales.map((sale, i) => (
                                <div key={`bar-${i}`} className={`${i === 6 ? 'bg-primary' : 'bg-primary/20 dark:bg-primary/40'} w-full rounded-t`} style={{ height: `${(sale / maxDailySale) * 100}%` }}></div>
                            ))}
                            {last7DaysLabels.map((label, i) => (
                                <p key={`label-${i}`} className={`${i === 6 ? 'text-primary' : 'text-text-muted-light dark:text-text-muted-dark'} text-xs font-bold leading-normal`}>{label}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] pt-6 pb-3">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                    <QuickLink icon="cut" title="Services" onClick={navigateToAdminServices} />
                    <QuickLink icon="school" title="Courses" onClick={navigateToAdminTraining} />
                    <QuickLink icon="shopping_bag" title="Products" onClick={navigateToAdminProducts} />
                    <QuickLink icon="calendar_month" title="Bookings" onClick={navigateToAdminBookings} />
                    <QuickLink icon="assignment_ind" title="Enrollments" onClick={navigateToAdminEnrollments} />
                    <QuickLink icon="photo_library" title="Gallery" onClick={navigateToAdminGallery} />
                    <QuickLink icon="receipt_long" title="Orders" onClick={navigateToAdminOrders} />
                    <QuickLink icon="settings" title="Settings" onClick={navigateToAdminSettings} />
                </div>

                <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] pt-6 pb-3">Upcoming Activity</h3>
                <div className="flex flex-col gap-3">
                    {upcomingActivities.length > 0 ? (
                        upcomingActivities.map(activity => {
                           const timeInfo = parseTime(activity.time);
                           const [time, modifier] = timeInfo.display.split(' ');
                           return (
                            <div key={activity.id} className="flex items-center gap-4 rounded-xl p-4 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark">
                                <div className="flex flex-col items-center justify-center bg-primary/10 dark:bg-primary/20 text-primary w-14 h-14 rounded-lg shrink-0">
                                    <span className="font-bold text-lg leading-none">{time}</span>
                                    <span className="text-xs font-medium uppercase">{modifier}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-text-light dark:text-text-dark">{activity.service}</p>
                                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Client: {activity.clientName}</p>
                                </div>
                            </div>
                           )
                        })
                    ) : (
                        <div className="text-center py-10 text-text-muted-light dark:text-text-muted-dark">
                            No upcoming confirmed bookings for today.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};