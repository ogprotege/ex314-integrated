'use client';

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  error?: string;
}

export const LoginPage = ({ onLogin, error }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ⛪️ User identity setup
    const existingId = localStorage.getItem('user_id');
    if (!existingId) {
      const newId = uuidv4();
      localStorage.setItem('user_id', newId);
    }

    // optional: sync name too
    localStorage.setItem('user_name', username);

    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md border-2 border-accent-purple border-opacity-30 rounded-lg p-8 bg-[#131419] shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-accent-purple bg-gradient-to-r from-[#800080] to-[#9c27b0] bg-clip-text text-transparent">
            EX 3:14
          </h1>
          <p className="text-white/80 mt-1 italic">
            A Catholic Theological Assistant
          </p>
        </div>
        {error && <div className="text-error text-center mb-6 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-[#b366cc] mb-2 font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1a1c24] border-2 border-accent-purple border-opacity-30 rounded p-3 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="block text-[#b366cc] mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1a1c24] border-2 border-accent-purple border-opacity-30 rounded p-3 text-white focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent-purple hover:bg-purple-hover text-white py-3 rounded font-medium transition-colors shadow-sm"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};
