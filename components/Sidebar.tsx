// components/Sidebar.tsx
'use client'

import React, { useState } from 'react'
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon,
  DownloadIcon,
  StarIcon,
  ArchiveIcon,
  InboxIcon
} from 'lucide-react'
import { SidebarSection } from '@/components/SidebarSection'
import { UserProfile } from '@/components/UserProfile'
import { useChat } from '@/context/ChatContext'
import { ChatSearch } from '@/components/ChatSearch'

export const Sidebar = ({
  isCollapsed,
  onToggle,
  onLogout
}: {
  isCollapsed: boolean
  onToggle: () => void
  onLogout?: () => void
}) => {
  const {
    visibleChats,
    activeChatId,
    newChat,
    selectChat,
    updateChat,
    deleteChat,
    exportChats,
    filterChats
  } = useChat()

  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const handleRename = (id: string, title: string) => {
    updateChat(id, { title })
    setRenamingId(null)
  }

  const isAdmin =
    typeof window !== 'undefined' &&
    localStorage.getItem('user_id') === 'admin'

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

          {/* 🗂 Status Tabs */}
          <div className="px-4 mb-3 flex gap-2">
            <button onClick={() => filterChats('all')} className="flex-1 text-sm py-1 rounded bg-card-bg text-gray-300 hover:bg-[#333]">All</button>
            <button onClick={() => filterChats('starred')} className="flex-1 text-sm py-1 rounded bg-card-bg text-yellow-300 hover:bg-[#333]">⭐ Starred</button>
            <button onClick={() => filterChats('archived')} className="flex-1 text-sm py-1 rounded bg-card-bg text-blue-300 hover:bg-[#333]">📦 Archived</button>
          </div>

          {/* 🔍 Live Search */}
          <ChatSearch />

          <nav className="flex-grow overflow-y-auto px-2 pb-4 custom-scrollbar">
            <SidebarSection title="Chat History" defaultOpen={true}>
              <ul>
                {visibleChats.map((chat) => (
                  <li key={chat.id} className="group flex items-center">
                    {renamingId === chat.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRename(chat.id, renameValue)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(chat.id, renameValue)
                        }}
                        className="flex-1 p-2 mb-1 rounded text-sm bg-input-bg border border-[#444] text-white"
                      />
                    ) : (
                      <button
                        onDoubleClick={() => {
                          setRenamingId(chat.id)
                          setRenameValue(chat.title)
                        }}
                        onClick={() => selectChat(chat.id)}
                        className={`flex-1 text-left p-2 mb-1 rounded text-sm truncate transition-colors ${
                          activeChatId === chat.id ? 'bg-[#333333]' : 'hover:bg-[#333333]'
                        }`}
                      >
                        {chat.title}
                      </button>
                    )}

                    {/* ⭐ */}
                    <button
                      onClick={() =>
                        updateChat(chat.id, {
                          status: chat.status === 'starred' ? 'active' : 'starred'
                        })
                      }
                      title="Star"
                      className="text-gray-400 hover:text-yellow-400 ml-1"
                    >
                      <StarIcon size={14} fill={chat.status === 'starred' ? 'currentColor' : 'none'} />
                    </button>

                    {/* 📦 Archive */}
                    <button
                      onClick={() =>
                        updateChat(chat.id, {
                          status: chat.status === 'archived' ? 'active' : 'archived'
                        })
                      }
                      title="Archive"
                      className="text-gray-400 hover:text-blue-400 ml-1"
                    >
                      {chat.status === 'archived' ? (
                        <InboxIcon size={14} />
                      ) : (
                        <ArchiveIcon size={14} />
                      )}
                    </button>

                    {/* ❌ */}
                    <button
                      onClick={() => deleteChat(chat.id)}
                      className="ml-1 text-gray-400 hover:text-red-400 transition"
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
                onClick={exportChats}
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
  )
}
