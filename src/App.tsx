
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import SpatialBackground from './components/SpatialBackground';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RoleSelection from './pages/RoleSelection';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import TeamManagement from './pages/TeamManagement';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import AdminOps from './pages/AdminOps';
import './index.css';

const ProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/role-selection" replace />;
  return <Outlet />;
};

const AuthRoute = () => {
  const { user } = useAuth();
  if (user) {
    const isRoleAdmin = window.location.search.includes('role=admin');
    return <Navigate to={isRoleAdmin ? "/admin-ops" : "/dashboard"} replace />;
  }
  return <Outlet />;
};

function AppRoutes() {
  return (
    <Router>
      <SpatialBackground />
      <Routes>
        <Route path="/" element={<Navigate to="/role-selection" replace />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin-ops" element={<AdminOps />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project-details" element={<ProjectDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/team-management" element={<TeamManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/role-selection" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
