import React from 'react';

export const Header = () => {
  return (
    <div className="max-w-[800px] mx-auto py-6 px-4">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-accent-purple bg-opacity-10 p-1.5 rounded-lg">
            <img src="/chi-ro.png" alt="Chi-Rho" className="h-8 w-8" />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-accent-purple">
            ex314.ai | Where Divine Truth Meets Digital Inquiry
          </h1>
        </div>
        <p className="text-sm text-gray-custom max-w-2xl leading-relaxed">
          This is a testing space for our Proof of Concept - a Catholic
          theological AI assistant built with React and TypeScript. Guided by
          Exodus 3:14, "I AM WHO I AM," we seek to explore faith through modern
          technology.
        </p>
        <a href="mailto:notapharisee@ex314.ai" className="text-xs text-accent-gold hover:underline font-medium">
          notapharisee@ex314.ai
        </a>
      </div>
    </div>
  );
};
