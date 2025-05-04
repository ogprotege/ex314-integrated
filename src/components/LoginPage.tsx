import React, { useState } from 'react';
interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
  error?: string;
}
export const LoginPage = ({
  onLogin,
  error
}: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };
  return <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
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
            <div className="relative">
              <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-[#1a1c24] border-2 border-accent-purple border-opacity-30 rounded p-3 text-white focus:outline-none focus:border-accent-purple focus:border-opacity-50 transition-colors" required />
            </div>
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="block text-[#b366cc] mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#1a1c24] border-2 border-accent-purple border-opacity-30 rounded p-3 text-white focus:outline-none focus:border-accent-purple focus:border-opacity-50 transition-colors" required />
            </div>
          </div>
          <button type="submit" className="w-full bg-accent-purple hover:bg-purple-hover text-white py-3 rounded font-medium transition-colors shadow-sm">
            Enter
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="text-[#b366cc] text-sm hover:text-[#9c27b0] transition-colors">
            Need an account? Request access
          </a>
        </div>
      </div>
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-accent-purple bg-opacity-10 p-1.5 rounded-lg">
            <img src="/chi-ro.png" alt="Chi-Rho" className="h-6 w-6" />
          </div>
          <p className="text-xs text-gray-custom">
            ex314.ai | Where Divine Truth Meets Digital Inquiry
          </p>
        </div>
      </div>
    </div>;
};