import React, { useState } from 'react';
import { Service } from './data';

// Interfaces
interface ServicesPageProps {
  navigateToHome: () => void;
  navigateToBook: () => void;
  services: Service[];
}

const categories = ['All', 'Hair', 'Nails', 'Skin', 'Makeup'];


// Components
const ServicesTopAppBar: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4 pt-4 pb-2 justify-between">
    <button onClick={onBack} className="flex size-12 shrink-0 items-center justify-center text-text-light dark:text-text-dark" aria-label="Go back">
      <span className="material-symbols-outlined text-2xl">arrow_back</span>
    </button>
    <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Our Services</h1>
    <div className="flex size-12 shrink-0 items-center justify-center"></div>
  </header>
);

const FilterChips: React.FC<{ activeFilter: string; onFilterChange: (filter: string) => void }> = ({ activeFilter, onFilterChange }) => (
  <nav className="sticky top-[72px] z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
    <div className="flex gap-3 px-4 py-3 overflow-x-auto whitespace-nowrap">
      {categories.map(category => (
        <button
          key={category} 
          onClick={() => onFilterChange(category)}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-sm font-medium leading-normal ${
            activeFilter === category 
              ? 'bg-primary text-white' 
              : 'bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  </nav>
);

const ServiceCard: React.FC<{ service: Service; onBook: () => void; style?: React.CSSProperties }> = ({ service, onBook, style }) => (
  <section style={style} className="p-4 @container bg-card-light dark:bg-card-dark rounded-xl shadow-sm animate-fade-in-up">
    <div className="flex flex-col items-stretch justify-start">
      <div 
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" 
        role="img"
        aria-label={service.alt}
        style={{ backgroundImage: `url("${service.imageUrl}")` }}
      ></div>
      <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 py-4">
        <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">{service.name}</h2>
        <div className="flex items-end gap-3 justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal">{service.description}</p>
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal">🕒 {service.duration} min • R{service.price}</p>
          </div>
          <button onClick={onBook} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-medium leading-normal shadow-md">
            <span className="truncate">Book Now</span>
          </button>
        </div>
      </div>
    </div>
  </section>
);


// Page Component
export const ServicesPage: React.FC<ServicesPageProps> = ({ navigateToHome, navigateToBook, services }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredServices = activeFilter === 'All'
    ? services
    : services.filter(service => service.category === activeFilter);
  
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <ServicesTopAppBar onBack={navigateToHome} />
      <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <main className="flex flex-col gap-4 p-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onBook={navigateToBook} 
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))
        ) : (
          <div className="text-center py-10 text-text-light-secondary dark:text-text-dark-secondary">
            No services available in this category.
          </div>
        )}
      </main>
    </div>
  );
};