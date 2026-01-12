import React, { useEffect, useState } from 'react';
import { Settings } from './data';

declare const L: any; // Declare Leaflet global

interface ContactPageProps {
  navigateToHome: () => void;
  settings: Settings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigateToHome, settings }) => {
  const [formState, setFormState] = useState({ fullName: '', email: '', message: '' });

  useEffect(() => {
    let map: any;
    try {
      const position: [number, number] = [-25.7479, 28.2293]; // Pretoria coordinates
      map = L.map('map').setView(position, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker(position).addTo(map)
        .bindPopup(`<b>${settings.salonName}</b><br>Pretoria, South Africa.`)
        .openPopup();
    } catch (e) {
      console.error("Failed to initialize Leaflet map:", e);
    }
    
    // Cleanup function to remove the map instance when the component unmounts
    return () => {
        if (map) {
            map.remove();
        }
    };
  }, [settings.salonName]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, message } = formState;
    if (!fullName || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }

    const whatsAppNumber = settings.primaryPhone.replace(/\D/g, '');
    let whatsappMessage = `*New Contact Form Message*\n\n`;
    whatsappMessage += `*Name:* ${fullName}\n`;
    whatsappMessage += `*Email:* ${email}\n\n`;
    whatsappMessage += `*Message:*\n${message}`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const url = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* TopAppBar */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark/20">
        <button onClick={navigateToHome} className="flex size-10 shrink-0 items-center justify-center text-text-light-primary dark:text-dark-primary" aria-label="Go back">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-text-light-primary dark:text-dark-primary">Contact Us</h1>
        <div className="size-10 shrink-0"></div> {/* Spacer */}
      </header>

      <main className="flex flex-col gap-8 p-4 flex-1">
        {/* Get in Touch Section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:text-dark-primary">Get in Touch</h2>
          <div className="flex flex-col bg-white dark:bg-background-dark/50 rounded-xl divide-y divide-border-light dark:divide-border-dark/50 shadow-sm">
            {/* Address ListItem */}
            <div className="flex items-center gap-4 p-4 min-h-14">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 text-text-light-primary dark:text-dark-primary">{settings.address}</p>
            </div>
            {/* Phone ListItem */}
            <div className="flex items-center gap-4 p-4 min-h-14">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-outlined">call</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate text-text-light-primary dark:text-dark-primary">{settings.primaryPhone}</p>
            </div>
            {/* Email ListItem */}
            <div className="flex items-center gap-4 p-4 min-h-14">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate text-text-light-primary dark:text-dark-primary">{settings.bookingEmail}</p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:text-dark-primary">Our Location</h2>
          <div id="map" className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:text-dark-primary">Send Us a Message</h2>
          <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
            <input name="fullName" value={formState.fullName} onChange={handleFormChange} className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark/50 p-3 text-text-light-primary dark:text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-dark-secondary focus:border-primary focus:ring-primary" placeholder="Full Name" type="text" required />
            <input name="email" value={formState.email} onChange={handleFormChange} className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark/50 p-3 text-text-light-primary dark:text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-dark-secondary focus:border-primary focus:ring-primary" placeholder="Email Address" type="email" required />
            <textarea name="message" value={formState.message} onChange={handleFormChange} className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark/50 p-3 text-text-light-primary dark:text-dark-primary placeholder:text-text-light-secondary dark:placeholder:text-dark-secondary focus:border-primary focus:ring-primary" placeholder="Your Message..." rows={4} required></textarea>
            <button className="w-full rounded-lg bg-primary py-3.5 text-base font-bold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]" type="submit">Send Message</button>
          </form>
        </section>
      </main>

      <footer className="bg-background-light dark:bg-background-dark py-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-text-light-primary dark:text-dark-primary text-center">Follow Us</h2>
          <div className="flex items-center justify-center gap-4">
            <a className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white" aria-label="Instagram" href={settings.socials.instagram} target="_blank" rel="noopener noreferrer">
              <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
            <a className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white" aria-label="Facebook" href={settings.socials.facebook} target="_blank" rel="noopener noreferrer">
              <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white" aria-label="Twitter" href={settings.socials.twitter} target="_blank" rel="noopener noreferrer">
              <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
          </div>
        </section>
      </footer>
    </div>
  );
};