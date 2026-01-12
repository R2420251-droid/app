import React from 'react';
import { expertsData, communityData } from './data';

interface AboutUsPageProps {
  navigateToHome: () => void;
  navigateToBook: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ navigateToHome, navigateToBook }) => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark text-content-light dark:text-content-dark">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 pb-2 justify-between border-b border-border-light dark:border-border-dark">
        <button onClick={navigateToHome} className="flex size-12 shrink-0 items-center justify-start -ml-2" aria-label="Go back">
          <span className="material-symbols-outlined text-content-light dark:text-content-dark text-2xl">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">About Us</h2>
        <div className="flex size-12 shrink-0 items-center justify-end"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Image */}
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3 p-4">
            <div 
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden @[480px]:rounded-xl min-h-80 rounded-xl" 
              role="img"
              aria-label="Chic and modern interior of the Hair Doc salon"
              style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAEi-olDX8NWi-z5TpTIGt5oF9lNpb3W8EYGmwOX6Z-jNBd7wcbwsghOWnoF8vLYUQ5wQtAcqcN4B7LUK2IJBeQ6FXII40DuyHHD5NNLJhyKUBrnXzvSODP1eibHz5bN-BYZ9MkaK4-Ma2LTRYgMRRPOcWO7fBKDZddHmcePpwvvNAIsCQO-vwMcY-cmFml3TEp-_sWDoa_Fdlc8nZFLKSpRm2aBlHylraZB-W_MpixGXAK-rgLryIbWbew1hzKcC6zxYMTr2jCEjxe")`}}
            ></div>
          </div>
        </div>

        {/* Our Story Section */}
        <section className="pb-4">
          <h1 className="tracking-light text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-4">Our Story</h1>
          <p className="text-base font-normal leading-normal pb-3 pt-1 px-4 text-subtle-light dark:text-subtle-dark">
            Founded with a passion for beauty and a commitment to excellence, Hair Doc Salon & Academy has grown from a small boutique into a premier destination for top-tier salon services and professional beauty education.
          </p>
        </section>

        {/* Vision & Mission Section */}
        <section className="pb-4">
          <h1 className="tracking-light text-[32px] font-bold leading-tight px-4 text-left pb-3 pt-6">Vision & Mission</h1>
          <div className="px-4 space-y-4">
            <div>
              <h3 className="font-bold text-lg">Our Vision</h3>
              <p className="text-base font-normal leading-normal text-subtle-light dark:text-subtle-dark">To be the leading name in beauty and wellness, empowering individuals to feel confident and beautiful, inside and out.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg">Our Mission</h3>
              <p className="text-base font-normal leading-normal text-subtle-light dark:text-subtle-dark">To provide exceptional services and education through a team of passionate experts, using innovative techniques and premium products in a welcoming, luxurious environment.</p>
            </div>
          </div>
        </section>

        {/* Meet Our Experts Section */}
        <section className="py-8">
          <h1 className="tracking-light text-[32px] font-bold leading-tight px-4 text-left pb-4">Meet Our Experts</h1>
          <div className="flex overflow-x-auto space-x-4 pl-4 pb-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {expertsData.map(expert => (
              <div key={expert.name} className="flex flex-col items-center flex-shrink-0 w-32 text-center">
                <img className="h-28 w-28 rounded-full object-cover" alt={`Portrait of ${expert.name}`} src={expert.imageUrl}/>
                <h4 className="mt-3 font-bold">{expert.name}</h4>
                <p className="text-sm text-subtle-light dark:text-subtle-dark">{expert.role}</p>
              </div>
            ))}
            <div className="w-4 flex-shrink-0"></div>
          </div>
        </section>

        {/* Words from Our Community Section */}
        <section className="pb-8">
          <h1 className="tracking-light text-[32px] font-bold leading-tight px-4 text-left pb-4 pt-4">From Our Community</h1>
          <div className="px-4 space-y-4">
            {communityData.map(testimonial => (
              <div key={testimonial.name} className="bg-background-light dark:bg-background-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
                <p className="text-base italic leading-relaxed text-subtle-light dark:text-subtle-dark">"{testimonial.quote}"</p>
                <div className="flex items-center mt-4">
                  <img className="h-10 w-10 rounded-full object-cover mr-4" alt={`Avatar of ${testimonial.name}`} src={testimonial.imageUrl}/>
                  <div>
                    <h5 className="font-bold">{testimonial.name}</h5>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <footer className="sticky bottom-0 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark">
        <button onClick={navigateToBook} className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-primary/90 transition-colors">Book an Appointment</button>
      </footer>
    </div>
  );
};