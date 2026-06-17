import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LearnerDashboard from './pages/LearnerDashboard';
import MentorDashboard from './pages/MentorDashboard';
import RoadmapListingPage from './pages/RoadmapListingPage';
import RoadmapDetailPage from './pages/RoadmapDetailPage';
import StepDetailPage from './pages/StepDetailPage';
import { ProfilePage } from './pages/Placeholders';

// Route guards
function ProtectedRoute({ children, allowedRole }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    // Redirect to their correct dashboard
    return <Navigate to={currentUser.role === 'Mentor' ? '/mentor-dashboard' : '/dashboard'} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="Learner">
                <LearnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor-dashboard"
            element={
              <ProtectedRoute allowedRole="Mentor">
                <MentorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Extra tracks and details */}
          <Route
            path="/roadmaps"
            element={
              <ProtectedRoute>
                <RoadmapListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmaps/:id"
            element={
              <ProtectedRoute>
                <RoadmapDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmaps/:id/steps/:stepId"
            element={
              <ProtectedRoute>
                <StepDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

