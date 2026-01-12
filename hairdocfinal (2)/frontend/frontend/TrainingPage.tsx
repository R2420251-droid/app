import React, { useState, useMemo } from 'react';
import { Course } from './data';

// Interfaces
interface TrainingPageProps {
  navigateToHome: () => void;
  onEnrollClick: (course: Course) => void;
  courses: Course[];
}

const categories = ['All', 'Hair', 'Makeup', 'Nails', 'Skincare'];

// Components
const TrainingTopAppBar: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 pb-2 justify-between">
    <button onClick={onBack} className="flex size-12 shrink-0 items-center justify-start text-text-light dark:text-text-dark" aria-label="Go back">
      <span className="material-symbols-outlined">arrow_back</span>
    </button>
    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-text-light dark:text-text-dark">Training & Academy</h2>
    <div className="flex w-12 items-center justify-end">
      <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-transparent text-text-light dark:text-text-dark gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0" aria-label="More options">
        <span className="material-symbols-outlined">more_vert</span>
      </button>
    </div>
  </header>
);

const SearchBar: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => (
    <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-primary/10 dark:bg-white/10">
                <div className="text-primary/70 dark:text-primary/50 flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-primary/70 dark:placeholder:text-primary/50 px-4 pl-2 text-base font-normal leading-normal" 
                    placeholder="Search for courses..." 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </label>
    </div>
);

const FilterChips: React.FC<{ activeFilter: string; onFilterChange: (filter: string) => void }> = ({ activeFilter, onFilterChange }) => (
  <nav className="flex gap-3 px-4 py-2 overflow-x-auto whitespace-nowrap">
    {categories.map(category => (
      <button
        key={category}
        onClick={() => onFilterChange(category)}
        className={`flex h-8 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium leading-normal ${
          activeFilter === category
            ? 'bg-primary text-white'
            : 'bg-primary/10 dark:bg-white/10 text-text-light dark:text-text-dark'
        }`}
      >
        {category}
      </button>
    ))}
  </nav>
);

const CourseCard: React.FC<{ course: Course, onEnroll: () => void, style?: React.CSSProperties }> = ({ course, onEnroll, style }) => (
  <div style={style} className="flex flex-col items-stretch justify-start rounded-xl shadow-sm bg-card-light dark:bg-card-dark overflow-hidden animate-fade-in-up">
    <div 
        className="w-full bg-center bg-no-repeat aspect-[16/8] bg-cover" 
        role="img" 
        aria-label={course.alt}
        style={{ backgroundImage: `url("${course.imageUrl}")` }}>
    </div>
    <div className="flex w-full grow flex-col items-stretch justify-center gap-4 p-4">
      <p className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em]">{course.title}</p>
      <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal">{course.description}</p>
      <div className="flex flex-col gap-2.5 text-sm text-text-light-secondary dark:text-text-dark-secondary">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">calendar_today</span>
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">payments</span>
          <span>R{course.price}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{course.prerequisites}</span>
        </div>
      </div>
      <button onClick={onEnroll} className="flex min-w-[84px] max-w-[480px] w-full mt-2 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal">
        <span className="truncate">Enroll Now</span>
      </button>
    </div>
  </div>
);

// Page Component
export const TrainingPage: React.FC<TrainingPageProps> = ({ navigateToHome, onEnrollClick, courses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCourses = useMemo(() => {
    return courses
      .filter(course => activeFilter === 'All' || course.category === activeFilter)
      .filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery, activeFilter, courses]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col font-display group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <TrainingTopAppBar onBack={navigateToHome} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <main className="flex flex-col gap-4 p-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnroll={() => onEnrollClick(course)} 
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))
        ) : (
          <div className="text-center py-10 text-text-light-secondary dark:text-text-dark-secondary">
            <p className="font-bold">No courses found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};