import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

// Page Components
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { VerifyOtp } from "./pages/VerifyOtp";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import { WorkspaceDetail } from "./pages/WorkspaceDetail";
import { Leaderboard } from "./pages/Leaderboard";
import { Unauthorized } from "./pages/Unauthorized";
import { NotFound } from "./pages/NotFound";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

// Landing route redirect based on authentication
const HomeRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === "TEACHER" ? (
    <Navigate to="/teacher/dashboard" replace />
  ) : (
    <Navigate to="/student/dashboard" replace />
  );
};

// Layout Wrapper
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
            {/* PUBLIC AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password"element={<ForgotPassword />}/>
            <Route path="/reset-password" element={<ResetPassword />}/>

            {/* ROOT LANDING PATH */}
            <Route path="/" element={<HomeRedirect />} />

            {/* SECURED HUB SECTION */}
            <Route element={<ProtectedRoute />}>
              <Route element={<LayoutWrapper />}>
                {/* Teacher */}
                <Route
                  path="/teacher/dashboard"
                  element={
                    <ProtectedRoute allowedRole="TEACHER">
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Student */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRole="STUDENT">
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Shared Workspace */}
                <Route
                  path="/workspace/:workspaceId"
                  element={<WorkspaceDetail />}
                />

                {/* Leaderboard */}
                <Route
                  path="/leaderboard"
                  element={<Leaderboard />}
                />
              </Route>
            </Route>

            {/* ERROR PAGES */}
            <Route
              path="/unauthorized"
              element={<Unauthorized />}
            />

            <Route
              path="/404"
              element={<NotFound />}
            />

            <Route
              path="*"
              element={<Navigate to="/404" replace />}
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}