'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Settings2Icon,
  PaletteIcon,
  LogOutIcon,
  MailIcon,
  ClockIcon,
  ChevronUpIcon
} from 'lucide-react';
import { ChatHistoryDrawer } from './ChatHistoryDrawer';

interface UserProfileProps {
  onLogout?: () => void;
}

export const UserProfile = ({ onLogout }: UserProfileProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
    }
    if (onLogout) onLogout();
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full p-4 border-t border-[#444444] flex items-center gap-3 flex-shrink-0 hover:bg-card-bg transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-[#555555] flex items-center justify-center font-medium text-sm shadow-sm">
            GS
          </div>
          <span className="font-medium flex-grow text-left">Guest Session</span>
          <ChevronUpIcon
            size={16}
            className={`text-gray-custom transition-transform duration-200 ${
              isMenuOpen ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </button>

        {isMenuOpen && (
          <div className="absolute bottom-full left-0 w-full bg-card-bg border border-[#444444] rounded-t-lg overflow-hidden shadow-lg z-50">
            <button
              className="w-full p-3 flex items-center gap-3 hover:bg-input-bg transition-colors text-sm"
              onClick={() => {
                setShowDrawer(true);
                setIsMenuOpen(false);
              }}
            >
              <ClockIcon size={16} className="text-gray-custom" />
              <span>Chat History</span>
            </button>
            <button className="w-full p-3 flex items-center gap-3 hover:bg-input-bg transition-colors text-sm">
              <Settings2Icon size={16} className="text-gray-custom" />
              <span>Settings</span>
            </button>
            <button className="w-full p-3 flex items-center gap-3 hover:bg-input-bg transition-colors text-sm">
              <PaletteIcon size={16} className="text-gray-custom" />
              <span>Appearance</span>
            </button>
            <a
              href="mailto:notapharisee@ex314.ai"
              className="w-full p-3 flex items-center gap-3 hover:bg-input-bg transition-colors text-sm"
            >
              <MailIcon size={16} className="text-gray-custom" />
              <span>Contact</span>
            </a>
            <button
              onClick={handleLogout}
              className="w-full p-3 flex items-center gap-3 hover:bg-input-bg transition-colors text-sm text-error border-t border-[#444444]"
            >
              <LogOutIcon size={16} />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>

      {/* Genie-style drawer */}
      <ChatHistoryDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
};
