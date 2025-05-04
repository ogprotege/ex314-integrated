'use client';

import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';

type Settings = {
  name: string;
  email: string;
  theme: string;
  fontSize: string;
  aiTone: string;
  tokenLimit: string;
  markdown: boolean;
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
}

const tabList = ['General', 'Chat', 'Advanced'] as const;
type Tab = (typeof tabList)[number];

export const SettingsModal = ({ isOpen, onClose, onSave }: SettingsModalProps) => {
  const [tab, setTab] = useState<Tab>('General');

  const [settings, setSettings] = useState<Settings>({
    name: '',
    email: '',
    theme: 'dark',
    fontSize: 'normal',
    aiTone: 'formal',
    tokenLimit: '800',
    markdown: true
  });

  useEffect(() => {
    setSettings({
      name: localStorage.getItem('user_name') || '',
      email: localStorage.getItem('user_email') || '',
      theme: localStorage.getItem('theme') || 'dark',
      fontSize: localStorage.getItem('font_size') || 'normal',
      aiTone: localStorage.getItem('ai_tone') || 'formal',
      tokenLimit: localStorage.getItem('token_limit') || '800',
      markdown: localStorage.getItem('markdown_enabled') !== 'false' // default true
    });
  }, [isOpen]);

  const persistSettings = () => {
    localStorage.setItem('user_name', settings.name);
    localStorage.setItem('user_email', settings.email);
    localStorage.setItem('theme', settings.theme);
    localStorage.setItem('font_size', settings.fontSize);
    localStorage.setItem('ai_tone', settings.aiTone);
    localStorage.setItem('token_limit', settings.tokenLimit);
    localStorage.setItem('markdown_enabled', String(settings.markdown));
  };

  const handleSave = () => {
    persistSettings();
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-dark-bg border border-[#444] rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <XIcon size={20} />
        </button>

        <h2 className="text-xl font-semibold text-accent-purple mb-4">
          Settings
        </h2>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-[#444]">
          {tabList.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`mr-4 pb-2 px-1 text-sm ${
                tab === t
                  ? 'text-accent-purple border-b-2 border-accent-purple'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {tab === 'General' && (
            <>
              <div>
                <label className="text-sm text-gray-300">Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, name: e.target.value }))
                  }
                  className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, email: e.target.value }))
                  }
                  className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, theme: e.target.value }))
                    }
                    className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300">Font Size</label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, fontSize: e.target.value }))
                    }
                    className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
                  >
                    <option value="small">Small</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {tab === 'Chat' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300">AI Tone</label>
                  <select
                    value={settings.aiTone}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, aiTone: e.target.value }))
                    }
                    className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
                  >
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="theological">Theological</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-300">Token Limit</label>
                  <input
                    type="number"
                    value={settings.tokenLimit}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, tokenLimit: e.target.value }))
                    }
                    className="w-full bg-input-bg text-white p-2 mt-1 rounded border border-[#555]"
                    min={100}
                    max={4000}
                  />
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  id="markdownToggle"
                  type="checkbox"
                  checked={settings.markdown}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, markdown: e.target.checked }))
                  }
                  className="mr-2"
                />
                <label htmlFor="markdownToggle" className="text-sm text-gray-300">
                  Enable Markdown Rendering
                </label>
              </div>
            </>
          )}

          {tab === 'Advanced' && (
            <>
              <p className="text-sm text-gray-400 italic">
                More advanced settings coming soon: API override, debug toggles, export chat history.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
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
