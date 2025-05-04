'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArchiveIcon,
  Trash2Icon,
  PencilIcon,
  CheckIcon
} from 'lucide-react';
import { SidebarSection } from '@/components/SidebarSection';
import { UserProfile } from '@/components/UserProfile';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout?: () => void;
}

type ChatItem = {
  id: string;
  name: string;
  archived?: boolean;
};

export const Sidebar = ({ isCollapsed, onToggle, onLogout }: SidebarProps) => {
  const [chats, setChats] = useState<ChatItem[]>([
    { id: '1', name: 'Theological Discussion on Grace' },
    { id: '2', name: 'Church Fathers Study' },
    { id: '3', name: 'Vatican II Documents' },
    { id: '4', name: 'Biblical Interpretation' },
    { id: '5', name: 'Liturgical Questions' },
    { id: '6', name: 'Patristic Readings', archived: true },
    { id: '7', name: 'Moral Theology', archived: true }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleRename = (id: string, newName: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, name: newName } : chat))
    );
    setEditingId(null);
  };

  const handleArchive = (id: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, archived: !chat.archived } : chat
      )
    );
  };

  const handleDelete = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  const handleStartEdit = (id: string, current: string) => {
    setEditingId(id);
    setEditValue(current);
  };

  const displayedChats = chats.filter((chat) => !chat.archived);
  const archivedChats = chats.filter((chat) => chat.archived);

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
          <button className="flex items-center gap-2 bg-accent-purple text-white py-2.5 px-3 mx-4 mb-4 rounded-md font-medium text-left transition-colors hover:bg-purple-hover shadow-sm">
            <PlusIcon size={16} />
            New Chat
          </button>

          <nav className="flex-grow overflow-y-auto px-2 pb-4 custom-scrollbar">
            <SidebarSection title="Chat History" defaultOpen={true}>
              <ul>
                {displayedChats.map((chat) => (
                  <li key={chat.id} className="relative group">
                    {editingId === chat.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleRename(chat.id, editValue);
                        }}
                        className="flex items-center"
                      >
                        <input
                          className="bg-[#333333] text-sm w-full p-2 rounded text-white"
                          value={editValue}
                          autoFocus
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <button type="submit" className="ml-2">
                          <CheckIcon size={16} className="text-accent-purple" />
                        </button>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center p-2 mb-1 hover:bg-[#333333] rounded transition-colors">
                        <button
                          className="text-left text-sm truncate w-full"
                          onDoubleClick={() => handleStartEdit(chat.id, chat.name)}
                        >
                          {chat.name}
                        </button>
                        <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleArchive(chat.id)} title="Archive">
                            <ArchiveIcon size={14} className="text-gray-400 hover:text-white" />
                          </button>
                          <button onClick={() => handleDelete(chat.id)} title="Delete">
                            <Trash2Icon size={14} className="text-error hover:text-white" />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </SidebarSection>

            <SidebarSection title="Archived" defaultOpen={false}>
              <ul>
                {archivedChats.map((chat) => (
                  <li key={chat.id}>
                    <div className="flex justify-between items-center p-2 mb-1 hover:bg-[#333333] rounded transition-colors">
                      <span className="text-sm truncate">{chat.name}</span>
                      <div className="flex gap-2 ml-2">
                        <button onClick={() => handleArchive(chat.id)} title="Unarchive">
                          <ArchiveIcon size={14} className="text-accent-purple" />
                        </button>
                        <button onClick={() => handleDelete(chat.id)} title="Delete">
                          <Trash2Icon size={14} className="text-error" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </SidebarSection>
          </nav>

          <UserProfile onLogout={onLogout} />
        </>
      )}
    </aside>
  );
};
