import React, { useState } from 'react';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { SidebarSection } from './SidebarSection';
import { UserProfile } from './UserProfile';
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
  const recentChats = ['Theological Discussion on Grace', 'Church Fathers Study', 'Vatican II Documents', 'Biblical Interpretation', 'Liturgical Questions'];
  const olderChats = ['Patristic Readings', 'Moral Theology', 'Catechism Review', 'Doctrinal Questions'];
  return <aside className={`${isCollapsed ? 'w-[60px]' : 'w-[260px]'} flex-shrink-0 bg-dark-bg flex flex-col border-r border-[#383838] transition-all duration-300`}>
      <div className="p-4 flex items-center gap-2 flex-shrink-0">
        {!isCollapsed ? <>
            <div className="w-7 h-7 bg-accent-purple rounded flex items-center justify-center shadow-sm">
              <img src="/jerusalem-cross.png" alt="Jerusalem Cross" className="w-5 h-5" />
            </div>
            <span className="text-base font-semibold">AI Assistant</span>
          </> : <div className="w-7 h-7 bg-accent-purple rounded flex items-center justify-center shadow-sm mx-auto">
            <img src="/chi-ro.png" alt="Chi-Rho" className="w-5 h-5" />
          </div>}
        <button onClick={onToggle} className="ml-auto p-1.5 hover:bg-card-bg rounded-lg transition-colors" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {isCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
        </button>
      </div>
      {!isCollapsed && <>
          <button className="flex items-center gap-2 bg-accent-purple text-white py-2.5 px-3 mx-4 mb-4 rounded-md font-medium text-left transition-colors hover:bg-purple-hover shadow-sm">
            <PlusIcon size={16} />
            New Chat
          </button>
          <nav className="flex-grow overflow-y-auto px-2 pb-4 custom-scrollbar">
            <SidebarSection title="Chat History" defaultOpen={true}>
              <ul>
                {recentChats.map((chat, index) => <li key={index}>
                    <button onClick={() => onToggle()} className="w-full text-left p-2 mb-1 rounded text-sm truncate hover:bg-[#333333] transition-colors">
                      {chat}
                    </button>
                  </li>)}
                {!showAllChats && <button onClick={() => setShowAllChats(true)} className="w-full p-2 text-sm text-gray-custom hover:bg-[#333333] rounded transition-colors text-left opacity-75">
                    Show more chats...
                  </button>}
                {showAllChats && olderChats.map((chat, index) => <li key={index}>
                      <a href="#" className="block p-2 mb-1 rounded text-sm truncate hover:bg-[#333333] transition-colors">
                        {chat}
                      </a>
                    </li>)}
              </ul>
            </SidebarSection>
            <SidebarSection title="Archived" defaultOpen={false}>
              <ul>
                <li>
                  <a href="#" className="block p-2 mb-1 rounded text-sm truncate hover:bg-[#333333] transition-colors">
                    Early Church History
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-2 mb-1 rounded text-sm truncate hover:bg-[#333333] transition-colors">
                    Sacramental Theology
                  </a>
                </li>
              </ul>
            </SidebarSection>
          </nav>
          <UserProfile onLogout={onLogout} />
        </>}
    </aside>;
};