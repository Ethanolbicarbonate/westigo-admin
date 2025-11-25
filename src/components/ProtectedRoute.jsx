import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // TODO: In Phase 2, we will replace this with real Supabase auth state
  const isAuthenticated = true; // 🔒 CHANGE THIS to 'true' to test access
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}