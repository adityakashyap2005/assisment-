import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, Folder, Settings, LogOut, CheckSquare, Activity, Box } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const isGlobalAdmin = localStorage.getItem('userRole') === 'admin';

  if (isGlobalAdmin) {
    return (
      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        style={{ width: isExpanded ? '260px' : '80px', transition: 'width 0.3s ease', padding: isExpanded ? '32px 24px' : '32px 16px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#111318', zIndex: 10, flexShrink: 0, position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '48px', justifyContent: isExpanded ? 'flex-start' : 'center' }}>
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px', height: '40px' }}>
            <Activity size={20} color="#000" />
          </div>
          {isExpanded && (
            <div style={{ whiteSpace: 'nowrap' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Command Center</h3>
              <p style={{ margin: 0, fontSize: '10px', color: 'var(--outline)', letterSpacing: '0.1em' }}>V3.0 SPATIAL</p>
            </div>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: isActive('/dashboard') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/dashboard') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500, justifyContent: isExpanded ? 'flex-start' : 'center' }}>
            <LayoutDashboard size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Dashboard</span>}
          </Link>
          <Link to="/admin-ops" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: isActive('/admin-ops') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/admin-ops') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500, justifyContent: isExpanded ? 'flex-start' : 'center' }}>
            <Shield size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Admin Ops</span>}
          </Link>
          <Link to="/project-details" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: isActive('/project-details') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/project-details') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500, justifyContent: isExpanded ? 'flex-start' : 'center' }}>
            <Folder size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Workspaces</span>}
          </Link>
          <Link to="/tasks" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: isActive('/tasks') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/tasks') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500, justifyContent: isExpanded ? 'flex-start' : 'center' }}>
            <CheckSquare size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Tasks</span>}
          </Link>
          <Link to="/team-management" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: isActive('/team-management') ? 'var(--primary)' : 'var(--outline)', backgroundColor: isActive('/team-management') ? 'rgba(208, 188, 255, 0.1)' : 'transparent', textDecoration: 'none', fontSize: '14px', fontWeight: 500, justifyContent: isExpanded ? 'flex-start' : 'center' }}>
            <Users size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Team</span>}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: 'var(--outline)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, cursor: 'not-allowed', opacity: 0.5, justifyContent: isExpanded ? 'flex-start' : 'center' }}>
            <Activity size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Analytics</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: 'var(--outline)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, cursor: 'not-allowed', opacity: 0.5, justifyContent: isExpanded ? 'flex-start' : 'center' }}>
            <Box size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Archive</span>}
          </div>
        </nav>

        <button 
          onClick={() => supabase.auth.signOut()} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', color: '#ff4d4d', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', marginTop: 'auto', fontSize: '14px', fontWeight: 500, justifyContent: isExpanded ? 'flex-start' : 'center' }}
        >
          <LogOut size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Sign Out</span>}
        </button>
      </aside>
    );
  }

  const activeClass = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <aside 
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="sidebar glass-panel" 
      style={{ borderRadius: 0, width: isExpanded ? '280px' : '80px', transition: 'width 0.3s ease', padding: isExpanded ? '32px 24px' : '32px 16px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}
    >
      <div className="brand" style={{ justifyContent: isExpanded ? 'flex-start' : 'center', gap: '12px', marginBottom: '32px' }}>
        <Shield size={32} color="var(--primary)" style={{ minWidth: '32px' }} />
        {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>AETHERA</span>}
      </div>
      
      <nav className="nav-menu" style={{ gap: '8px' }}>
        <Link to="/dashboard" className={`nav-item ${activeClass('/dashboard')}`} style={{ justifyContent: isExpanded ? 'flex-start' : 'center', padding: '12px' }}>
          <LayoutDashboard size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Dashboard</span>}
        </Link>
        <Link to="/project-details" className={`nav-item ${activeClass('/project-details')}`} style={{ justifyContent: isExpanded ? 'flex-start' : 'center', padding: '12px' }}>
          <Folder size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Projects</span>}
        </Link>
        <Link to="/tasks" className={`nav-item ${activeClass('/tasks')}`} style={{ justifyContent: isExpanded ? 'flex-start' : 'center', padding: '12px' }}>
          <CheckSquare size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Tasks</span>}
        </Link>
        <Link to="/team-management" className={`nav-item ${activeClass('/team-management')}`} style={{ justifyContent: isExpanded ? 'flex-start' : 'center', padding: '12px' }}>
          <Users size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Team</span>}
        </Link>
        <Link to="/settings" className={`nav-item ${activeClass('/settings')}`} style={{ justifyContent: isExpanded ? 'flex-start' : 'center', padding: '12px' }}>
          <Settings size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Settings</span>}
        </Link>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="nav-item" 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginTop: 'auto', justifyContent: isExpanded ? 'flex-start' : 'center', padding: '12px' }}
        >
          <LogOut size={20} style={{ minWidth: '20px' }} /> {isExpanded && <span style={{ whiteSpace: 'nowrap' }}>Sign Out</span>}
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
