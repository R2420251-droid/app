import React, { useState, useMemo } from 'react';
import { GalleryItem } from './data';

interface GalleryPageProps {
  navigateToHome: () => void;
  galleryItems: GalleryItem[];
}

const categories = ["All", "Hair", "Nails", "Makeup", "Students Work"];

const Lightbox: React.FC<{ item: GalleryItem; onClose: () => void; }> = ({ item, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
    >
      <div className="relative max-w-3xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={item.imageUrl} alt={item.alt} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
        <p className="text-white text-center mt-4">{item.caption}</p>
        <button onClick={onClose} className="absolute -top-4 -right-4 flex items-center justify-center size-10 rounded-full bg-white/20 text-white backdrop-blur-sm" aria-label="Close image viewer">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};


export const GalleryPage: React.FC<GalleryPageProps> = ({ navigateToHome, galleryItems }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return galleryItems;
    return galleryItems.filter(item => item.category === activeFilter);
  }, [activeFilter, galleryItems]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4 pt-4 pb-2 justify-between">
        <button onClick={navigateToHome} className="flex size-12 shrink-0 items-center justify-center text-text-light dark:text-text-dark" aria-label="Go back">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Our Gallery</h1>
        <div className="flex size-12 shrink-0 items-center justify-center"></div>
      </header>

      <nav className="sticky top-[72px] z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="flex gap-3 px-4 py-3 overflow-x-auto whitespace-nowrap">
          {categories.map(category => (
            <button
              key={category} 
              onClick={() => setActiveFilter(category)}
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

      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4">
        {filteredItems.map((item, index) => (
          <div 
            key={item.id} 
            className="group relative cursor-pointer overflow-hidden rounded-xl aspect-square animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setSelectedImage(item)}
          >
            <img src={item.imageUrl} alt={item.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold leading-tight line-clamp-2">{item.caption}</p>
          </div>
        ))}
      </main>

      {filteredItems.length === 0 && (
        <div className="text-center py-10 text-text-light-secondary dark:text-text-dark-secondary">
          <p className="font-bold">No images to display</p>
          <p className="text-sm">Check back later for beautiful photos!</p>
        </div>
      )}

      {selectedImage && (
        <Lightbox item={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};