import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Bell, Shield, Palette, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ name: '', role: '', avatar_color: 'var(--primary)' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile({ name: data.name || '', role: data.role || '', avatar_color: data.avatar_color || 'var(--primary)' });
    };
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);
      if (error) throw error;
      setMessage('Profile updated successfully!');
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="header glass-panel edge-glow" style={{ padding: '32px 40px', marginBottom: '40px', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <SettingsIcon size={32} color="var(--primary)" />
          <div>
            <h1 className="header-title" style={{ fontSize: '32px', margin: 0 }}>Settings</h1>
            <p className="text-muted" style={{ margin: 0 }}>Manage your account and preferences.</p>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Profile', 'Notifications', 'Security', 'Appearance'].map((tab, i) => (
              <button 
                key={tab} 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: i === 0 ? 'rgba(208, 188, 255, 0.1)' : 'transparent', border: '1px solid transparent', borderColor: i === 0 ? 'rgba(208, 188, 255, 0.2)' : 'transparent', borderRadius: '12px', color: i === 0 ? 'var(--primary)' : 'var(--on-surface)', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
              >
                {i === 0 && <User size={18} />}
                {i === 1 && <Bell size={18} />}
                {i === 2 && <Shield size={18} />}
                {i === 3 && <Palette size={18} />}
                {tab}
              </button>
            ))}
          </div>

          <div className="glass-panel edge-glow" style={{ padding: '40px', borderRadius: '1.5rem' }}>
            <h2 style={{ fontSize: '24px', margin: '0 0 24px 0' }}>Profile Settings</h2>
            
            {message && (
              <div style={{ padding: '12px', background: message.includes('success') ? 'rgba(76, 215, 246, 0.1)' : 'rgba(255, 180, 171, 0.1)', color: message.includes('success') ? 'var(--tertiary)' : 'var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
                {message}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `rgba(${profile.avatar_color.includes('primary') ? '208, 188, 255' : profile.avatar_color.includes('secondary') ? '251, 171, 255' : '76, 215, 246'}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${profile.avatar_color}` }}>
                  <span style={{ fontSize: '32px', color: profile.avatar_color, fontWeight: 600 }}>{profile.name.charAt(0) || user?.email?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Avatar Color</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['var(--primary)', 'var(--secondary)', 'var(--tertiary)', '#ff8a65', '#aed581'].map(color => (
                      <div 
                        key={color} 
                        onClick={() => setProfile({ ...profile, avatar_color: color })}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', background: color, cursor: 'pointer', border: profile.avatar_color === color ? '2px solid white' : '2px solid transparent', boxShadow: profile.avatar_color === color ? `0 0 10px ${color}` : 'none' }} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Full Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Role</label>
                <input 
                  type="text" 
                  value={profile.role} 
                  onChange={e => setProfile({ ...profile, role: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Email Address (Read Only)</label>
                <input 
                  type="email" 
                  readOnly 
                  value={user?.email || ''} 
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--on-surface-variant)', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ marginTop: '16px' }}>
                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 32px', fontSize: '16px' }}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Settings;
