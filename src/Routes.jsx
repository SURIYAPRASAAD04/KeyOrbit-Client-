import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import Unauthorized from "pages/Unauthorized";
import Login from './pages/login';
import Register from './pages/register';
import ProfileSettings from './pages/profile-settings';
import APITokensPage from './pages/api-tokens';
import Dashboard from './pages/dashboard';
import KeyManagement from './pages/key-management';
import AuditLogs from './pages/audit-logs';
import KeyDetailsPage from './pages/key-details';
import UserManagement from './pages/user-management';
import PublicLandingPage from './pages/public-landing-page';
import PolicyManagement from './pages/policy-management';
import AuthSuccess from './pages/auth/AuthSuccess';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLandingPage />} />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Register />
              </ProtectedRoute>
            } 
          />

          <Route path="/auth/success" element={<AuthSuccess />} />
          
          {/* Protected Routes - All authenticated users */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireAuth={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile-settings" 
            element={
              <ProtectedRoute requireAuth={true}>
                <ProfileSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/api-tokens" 
            element={
              <ProtectedRoute requireAuth={true}>
                <APITokensPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/key-details/:id?" 
            element={
              <ProtectedRoute requireAuth={true}>
                <KeyDetailsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Admin & Security Roles */}
          <Route 
            path="/key-management" 
            element={
              <ProtectedRoute requireAuth={true} requiredRoles={['admin', 'security']}>
                <KeyManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/audit-logs" 
            element={
              <ProtectedRoute requireAuth={true} requiredRoles={['admin', 'security', 'auditor']}>
                <AuditLogs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/policy-management" 
            element={
              <ProtectedRoute requireAuth={true} requiredRoles={['admin', 'security']}>
                <PolicyManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Admin Only */}
          <Route 
            path="/user-management" 
            element={
              <ProtectedRoute requireAuth={true} requiredRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Landing Page */}
          <Route path="/public-landing-page" element={<PublicLandingPage />} />
          
          {/* Error Pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />
          
          {/* Redirects */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />

          <Route 
            path="/forgot-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <ForgotPassword />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <ResetPassword />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;