import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, Folder, Settings, LogOut, CheckSquare, Activity, Box } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isGlobalAdmin = localStorage.getItem('userRole') === 'admin';

  if (isGlobalAdmin) {
    return (
      <aside style={{ width: '260px', padding: '32px 24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#111318', zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '48px' }}>
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} color="#000" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Command Center</h3>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--outline)', letterSpacing: '0.1em' }}>V3.0 SPATIAL</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: isActive('/dashboard') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/dashboard') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin-ops" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: isActive('/admin-ops') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/admin-ops') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            <Shield size={20} /> Admin Ops
          </Link>
          <Link to="/project-details" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: isActive('/project-details') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/project-details') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            <Folder size={20} /> Workspaces
          </Link>
          <Link to="/tasks" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: isActive('/tasks') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/tasks') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            <CheckSquare size={20} /> Tasks
          </Link>
          <Link to="/team-management" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: isActive('/team-management') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/team-management') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            <Users size={20} /> Team
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--outline)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, cursor: 'not-allowed', opacity: 0.5 }}>
            <Activity size={20} /> Analytics
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--outline)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, cursor: 'not-allowed', opacity: 0.5 }}>
            <Box size={20} /> Archive
          </div>
        </nav>

        <button 
          onClick={() => supabase.auth.signOut()} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: '#ff4d4d', backgroundColor: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', marginTop: 'auto', fontSize: '14px', fontWeight: 500 }}
        >
          <LogOut size={20} /> Sign Out
        </button>
      </aside>
    );
  }

  const activeClass = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <aside className="sidebar glass-panel" style={{ borderRadius: 0 }}>
      <div className="brand">
        <Shield size={32} color="var(--primary)" />
        <span>TASKFLOW</span>
      </div>
      
      <nav className="nav-menu">
        <Link to="/dashboard" className={`nav-item ${activeClass('/dashboard')}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/project-details" className={`nav-item ${activeClass('/project-details')}`}>
          <Folder size={20} /> Projects
        </Link>
        <Link to="/tasks" className={`nav-item ${activeClass('/tasks')}`}>
          <CheckSquare size={20} /> Tasks
        </Link>
        <Link to="/team-management" className={`nav-item ${activeClass('/team-management')}`}>
          <Users size={20} /> Team
        </Link>
        <Link to="/settings" className={`nav-item ${activeClass('/settings')}`}>
          <Settings size={20} /> Settings
        </Link>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="nav-item" 
          style={{ background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', marginTop: 'auto' }}
        >
          <LogOut size={20} /> Sign Out
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
