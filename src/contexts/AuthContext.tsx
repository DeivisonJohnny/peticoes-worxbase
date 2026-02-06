import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Api, { ApiErrorResponse } from '@/api';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const response = await Api.get('/auth/me');
      setUser(response as unknown as User);
    } catch (error) {
      setUser(null);
      console.log('Usuário não autenticado');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await Api.post('/auth/login', { email, password });
      
      const response = await Api.get('/auth/me');
      setUser(response as unknown as User);
      
      toast.success('Login realizado com sucesso!');
      
      setTimeout(() => {
        router.replace('/dashboard');
      }, 1500);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      console.error('🚀 ~ Erro de autenticação:', apiError);
      toast.error(`Erro de autenticação: ${apiError.message}`);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Api.post('/auth/logout').catch(() => {
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      router.replace('/');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
