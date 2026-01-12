
import React from 'react';

interface TestimonialsSectionProps {
  onClick: () => void;
}


export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onClick }) => {
  return (
    <div 
      className="px-4 pb-6"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label="View all client testimonials"
    >
      <div className="relative rounded-xl border border-border-light dark:border-border-dark bg-primary/10 dark:bg-primary/20 p-6 cursor-pointer hover:bg-primary/20 transition-colors duration-200">
        <span className="material-symbols-outlined text-primary text-5xl absolute top-3 left-3 opacity-20">format_quote</span>
        <p className="text-text-light dark:text-text-dark z-10 relative italic">"Hair Doc transformed my confidence. The lash course was incredibly detailed, and the instructors were so supportive. I started my own business right after!"</p>
        <div className="flex items-center gap-3 mt-4 z-10 relative">
          <img 
            className="h-10 w-10 rounded-full object-cover" 
            alt="Headshot of a smiling woman." 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqb1c9lOSSDK9A0Zq2G4O7N2cm6q43MSGsX_Uz79sMATpr6OP2uWuu4l9GsVl69drvrp8-Z_i9CIU2-1ZEYkJstZ7qGysgEDHf91PUqhokXHkikeUJjGP7_rW7E-grlxznn9S_dyu0W70mMYl7kHezpQ0TYga-0SQse2INFKtXkQd4PyC16YTtlzuzMzijll56Bv4KWt-hrjU4iRQwVawI2_2YakI_erTA6CHFG6fYfi5QFU7h4cCHuaOzAxiNLb7ybm2w3RHJce5i"
          />
          <div>
            <h4 className="font-bold text-text-light dark:text-text-dark">Jessica Miller</h4>
            <p className="text-sm text-text-light/70 dark:text-text-dark/70">Academy Graduate</p>
          </div>
        </div>
      </div>
    </div>
  );
};