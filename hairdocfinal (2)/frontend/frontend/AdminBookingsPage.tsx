import React, { useState, useMemo, useEffect } from 'react';
import { Booking, BookingStatus, Service } from './data'; // Import Service for staff names

interface AdminBookingsPageProps {
  navigateToDashboard: () => void;
  bookings: Booking[];
  onAddBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
  onUpdateBooking: (booking: Booking) => void;
  onDeleteBooking: (id: number) => void;
  services: Service[]; // For selecting service in modal
}

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
    const styles: Record<BookingStatus, string> = {
        Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
        Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
        Canceled: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    };
    return (
        <div className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 ${styles[status]}`}>
            <p className="text-xs font-medium">{status}</p>
        </div>
    );
};

const BookingDetailsModal: React.FC<{
  booking: Booking | null;
  onClose: () => void;
}> = ({ booking, onClose }) => {
  if (!booking) return null;

  const bookingDate = new Date(booking.date + 'T00:00:00');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Booking Details</h3>
          <button onClick={onClose} className="text-text-muted-light dark:text-text-muted-dark"><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Client:</span> <span className="font-bold text-right">{booking.clientName}</span></div>
          <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Email:</span> <span className="font-bold text-right">{booking.clientEmail}</span></div>
          <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Phone:</span> <span className="font-bold text-right">{booking.clientPhone}</span></div>
          <div className="border-t border-border-light dark:border-border-dark my-3"></div>
          <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Service:</span> <span className="font-bold text-right">{booking.service}</span></div>
          <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Date:</span> <span className="font-bold text-right">{bookingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
          <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Time:</span> <span className="font-bold text-right">{booking.time}</span></div>
          <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Stylist:</span> <span className="font-bold text-right">{booking.staff}</span></div>
          <div className="border-t border-border-light dark:border-border-dark my-3"></div>
          <div className="flex justify-between items-center text-lg"><span className="text-text-muted-light dark:text-text-muted-dark">Total:</span> <span className="font-bold text-primary">R{booking.price.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};

// New BookingModal Component
const BookingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Omit<Booking, 'id' | 'status'>) => void;
  services: Service[];
}> = ({ isOpen, onClose, onSave, services }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    service: '',
    staff: 'Any Available', // Default staff
    date: '',
    time: '',
    price: 0,
    duration: 0,
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens for a new booking
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        service: '',
        staff: 'Any Available',
        date: '',
        time: '',
        price: 0,
        duration: 0,
      });
    }
  }, [isOpen]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedService = services.find(s => s.name === e.target.value);
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        service: selectedService.name,
        price: selectedService.price,
        duration: selectedService.duration,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        service: e.target.value,
        price: 0,
        duration: 0,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  // Generate time slots (same logic as in BookPage)
  const generateTimeSlots = (): string[] => {
    const slots = [];
    for (let i = 9; i <= 17; i++) {
        slots.push(`${i}:00 ${i < 12 ? 'AM' : 'PM'}`);
        if (i !== 17) {
            slots.push(`${i}:30 ${i < 12 ? 'AM' : 'PM'}`);
        }
    }
    return slots;
  };
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  
  // Helper to format date as YYYY-MM-DD for input[type="date"]
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in">
        <div className="p-4 border-b border-border-light dark:border-border-dark">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Add New Booking</h3>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Client Name</label>
            <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Client Email</label>
            <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Client Phone</label>
            <input type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Service</label>
            <select name="service" value={formData.service} onChange={handleServiceChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required>
              <option value="">Select a Service</option>
              {services.map(s => (
                <option key={s.id} value={s.name}>{s.name} (R{s.price})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Staff</label>
            <input type="text" name="staff" value={formData.staff} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} min={getTodayDate()} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Time</label>
            <select name="time" value={formData.time} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required>
              <option value="">Select Time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Price (R)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Duration (minutes)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" readOnly />
          </div>
        </form>
        <div className="p-4 flex justify-end gap-2 border-t border-border-light dark:border-border-dark">
            <button type="button" onClick={onClose} className="h-9 px-4 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-medium">Cancel</button>
            <button type="submit" onClick={handleSubmit} className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
};


const BookingCard: React.FC<BookingCardProps> = ({ booking, onUpdateStatus, onDelete, onShowDetails }) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const statusStyles: Record<BookingStatus, { bar: string }> = {
    Pending: { bar: 'bg-[#FFA500]' },
    Confirmed: { bar: 'bg-[#28A745]' },
    Canceled: { bar: 'bg-[#DC3545]' },
  };

  const { bar } = statusStyles[booking.status];
  
  const bookingDate = new Date(booking.date + 'T00:00:00');

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setConfirmingDelete(false);
  };
  
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDelete(false);
  };

  return (
    <div className={`flex flex-col gap-3 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4 shadow-sm ${booking.status === 'Canceled' && 'opacity-70'}`}>
      <div onClick={onShowDetails} className="cursor-pointer flex items-start gap-4">
        <div className={`flex w-1 flex-col self-stretch rounded-full ${bar}`}></div>
        <div className="flex flex-1 flex-col justify-center gap-1">
          <p className={`text-text-light dark:text-text-dark text-base font-bold leading-normal ${booking.status === 'Canceled' && 'line-through'}`}>{booking.clientName}</p>
          <p className={`text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal ${booking.status === 'Canceled' && 'line-through'}`}>{booking.service}</p>
          <p className={`text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal ${booking.status === 'Canceled' && 'line-through'}`}>
            {bookingDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {booking.time}
          </p>
          <p className={`text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal ${booking.status === 'Canceled' && 'line-through'}`}>Assigned to: {booking.staff}</p>
        </div>
        <div className="flex flex-col items-end">
            <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-light dark:border-border-dark">
        {confirmingDelete ? (
           <>
            <button onClick={handleConfirmDelete} className="h-9 px-3 rounded-lg bg-red-500 text-white text-sm font-bold">Confirm</button>
            <button onClick={handleCancelDelete} className="h-9 px-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-bold">Cancel</button>
          </>
        ) : (
          <>
            {booking.status === 'Pending' && (
              <>
                <button onClick={(e) => { e.stopPropagation(); onUpdateStatus('Canceled'); }} className={`h-9 px-3 rounded-lg bg-red-500/20 text-red-500 text-sm font-bold`}>Decline</button>
                <button onClick={(e) => { e.stopPropagation(); onUpdateStatus('Confirmed'); }} className={`h-9 px-3 rounded-lg bg-green-500/20 text-green-600 text-sm font-bold`}>Approve</button>
              </>
            )}
            {booking.status === 'Confirmed' && (
                <button onClick={(e) => { e.stopPropagation(); onUpdateStatus('Canceled'); }} className="h-9 px-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-bold">Cancel</button>
            )}
            <button onClick={handleDeleteClick} className="flex items-center justify-center size-9 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors" aria-label="Delete booking">
                <span className="material-symbols-outlined text-xl pointer-events-none">delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export const AdminBookingsPage: React.FC<AdminBookingsPageProps> = ({ navigateToDashboard, bookings, onUpdateBooking, onDeleteBooking }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // State for the new booking modal
  
  const filteredBookings = useMemo(() => 
    bookings.filter(b => 
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.service.toLowerCase().includes(searchQuery.toLowerCase())
    ), 
  [searchQuery, bookings]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <button onClick={navigateToDashboard} className="flex size-12 cursor-pointer items-center justify-center -ml-2 text-text-light dark:text-text-dark" aria-label="Back to Dashboard">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Booking Management</h1>
        <div className="flex h-12 w-12 items-center justify-end">
          <button onClick={() => setIsBookingModalOpen(true)} className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-primary text-white" aria-label="Add new booking">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </header>
      
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-gray-200/50 dark:bg-gray-700/50">
                <div className="text-text-muted-light dark:text-text-muted-dark flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark px-4 pl-2 text-base font-normal leading-normal" 
                    placeholder="Search by client or service" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </label>
      </div>

      <div className="flex px-4 py-3">
        <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-gray-200/50 dark:bg-gray-700/50 p-1">
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-card-light dark:has-[:checked]:bg-card-dark has-[:checked]:shadow-sm has-[:checked]:checked:text-primary text-text-light dark:text-text-dark text-sm font-medium leading-normal">
            <span className="truncate">Day</span>
            <input defaultChecked name="view-selector" type="radio" value="Day" className="invisible w-0"/>
          </label>
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-card-light dark:has-[:checked]:bg-card-dark has-[:checked]:shadow-sm has-[:checked]:text-primary text-text-light dark:text-text-dark text-sm font-medium leading-normal">
            <span className="truncate">Week</span>
            <input name="view-selector" type="radio" value="Week" className="invisible w-0"/>
          </label>
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-card-light dark:has-[:checked]:bg-card-dark has-[:checked]:shadow-sm has-[:checked]:text-primary text-text-light dark:text-text-dark text-sm font-medium leading-normal">
            <span className="truncate">List</span>
            <input name="view-selector" type="radio" value="List" className="invisible w-0"/>
          </label>
        </div>
      </div>

      <div className="flex gap-3 px-4 py-3 overflow-x-auto">
        <div className="flex h-16 shrink-0 flex-col items-center justify-center gap-y-1 rounded-xl bg-primary px-4 w-16 text-white">
            <p className="text-sm font-normal">Tue</p><p className="text-xl font-bold">16</p>
        </div>
        {[...Array(5)].map((_, i) => (
             <div key={i} className="flex h-16 shrink-0 flex-col items-center justify-center gap-y-1 rounded-xl bg-gray-200/50 dark:bg-gray-700/50 px-4 w-16">
                <p className="text-sm font-normal text-text-muted-light dark:text-text-muted-dark">{'WThFS'[i] + 'ua'.substring(i%2, 1)}</p>
                <p className="text-xl font-bold text-text-light dark:text-text-dark">{17+i}</p>
            </div>
        ))}
      </div>

      <main className="flex flex-col gap-4 p-4">
        {filteredBookings.map(booking => <BookingCard 
            key={booking.id} 
            booking={booking} 
            onShowDetails={() => setSelectedBooking(booking)}
            onDelete={() => onDeleteBooking(booking.id)}
            onUpdateStatus={(newStatus) => onUpdateBooking({ ...booking, status: newStatus })}
        />)}
        
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border-light dark:border-border-dark bg-transparent py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-700/50">
                <span className="material-symbols-outlined text-4xl text-text-muted-light dark:text-text-muted-dark">calendar_month</span>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-lg font-bold text-text-light dark:text-text-dark">No More Bookings</p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">There are no other appointments for today.</p>
            </div>
        </div>
      </main>

      <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      
      {/* New Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSave={onAddBooking}
        services={services}
      />

      <div className="h-5 bg-background-light dark:bg-background-dark"></div>
    </div>
  );
};