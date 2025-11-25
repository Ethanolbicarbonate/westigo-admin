import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

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

        {/* Protected Routes wrapped in Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/events" element={<Events />} />
          <Route path="/lists" element={<Lists />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Global Toast Container */}
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;