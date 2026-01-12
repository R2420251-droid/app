import React from 'react';
import { Service } from '../frontend/data';

interface FeaturedServicesSectionProps {
  services: Service[];
}

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <div className="flex flex-col rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
    <img className="h-40 w-full object-cover" src={service.imageUrl} alt={service.alt} />
    <div className="p-4 bg-background-light dark:bg-background-dark">
      <h3 className="font-bold text-text-light dark:text-text-dark">{service.name}</h3>
      <p className="text-sm text-text-light/70 dark:text-text-dark/70 mt-1">{service.description}</p>
    </div>
  </div>
);

export const FeaturedServicesSection: React.FC<FeaturedServicesSectionProps> = ({ services }) => {
  const featuredServices = services.slice(0, 2);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
      {featuredServices.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};
