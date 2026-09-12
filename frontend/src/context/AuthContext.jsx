import React, { createContext, useState, useEffect } from 'react';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await client.get('/auth/me');
        setUser({ id: response.data.id, name: response.data.name });
        setRole(response.data.role); // "STUDENT" or "LIBRARIAN"
      } catch (err) {
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  const loginStudent = async (email, password) => {
    const res = await client.post('/auth/student/login', { email, password });
    setUser(res.data.user);
    setRole('STUDENT');
    return res.data;
  };

  const loginLibrarian = async (username, password) => {
    const res = await client.post('/auth/librarian/login', { username, password });
    setUser(res.data.user);
    setRole('LIBRARIAN');
    return res.data;
  };

  const registerStudent = async (studentData) => {
    return await client.post('/auth/student/register', studentData);
  };

  const logout = async () => {
    try {
      await client.post('/auth/logout');
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginStudent, loginLibrarian, registerStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
