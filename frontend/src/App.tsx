import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Dashboard - Protected */}
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <Navigate to="/signin" />
            </SignedOut>
          </>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
