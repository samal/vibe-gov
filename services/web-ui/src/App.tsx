import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DataCatalog } from './pages/DataCatalog';
import { LineageGraphPage } from './pages/LineageGraph';
import { Governance } from './pages/Governance';
import { Settings } from './pages/Settings';
import { useAuthStore } from './stores/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/catalog" element={
        <ProtectedRoute>
          <DataCatalog />
        </ProtectedRoute>
      } />
      
      <Route path="/lineage" element={
        <ProtectedRoute>
          <LineageGraphPage />
        </ProtectedRoute>
      } />
      
      <Route path="/governance" element={
        <ProtectedRoute>
          <Governance />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
