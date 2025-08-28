import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DataCatalog } from './pages/DataCatalog';
import { LineageGraphPage } from './pages/LineageGraph';
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
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Governance</h1>
              <p className="text-gray-600">Data governance and policy management</p>
            </div>
            <div className="card">
              <p className="text-gray-600">Governance features coming soon...</p>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Platform configuration and preferences</p>
            </div>
            <div className="card">
              <p className="text-gray-600">Settings features coming soon...</p>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
