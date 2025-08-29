import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 space-y-8">
      <div className="text-center">
        <img src="/logo.png" alt="IntimAI Logo" className="mx-auto" style={{ width: '174.3px', height: '48px' }} />
        <p className="text-muted-foreground mt-4 text-lg">Crie sua conta para começar.</p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;