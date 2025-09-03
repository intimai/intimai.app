import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      await fetchSessionAndProfile(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = (email, password) => supabase.auth.signUp({ email, password });

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  const passwordRecovery = (email) => supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });

  const updateUser = (credentials) => supabase.auth.updateUser(credentials);

  const value = {
    signUp,
    signIn,
    signOut,
    passwordRecovery,
    updateUser,
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};