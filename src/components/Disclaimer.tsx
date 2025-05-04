import React from 'react';
export const Disclaimer = () => {
  return <div className="w-full max-w-[800px] mx-auto p-5 bg-card-bg rounded-lg border border-[#383838] shadow-sm">
      <p className="text-xs text-gray-custom leading-relaxed">
        <strong className="text-accent-purple font-semibold">
          DISCLAIMER:
        </strong>{' '}
        This AI assistant follows the Vatican's "Note on Artificial Intelligence
        in Human Life and Mission" (2023). It serves as a tool for theological
        exploration, not as a replacement for Church teaching, pastoral
        guidance, or the Magisterium. All responses should be discerned in
        prayer, community, and with appropriate spiritual direction. ex314.ai is
        an independent Catholic initiative committed to truth and human dignity.
      </p>
    </div>;
};