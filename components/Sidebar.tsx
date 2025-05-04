'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon,
  DownloadIcon
} from 'lucide-react';

import { SidebarSection } from './SidebarSection';
import { UserProfile } from './UserProfile';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  chats: { id: string; title: string }[];
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onSelectChat: (id: string) => void;
  activeChatId: string | null;
}

export const Sidebar = ({
  isCollapsed,
  onToggle,
  onLogout,
  chats,
  onNewChat,
  onDeleteChat,
  onSelectChat,
  activeChatId
}: SidebarProps) => {
  const [showAllChats, setShowAllChats] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin =
    typeof window !== 'undefined' &&
    localStorage.getItem('user_is_admin') === 'true';

  const handleRename = (id: string, title: string) => {
    const updated = chats.map((chat) =>
      chat.id === id ? { ...chat, title } : chat
    );
    localStorage.setItem('chat_threads', JSON.stringify(updated));
    setRenamingId(null);
  };

  const handleExport = () => {
    const threads = JSON.parse(localStorage.getItem('chat_threads') || '[]');
    const blob = new Blob([JSON.stringify(threads, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ex314_chat_history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentChats = filteredChats.slice(0, 7);
  const olderChats = filteredChats.slice(7);

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
              <img
                src="/jerusalem-cross.png"
                alt="Jerusalem Cross"
                className="w-5 h-5"
              />
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
          {isCollapsed ? (
            <ChevronRightIcon size={18} />
          ) : (
            <ChevronLeftIcon size={18} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 bg-accent-purple text-white py-2.5 px-3 mx-4 mb-4 rounded-md font-medium text-left transition-colors hover:bg-purple-hover shadow-sm"
          >
            <PlusIcon size={16} />
            New Chat
          </button>

          <div className="px-4 mb-3">
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
                {recentChats.map((chat) => (
                  <li key={chat.id} className="group flex items-center">
                    {renamingId === chat.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRename(chat.id, renameValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRename(chat.id, renameValue);
                          }
                        }}
                        className="flex-1 p-2 mb-1 rounded text-sm bg-input-bg border border-[#444] text-white"
                      />
                    ) : (
                      <button
                        onDoubleClick={() => {
                          setRenamingId(chat.id);
                          setRenameValue(chat.title);
                        }}
                        onClick={() => onSelectChat(chat.id)}
                        className={`flex-1 text-left p-2 mb-1 rounded text-sm truncate transition-colors ${
                          activeChatId === chat.id
                            ? 'bg-[#333333]'
                            : 'hover:bg-[#333333]'
                        }`}
                      >
                        {chat.title}
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteChat(chat.id)}
                      className="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2Icon size={14} />
                    </button>
                  </li>
                ))}

                {!showAllChats && olderChats.length > 0 && (
                  <button
                    onClick={() => setShowAllChats(true)}
                    className="w-full p-2 text-sm text-gray-custom hover:bg-[#333333] rounded transition-colors text-left opacity-75"
                  >
                    Show more chats...
                  </button>
                )}

                {showAllChats &&
                  olderChats.map((chat) => (
                    <li key={chat.id} className="group flex items-center">
                      <button
                        onClick={() => onSelectChat(chat.id)}
                        className={`flex-1 text-left p-2 mb-1 rounded text-sm truncate transition-colors opacity-60 ${
                          activeChatId === chat.id
                            ? 'bg-[#333333]'
                            : 'hover:bg-[#333333]'
                        }`}
                      >
                        {chat.title}
                      </button>
                      <button
                        onClick={() => onDeleteChat(chat.id)}
                        className="ml-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2Icon size={14} />
                      </button>
                    </li>
                  ))}
              </ul>
            </SidebarSection>
          </nav>

          {isAdmin && (
            <div className="px-4 mb-4">
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2 justify-center text-sm py-2 rounded bg-card-bg hover:bg-[#2a2a2a] border border-[#444] text-gray-300"
              >
                <DownloadIcon size={14} />
                Export Chats
              </button>
            </div>
          )}

          <UserProfile onLogout={onLogout} />
        </>
      )}
    </aside>
  );
};
