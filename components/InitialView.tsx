'use client';

import React from 'react';
import { ChatInput } from '@/components/ChatInput';
import { Disclaimer } from '@/components/Disclaimer';

interface InitialViewProps {
  onSendMessage: (message: string) => void;
}

export const InitialView = ({ onSendMessage }: InitialViewProps) => {
  return <div className="flex-grow flex flex-col">
      <div className="flex-grow flex flex-col justify-center items-center p-6 md:p-8 overflow-auto">
        <div className="w-full max-w-[800px] mt-12 md:mt-24 mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-custom mb-10 flex items-center gap-4 justify-center">
            <div className="bg-accent-purple bg-opacity-10 p-2 rounded-lg">
              <img src="/chi-ro.png" alt="Chi-Rho" className="w-12 h-12" />
            </div>
            <span>How can I help you today?</span>
          </h1>
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      </div>
      <div className="p-4 md:p-6">
        <Disclaimer />
      </div>
    </div>;
};
