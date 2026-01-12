import React, { useState, useMemo, useEffect } from 'react';
import { Course } from './data';

interface AdminTrainingPageProps {
  navigateToDashboard: () => void;
  courses: Course[];
  onAddCourse: (course: Omit<Course, 'id'>) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (id: number) => void;
}

const CourseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course | Omit<Course, 'id'>) => void;
  course: Course | null;
}> = ({ isOpen, onClose, onSave, course }) => {

  const initialFormState: Omit<Course, 'id'> = {
    title: '',
    category: 'Hair',
    description: '',
    duration: '',
    price: 0,
    prerequisites: '',
    imageUrl: '',
    alt: '',
  };

  const [formData, setFormData] = useState<Omit<Course, 'id'>>(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if (course) {
        setFormData(course);
      } else {
        setFormData(initialFormState);
      }
    }
  }, [course, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
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
    if (course) {
      onSave({ ...formData, id: course.id });
    } else {
      onSave(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col animate-scale-in">
        <h3 className="p-4 border-b border-border-light dark:border-border-dark text-lg font-bold text-text-light dark:text-text-dark">{course ? 'Edit Course' : 'Add New Course'}</h3>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2">
            <option value="Hair">Hair</option>
            <option value="Makeup">Makeup</option>
            <option value="Nails">Nails</option>
            <option value="Skincare">Skincare</option>
          </select>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" rows={3}></textarea>
          <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (e.g., 4 Weeks)" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          <input type="text" name="prerequisites" value={formData.prerequisites} onChange={handleChange} placeholder="Prerequisites" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" required />
          <div className="mt-2 flex items-center gap-x-3">
            {formData.imageUrl ? <img src={formData.imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg" /> : <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-gray-400">photo_camera</span></div>}
            <label htmlFor="file-upload" className="cursor-pointer rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <span>Upload</span>
              <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          <input type="text" name="alt" value={formData.alt} onChange={handleChange} placeholder="Image Alt Text" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2" />
        </form>
        <div className="p-4 flex justify-end gap-2 border-t border-border-light dark:border-border-dark">
          <button type="button" onClick={onClose} className="h-9 px-4 rounded-full bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-medium">Cancel</button>
          <button type="submit" className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium">Save</button>
        </div>
      </div>
    </div>
  );
};


export const AdminTrainingPage: React.FC<AdminTrainingPageProps> = ({ navigateToDashboard, courses, onAddCourse, onUpdateCourse, onDeleteCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleSave = (courseData: Course | Omit<Course, 'id'>) => {
    if ('id' in courseData) {
      onUpdateCourse(courseData);
    } else {
      onAddCourse(courseData);
    }
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, courses]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background-light/80 dark:bg-background-dark/80 px-4 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <button onClick={navigateToDashboard} className="flex size-12 cursor-pointer items-center justify-center -ml-2 text-text-light dark:text-text-dark" aria-label="Back to Dashboard">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-text-light dark:text-text-dark">Training Courses</h1>
        <div className="h-12 w-12"></div>
      </header>
      
      <main className="flex-1 px-4 pb-28 pt-2">
      {filteredCourses.length > 0 ? (
        filteredCourses.map(course => (
          <div key={course.id} className="mb-4 flex items-center gap-4 rounded-xl bg-card-light dark:bg-card-dark p-4 shadow-sm">
            <div className="w-24 shrink-0 bg-center bg-no-repeat bg-cover rounded-lg aspect-video" style={{ backgroundImage: `url("${course.imageUrl}")` }} role="img" aria-label={course.alt}></div>
            <div className="flex flex-col gap-1 flex-1">
                <p className="text-base font-bold leading-tight text-text-light dark:text-text-dark">{course.title}</p>
                <p className="text-sm font-normal text-text-muted-light dark:text-text-muted-dark">{course.duration} • R{course.price}</p>
            </div>
            <div className="flex items-center gap-2">
                {confirmingDeleteId === course.id ? (
                  <>
                    <button onClick={() => { onDeleteCourse(course.id); setConfirmingDeleteId(null); }} className="h-10 px-4 rounded-lg bg-red-500 text-white text-sm font-bold">Confirm</button>
                    <button onClick={() => setConfirmingDeleteId(null)} className="h-10 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark text-sm font-bold">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleOpenEditModal(course)} className="flex items-center justify-center size-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors" aria-label="Edit course"><span className="material-symbols-outlined text-xl pointer-events-none">edit</span></button>
                    <button onClick={() => setConfirmingDeleteId(course.id)} className="flex items-center justify-center size-10 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors" aria-label="Delete course"><span className="material-symbols-outlined text-xl pointer-events-none">delete</span></button>
                  </>
                )}
            </div>
          </div>
        ))
      ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/30">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-4xl">school</span>
            </div>
            <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">No Courses Yet</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Get started by adding your first training course.</p>
            <button onClick={handleOpenAddModal} className="mt-4 flex h-10 items-center justify-center gap-x-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90">
                Add First Course
            </button>
          </div>
      )}
      </main>

      <div className="fixed bottom-24 right-6 z-20">
        <button onClick={handleOpenAddModal} className="flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95" aria-label="Add new course">
          <span className="material-symbols-outlined !text-3xl">add</span>
        </button>
      </div>
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        course={editingCourse}
      />
    </div>
  );
};