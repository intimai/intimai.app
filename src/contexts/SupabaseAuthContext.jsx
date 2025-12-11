import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { auditService } from '@/lib/auditService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [authError, setAuthError] = useState(null); // Novo estado para capturar erros

  const fetchSessionAndProfile = async (session) => {
    setLoading(true);
    setAuthError(null); // Limpa erros anteriores
    try {
      if (session) {
        const { data: userProfile, error: userProfileError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('userId', session.user.id)
          .single();

        if (userProfileError) {
          console.error('Erro ao buscar perfil:', userProfileError);
          setAuthError(`Erro ao buscar perfil: ${userProfileError.message} (${userProfileError.code})`);
          // setUser(null); // REMOVIDO: Não desloga, mostra o erro
          return;
        }
        
        if (!userProfile) {
           setAuthError('Perfil de usuário não encontrado na tabela usuarios.');
           return;
        }

        if (!userProfile.delegaciaId) {
           setAuthError('Usuário não possui delegacia vinculada (delegaciaId nulo).');
           return;
        }

        const { data: delegaciaData, error: delegaciaError } = await supabase
          .from('delegacias')
          .select('nome, endereco, cidadeEstado')
          .eq('delegaciaId', userProfile.delegaciaId)
          .single();

        if (delegaciaError) {
          console.error('Erro ao buscar delegacia:', delegaciaError);
          setAuthError(`Erro ao buscar delegacia: ${delegaciaError.message} (${delegaciaError.code})`);
          // setUser(null); // REMOVIDO: Não desloga, mostra o erro
          return;
        }

        if (!delegaciaData) {
           setAuthError('Delegacia não encontrada no banco de dados.');
           return;
        }

        const finalUser = {
          ...session.user,
          ...userProfile,
          delegaciaNome: delegaciaData.nome,
          delegaciaEndereco: `${delegaciaData.endereco}, ${delegaciaData.cidadeEstado}`,
        };

        const needsTermsAcceptance = !userProfile.terms_accepted_at;
        setNeedsConsent(needsTermsAcceptance);
        setUser(finalUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Erro inesperado na autenticação:', err);
      setAuthError(`Erro inesperado: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
    authError, // Expor o erro
  };
  
  // Se houver erro crítico de autenticação, mostre na tela em vez de redirecionar
  if (authError) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#e11d48' }}>Erro de Autenticação Detectado</h1>
        <p>O sistema encontrou um problema ao carregar seus dados e parou para evitar loops.</p>
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', margin: '20px auto', maxWidth: '600px', textAlign: 'left' }}>
          <strong>Detalhe do Erro:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#dc2626' }}>{authError}</pre>
        </div>
        <button 
          onClick={() => { setAuthError(null); signOut(); }}
          style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Forçar Logout e Tentar Novamente
        </button>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};