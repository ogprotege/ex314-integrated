'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Set isClient to true once component is mounted
  useEffect(() => {
    setIsClient(true);
    
    // Check if already logged in
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (isAuthenticated) {
        router.push('/');
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isClient) return;
    
    setIsLoading(true);
    setError('');
    
    // Simple authentication for demo
    // In production, this would call an API
    setTimeout(() => {
      if (password === 'jesus' || password === 'admin') {
        localStorage.setItem('isAuthenticated', 'true');
        
        // Set admin user if admin password used
        if (password === 'admin') {
          localStorage.setItem('user_id', 'admin');
        }
        
        router.push('/');
      } else {
        setError('Invalid password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  // Don't render during server-side rendering
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="bg-card-bg rounded-lg p-8 w-full max-w-md shadow-lg border border-border-color">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/jerusalem-cross.png" alt="Jerusalem Cross" className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold">EX314</h1>
          <p className="text-gray-custom mt-1">Biblical AI Assistant</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-input-bg border border-border-color rounded focus:outline-none focus:border-accent-purple"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 p-2 bg-red-900/30 border border-red-500/50 rounded text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded bg-accent-purple hover:bg-purple-hover text-white transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-custom">
          <p>Hint: Password is "jesus"</p>
          <p className="text-xs mt-1">Admin access: "admin"</p>
        </div>
      </div>
    </div>
  );
}
