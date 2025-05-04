'use client';

import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import clsx from 'clsx';

type Settings = {
  name: string;
  email: string;
  theme: string;
  fontSize: string;
  aiTone: string;
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
}

const defaultSettings: Settings = {
  name: '',
  email: '',
  theme: 'dark',
  fontSize: 'normal',
  aiTone: 'formal'
};

export const SettingsModal = ({ isOpen, onClose, onSave }: SettingsModalProps) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const stored = {
      name: localStorage.getItem('user_name') || '',
      email: localStorage.getItem('user_email') || '',
      theme: localStorage.getItem('theme') || 'dark',
      fontSize: localStorage.getItem('font_size') || 'normal',
      aiTone: localStorage.getItem('ai_tone') || 'formal'
    };
    setSettings(stored);
  }, [isOpen]);

  const handleSave = () => {
    Object.entries(settings).forEach(([key, val]) =>
      localStorage.setItem(key === 'name' ? 'user_name' : key === 'email' ? 'user_email' : key, val)
    );
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-dark-bg border border-[#444] rounded-xl w-full max-w-lg p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <XIcon size={20} />
        </button>
        <h2 className="text-xl font-semibold text-accent-purple mb-6">
          Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <input
              type="text"
              className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
              value={settings.name}
              onChange={(e) =>
                setSettings((s) => ({ ...s, name: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
              value={settings.email}
              onChange={(e) =>
                setSettings((s) => ({ ...s, email: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-300">Theme</label>
              <select
                className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
                value={settings.theme}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, theme: e.target.value }))
                }
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-300">Font Size</label>
              <select
                className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
                value={settings.fontSize}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, fontSize: e.target.value }))
                }
              >
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300">AI Tone</label>
            <select
              className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
              value={settings.aiTone}
              onChange={(e) =>
                setSettings((s) => ({ ...s, aiTone: e.target.value }))
              }
            >
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="theological">Theological</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#333] text-white rounded hover:bg-[#444]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-accent-purple hover:bg-purple-hover text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
