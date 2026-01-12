import React, { useState, useMemo } from 'react';
import { Service, Booking } from './data';

interface BookPageProps {
  navigateToHome: () => void;
  services: Service[];
  onAddBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
}

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generates time slots
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

export const BookPage: React.FC<BookPageProps> = ({ navigateToHome, services, onAddBooking }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Booking details state
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientDetails, setClientDetails] = useState({ name: '', email: '', phone: '' });
  
  const selectedService = useMemo(() => services.find(s => s.id === selectedServiceId), [selectedServiceId, services]);

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedService) {
      alert("Please select a service.");
      return;
    }
    if (currentStep === 2 && !selectedTime) {
      alert("Please select a time slot.");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => setCurrentStep(prev => prev - 1);
  
  const handleSubmitBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientDetails.name || !clientDetails.email || !clientDetails.phone) {
      alert("Please ensure all details are filled correctly.");
      return;
    }

    // WhatsApp Integration
    const whatsAppNumber = "27670343809"; // No '+' or spaces
    const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    let message = `*New Booking Request*\n\n`;
    message += `*Client:* ${clientDetails.name}\n`;
    message += `*Email:* ${clientDetails.email}\n`;
    message += `*Phone:* ${clientDetails.phone}\n\n`;
    message += `*Service:* ${selectedService.name}\n`;
    message += `*Date:* ${formattedDate}\n`;
    message += `*Time:* ${selectedTime}\n`;
    message += `*Price:* R${selectedService.price.toFixed(2)}\n`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;

    window.open(url, '_blank', 'noopener,noreferrer');


    // Add booking to admin panel
    onAddBooking({
      clientName: clientDetails.name,
      clientEmail: clientDetails.email,
      clientPhone: clientDetails.phone,
      service: selectedService.name,
      staff: "Any Available",
      date: selectedDate,
      time: selectedTime,
      price: selectedService.price,
      duration: selectedService.duration,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Select Service
        return <SelectServiceStep services={services} selectedServiceId={selectedServiceId} onSelect={setSelectedServiceId} />;
      case 2: // Select Date & Time
        return <SelectDateTimeStep selectedDate={selectedDate} onDateChange={setSelectedDate} selectedTime={selectedTime} onTimeSelect={setSelectedTime} timeSlots={timeSlots} />;
      case 3: // Client Details
        return <ClientDetailsStep details={clientDetails} onDetailsChange={setClientDetails} />;
      case 4: // Confirmation
        return <ConfirmationStep service={selectedService} staffName="Any Available" date={selectedDate} time={selectedTime} client={clientDetails} />;
      default:
        return null;
    }
  };
  
  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "1. Select a Service";
      case 2: return "2. Pick a Date & Time";
      case 3: return "3. Your Details";
      case 4: return "4. Confirm Booking";
      default: return "";
    }
  };
  
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex items-center p-4 pb-2 justify-between">
          <button onClick={currentStep === 1 ? navigateToHome : handlePrevStep} className="text-text-light dark:text-text-dark flex size-12 shrink-0 items-center justify-center -ml-2" aria-label="Go back">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Book an Appointment</h2>
          <div className="size-12"></div>
        </div>
      </header>

      <main className="flex-grow pb-32">
        <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${i < currentStep ? 'bg-primary' : 'bg-border-light dark:bg-border-dark'}`}></div>
          ))}
        </div>

        <h1 className="text-text-light dark:text-text-dark tracking-tight text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-6">{getStepTitle()}</h1>
        
        {renderStep()}
      </main>

      <footer className="sticky bottom-20 left-0 right-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-t border-border-light dark:border-border-dark">
        <div className="px-4 py-4 sm:px-6">
            <button onClick={currentStep === 4 ? handleSubmitBooking : handleNextStep} className="w-full rounded-full bg-primary py-4 px-6 text-center text-base font-bold text-white shadow-sm hover:bg-primary/90">
                {currentStep === 4 ? 'Confirm Booking' : 'Continue'}
            </button>
        </div>
      </footer>
    </div>
  );
};


// Step 1: Service Selection
const SelectServiceStep: React.FC<{services: Service[], selectedServiceId: number | null, onSelect: (id: number) => void}> = ({ services, selectedServiceId, onSelect }) => {
    const [activeTab, setActiveTab] = useState<Service['category']>('Hair');
    const categories: Service['category'][] = ['Hair', 'Nails', 'Skin', 'Makeup'];
    const filteredServices = useMemo(() => services.filter(s => s.category === activeTab), [activeTab, services]);

    return (
        <div>
            <div className="pb-3 sticky top-[60px] z-[5] bg-background-light dark:bg-background-dark">
                <div className="flex border-b border-border-light dark:border-border-dark px-4 gap-8">
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveTab(cat)} className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${activeTab === cat ? 'border-b-primary text-text-light dark:text-text-dark' : 'border-b-transparent text-subtext-light dark:text-subtext-dark'}`}>
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">{cat}</p>
                        </button>
                    ))}
                </div>
            </div>
            {filteredServices.map(service => (
                <div key={service.id} className="px-4 py-2">
                    <div onClick={() => onSelect(service.id)} className={`flex items-center gap-4 p-4 min-h-[72px] justify-between rounded-xl border cursor-pointer ${selectedServiceId === service.id ? 'bg-primary/10 dark:bg-primary/20 border-primary' : 'bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark'}`}>
                        <div className="flex items-center gap-4 flex-1">
                            <img src={service.imageUrl} alt={service.alt} className="size-14 rounded-lg object-cover" />
                            <div className="flex flex-col justify-center">
                                <p className="text-text-light dark:text-text-dark text-base font-medium leading-normal line-clamp-1">{service.name}</p>
                                <p className="text-subtext-light dark:text-subtext-dark text-sm font-normal leading-normal line-clamp-2">{service.duration} min • R{service.price}</p>
                            </div>
                        </div>
                        <div className="shrink-0">
                             <input type="radio" checked={selectedServiceId === service.id} readOnly className="h-5 w-5 border-primary border-2 text-primary focus:ring-0 focus:ring-offset-0" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Step 2: Date & Time Selection
const SelectDateTimeStep: React.FC<{selectedDate: string, onDateChange: (date: string) => void, selectedTime: string | null, onTimeSelect: (time: string) => void, timeSlots: string[]}> = ({ selectedDate, onDateChange, selectedTime, onTimeSelect, timeSlots }) => {
    const today = new Date();
    const dates = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() + i);
        return date;
    });

    return (
        <div className="px-4">
            <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">Select Date</h3>
            <div className="flex gap-3 overflow-x-auto pb-4">
                {dates.map(date => {
                    const dateString = formatDate(date);
                    const isSelected = selectedDate === dateString;
                    return (
                        <button key={dateString} onClick={() => onDateChange(dateString)} className={`flex flex-col items-center justify-center shrink-0 w-16 h-20 rounded-xl ${isSelected ? 'bg-primary text-white' : 'bg-card-light dark:bg-card-dark'}`}>
                            <span className="text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="text-xl font-bold">{date.getDate()}</span>
                            <span className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                        </button>
                    )
                })}
            </div>
             <h3 className="text-lg font-bold text-text-light dark:text-text-dark my-4">Select Time</h3>
            <div className="grid grid-cols-3 gap-3">
                {timeSlots.map(time => {
                    const isSelected = selectedTime === time;
                    return (
                        <button key={time} onClick={() => onTimeSelect(time)} className={`p-3 rounded-lg text-center font-medium ${isSelected ? 'bg-primary text-white' : 'bg-card-light dark:bg-card-dark'}`}>
                            {time}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

// Step 3: Client Details
const ClientDetailsStep: React.FC<{details: {name: string, email: string, phone: string}, onDetailsChange: React.Dispatch<React.SetStateAction<{name: string, email: string, phone: string}>>}> = ({ details, onDetailsChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDetailsChange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form className="px-4 space-y-4">
            <input type="text" name="name" value={details.name} onChange={handleChange} placeholder="Full Name" required className="w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-3 text-text-light dark:text-text-dark" />
            <input type="email" name="email" value={details.email} onChange={handleChange} placeholder="Email Address" required className="w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-3 text-text-light dark:text-text-dark" />
            <input type="tel" name="phone" value={details.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full rounded-lg border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-3 text-text-light dark:text-text-dark" />
        </form>
    );
};

// Step 4: Confirmation
const ConfirmationStep: React.FC<{service: Service | undefined, staffName: string, date: string, time: string | null, client: {name: string, email: string, phone: string}}> = ({ service, staffName, date, time, client }) => {
    if (!service || !time) return <div className="px-4 text-center">Loading booking details...</div>;
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return (
        <div className="px-4 space-y-4">
            <p>Please review your booking details before confirming.</p>
            <div className="p-4 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark space-y-3">
                <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Service:</span> <span className="font-bold">{service.name}</span></div>
                <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Stylist:</span> <span className="font-bold">{staffName}</span></div>
                <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Date:</span> <span className="font-bold">{formattedDate}</span></div>
                <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Time:</span> <span className="font-bold">{time}</span></div>
                <div className="flex justify-between"><span className="text-text-muted-light dark:text-text-muted-dark">Name:</span> <span className="font-bold">{client.name}</span></div>
                <div className="flex justify-between items-center text-lg mt-4 pt-3 border-t border-border-light dark:border-border-dark"><span className="text-text-muted-light dark:text-text-muted-dark">Total:</span> <span className="font-bold text-primary">R{service.price.toFixed(2)}</span></div>
            </div>
        </div>
    );
};