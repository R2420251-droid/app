import React from 'react';

interface ExploreItem {
  icon: string;
  title: string;
}

const exploreItems: ExploreItem[] = [
  { icon: 'content_cut', title: 'Services' },
  { icon: 'school', title: 'Training' },
  { icon: 'storefront', title: 'Shop' },
  { icon: 'photo_library', title: 'Gallery' },
  { icon: 'info', title: 'About Us' },
];

const ExploreCard: React.FC<{ item: ExploreItem; onClick?: () => void }> = ({ item, onClick }) => (
  <div 
    className={`flex flex-1 flex-col gap-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-4 items-start ${onClick ? 'cursor-pointer hover:bg-primary/5' : ''}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : -1}
    onKeyDown={(e) => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
    aria-label={item.title}
  >
    <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
    <h2 className="text-text-light dark:text-text-dark text-base font-bold leading-tight">{item.title}</h2>
  </div>
);

interface ExploreSectionProps {
  onServicesClick: () => void;
  onTrainingClick: () => void;
  onAboutClick: () => void;
  onShopClick: () => void;
  onGalleryClick: () => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({ onServicesClick, onTrainingClick, onAboutClick, onShopClick, onGalleryClick }) => {
  const getClickHandler = (title: string) => {
    switch (title) {
      case 'Services':
        return onServicesClick;
      case 'Training':
        return onTrainingClick;
      case 'About Us':
        return onAboutClick;
      case 'Shop':
        return onShopClick;
      case 'Gallery':
        return onGalleryClick;
      default:
        return undefined;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {exploreItems.map((item) => (
        <ExploreCard 
          key={item.title} 
          item={item} 
          onClick={getClickHandler(item.title)}
        />
      ))}
    </div>
  );
};
