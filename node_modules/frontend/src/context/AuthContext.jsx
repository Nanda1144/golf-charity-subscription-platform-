import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
  );
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  const login = (token, userInfo) => {
    const normalizedUser = { ...userInfo, token };
    setUser(normalizedUser);
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(normalizedUser));
  };

  const refreshUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        const { data } = await api.get('/users/profile');
        setUser({ ...data, token: localStorage.getItem('token') });
      } catch (err) {
        logout();
      }
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const registerAuth = (token, userInfo) => {
    const normalizedUser = { ...userInfo, token };
    setUser(normalizedUser);
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(normalizedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading, register: registerAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
