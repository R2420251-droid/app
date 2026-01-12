

import React from 'react';

export const HeaderImage: React.FC = () => {
  const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBTsigt350if102rT_6mdx5ZiP_oD-Ovqo0gq6Pj52ugJE4xayztfh4wMg6nMWi6WdAkGa2spbcqFRJ7t4eUqB9r8pK5pdlSEspSGw7YrVeIAIxlov-ZOFNMcSPyfcGIERJgXT7bWXvNbZKYbZokr4OqXG5-g_rRV6s1ooUpmphNwhOu82XlAb_uWWciXRLSVaTKQPfVJb3PyZvry2al-3ZPCtL-koBUtFAbnCYlcqwscPi8NxRtcyEM9hDdxahqKARTb3MmIKeZ01I";

  return (
    <div className="@container">
      <div className="px-4 py-3">
        <div 
          className="relative overflow-hidden rounded-xl bg-cover bg-center flex flex-col justify-start min-h-[400px] md:min-h-[500px] animate-kenburns" 
          style={{ backgroundImage: `url("${imageUrl}")` }}
          aria-label="A collage of images showcasing salon services like manicures and facials, and students learning makeup artistry."
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          {/* Text Content */}
          <div className="relative z-20 flex w-full p-6 pt-28 opacity-0 animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="w-full text-center">
              <h1 className="text-white tracking-tight text-5xl font-bold leading-tight">
                <span className="animate-color-cycle">Welcome to</span> <span>Hair Doc</span>
              </h1>
              <p className="text-xl font-medium mt-2 animate-color-cycle">Your Journey to Beauty Starts Here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};