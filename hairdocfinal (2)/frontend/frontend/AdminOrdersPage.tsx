import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from './data';

interface AdminOrdersPageProps {
  navigateToDashboard: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const allStatuses: OrderStatus[] = ['Pending', 'Shipped', 'Delivered', 'Canceled'];

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const styles: Record<OrderStatus, string> = {
        Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
        Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
        Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
        Canceled: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    };
    return (
        <div className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 ${styles[status]}`}>
            <p className="text-xs font-medium">{status}</p>
        </div>
    );
};

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ navigateToDashboard, orders, onUpdateOrderStatus }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('All');

    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => activeFilter === 'All' || order.status === activeFilter)
            .filter(order => 
                order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [searchQuery, activeFilter, orders]);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background-light/80 px-4 backdrop-blur-sm dark:bg-background-dark/80 border-b border-border-light dark:border-border-dark">
                <button onClick={navigateToDashboard} className="flex h-12 w-12 cursor-pointer items-center justify-center -ml-2 text-text-light dark:text-text-dark" aria-label="Back to Dashboard">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Orders Management</h1>
                <div className="h-12 w-12"></div>
            </header>

            <div className="px-4 py-3">
                <label className="flex h-12 min-w-40 w-full flex-col">
                    <div className="flex h-full w-full flex-1 items-stretch rounded-xl bg-primary/10 dark:bg-white/5">
                        <div className="flex items-center justify-center pl-4 text-primary dark:text-primary/70">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <input 
                            className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent px-2 text-base font-normal leading-normal text-text-light placeholder:text-primary/50 focus:outline-0 focus:ring-0 dark:text-text-dark dark:placeholder:text-primary/40" 
                            placeholder="Search by name or order ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </label>
            </div>
            
            <div className="px-4 py-3">
                <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-primary/10 dark:bg-white/5 p-1">
                    {(['All', ...allStatuses] as const).map(status => (
                         <label key={status} className="flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal text-primary/80 has-[:checked]:bg-background-light has-[:checked]:text-primary has-[:checked]:shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:text-white/80 dark:has-[:checked]:bg-card-dark dark:has-[:checked]:text-white">
                            <span className="truncate">{status}</span>
                            <input
                                checked={activeFilter === status}
                                onChange={() => setActiveFilter(status)}
                                className="invisible w-0"
                                name="order-status"
                                type="radio"
                                value={status}
                            />
                        </label>
                    ))}
                </div>
            </div>

            <main className="flex flex-col gap-4 p-4">
                {filteredOrders.map(order => (
                    <div key={order.id} className="rounded-xl bg-card-light p-4 shadow-sm dark:bg-card-dark">
                        <div className="flex items-center justify-between border-b border-border-light pb-3 dark:border-border-dark">
                            <div>
                                <p className="text-sm font-semibold text-text-light dark:text-text-dark">{order.id}</p>
                                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">{order.date}</p>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>
                        <div className="flex items-end justify-between pt-3">
                            <div>
                                <p className="text-base font-bold text-text-light dark:text-text-dark">{order.clientName}</p>
                                <p className="text-sm font-medium text-text-light dark:text-text-dark">R{order.total.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-medium text-text-muted-light dark:text-text-muted-dark">Status:</label>
                                <select 
                                    value={order.status} 
                                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                    className="rounded-md border-border-light bg-background-light py-1 pl-2 pr-8 text-sm font-semibold text-text-light focus:border-primary focus:ring-primary/50 dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
                                >
                                    {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredOrders.length === 0 && (
                     <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-4xl">receipt_long</span>
                        </div>
                        <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">No Orders Found</p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Try adjusting your search or filter.</p>
                    </div>
                )}
            </main>
        </div>
    );
};