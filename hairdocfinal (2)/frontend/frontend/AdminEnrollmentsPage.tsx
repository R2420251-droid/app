import React, { useState, useMemo, useEffect } from 'react';
import { Enrollment, EnrollmentStatus, Course } from './data'; // Import Course

interface AdminEnrollmentsPageProps {
    navigateToDashboard: () => void;
    enrollments: Enrollment[];
    onAddEnrollment: (details: { name: string; email: string; phone: string; avatarUrl?: string; course: string }) => void;
    onUpdateEnrollment: (enrollment: Enrollment) => void;
    onDeleteEnrollment: (id: number) => void;
    courses: Course[]; // For selecting course in modal
}

const StatusBadge: React.FC<{ status: EnrollmentStatus }> = ({ status }) => {
    const styles: Record<EnrollmentStatus, string> = {
        Approved: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
        Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
        Declined: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    };
    return (
        <div className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 ${styles[status]}`}>
            <p className="text-xs font-medium">{status}</p>
        </div>
    );
};

// New EnrollmentModal Component
const EnrollmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: { name: string; email: string; phone: string; avatarUrl?: string; course: string }) => void;
  courses: Course[];
}> = ({ isOpen, onClose, onSave, courses }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        avatarUrl: '',
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, avatarUrl: formData.avatarUrl || undefined });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in">
        <div className="p-4 border-b border-border-light dark:border-border-dark">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">Add New Enrollment</h3>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Course</label>
            <select name="course" value={formData.course} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required>
              <option value="">Select a Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Avatar (Optional)</label>
            <div className="mt-2 flex items-center gap-x-3">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar Preview" className="h-16 w-16 object-cover rounded-full" />
              ) : (
                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">person</span>
                </div>
              )}
              <label htmlFor="avatar-upload" className="cursor-pointer rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <span>Upload</span>
                <input id="avatar-upload" name="avatarUrl" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        </form>
        <div className="p-4 flex justify-end gap-2 border-t border-border-light dark:border-border-dark">
            <button type="button" onClick={onClose} className="h-9 px-4 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-medium">Cancel</button>
            <button type="submit" onClick={handleSubmit} className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
};


export const AdminEnrollmentsPage: React.FC<AdminEnrollmentsPageProps> = ({ navigateToDashboard, enrollments, onUpdateEnrollment, onDeleteEnrollment, courses, onAddEnrollment }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<EnrollmentStatus | 'All'>('Pending');
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false); // State for the new enrollment modal

    const filteredEnrollments = useMemo(() => {
        return enrollments
            .filter(e => activeFilter === 'All' || e.status === activeFilter)
            .filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.course.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, activeFilter, enrollments]);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
                <button onClick={navigateToDashboard} className="flex size-12 cursor-pointer items-center justify-center -ml-2 text-text-light dark:text-text-dark" aria-label="Back to Dashboard">
                    <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold tracking-tight text-text-light dark:text-text-dark">Enrollments</h1>
                <div className="h-12 w-12 flex items-center justify-end">
                    <button onClick={() => setIsEnrollmentModalOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95" aria-label="Add new enrollment">
                        <span className="material-symbols-outlined !text-3xl">add</span>
                    </button>
                </div>
            </header>
            
            <div className="px-4 py-3">
                <label className="flex h-12 min-w-40 w-full flex-col">
                    <div className="flex h-full w-full flex-1 items-stretch rounded-xl bg-primary/20 dark:bg-primary/30">
                        <div className="flex items-center justify-center rounded-l-xl pl-4 text-primary dark:text-pink-300">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input className="form-input h-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl border-none bg-transparent px-4 text-base font-normal leading-normal text-text-light dark:text-text-dark placeholder:text-primary/70 focus:outline-none focus:ring-0 dark:placeholder:text-pink-300/70" 
                            placeholder="Search by name or course" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </label>
            </div>

            <div className="px-4 py-3">
                <div className="flex h-10 flex-1 items-center justify-center rounded-xl bg-primary/20 p-1 dark:bg-primary/30">
                    {(['Pending', 'Approved', 'Declined', 'All'] as const).map(status => (
                        <label key={status} className="flex h-full grow cursor-pointer items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal text-primary/80 has-[:checked]:bg-background-light has-[:checked]:text-primary has-[:checked]:shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:text-pink-300/80 dark:has-[:checked]:bg-background-dark dark:has-[:checked]:text-pink-200">
                            <span className="truncate">{status}</span>
                            <input 
                                checked={activeFilter === status} 
                                onChange={() => setActiveFilter(status)}
                                className="invisible w-0" 
                                name="enrollment-status" 
                                type="radio" 
                                value={status}
                            />
                        </label>
                    ))}
                </div>
            </div>

            <main className="flex flex-col gap-4 p-4">
                {filteredEnrollments.map(enrollment => (
                    <div key={enrollment.id} className="flex flex-col gap-4 rounded-xl bg-card-light dark:bg-card-dark p-4 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="aspect-square h-[60px] w-[60px] shrink-0 rounded-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${enrollment.avatarUrl}')` }} role="img" aria-label={enrollment.alt}></div>
                            <div className="flex flex-1 flex-col justify-center">
                                <p className="text-base font-medium text-text-light dark:text-text-dark">{enrollment.name}</p>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{enrollment.course}</p>
                                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Submitted: {enrollment.submitted}</p>
                            </div>
                            <div className="flex flex-col items-end justify-start gap-1.5 self-start">
                                <StatusBadge status={enrollment.status} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-border-light dark:border-border-dark">
                            {confirmingDeleteId === enrollment.id ? (
                                 <>
                                    <button onClick={() => { onDeleteEnrollment(enrollment.id); setConfirmingDeleteId(null); }} className="h-9 px-4 rounded-full bg-red-500 text-white text-sm font-medium">Confirm Delete</button>
                                    <button onClick={() => setConfirmingDeleteId(null)} className="h-9 px-4 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-medium">Cancel</button>
                                </>
                            ) : (
                                <>
                                    {enrollment.status === 'Pending' && (
                                        <>
                                            <button
                                                onClick={() => onUpdateEnrollment({ ...enrollment, status: 'Declined' })}
                                                className="h-9 px-4 rounded-full bg-red-500/10 text-red-500 text-sm font-medium"
                                            >
                                                Decline
                                            </button>
                                            <button
                                                onClick={() => onUpdateEnrollment({ ...enrollment, status: 'Approved' })}
                                                className="h-9 px-4 rounded-full bg-green-500/10 text-green-600 text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                        </>
                                    )}
                                     <button
                                        onClick={() => setConfirmingDeleteId(enrollment.id)}
                                        className="flex items-center justify-center size-9 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                                        aria-label="Delete enrollment"
                                    >
                                        <span className="material-symbols-outlined text-xl pointer-events-none">delete</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </main>
            
            <div className="fixed bottom-6 right-6">
                <button onClick={() => setIsEnrollmentModalOpen(true)} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform active:scale-95" aria-label="Add new enrollment">
                    <span className="material-symbols-outlined !text-3xl">add</span>
                </button>
            </div>

            {/* Enrollment Modal */}
            <EnrollmentModal
                isOpen={isEnrollmentModalOpen}
                onClose={() => setIsEnrollmentModalOpen(false)}
                onSave={onAddEnrollment}
                courses={courses}
            />
        </div>
    );
};