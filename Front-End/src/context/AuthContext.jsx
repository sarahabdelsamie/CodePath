import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default mock users for testing
const MOCK_USERS = [
  {
    name: 'Alex Johnson',
    email: 'learner@codepath.com',
    password: 'password123',
    role: 'Learner',
    path: 'Frontend',
    level: 'Intermediate'
  },
  {
    name: 'Sarah Jenkins',
    email: 'mentor@codepath.com',
    password: 'password123',
    role: 'Mentor',
    path: '',
    level: ''
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('codepath_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('codepath_all_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  useEffect(() => {
    localStorage.setItem('codepath_all_users', JSON.stringify(users));
  }, [users]);

  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('codepath_user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const register = (userData) => {
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      path: userData.path || '',
      level: userData.level || ''
    };

    setUsers((prev) => [...prev, newUser]);
    
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('codepath_user', JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('codepath_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
