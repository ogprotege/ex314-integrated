import React, { useState, Component } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage as LoginComponent } from '../../../components/LoginPage';
export default function LoginPage() {
  const [loginError, setLoginError] = useState<string | undefined>();
  const router = useRouter();
  const handleLogin = (username: string, password: string) => {
    // Simple mock authentication for preview purposes
    if (username === 'demo' && password === 'password') {
      // Store auth state in sessionStorage (use a more robust solution in production)
      sessionStorage.setItem('isAuthenticated', 'true');
      router.push('/');
    } else {
      setLoginError('Invalid username or password. Try demo/password');
    }
  };
  return <LoginComponent onLogin={handleLogin} error={loginError} />;
}