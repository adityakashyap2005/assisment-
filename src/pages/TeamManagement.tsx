import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { UserPlus, MoreHorizontal, Settings, Shield, Code, PenTool, LayoutDashboard, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { timeAgo } from '../lib/utils';

interface Profile {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar_color: string;
  last_active?: string;
  created_at: string;
}

const TeamManagement = () => {
  const isGlobalAdmin = localStorage.getItem('userRole') === 'admin';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [members, setMembers] = useState<Profile[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

  useEffect(() => {
    let cancelled = false;
    const fetchTeam = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');
        
      if (cancelled) return;
      if (error) setError(error.message);
      else setMembers(data as Profile[] ?? []);
      setLoading(false);
    };
    
    fetchTeam();
    return () => { cancelled = true; };
  }, []);

  const getRoleIcon = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('admin') || r.includes('manager')) return <Shield size={14} />;
    if (r.includes('dev') || r.includes('backend') || r.includes('frontend')) return <Code size={14} />;
    if (r.includes('design')) return <PenTool size={14} />;
    if (r.includes('product')) return <LayoutDashboard size={14} />;
    return <Settings size={14} />;
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setLoading(true);
    // Real app would send email via Edge Function or similar. Here we simulate.
    setTimeout(() => {
      alert(`Invitation sent to ${inviteEmail} for role ${inviteRole}`);
      setShowInviteModal(false);
      setInviteEmail('');
      setLoading(false);
    }, 1000);
  };

  if (loading && members.length === 0) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '64px', height: '64px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="header glass-panel edge-glow" style={{ padding: '32px 40px', marginBottom: '40px', borderRadius: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(30,31,37,0.7), rgba(15,16,20,0.8))' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ padding: '6px 12px', background: 'rgba(208, 188, 255, 0.1)', color: 'var(--primary)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>WORKSPACE</span>
              <span style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>{members.length} Active Members</span>
            </div>
            <h1 className="header-title" style={{ fontSize: '32px' }}>Team Operations Center</h1>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {isGlobalAdmin && (
               <button onClick={() => setShowInviteModal(true)} className="btn-primary" style={{ padding: '14px 28px', fontSize: '16px', background: 'linear-gradient(to right, var(--primary), var(--secondary))', boxShadow: '0 4px 20px rgba(208, 188, 255, 0.3)' }}>
                 <UserPlus size={20} /> Invite Member
               </button>
            )}
          </div>
        </header>
        
        {error && (
          <div style={{ padding: '12px', background: 'rgba(255, 180, 171, 0.1)', color: 'var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {['All Members', 'Engineering', 'Design', 'Product'].map((filter, i) => (
            <button key={filter} style={{ 
              padding: '10px 24px', 
              borderRadius: '9999px', 
              background: i === 0 ? 'rgba(208, 188, 255, 0.15)' : 'transparent', 
              border: i === 0 ? '1px solid rgba(208, 188, 255, 0.3)' : '1px solid rgba(255,255,255,0.1)', 
              color: i === 0 ? 'var(--primary)' : 'var(--on-surface-variant)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}>
              {filter}
            </button>
          ))}
        </div>
        
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
           {members.map((member) => (
             <div key={member.id} className="glass-panel card edge-glow" style={{ position: 'relative', overflow: 'hidden', padding: '32px 24px' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '120px', background: `linear-gradient(to bottom, rgba(${member.avatar_color?.includes('primary') ? '208, 188, 255' : member.avatar_color?.includes('secondary') ? '251, 171, 255' : '76, 215, 246'}, 0.05), transparent)`, pointerEvents: 'none' }}></div>
                
                <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                  <MoreHorizontal size={20} />
                </button>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(30,31,37,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${member.avatar_color || 'var(--outline)'}`, boxShadow: `0 0 30px rgba(${member.avatar_color?.includes('primary') ? '208, 188, 255' : member.avatar_color?.includes('secondary') ? '251, 171, 255' : '76, 215, 246'}, 0.2)` }}>
                       <span style={{ fontSize: '36px', fontWeight: 600, color: 'var(--on-surface)' }}>{member.name.charAt(0)}</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '16px', height: '16px', borderRadius: '50%', background: member.status === 'Online' ? 'var(--tertiary)' : member.status === 'In Meeting' ? 'var(--secondary)' : member.status === 'Focus Mode' ? 'var(--primary)' : 'var(--outline)', border: '3px solid var(--surface-container-low)', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}></div>
                  </div>
                  
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: 'var(--on-surface)' }}>{member.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: member.avatar_color || 'var(--primary)', background: `rgba(${member.avatar_color?.includes('primary') ? '208, 188, 255' : member.avatar_color?.includes('secondary') ? '251, 171, 255' : '76, 215, 246'}, 0.1)`, padding: '6px 16px', borderRadius: '9999px', width: 'fit-content', margin: '0 auto' }}>
                      {getRoleIcon(member.role)}
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{member.role}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '8px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Joined</span>
                      <span style={{ fontSize: '13px', color: 'var(--on-surface)', fontWeight: 500 }}>{timeAgo(member.created_at)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>Current Status</span>
                      <span style={{ fontSize: '13px', color: member.status === 'Online' ? 'var(--tertiary)' : member.status === 'In Meeting' ? 'var(--secondary)' : member.status === 'Focus Mode' ? 'var(--primary)' : 'var(--outline)', fontWeight: 600 }}>{member.status}</span>
                    </div>
                  </div>
                  
                  <button style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--on-surface)', borderRadius: '0.75rem', fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}} onMouseOut={e => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}}>
                    Manage Permissions
                  </button>
                </div>
             </div>
           ))}
           
            {isGlobalAdmin && (
              <div onClick={() => setShowInviteModal(true)} className="glass-panel card" style={{ border: '2px dashed rgba(208, 188, 255, 0.3)', background: 'rgba(208, 188, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s', minHeight: '400px' }} onMouseOver={e => {e.currentTarget.style.background = 'rgba(208, 188, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(208, 188, 255, 0.6)'}} onMouseOut={e => {e.currentTarget.style.background = 'rgba(208, 188, 255, 0.02)'; e.currentTarget.style.borderColor = 'rgba(208, 188, 255, 0.3)'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(208, 188, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(208, 188, 255, 0.2)' }}>
                    <UserPlus size={32} color="var(--primary)" />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '18px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>Add Team Member</span>
                    <span style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Send an invitation link</span>
                  </div>
                </div>
              </div>
            )}
         </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div className="glass-panel edge-glow" style={{ padding:'40px', width:'100%', maxWidth:'480px', borderRadius:'1.5rem', display:'flex', flexDirection:'column', gap:'24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--on-surface)' }}>Invite Member</h2>
              <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Email Address *</label>
                  <input type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Role</label>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }}>
                    <option style={{ background: '#1a1b23' }}>Developer</option>
                    <option style={{ background: '#1a1b23' }}>Designer</option>
                    <option style={{ background: '#1a1b23' }}>Manager</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowInviteModal(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--on-surface)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{loading ? 'Sending...' : 'Send Invite'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default TeamManagement;
