import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { auditService } from '@/lib/auditService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsConsent, setNeedsConsent] = useState(false);

  const fetchSessionAndProfile = async (session) => {
    if (session) {
      // Etapa 1: Buscar perfil do usuário
      const { data: userProfile, error: userProfileError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('userId', session.user.id)
        .single();

      if (userProfileError || !userProfile) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (!userProfile.delegaciaId) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Etapa 2: Buscar dados da delegacia
      const { data: delegaciaData, error: delegaciaError } = await supabase
        .from('delegacias')
        .select('nome, endereco, cidadeEstado')
        .eq('delegaciaId', userProfile.delegaciaId)
        .single();

      if (delegaciaError || !delegaciaData) {
        setUser(null);
        setLoading(false);
        return;
      }

      const finalUser = {
        ...session.user,
        ...userProfile,
        delegaciaNome: delegaciaData.nome,
        delegaciaEndereco: `${delegaciaData.endereco}, ${delegaciaData.cidadeEstado}`,
      };

      // Verificar se precisa aceitar termos
      const needsTermsAcceptance = !userProfile.terms_accepted_at;
      setNeedsConsent(needsTermsAcceptance);

      setUser(finalUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await fetchSessionAndProfile(session);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session) {
        await fetchSessionAndProfile(session);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = (email, password, metadata = {}) => supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: metadata
    }
  });

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  const passwordRecovery = (email) => supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });

  const updateUser = (credentials) => supabase.auth.updateUser(credentials);

  const acceptTerms = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ terms_accepted_at: new Date().toISOString() })
        .eq('userId', user.userId);
      
      if (error) {
        console.error('Erro ao aceitar termos:', error);
        return false;
      }
      
      setNeedsConsent(false);
      
      // Atualizar o user local com a data de aceite
      setUser(prev => ({
        ...prev,
        terms_accepted_at: new Date().toISOString()
      }));

      // Registrar log de auditoria
      await auditService.logAcceptTerms(user);
      
      return true;
    } catch (error) {
      console.error('Erro ao aceitar termos:', error);
      return false;
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    passwordRecovery,
    updateUser,
    acceptTerms,
    user,
    loading,
    needsConsent,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};