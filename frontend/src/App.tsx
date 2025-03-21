// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUserContext } from './context/UserContext';

import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';

export default function App() {
  const { user } = useUserContext();

  return (
    <Routes>
      {/* If user is logged in, redirect from auth pages to dashboard */}
      <Route path="/signin" element={!user ? <AuthPage /> : <Navigate to="/todos" />} />
      <Route path="/signup" element={!user ? <AuthPage /> : <Navigate to="/todos" />} />

      {/* Dashboard - protected route */}
      <Route path="/todos" element={user ? <Dashboard /> : <Navigate to="/signin" />} />

      {/* Default route */}
      <Route path="/" element={<Navigate to={user ? "/todos" : "/signin"} />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
