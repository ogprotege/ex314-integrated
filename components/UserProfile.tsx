'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Settings2Icon,
  PaletteIcon,
  LogOutIcon,
  MailIcon,
  ChevronUpIcon,
  EditIcon,
  CheckIcon
} from 'lucide-react';
import clsx from 'clsx';

interface UserProfileProps {
  onLogout?: () => void;
}

export const UserProfile = ({ onLogout }: UserProfileProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem('user_name') || 'Guest Session');
  const [email, setEmail] = useState(() => localStorage.getItem('user_email') || '');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme switching
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('isAuthenticated');
    if (onLogout) onLogout();
    setIsMenuOpen(false);
  };

  const saveProfile = () => {
    setName(tempName);
    setEmail(tempEmail);
    localStorage.setItem('user_name', tempName);
    localStorage.setItem('user_email', tempEmail);
    setEditing(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-full p-4 border-t border-[#444444] flex items-center gap-3 flex-shrink-0 hover:bg-card-bg transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-[#555555] flex items-center justify-center font-medium text-sm shadow-sm">
          {name.slice(0, 2).toUpperCase()}
        </div>
        <span className="font-medium flex-grow text-left">{name}</span>
        <ChevronUpIcon
          size={16}
          className={`text-gray-custom transition-transform duration-200 ${
            isMenuOpen ? 'rotate-0' : 'rotate-180'
          }`}
        />
      </button>

      {isMenuOpen && (
        <div className="absolute bottom-full left-0 w-full bg-card-bg border border-[#444444] rounded-t-lg overflow-hidden shadow-lg z-50 p-1">
          {editing ? (
            <div className="p-3 space-y-2">
              <input
                type="text"
                placeholder="Name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full px-3 py-2 bg-input-bg text-white rounded border border-[#555]"
              />
              <input
                type="email"
                placeholder="Email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full px-3 py-2 bg-input-bg text-white rounded border border-[#555]"
              />
              <button
                onClick={saveProfile}
                className="w-full bg-accent-purple hover:bg-purple-hover text-white py-2 rounded font-medium transition-colors"
              >
                <CheckIcon size={16} className="inline-block mr-2" />
                Save Profile
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="w-full p-3 flex items-center gap-3 hover:bg-input-bg transition-colors text-sm"
              >
                <EditIcon size={16} className="text-gray-custom" />
                <span>Edit Profile</span>
              </button>

              <div className="px-3 pb-2">
                <label className="text-xs block text-gray-custom mb-1">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-input-bg text-white p-2 rounded text-sm border border-[#444]"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
              </div>

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
            </>
          )}
        </div>
      )}
    </div>
  );
};
