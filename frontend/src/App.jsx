import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import AuthRoute from './components/AuthRoute';
import LoginPage from './pages/LoginPage';
import ProductListPage from './pages/ProductListPage';
import ProductFormPage from './pages/ProductFormPage';
import Notification from './components/Notification';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Notification />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={
              <AuthRoute>
                <ProductListPage />
              </AuthRoute>
            } />
            <Route path="/products/new" element={
              <AuthRoute>
                <ProductFormPage />
              </AuthRoute>
            } />
            <Route path="/products/:id/edit" element={
              <AuthRoute>
                <ProductFormPage />
              </AuthRoute>
            } />
            <Route path="/" element={<Navigate to="/products" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
