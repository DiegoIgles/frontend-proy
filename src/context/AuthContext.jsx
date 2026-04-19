import React, { createContext, useContext, useState, useEffect } from "react";
import { checkAuthStatusAction } from "../pages/auth/actions/check-auth-status.action";
import { getUserAuthAction } from "../pages/auth/actions/get-user-auth.action";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar: si hay token, refresca y obtiene datos del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    checkAuthStatusAction()
      .then(async (statusData) => {
        localStorage.setItem("token", statusData.token);
        if (!statusData.profile) {
          const userData = await getUserAuthAction();
          setUser({ ...userData, token: statusData.token });
        } else {
          setUser(statusData);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Llama al backend y actualiza el usuario en contexto (útil tras cambiar foto/género)
  const refreshUser = async () => {
    try {
      const userData = await getUserAuthAction();
      const token = localStorage.getItem("token");
      setUser({ ...userData, token });
    } catch {
      // silencioso
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
