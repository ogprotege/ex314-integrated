// components/SidebarSection.tsx
'use client'

import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  children,
  defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-xs font-medium text-gray-400 px-2 py-1.5 hover:bg-card-bg rounded transition-colors"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUpIcon size={14} className="opacity-70" />
        ) : (
          <ChevronDownIcon size={14} className="opacity-70" />
        )}
      </button>
      <div
        className={`mt-1 transition-all duration-300 ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
