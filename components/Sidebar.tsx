'use client';

import React, { useState } from 'react';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { SidebarSection } from './SidebarSection';
import { UserProfile } from './UserProfile';
import { useChat } from '@/context/ChatContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout?: () => void;
}

export const Sidebar = ({
  isCollapsed,
  onToggle,
  onLogout
}: SidebarProps) => {
  const [showAllChats, setShowAllChats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { chats, selectChat, newChat } = useChat();

  const filtered = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside
      className={`${
        isCollapsed ? 'w-[60px]' : 'w-[260px]'
      } flex-shrink-0 bg-dark-bg flex flex-col border-r border-[#383838] transition-all duration-300`}
    >
      <div className="p-4 flex items-center gap-2 flex-shrink-0">
        {!isCollapsed ? (
          <>
            <div className="w-7 h-7 bg-accent-purple rounded flex items-center justify-center shadow-sm">
              <img src="/jerusalem-cross.png" alt="Jerusalem Cross" className="w-5 h-5" />
            </div>
            <span className="text-base font-semibold">AI Assistant</span>
          </>
        ) : (
          <div className="w-7 h-7 bg-accent-purple rounded flex items-center justify-center shadow-sm mx-auto">
            <img src="/chi-ro.png" alt="Chi-Rho" className="w-5 h-5" />
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 hover:bg-card-bg rounded-lg transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <button 
            onClick={newChat}
            className="flex items-center gap-2 bg-accent-purple text-white py-2.5 px-3 mx-4 mb-4 rounded-md font-medium text-left transition-colors hover:bg-purple-hover shadow-sm"
          >
            <PlusIcon size={16} />
            New Chat
          </button>

          <div className="px-4 mb-2">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-input-bg text-white p-2 rounded text-sm border border-[#444] placeholder:text-gray-custom"
            />
          </div>

          <nav className="flex-grow overflow-y-auto px-2 pb-4 custom-scrollbar">
            <SidebarSection title="Chat History" defaultOpen={true}>
              <ul>
                {filtered.slice(0, showAllChats ? filtered.length : 7).map((chat) => (
                  <li key={chat.id}>
                    <button
                      onClick={() => selectChat(chat.id)}
                      className="w-full text-left p-2 mb-1 rounded text-sm truncate hover:bg-[#333333] transition-colors"
                    >
                      {chat.title}
                    </button>
                  </li>
                ))}
                {!showAllChats && filtered.length > 7 && (
                  <button
                    onClick={() => setShowAllChats(true)}
                    className="w-full p-2 text-sm text-gray-custom hover:bg-[#333333] rounded transition-colors text-left opacity-75"
                  >
                    Show more chats...
                  </button>
                )}
              </ul>
            </SidebarSection>
          </nav>

          <UserProfile onLogout={onLogout} />
        </>
      )}
    </aside>
  );
};
