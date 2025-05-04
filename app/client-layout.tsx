'use client';

import React from 'react';
import { ChatProvider } from '../context/ChatContext';

export function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
