'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage as LoginComponent } from '../../components/LoginPage';

export default function LoginPage() {
  const [loginError, setLoginError] = useState<string | undefined>();
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // Set isClient to true once component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Check if already logged in
  useEffect(() => {
    if (!isClient) return;
    
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      router.push('/');
    }
  }, [router, isClient]);

  const handleLogin = (username: string, password: string) => {
    if (!isClient) return;
    
    // Simple mock authentication for preview purposes
    if (username === 'demo' && password === 'password') {
      // Store auth state in sessionStorage (use a more robust solution in production)
      sessionStorage.setItem('isAuthenticated', 'true');
      router.push('/');
    } else {
      setLoginError('Invalid username or password. Try demo/password');
    }
  };
  
  // Don't render during server-side rendering
  if (!isClient) {
    return null;
  }

  return <LoginComponent onLogin={handleLogin} error={loginError} />;
}
