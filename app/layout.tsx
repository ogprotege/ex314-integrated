import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'ex314.ai | Catholic Theological AI Assistant',
  description: 'A Catholic theological AI assistant built with React and Next.js'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-bg text-white font-segoe`}>
        {children}
      </body>
    </html>
  );
}
