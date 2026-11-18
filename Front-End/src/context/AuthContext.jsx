import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

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
  },
  {
    name: 'CodePath Administrator',
    email: 'admin@codepath.com',
    password: 'password123',
    role: 'Admin',
    path: '',
    level: ''
  }
];


const mapUserToFrontend = (user) => {
  if (!user) return null;

  let role = user.role;
  if (role === 'learner') role = 'Learner';
  else if (role === 'mentor') role = 'Mentor';
  else if (role === 'admin') role = 'Admin';

  let path = '';
  if (user.learningPath) {
    if (user.learningPath === 'frontend') path = 'Frontend';
    else if (user.learningPath === 'backend') path = 'Backend';
    else if (user.learningPath === 'ai') path = 'AI';
    else if (user.learningPath === 'mobile') path = 'Mobile';
    else path = user.learningPath;
  }

  let level = '';
  if (user.skillLevel) {
    if (user.skillLevel === 'beginner') level = 'Beginner';
    else if (user.skillLevel === 'intermediate') level = 'Intermediate';
    else if (user.skillLevel === 'advanced') level = 'Advanced';
    else level = user.skillLevel;
  }

  return {
    ...user,
    id: user._id || user.id,
    role,
    path,
    level,
    learningPath: user.learningPath,
    skillLevel: user.skillLevel,
  };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('codepath_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('codepath_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const resData = await response.json();
        if (resData.success && resData.data) {
          const mappedUser = mapUserToFrontend(resData.data);
          setCurrentUser(mappedUser);
          localStorage.setItem('codepath_user', JSON.stringify(mappedUser));
        } else {
          // Token is invalid/expired
          localStorage.removeItem('codepath_user');
          localStorage.removeItem('codepath_token');
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        return { success: false, message: resData.message || 'Invalid email or password' };
      }

      const { token, user } = resData.data;
      const mappedUser = mapUserToFrontend(user);

      localStorage.setItem('codepath_token', token);
      localStorage.setItem('codepath_user', JSON.stringify(mappedUser));
      setCurrentUser(mappedUser);

      return { success: true, user: mappedUser };
    } catch (err) {
      console.error("Login request error", err);
      return { success: false, message: 'Server is currently unreachable.' };
    }
  };

  const register = async (userData) => {
    try {
      const backendData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role.toLowerCase(),
        learningPath: userData.path ? userData.path.toLowerCase() : undefined,
        skillLevel: userData.level ? userData.level.toLowerCase() : undefined,
      };

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        return { success: false, message: resData.message || 'Registration failed' };
      }

      const { token, user } = resData.data;
      const mappedUser = mapUserToFrontend(user);

      if (token) {
        localStorage.setItem('codepath_token', token);
      }
      localStorage.setItem('codepath_user', JSON.stringify(mappedUser));
      setCurrentUser(mappedUser);

      return { success: true, user: mappedUser };
    } catch (err) {
      console.error("Registration request error", err);
      return { success: false, message: 'Server is currently unreachable.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('codepath_user');
    localStorage.removeItem('codepath_token');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
