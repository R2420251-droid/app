import React, { useState, useMemo, useEffect } from 'react';
import { GalleryItem } from './data';

interface AdminGalleryPageProps {
  navigateToDashboard: () => void;
  galleryItems: GalleryItem[];
  onAddGalleryItem: (item: Omit<GalleryItem, 'id'>, imageFile: File | null) => void;
  onUpdateGalleryItem: (item: GalleryItem, imageFile: File | null) => void;
  onDeleteGalleryItem: (itemId: number) => void;
}

const categories = ["All", "Hair", "Nails", "Makeup", "Students Work"];
const availableCategories = ["Hair", "Nails", "Makeup", "Students Work"];


const GalleryItemModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: GalleryItem | Omit<GalleryItem, 'id'>, imageFile: File | null) => void;
  item: GalleryItem | null;
}> = ({ isOpen, onClose, onSave, item }) => {
  
  const initialFormState: Omit<GalleryItem, 'id'> = {
    caption: '',
    category: 'Hair',
    imageUrl: '',
    alt: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
        setError('');
        if (item) {
            setFormData(item);
            setSelectedImageFile(null); // Clear selected file when editing existing item
        } else {
            setFormData(initialFormState);
            setSelectedImageFile(null);
        }
    }
  }, [item, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file); // Store the file object

      // For immediate preview, read as DataURL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        if (error) setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl && !selectedImageFile) { // Check both if there's no existing image and no new file
        setError("Please upload an image.");
        return;
    }
    
    const submissionData = { ...formData };
    if (!submissionData.alt) {
        submissionData.alt = submissionData.caption; // Use caption as alt text if not provided
    }
    
    if (item) {
        onSave({ ...submissionData, id: item.id }, selectedImageFile);
    } else {
        onSave(submissionData, selectedImageFile);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in">
        <h3 className="p-4 border-b border-border-light dark:border-border-dark text-lg font-bold text-text-light dark:text-text-dark">{item ? 'Edit Image' : 'Add New Image'}</h3>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Image</label>
            <div className="mt-2 flex items-center gap-x-3">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg" />
              ) : (
                <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">photo_camera</span>
                </div>
              )}
              <label htmlFor="file-upload" className="rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <span>Upload Image</span>
                <input id="file-upload" name="imageUrl" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Caption</label>
            <textarea name="caption" value={formData.caption} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary/50" rows={2} required></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Alt Text (for accessibility)</label>
            <input type="text" name="alt" value={formData.alt} onChange={handleChange} placeholder="Describe the image" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary/50">
              {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </form>
        <div className="p-4 flex justify-end gap-2 border-t border-border-light dark:border-border-dark">
            <button type="button" onClick={onClose} className="h-9 px-4 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-medium">Cancel</button>
            <button type="submit" className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
};


export const AdminGalleryPage: React.FC<AdminGalleryPageProps> = ({ navigateToDashboard, galleryItems, onAddGalleryItem, onUpdateGalleryItem, onDeleteGalleryItem }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

    const filteredGallery = useMemo(() => {
        return galleryItems
            .filter(item => activeFilter === 'All' || item.category === activeFilter)
            .filter(item => item.caption.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, activeFilter, galleryItems]);

    const handleOpenAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: GalleryItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };
    
    const handleSaveItem = (itemData: GalleryItem | Omit<GalleryItem, 'id'>) => {
        if ('id' in itemData) {
            onUpdateGalleryItem(itemData);
        } else {
            onAddGalleryItem(itemData as Omit<GalleryItem, 'id'>);
        }
        handleCloseModal();
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden text-text-light dark:text-text-dark bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
                <button onClick={navigateToDashboard} className="flex size-12 cursor-pointer items-center justify-center -ml-2 text-text-light dark:text-text-dark" aria-label="Back to Dashboard">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Gallery Management</h1>
                <div className="h-12 w-12"></div>
            </header>

            <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-primary/10 dark:bg-white/10">
                        <div className="text-primary/80 dark:text-gray-300 flex items-center justify-center pl-4">
                            <span className="material-symbols-outlined !text-2xl">search</span>
                        </div>
                        <input 
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-primary/70 dark:placeholder:text-gray-400 px-4 pl-2 text-base font-normal leading-normal" 
                            placeholder="Search by caption" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </label>
            </div>
            
            <div className="flex gap-3 p-4 pt-0 overflow-x-auto">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveFilter(cat)} className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 cursor-pointer ${activeFilter === cat ? 'bg-primary text-white' : 'bg-primary/10 dark:bg-white/10 text-text-light dark:text-text-dark'}`}>
                        <p className="text-sm font-medium leading-normal">{cat}</p>
                    </button>
                ))}
            </div>

            <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 pt-1 flex-grow">
                {filteredGallery.length > 0 ? (
                    filteredGallery.map(item => (
                        <div key={item.id} className="relative group bg-cover bg-center flex flex-col rounded-xl justify-end aspect-square" style={{ backgroundImage: `url("${item.imageUrl}")` }} role="img" aria-label={item.alt}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
                            <div className="relative p-2 flex flex-col justify-end h-full">
                                <p className="text-white text-sm font-bold leading-tight w-full line-clamp-2">{item.caption}</p>
                            </div>
                            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
                            {confirmingDeleteId === item.id ? (
                                    <div className="flex items-center gap-2 p-1 rounded-full bg-black/50 backdrop-blur-sm">
                                    <button onClick={() => { onDeleteGalleryItem(item.id); setConfirmingDeleteId(null); }} className="h-8 px-3 rounded-full bg-red-500 text-white text-xs font-bold">Confirm</button>
                                    <button onClick={() => setConfirmingDeleteId(null)} className="h-8 px-3 rounded-full bg-gray-300/80 text-black text-xs font-bold">Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                    <button onClick={() => handleOpenEditModal(item)} className="flex items-center justify-center size-9 rounded-full bg-black/50 text-white backdrop-blur-sm" aria-label="Edit image">
                                        <span className="material-symbols-outlined !text-xl pointer-events-none">edit</span>
                                    </button>
                                    <button onClick={() => setConfirmingDeleteId(item.id)} className="flex items-center justify-center size-9 rounded-full bg-red-600/70 text-white backdrop-blur-sm" aria-label="Delete image">
                                        <span className="material-symbols-outlined !text-xl pointer-events-none">delete</span>
                                    </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-4xl">photo_library</span>
                        </div>
                        <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Gallery is Empty</p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Add your first beautiful image to the gallery.</p>
                        <button onClick={handleOpenAddModal} className="mt-4 flex h-10 items-center justify-center gap-x-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90">
                            Add First Image
                        </button>
                    </div>
                )}
            </main>
            
            <div className="sticky bottom-24 right-6 flex justify-end">
                <button onClick={handleOpenAddModal} className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full shadow-lg h-14 w-14 bg-primary text-white" aria-label="Add new image">
                    <span className="material-symbols-outlined !text-3xl">add_photo_alternate</span>
                </button>
            </div>
            <GalleryItemModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              item={editingItem}
            />
        </div>
    );
};