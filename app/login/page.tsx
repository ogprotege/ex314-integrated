'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage as LoginComponent } from '@/components/LoginPage';

export default function LoginPage() {
  const [loginError, setLoginError] = useState<string | undefined>();
  const router = useRouter();

  const handleLogin = (username: string, password: string) => {
    // Simple mock authentication
    if (username === 'demo' && password === 'password') {
      sessionStorage.setItem('isAuthenticated', 'true');
      router.push('/');
    } else {
      setLoginError('Invalid username or password. Try demo/password');
    }
  };

  return <LoginComponent onLogin={handleLogin} error={loginError} />;
}
