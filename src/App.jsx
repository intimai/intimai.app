import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { IntimacoesPage } from '@/components/dashboard/IntimacoesPage';
import { AgendaPage } from '@/components/dashboard/AgendaPage';
import { PerfilPage } from '@/components/dashboard/PerfilPage';
import { SuportePage } from '@/components/dashboard/SuportePage';
import { GlossarioPage } from '@/components/dashboard/GlossarioPage';
import { OrientacoesPage } from '@/components/dashboard/OrientacoesPage';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { UpdatePasswordPage } from '@/components/auth/UpdatePasswordPage';

const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/ff2104f3-6482-49a4-9fec-6fd1d70a2204/c4a62877bf18a6bbdd6ac8a9a25455d7.png";

// Placeholder components for other routes
const Placeholder = ({ title }) => <h1 className="text-3xl font-bold active-link-gradient italic">{title}</h1>;

const AuthLayout = ({ children, title, description }) => (
  <>
    <Helmet>
      <title>IntimAI - {title}</title>
      <meta name="description" content={description} />
    </Helmet>
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-6"
          >
            <img src={logoUrl} alt="IntimAI Logo" className="h-12" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Gestão inteligente de intimações policiais.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  </>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Navigate to="/login" />} />
        <Route path="/login" element={<PublicRoute><AuthLayout title="Login"><LoginForm /></AuthLayout></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><AuthLayout title="Registrar"><RegisterForm /></AuthLayout></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><AuthLayout title="Recuperar Senha"><ForgotPasswordForm /></AuthLayout></PublicRoute>} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        
        <Route path="/*" element={<ProtectedRoute><LayoutRoutes /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

const LayoutRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/intimacoes" element={<IntimacoesPage />} />
      <Route path="/agenda" element={<AgendaPage />} />
      <Route path="/glossario" element={<GlossarioPage />} />
      <Route path="/orientacoes" element={<OrientacoesPage />} />
      <Route path="/perfil" element={<PerfilPage />} />
      <Route path="/suporte" element={<SuportePage />} />
    </Routes>
  </Layout>
);

export default App;