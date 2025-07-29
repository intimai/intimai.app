
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de autenticação
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Simular login
    const mockUser = {
      id: '1',
      email,
      nome: 'João Silva',
      delegadoResponsavel: 'Dr. Carlos Santos',
      estadoId: 1,
      delegaciaId: 1
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (userData) => {
    // Simular registro
    const newUser = {
      id: Date.now().toString(),
      ...userData
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  return {
    user,
    loading,
    login,
    logout,
    register
  };
}
