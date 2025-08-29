import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile, error } = await supabase
          .from('usuarios')
          .select('delegadoResponsavel, delegaciaId')
          .eq('userId', session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
        }

        const newUser = { ...session.user, ...profile };
        setUser(newUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile, error } = await supabase
          .from('usuarios')
          .select('delegadoResponsavel, delegaciaId')
          .eq('userId', session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil no onAuthStateChange:", error);
        }
        
        const newUser = { ...session.user, ...profile };
        setUser(newUser);
      } else {
        setUser(null);
      }
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