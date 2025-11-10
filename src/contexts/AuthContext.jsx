import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({ data: null });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = sessionStorage.getItem("mie_user");
      return s ? JSON.parse(s) : (location.state?.user ?? null);
    } catch {
      return location.state?.user ?? null;
    }
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
