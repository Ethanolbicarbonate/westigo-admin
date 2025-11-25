import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Facilities from './pages/Facilities';
import Spaces from './pages/Spaces';
import Events from './pages/Events';
import Lists from './pages/Lists';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/facilities"
          element={
            <ProtectedRoute>
              <Facilities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spaces"
          element={
            <ProtectedRoute>
              <Spaces />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists"
          element={
            <ProtectedRoute>
              <Lists />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;