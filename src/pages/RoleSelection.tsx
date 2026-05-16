
import { Link } from 'react-router-dom';
import { Settings, User } from 'lucide-react';

const RoleSelection = () => {
  return (
    <div className="page-center">
      <div className="glass-panel edge-glow" style={{ padding: '48px', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
        <div className="text-center">
          <h2 className="header-title" style={{ fontSize: '32px' }}>Select Your TaskFlow Role</h2>
          <p className="text-muted" style={{ marginTop: '8px' }}>Choose your operational context for this session.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '24px', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/login?role=admin" style={{ textDecoration: 'none', flex: '1', minWidth: '280px' }}>
            <div className="glass-panel edge-glow card" style={{ transition: 'transform 0.2s', cursor: 'pointer', height: '100%' }}>
              <div style={{ padding: '16px', background: 'rgba(208, 188, 255, 0.1)', borderRadius: '50%', width: 'fit-content', marginBottom: '16px' }}>
                <Settings size={32} color="var(--primary)" />
              </div>
              <h3 className="card-title" style={{ fontSize: '24px' }}>Workspace Admin</h3>
              <p className="text-muted">Manage projects, settings, and team access.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--tertiary)' }}>
                <li style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--tertiary)', borderRadius: '50%' }}></span> Full System Access</li>
                <li style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--tertiary)', borderRadius: '50%' }}></span> Billing Control</li>
              </ul>
            </div>
          </Link>
          
          <Link to="/login?role=member" style={{ textDecoration: 'none', flex: '1', minWidth: '280px' }}>
            <div className="glass-panel edge-glow card" style={{ transition: 'transform 0.2s', cursor: 'pointer', height: '100%' }}>
              <div style={{ padding: '16px', background: 'rgba(251, 171, 255, 0.1)', borderRadius: '50%', width: 'fit-content', marginBottom: '16px' }}>
                <User size={32} color="var(--secondary)" />
              </div>
              <h3 className="card-title" style={{ fontSize: '24px' }}>Project Member</h3>
              <p className="text-muted">Execute tasks, collaborate, and report status.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--tertiary)' }}>
                <li style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--tertiary)', borderRadius: '50%' }}></span> Task Execution</li>
                <li style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ display: 'inline-block', width: '6px', height: '6px', background: 'var(--tertiary)', borderRadius: '50%' }}></span> Limited Access</li>
              </ul>
            </div>
          </Link>
        </div>
        
        <div>
          <a href="#" style={{ color: 'var(--outline)', textDecoration: 'none', fontSize: '14px' }}>Need help? Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
