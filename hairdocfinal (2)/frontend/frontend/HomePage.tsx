import React from 'react';
import { TopAppBar } from '../components/TopAppBar';
import { HeaderImage } from '../components/HeaderImage';
import { ButtonGroup } from '../components/ButtonGroup';
import { SectionHeader } from '../components/SectionHeader';
import { ExploreSection } from '../components/ExploreSection';
import { FeaturedServicesSection } from '../components/FeaturedServicesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { Service, User } from './data';

interface HomePageProps {
  currentUser: User | null;
  onMenuClick: () => void;
  navigateToServices: () => void;
  navigateToTraining: () => void;
  navigateToAbout: () => void;
  navigateToContact: () => void;
  navigateToShop: () => void;
  navigateToSuccessStories: () => void;
  navigateToBook: () => void;
  navigateToAccount: () => void;
  navigateToGallery: () => void;
  services: Service[];
}

export const HomePage: React.FC<HomePageProps> = ({ currentUser, onMenuClick, navigateToServices, navigateToTraining, navigateToAbout, navigateToContact, navigateToShop, navigateToSuccessStories, navigateToBook, navigateToAccount, navigateToGallery, services }) => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <TopAppBar currentUser={currentUser} onMenuClick={onMenuClick} onAccountClick={navigateToAccount} />
      <HeaderImage />
      <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <ButtonGroup 
          onBookServiceClick={navigateToBook}
          onEnrollTrainingClick={navigateToTraining}
        />
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <SectionHeader title="Explore Hair Doc" />
        <ExploreSection 
          onServicesClick={navigateToServices} 
          onTrainingClick={navigateToTraining} 
          onAboutClick={navigateToAbout}
          onShopClick={navigateToShop}
          onGalleryClick={navigateToGallery}
        />
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <SectionHeader title="Featured Services" />
        <FeaturedServicesSection services={services} />
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <SectionHeader title="What Our Clients Say" />
        <TestimonialsSection onClick={navigateToSuccessStories} />
      </div>
      <div className="h-10 bg-background-light dark:bg-background-dark"></div>
    </div>
  );
};