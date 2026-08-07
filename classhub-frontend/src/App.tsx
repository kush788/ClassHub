import React from "react";

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import { ToastProvider } from "./context/ToastContext";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

// Page Components
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { VerifyOtp } from "./pages/VerifyOtp";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

import { TeacherDashboard } from "./pages/TeacherDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import { WorkspaceDetail } from "./pages/WorkspaceDetail";
import { Leaderboard } from "./pages/Leaderboard";
import TeacherResponses from "./pages/TeacherResponses";
import StudentResponses from "./pages/StudentResponses";

import Playground from "./pages/Playground";
import PlaygroundHome from "./pages/PlaygroundHome";

import { Unauthorized } from "./pages/Unauthorized";
import { NotFound } from "./pages/NotFound";

// Redirect root path based on login and role
const HomeRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "TEACHER") {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  if (user?.role === "STUDENT") {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
};

// Shared secured layout
const LayoutWrapper: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public authentication routes */}
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/verify-otp" element={<VerifyOtp />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Root redirect */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Protected application routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<LayoutWrapper />}>
                {/* Teacher dashboard */}
                <Route
                  path="/teacher/dashboard"
                  element={
                    <ProtectedRoute allowedRole="TEACHER">
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/playground/question/:questionId/responses"
                  element={
                    <ProtectedRoute allowedRole="TEACHER">
                      <TeacherResponses />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/workspace/:workspaceId/playground/history"
                  element={
                    <ProtectedRoute allowedRole="STUDENT">
                      <StudentResponses />
                    </ProtectedRoute>
                  }
                />

                {/* Student dashboard */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRole="STUDENT">
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Shared workspace */}
                <Route
                  path="/workspace/:workspaceId"
                  element={<WorkspaceDetail />}
                />

                {/* Top-level playground entry page */}
                <Route path="/playground" element={<PlaygroundHome />} />

                {/* Workspace-specific coding playground */}
                <Route
                  path="/workspace/:workspaceId/playground"
                  element={<Playground />}
                />

                {/* Shared leaderboard */}
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Route>
            </Route>

            {/* Error pages */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route path="/404" element={<NotFound />} />

            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
