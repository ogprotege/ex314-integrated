// components/ChatSearch.tsx
'use client'

import React, { useState } from 'react'
import { useChat } from '@/context/ChatContext'
import { SearchIcon } from 'lucide-react'

export const ChatSearch = () => {
  const { searchMessages } = useChat()
  const [query, setQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    searchMessages(q)
  }

  return (
    <div className="px-4 mb-3 flex items-center gap-2">
      <SearchIcon size={16} className="text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search chat messages or roles..."
        className="w-full bg-input-bg text-white p-2 rounded text-sm border border-[#444] placeholder:text-gray-custom"
      />
    </div>
  )
}
