import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 space-y-8">
      <div className="text-center">
        <img src="/logo.png" alt="IntimAI Logo" className="mx-auto" style={{ width: '174.3px', height: '48px' }} />
        <p className="text-muted-foreground mt-4 text-lg">Gestão inteligente de intimações policiais.</p>
      </div>
      
      <LoginForm />
      
    </div>
  );
};

export default LoginPage;