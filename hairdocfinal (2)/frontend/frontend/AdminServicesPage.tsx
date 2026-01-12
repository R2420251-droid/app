import React, { useState, useMemo, useEffect } from 'react';
import { Service } from './data';

interface AdminServicesPageProps {
  navigateToDashboard: () => void;
  services: Service[];
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: number) => void;
}

const ServiceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service | Omit<Service, 'id'>) => void;
  service: Service | null;
}> = ({ isOpen, onClose, onSave, service }) => {
  
  const initialFormState = {
    name: '',
    category: 'Hair' as Service['category'],
    description: '',
    duration: 0,
    price: 0,
    imageUrl: '',
    alt: '',
  };

  const [formData, setFormData] = useState<Omit<Service, 'id'>>(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if (service) {
        setFormData(service);
      } else {
        setFormData(initialFormState);
      }
    }
  }, [service, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'duration' || name === 'price' ? Number(value) : value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (service) {
      onSave({ ...formData, id: service.id });
    } else {
      onSave(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in">
        <div className="p-4 border-b border-border-light dark:border-border-dark">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{service ? 'Edit Service' : 'Add New Service'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2">
              <option value="Hair">Hair</option>
              <option value="Nails">Nails</option>
              <option value="Skin">Skin</option>
              <option value="Makeup">Makeup</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" rows={3}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Duration (minutes)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Price (R)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Image</label>
            <div className="mt-2 flex items-center gap-x-3">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Service" className="h-16 w-16 object-cover rounded-lg" />
              ) : (
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">photo_camera</span>
                </div>
              )}
              <label htmlFor="file-upload" className="rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <span>Change</span>
                <input id="file-upload" name="imageUrl" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Image Alt Text</label>
            <input type="text" name="alt" value={formData.alt} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" />
          </div>
        </form>
        <div className="p-4 flex justify-end gap-2 border-t border-border-light dark:border-border-dark">
            <button onClick={onClose} className="h-9 px-4 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-medium">Cancel</button>
            <button onClick={handleSubmit} type="submit" className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
};


export const AdminServicesPage: React.FC<AdminServicesPageProps> = ({ navigateToDashboard, services, onAddService, onUpdateService, onDeleteService }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  const handleOpenAddModal = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSaveService = (serviceData: Service | Omit<Service, 'id'>) => {
    if ('id' in serviceData) {
      onUpdateService(serviceData as Service);
    } else {
      onAddService(serviceData as Omit<Service, 'id'>);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, services]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <button onClick={navigateToDashboard} className="flex size-12 cursor-pointer items-center justify-center -ml-2 text-text-light dark:text-text-dark" aria-label="Back to Dashboard">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Services Management</h1>
        <div className="h-12 w-12"></div>
      </header>

      <div className="px-4 py-3 bg-background-light dark:bg-background-dark sticky top-[64px] z-10">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm bg-card-light dark:bg-card-dark">
            <div className="flex items-center justify-center pl-4 text-text-muted-light dark:text-text-muted-dark">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl border-none bg-transparent h-full px-4 pl-2 text-base font-normal leading-normal placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50" 
              placeholder="Search services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      <main className="flex flex-col gap-4 p-4">
        {filteredServices.length > 0 ? (
          filteredServices.map(service => (
            <div key={service.id} className="flex items-center gap-4 rounded-xl bg-card-light dark:bg-card-dark p-4 shadow-sm">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[70px] shrink-0" 
                style={{ backgroundImage: `url("${service.imageUrl}")` }}
                role="img"
                aria-label={service.alt}
              ></div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-base font-medium leading-normal text-text-light dark:text-text-dark">{service.name}</p>
                <p className="text-sm font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">Duration: {service.duration} min</p>
                <p className="text-sm font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">Price: R{service.price}</p>
              </div>
              <div className="flex items-center gap-2">
                {confirmingDeleteId === service.id ? (
                  <>
                    <button onClick={() => { onDeleteService(service.id); setConfirmingDeleteId(null); }} className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm font-bold">Confirm</button>
                    <button onClick={() => setConfirmingDeleteId(null)} className="h-10 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-bold">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleOpenEditModal(service)} className="flex items-center justify-center size-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors" aria-label="Edit service">
                      <span className="material-symbols-outlined text-xl pointer-events-none">edit</span>
                    </button>
                    <button onClick={() => setConfirmingDeleteId(service.id)} className="flex items-center justify-center size-10 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors" aria-label="Delete service">
                      <span className="material-symbols-outlined text-xl pointer-events-none">delete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-4xl">cut</span>
            </div>
            <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">No Services Yet</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Get started by adding your first service.</p>
            <button onClick={handleOpenAddModal} className="mt-4 flex h-10 items-center justify-center gap-x-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90">
                Add First Service
            </button>
          </div>
        )}
      </main>

      <div className="fixed bottom-24 right-6 z-20">
        <button onClick={handleOpenAddModal} className="flex items-center justify-center size-14 rounded-full bg-primary text-white shadow-lg" aria-label="Add new service">
          <span className="material-symbols-outlined !text-3xl">add</span>
        </button>
      </div>
      
      <ServiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
        service={editingService}
      />
    </div>
  );
};