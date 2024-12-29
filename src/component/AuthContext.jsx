import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedInfo = localStorage.getItem("officerInfo");
    if (storedInfo) {
      const { user, token } = JSON.parse(storedInfo);
      // console.log("Stored info retrieved:", user, token); // Add this line
      setUser(user);
      setToken(token);
    }
  }, []);

  const login = (userData, tokenData) => {
    // console.log("Logging in user:", userData, "with token:", tokenData);
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem(
      "officerInfo",
      JSON.stringify({ user: userData, token: tokenData })
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("officerInfo");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
