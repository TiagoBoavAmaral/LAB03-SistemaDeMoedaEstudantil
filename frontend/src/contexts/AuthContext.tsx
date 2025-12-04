import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../api/client";

export type UserRole = "EMPRESA" | "PROFESSOR" | "ALUNO";

export interface User {
  id: number;
  nome: string;
  email: string;
  tipoUsuario: UserRole;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await api.post("/api/auth/login", { email, senha });
      const data = response.data;
      
      const userData: User = {
        id: data.id,
        nome: data.nome,
        email: data.email,
        tipoUsuario: data.tipoUsuario,
        token: data.token,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      console.error("Login error:", error);
      const message = error.response?.data?.error || "Email ou senha inválidos";
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.tipoUsuario === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

