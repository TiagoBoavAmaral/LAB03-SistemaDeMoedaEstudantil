import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Erro ao fazer login" }));
      throw new Error(error.error || "Email ou senha inválidos");
    }

    const data = await response.json();
    const userData: User = {
      id: data.id,
      nome: data.nome,
      email: data.email,
      tipoUsuario: data.tipoUsuario,
      token: data.token,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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

