import React from 'react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigateToHome: () => void;
  navigateToServices: () => void;
  navigateToTraining: () => void;
  navigateToShop: () => void;
  navigateToGallery: () => void;
  navigateToAbout: () => void;
  navigateToContact: () => void;
  navigateToSuccessStories: () => void;
  navigateToBook: () => void;
  navigateToAccount: () => void;
}

const menuItems = [
  { label: 'Home', icon: 'home', page: 'home' },
  { label: 'Services', icon: 'content_cut', page: 'services' },
  { label: 'Training', icon: 'school', page: 'training' },
  { label: 'Shop', icon: 'storefront', page: 'shop' },
  { label: 'Gallery', icon: 'photo_library', page: 'gallery' },
  { label: 'About Us', icon: 'info', page: 'about' },
  { label: 'Contact Us', icon: 'contact_support', page: 'contact' },
  { label: 'Testimonials', icon: 'reviews', page: 'success-stories' },
];

const NavLink: React.FC<{ label: string; icon: string; onClick: () => void; style?: React.CSSProperties; }> = ({ label, icon, onClick, style }) => (
  <button onClick={onClick} style={style} className="flex items-center gap-4 p-4 text-left w-full hover:bg-primary/10 rounded-lg transition-colors duration-200 animate-fade-in-left opacity-0">
    <span className="material-symbols-outlined text-primary">{icon}</span>
    <span className="text-text-light dark:text-text-dark font-medium">{label}</span>
  </button>
);

export const SideMenu: React.FC<SideMenuProps> = ({ 
    isOpen, 
    onClose,
    navigateToHome,
    navigateToServices,
    navigateToTraining,
    navigateToShop,
    navigateToGallery,
    navigateToAbout,
    navigateToContact,
    navigateToSuccessStories,
    navigateToBook,
    navigateToAccount
}) => {
  const handleNavigation = (navigate: () => void) => {
    navigate();
    onClose();
  };
  
  const getClickHandler = (page: string) => {
      switch(page) {
          case 'home': return () => handleNavigation(navigateToHome);
          case 'services': return () => handleNavigation(navigateToServices);
          case 'training': return () => handleNavigation(navigateToTraining);
          case 'shop': return () => handleNavigation(navigateToShop);
          case 'gallery': return () => handleNavigation(navigateToGallery);
          case 'about': return () => handleNavigation(navigateToAbout);
          case 'contact': return () => handleNavigation(navigateToContact);
          case 'success-stories': return () => handleNavigation(navigateToSuccessStories);
          default: return () => {};
      }
  };

  return (
    <div 
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-background-light dark:bg-card-dark shadow-xl p-6 flex flex-col gap-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark pb-4">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Hair Doc</h2>
          <button onClick={onClose} className="text-text-light dark:text-text-dark" aria-label="Close menu">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav className="flex flex-col gap-2">
            {isOpen && menuItems.map((item, index) => (
                <NavLink 
                  key={item.label} 
                  label={item.label} 
                  icon={item.icon} 
                  onClick={getClickHandler(item.page)} 
                  style={{ animationDelay: `${index * 50}ms` }}
                />
            ))}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t border-border-light dark:border-border-dark pt-6">
            <button onClick={() => handleNavigation(navigateToBook)} className="flex w-full items-center justify-center rounded-full bg-primary h-12 px-6 text-white font-bold shadow-md hover:bg-primary/90 transition-colors">
                Book an Appointment
            </button>
            <button onClick={() => handleNavigation(navigateToAccount)} className="flex w-full items-center justify-center rounded-full bg-primary/20 h-12 px-6 text-primary font-bold hover:bg-primary/30 transition-colors">
                My Account
            </button>
        </div>
      </div>
    </div>
  );
};