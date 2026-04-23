import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Supply from './pages/Supply';
import Inventory from './pages/Inventory';
import Tracking from './pages/Tracking';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/main.css';

// Layout component for dashboard pages
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-bg-secondary">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onMenuClick={() => setSidebarOpen(true)} title={pageTitle} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Page wrapper with title setting
const Page = ({ children, title }) => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-2">
          {title}
        </h1>
        <p className="text-text-secondary">
          {title === 'Dashboard' && 'Overview of your supply chain performance'}
          {title === 'Supply' && 'Manage suppliers and procurement'}
          {title === 'Inventory' && 'Track and manage your stock levels'}
          {title === 'Tracking' && 'Track your shipments in real-time'}
          {title === 'Profile' && 'Manage your account settings'}
        </p>
      </div>
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/supply"
            element={
              <DashboardLayout>
                <Supply />
              </DashboardLayout>
            }
          />
          <Route
            path="/inventory"
            element={
              <DashboardLayout>
                <Inventory />
              </DashboardLayout>
            }
          />
          <Route
            path="/tracking"
            element={
              <DashboardLayout>
                <Tracking />
              </DashboardLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            }
          />
          <Route
            path="/assistant"
            element={
              <DashboardLayout>
                <Assistant />
              </DashboardLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
