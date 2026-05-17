import React from 'react';
import { 
  Bell, Settings, Rocket, Info, Zap, UserPlus, 
  RefreshCw, X, Search, ShieldCheck 
} from 'lucide-react';
// Removed react-router-dom imports
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';

const AdminOps = () => {
  // Removed location logic

  // State for Project Creation
  const [projectName, setProjectName] = React.useState('');
  const [projectDesc, setProjectDesc] = React.useState('');
  const [projectLoading, setProjectLoading] = React.useState(false);

  // State for User Provisioning
  const [memberName, setMemberName] = React.useState('');
  const [memberEmail, setMemberEmail] = React.useState('');
  const [memberRole, setMemberRole] = React.useState('Intern');
  const [memberLoading, setMemberLoading] = React.useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName) return;
    setProjectLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({ name: projectName, description: projectDesc })
        .select()
        .single();
        
      if (error) throw error;
      alert(`Project "${data.name}" successfully created!`);
      setProjectName('');
      setProjectDesc('');
    } catch (err: any) {
      alert(`Error creating project: ${err.message}`);
    } finally {
      setProjectLoading(false);
    }
  };

  const handleProvisionUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberEmail) return;
    setMemberLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: memberEmail,
        password: 'TaskflowPassword123!',
        options: {
          data: {
            name: memberName
          }
        }
      });
      
      if (error) throw error;
      
      // Update their role in the profiles table after creation
      if (data.user) {
        await supabase
          .from('profiles')
          .update({ role: memberRole })
          .eq('id', data.user.id);
      }
      
      alert(`Successfully added ${memberName} as ${memberRole}. They will now appear in the Team section.`);
      setMemberName('');
      setMemberEmail('');
    } catch (err: any) {
      alert(`Error adding team member: ${err.message}`);
    } finally {
      setMemberLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0c0e13', color: '#e2e2e9', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navbar */}
        <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: '20px', letterSpacing: '-0.02em', color: '#fff' }}>Aethera</h2>
            <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: 500 }}>
              <span style={{ color: 'var(--outline)', cursor: 'pointer' }}>Overview</span>
              <span style={{ color: '#fff', borderBottom: '2px solid var(--primary)', paddingBottom: '4px', cursor: 'pointer' }}>Command Center</span>
              <span style={{ color: 'var(--outline)', cursor: 'pointer' }}>Security</span>
            </nav>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Bell size={20} color="var(--outline)" style={{ cursor: 'pointer' }} />
            <Settings size={20} color="var(--outline)" style={{ cursor: 'pointer' }} />
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}></div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '8px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>Admin Operations</h1>
            <p style={{ margin: 0, color: 'var(--outline)', fontSize: '16px' }}>Initialize secure environments and provision team access in the spatial layer.</p>
          </div>

          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            
            {/* Initialize Project Workspace Card */}
            <form onSubmit={handleCreateProject} style={{ flex: 1, minWidth: '400px', background: 'rgba(30,31,37,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(76, 215, 246, 0.1)', padding: '12px', borderRadius: '12px' }}>
                  <Rocket color="var(--tertiary)" size={24} />
                </div>
                <h2 style={{ color: 'var(--tertiary)', margin: 0, fontSize: '20px', fontWeight: 600 }}>Initialize Project<br/>Workspace</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.05em' }}>PROJECT TITLE *</label>
                <input 
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Project 'Aether' Deployment" 
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '16px 20px', color: '#fff', fontSize: '14px', outline: 'none' }} 
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.05em' }}>DESCRIPTION</label>
                <textarea 
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Briefly describe the workspace scope and security parameters..." 
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '16px 20px', color: '#fff', fontSize: '14px', outline: 'none', minHeight: '100px', resize: 'none', fontFamily: 'inherit' }} 
                />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px 20px', borderRadius: '999px', display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--outline)' }}>
                <Info size={18} color="var(--tertiary)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: 1.4 }}>Workspace initialization will trigger automated repository generation and CI/CD pipeline configuration.</span>
              </div>

              <button disabled={projectLoading} type="submit" style={{ background: 'linear-gradient(to right, #00d2ff, #3a7bd5)', color: '#000', border: 'none', borderRadius: '999px', padding: '16px', fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', marginTop: 'auto', cursor: projectLoading ? 'not-allowed' : 'pointer', opacity: projectLoading ? 0.7 : 1, boxShadow: '0 0 20px rgba(0,210,255,0.3)' }}>
                <Zap size={20} /> {projectLoading ? 'Initializing...' : 'Create Project'}
              </button>
            </form>

            {/* Onboard Team & Generate IDs Card */}
            <form onSubmit={handleProvisionUser} style={{ flex: 1, minWidth: '400px', background: 'rgba(30,31,37,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(251, 171, 255, 0.1)', padding: '12px', borderRadius: '12px' }}>
                  <UserPlus color="var(--secondary)" size={24} />
                </div>
                <h2 style={{ color: 'var(--secondary)', margin: 0, fontSize: '20px', fontWeight: 600 }}>Onboard Team &<br/>Generate IDs</h2>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.05em' }}>FULL NAME *</label>
                  <input required value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Alex Sterling" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '16px 20px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.05em' }}>EMAIL ADDRESS *</label>
                  <input required value={memberEmail} onChange={e => setMemberEmail(e.target.value)} placeholder="a.sterling@taskflo" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '16px 20px', color: '#fff', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.05em' }}>SELECT ROLE</label>
                  <div style={{ position: 'relative' }}>
                    <select value={memberRole} onChange={e => setMemberRole(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '16px 20px', color: '#fff', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                      <option style={{ background: '#1a1b23' }}>Employee</option>
                      <option style={{ background: '#1a1b23' }}>Intern</option>
                      <option style={{ background: '#1a1b23' }}>Manager</option>
                      <option style={{ background: '#1a1b23' }}>Admin</option>
                    </select>
                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 1.5L6 6L10.5 1.5" stroke="#958ea0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.05em' }}>ASSIGNED ID</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ background: 'rgba(251, 171, 255, 0.05)', border: '1px solid rgba(251, 171, 255, 0.3)', color: 'var(--secondary)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', lineHeight: '1.1' }}>
                      TF-<br/>INT-<br/>001
                    </div>
                    <button type="button" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', width: '48px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--outline)', cursor: 'pointer' }}>
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', letterSpacing: '0.05em' }}>ACTIVE PROJECTS</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: 'rgba(251, 171, 255, 0.15)', color: 'var(--secondary)', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Aether <X size={12} style={{ cursor: 'pointer' }} />
                  </span>
                  <span style={{ background: 'rgba(208, 188, 255, 0.15)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Horizon <X size={12} style={{ cursor: 'pointer' }} />
                  </span>
                  <span style={{ color: 'var(--outline)', fontSize: '13px', marginLeft: '4px' }}>Select more...</span>
                  <Search size={16} color="var(--outline)" style={{ marginLeft: 'auto' }} />
                </div>
              </div>

              <button disabled={memberLoading} type="submit" style={{ background: 'linear-gradient(to right, #d926b0, #9628e3)', color: '#fff', border: 'none', borderRadius: '999px', padding: '16px', fontSize: '16px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', marginTop: 'auto', cursor: memberLoading ? 'not-allowed' : 'pointer', opacity: memberLoading ? 0.7 : 1, boxShadow: '0 0 20px rgba(217,38,176,0.3)' }}>
                <ShieldCheck size={20} /> {memberLoading ? 'Adding...' : 'Add Team Member'}
              </button>
            </form>

          </div>

          {/* Bottom Area Status */}
          <div style={{ background: 'rgba(30,31,37,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '140px', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
            <div style={{ position: 'absolute', zIndex: 1, letterSpacing: '0.4em', fontSize: '12px', color: 'var(--outline)', fontWeight: 700 }}>
              SPATIAL SYSTEM STATUS : NOMINAL
            </div>
            
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', opacity: 0.15 }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '10px solid #fff', borderTopColor: 'transparent', transform: 'rotate(45deg)' }}></div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                {[40, 70, 45, 90, 60, 80, 50, 100, 30, 60, 40, 80].map((h, i) => (
                  <div key={i} style={{ width: '8px', height: `${h}px`, background: '#fff', borderRadius: '4px' }}></div>
                ))}
              </div>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px dashed #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #fff' }}></div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminOps;
