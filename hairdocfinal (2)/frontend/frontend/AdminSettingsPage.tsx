import React, { useState, useEffect } from 'react';
import { Settings, SocialLinks, User, AdminUser } from './data';

interface AdminSettingsPageProps {
  navigateToDashboard: () => void;
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  currentUser: User | null;
  onUpdateCurrentUserProfile: (profile: { name: string; avatarUrl: string; }) => void;
  onLogout: () => void;
  allData: any;
  setters: any;
}

// Reusable Modal for editing string values
const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title: string;
  initialValue: string;
}> = ({ isOpen, onClose, onSave, title, initialValue }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg w-full max-w-sm animate-scale-in">
        <div className="p-4 border-b border-border-light dark:border-border-dark">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">{title}</h3>
        </div>
        <div className="p-4">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 text-text-light dark:text-text-dark"
          />
        </div>
        <div className="p-4 flex justify-end gap-2 border-t border-border-light dark:border-border-dark">
          <button onClick={onClose} className="h-9 px-4 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-medium">Cancel</button>
          <button onClick={handleSave} className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
};

const AdminUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: { name: string; avatarUrl: string; }) => void;
  user: User | null;
}> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState<{ name: string; avatarUrl: string; } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, avatarUrl: user.avatarUrl });
    }
  }, [user]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => prev ? { ...prev, avatarUrl: reader.result as string } : null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg w-full max-w-sm animate-scale-in">
        <div className="p-4 border-b border-border-light dark:border-border-dark">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Edit Admin Profile</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 text-text-light dark:text-text-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Avatar</label>
            <div className="mt-2 flex items-center gap-x-3">
              <img src={formData.avatarUrl} alt="Avatar" className="h-16 w-16 object-cover rounded-full" />
              <label htmlFor="avatar-upload" className="cursor-pointer rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <span>Change</span>
                <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        </div>
        <div className="p-4 flex justify-end gap-2 border-t border-border-light dark:border-border-dark">
          <button onClick={onClose} className="h-9 px-4 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-medium">Cancel</button>
          <button onClick={handleSave} className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
};


const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col gap-2">
        <h2 className="text-charcoal dark:text-gray-200 text-lg font-bold leading-tight tracking-[-0.015em] px-2">{title}</h2>
        <div className="flex flex-col gap-px overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 shadow-sm">
            {children}
        </div>
    </div>
);

const SettingsItem: React.FC<{ icon: string; title: string; subtitle?: string; action?: React.ReactNode; onClick?: () => void; iconImage?: string; }> = ({ icon, title, subtitle, action, onClick, iconImage }) => (
    <div onClick={onClick} className={`flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-[72px] py-2 justify-between ${onClick ? 'cursor-pointer' : ''}`}>
        <div className="flex items-center gap-4">
            <div className={`text-primary dark:text-primary/80 flex items-center justify-center rounded-lg bg-primary/10 shrink-0 ${subtitle ? 'size-12' : 'size-10'}`}>
                {iconImage ? <img alt={`${title} logo`} className="h-6 w-6 object-contain" src={iconImage} /> : <span className="material-symbols-outlined text-2xl">{icon}</span>}
            </div>
            <div className="flex flex-col justify-center">
                {subtitle ? <p className="text-charcoal/70 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-1">{title}</p> : null}
                <p className="text-charcoal dark:text-gray-100 text-base font-medium leading-normal line-clamp-2">{subtitle || title}</p>
            </div>
        </div>
        <div className="shrink-0">
            {action || (onClick && (
                <div className="text-charcoal/50 dark:text-gray-500 flex size-7 items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </div>
            ))}
        </div>
    </div>
);


export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ navigateToDashboard, settings, onUpdateSettings, currentUser, onUpdateCurrentUserProfile, onLogout, allData, setters }) => {
    const [localSettings, setLocalSettings] = useState<Settings>(settings);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ title: string, key: keyof Settings | `socials.${keyof SocialLinks}` | 'apiUrl', initialValue: string } | null>(null);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [syncStatus, setSyncStatus] = useState<string>('');

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSave = () => {
        onUpdateSettings(localSettings);
    };
    
    const openModal = (title: string, key: keyof Settings | `socials.${keyof SocialLinks}` | 'apiUrl', initialValue: string) => {
        setModalConfig({ title, key, initialValue });
        setIsModalOpen(true);
    };

    const handleModalSave = (value: string) => {
        if (modalConfig) {
            const keys = modalConfig.key.split('.');
            if (keys.length > 1 && keys[0] === 'socials') {
                const socialKey = keys[1] as keyof SocialLinks;
                setLocalSettings(prev => ({
                    ...prev,
                    socials: {
                        ...prev.socials,
                        [socialKey]: value
                    }
                }));
            } else {
                setLocalSettings(prev => ({ ...prev, [modalConfig.key]: value }));
            }
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'logoUrl' | 'faviconUrl') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalSettings(prev => ({ ...prev, [key]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const openAdminModal = () => {
      if (currentUser) {
        setIsAdminModalOpen(true);
      }
    };

    const handleAdminModalSave = (profile: { name: string; avatarUrl: string; }) => {
        onUpdateCurrentUserProfile(profile);
        setIsAdminModalOpen(false);
    };

    const handlePushToCloud = async () => {
        setSyncStatus('Pushing data to cloud...');
        
        const payload = {
            "hair-doc-services": allData.services,
            "hair-doc-products": allData.products,
            "hair-doc-courses": allData.courses,
            "hair-doc-bookings": allData.bookings,
            "hair-doc-enrollments": allData.enrollments,
            "hair-doc-galleryItems": allData.galleryItems,
            "hair-doc-settings": allData.settings,
            "hair-doc-orders": allData.orders,
            "hair-doc-users-v2": allData.users
        };

        try {
            const result = await api.push(payload);
            if (result.status === 'success') {
                setSyncStatus('Data successfully backed up to cloud!');
            } else {
                setSyncStatus(`Error: ${result.message}`);
            }
        } catch (error) {
            setSyncStatus(`Network Error: ${error}`);
        }
    };

    const handlePullFromCloud = async () => {
        setSyncStatus('Pulling data from cloud...');
        
        try {
            const result = await api.pull();
            
            if (result.status === 'success' && result.data) {
                const d = result.data;
                if (d['hair-doc-services']) setters.setServices(d['hair-doc-services']);
                if (d['hair-doc-products']) setters.setProducts(d['hair-doc-products']);
                if (d['hair-doc-courses']) setters.setCourses(d['hair-doc-courses']);
                if (d['hair-doc-bookings']) setters.setBookings(d['hair-doc-bookings']);
                if (d['hair-doc-enrollments']) setters.setEnrollments(d['hair-doc-enrollments']);
                if (d['hair-doc-galleryItems']) setters.setGalleryItems(d['hair-doc-galleryItems']);
                if (d['hair-doc-settings']) {
                     // Preserve local API URL if cloud is empty or different, mostly avoid breaking connection
                     const mergedSettings = { ...d['hair-doc-settings'], apiUrl: settings.apiUrl };
                     setters.setSettings(mergedSettings);
                     setLocalSettings(mergedSettings);
                }
                if (d['hair-doc-orders']) setters.setOrders(d['hair-doc-orders']);
                // Users sync skipped for now to protect admin login
                
                setSyncStatus('Local app updated from cloud database!');
            } else {
                setSyncStatus(`Error: ${result.message}`);
            }
        } catch (error) {
            setSyncStatus(`Network Error: ${error}`);
        }
    };


    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
                <button onClick={navigateToDashboard} className="flex size-12 cursor-pointer items-center justify-center -ml-2 text-text-light dark:text-text-dark" aria-label="Back to Dashboard">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Settings</h1>
                <div className="flex w-12 items-center justify-end">
                    <button onClick={handleSave} className="text-primary text-base font-bold leading-normal tracking-[0.015em] shrink-0">Save</button>
                </div>
            </header>
            <main className="flex-1 px-4 py-6 space-y-8 pb-24">
                <SettingsSection title="Database Integration (Node.js)">
                    <SettingsItem icon="cloud" title="API Endpoint URL" subtitle={localSettings.apiUrl || "Not Configured"} onClick={() => openModal('Enter Base API URL (e.g., https://your-domain.com)', 'apiUrl', localSettings.apiUrl || '')} />
                    <div className="p-4 bg-background-light dark:bg-background-dark flex flex-col gap-3">
                        <div className="flex gap-2">
                             <button onClick={handlePushToCloud} className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90">Push to Cloud</button>
                             <button onClick={handlePullFromCloud} className="flex-1 rounded-xl bg-gray-200 dark:bg-gray-700 px-4 py-3 text-sm font-bold text-text-light dark:text-text-dark hover:bg-gray-300 dark:hover:bg-gray-600">Pull from Cloud</button>
                        </div>
                        {syncStatus && <p className="text-xs text-center font-medium text-text-muted-light dark:text-text-muted-dark">{syncStatus}</p>}
                    </div>
                </SettingsSection>

                <SettingsSection title="General">
                    <SettingsItem icon="storefront" title="Salon Name" subtitle={localSettings.salonName} onClick={() => openModal('Edit Salon Name', 'salonName', localSettings.salonName)} />
                    <SettingsItem 
                        icon="image" 
                        title="Site Logo" 
                        iconImage={localSettings.logoUrl || undefined}
                        action={
                            <>
                                <input type="file" id="logo-upload" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, 'logoUrl')} />
                                <label htmlFor="logo-upload" className="text-primary text-base font-medium leading-normal cursor-pointer">Change</label>
                            </>
                        } 
                    />
                    <SettingsItem 
                        icon="favorite" 
                        title="Favicon" 
                        iconImage={localSettings.faviconUrl || undefined}
                        action={
                             <>
                                <input type="file" id="favicon-upload" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, 'faviconUrl')} />
                                <label htmlFor="favicon-upload" className="text-primary text-base font-medium leading-normal cursor-pointer">Change</label>
                            </>
                        } 
                    />
                    <SettingsItem icon="construction" title="Maintenance Mode" action={
                        <div className="relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full">
                            <input 
                                id="maintenance-toggle" 
                                type="checkbox" 
                                className="peer sr-only" 
                                checked={localSettings.maintenanceMode}
                                onChange={(e) => setLocalSettings(prev => ({...prev, maintenanceMode: e.target.checked}))}
                            />
                            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700"></div>
                        </div>
                    } />
                </SettingsSection>
                <SettingsSection title="Contact & Location">
                    <SettingsItem icon="call" title="Primary Phone" subtitle={localSettings.primaryPhone} onClick={() => openModal('Edit Primary Phone', 'primaryPhone', localSettings.primaryPhone)} />
                    <SettingsItem icon="mail" title="Booking Email" subtitle={localSettings.bookingEmail} onClick={() => openModal('Edit Booking Email', 'bookingEmail', localSettings.bookingEmail)} />
                    <SettingsItem icon="location_on" title="Physical Address" subtitle={localSettings.address} onClick={() => openModal('Edit Address', 'address', localSettings.address)} />
                </SettingsSection>
                <SettingsSection title="Social Media">
                    <SettingsItem icon="" title="Instagram" subtitle={localSettings.socials.instagram} iconImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBtl33Fe5Zg8WQvpTSE_hp7LfnHe4hf_WzNzmSCtmISpzjPJ-WoCBquLsz1nFGCr2yvIJ-2Mg6ZXbQb61Wdq2ADAXlwWOOAlWG_2vo1cmu9rG65xnWIHGef7G0t-oL1mawZB1fUf0DJAD5JMBGN0aJikzEKhkN8m_dEQilXrc4yVjzxIujb1dhtTI6i9Use-5sBbJlrZidt5mVTFqm7GGLfRYR-2BRRSMIuQzmvtFR-ahkJcWMJt7xd8V0QR06QW00R_2STqGG3l9d3" onClick={() => openModal('Instagram URL', 'socials.instagram', localSettings.socials.instagram)} />
                    <SettingsItem icon="" title="X (Twitter)" subtitle={localSettings.socials.twitter} iconImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAGFojwMRzLpzAVnzI0ztRc1W25vjhkJprHGsL0y1G0ISuEPfnEzYE0uMJLDcU6buiuvNDLlNjhfOsQJc9iI01Dhat4Q5Y7oVRI8EQdMEnLaKzJueeDWb4lTpQs-WhsrPwZNXDsXYDKAnNE3eiTxMRN6aR-K63Aj-Fso-fEcGzSqLq_Sufg5ffLa1cLhwjGtGSVG_PXZ5Q4Rnk-UHgBDMKb47b4xuSLbgtwTzZgxk_26ldR8o4pSN9djK5r4KWiEDBY6Q-9KUj7eLI6" onClick={() => openModal('Twitter URL', 'socials.twitter', localSettings.socials.twitter)} />
                    <SettingsItem icon="" title="Facebook" subtitle={localSettings.socials.facebook} iconImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDdnY3y7siPi-PXIrFt9D-ugDaD27437KpdcsJD5iQ0UIEztpwmTMbQ8ny02dA8Qq-OHuE87RTl3MyMuXNDn5-wwMf_Z3B6vchDkP7mlJQoteNwhNMv9JyeH161OYf8Bre9h1_QbpyUZ_qD2yYYsEXg2E-YGTAycyrHhBdnm1wTfHxgrZFHwthiBx1NY75XNACCnAviYhC28W3crl-IIRj66obD57XUj4CwzMoNlznfsFah9eqfN3sd8iGOQt114g-TQI4c0KV8ve8i" onClick={() => openModal('Facebook URL', 'socials.facebook', localSettings.socials.facebook)} />
                </SettingsSection>
                <SettingsSection title="Admin Profile">
                    {currentUser && (
                        <div onClick={openAdminModal} className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-[72px] py-2 justify-between cursor-pointer">
                            <div className="flex items-center gap-4">
                                <img className="shrink-0 size-12 rounded-full object-cover" alt={`Portrait of ${currentUser.name}`} src={currentUser.avatarUrl}/>
                                <div className="flex flex-col justify-center">
                                    <p className="text-charcoal dark:text-gray-100 text-base font-medium leading-normal line-clamp-1">{currentUser.name}</p>
                                    <p className="text-charcoal/70 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">{currentUser.role}</p>
                                </div>
                            </div>
                            <div className="shrink-0 text-charcoal/50 dark:text-gray-500 flex size-7 items-center justify-center"><span className="material-symbols-outlined text-2xl">chevron_right</span></div>
                        </div>
                    )}
                </SettingsSection>
                <SettingsSection title="Account">
                    <SettingsItem icon="logout" title="Logout" onClick={onLogout} />
                </SettingsSection>
            </main>
            {isModalOpen && modalConfig && (
                <EditModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleModalSave}
                    title={modalConfig.title}
                    initialValue={modalConfig.initialValue}
                />
            )}
            {currentUser && (
                <AdminUserModal
                    isOpen={isAdminModalOpen}
                    onClose={() => setIsAdminModalOpen(false)}
                    onSave={handleAdminModalSave}
                    user={currentUser}
                />
            )}
        </div>
    );
};