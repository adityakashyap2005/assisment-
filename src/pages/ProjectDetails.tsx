import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Plus, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Milestone {
  id: string;
  project_id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  progress_percentage: number;
  created_at: string;
}

interface Profile {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar_color: string;
}

interface ProjectMember {
  role: string;
  profile: Profile | null;
}

const ProjectDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [selectedProfileIdToAdd, setSelectedProfileIdToAdd] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, description')
        .order('created_at', { ascending: false });
        
      if (cancelled) return;
      if (error) setError(error.message);
      else {
        setProjects(data as Project[] ?? []);
        if (data && data.length > 0) {
          setSelectedProjectId(data[0].id);
        } else {
          setLoading(false);
        }
      }
    };
    fetchProjects();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!selectedProjectId) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      
      const { data: ms, error: err1 } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', selectedProjectId)
        .order('created_at', { ascending: true });

      if (err1 && !cancelled) setError(err1.message);

      const { data: mems, error: err2 } = await supabase
        .from('project_members')
        .select(`role, profile:profiles(id, name, role, status, avatar_color)`)
        .eq('project_id', selectedProjectId);
        
      if (err2 && !cancelled) setError(err2.message);

      if (cancelled) return;
      setMilestones((ms as any) ?? []);
      setMembers((mems as any) ?? []);
      setLoading(false);
    };

    fetchDetails();
    return () => { cancelled = true; };
  }, [selectedProjectId]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newProjectName) return;
    setLoading(true);
    try {
      const { data: pData, error: pErr } = await supabase
        .from('projects')
        .insert({ name: newProjectName, description: newProjectDesc })
        .select()
        .single();
        
      if (pErr) throw pErr;
      
      const { error: pmErr } = await supabase
        .from('project_members')
        .insert({ project_id: pData.id, user_id: user.id, role: 'Admin' });
        
      if (pmErr) throw pmErr;
      
      setProjects(prev => [pData, ...prev]);
      setSelectedProjectId(pData.id);
      setShowProjectModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !newMilestoneTitle) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert({
          project_id: selectedProjectId,
          title: newMilestoneTitle,
          status: 'Pending',
          progress_percentage: 0
        })
        .select()
        .single();
        
      if (error) throw error;
      setMilestones(prev => [...prev, data as any]);
      setShowMilestoneModal(false);
      setNewMilestoneTitle('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove this member?')) return;
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', selectedProjectId)
        .eq('user_id', userId);
      if (error) throw error;
      
      // Send notification to the removed member
      await supabase.from('notifications').insert({
        user_id: userId,
        title: 'Removed from Project',
        message: `You have been removed from the project: "${selectedProject?.name || 'Unknown'}"`,
        type: 'member_joined',
        link: '/workspaces'
      });
      
      setMembers(prev => prev.filter(m => m.profile?.id !== userId));
    } catch(e: any) {
      alert(e.message);
    }
  };

  const openAddMemberModal = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) {
       const existingIds = members.map(m => m.profile?.id);
       setAllProfiles(data.filter(p => !existingIds.includes(p.id)));
       if (data.filter(p => !existingIds.includes(p.id)).length > 0) {
         setSelectedProfileIdToAdd(data.filter(p => !existingIds.includes(p.id))[0].id);
       }
    }
    setShowAddMemberModal(true);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileIdToAdd) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('project_members').insert({
        project_id: selectedProjectId,
        user_id: selectedProfileIdToAdd,
        role: 'Member'
      });
      if (error) throw error;
      
      // Send notification to the newly added member
      await supabase.from('notifications').insert({
        user_id: selectedProfileIdToAdd,
        title: 'Added to Project',
        message: `You have been added to the project: "${selectedProject?.name || 'Unknown'}"`,
        type: 'member_joined',
        link: '/workspaces'
      });
      
      setShowAddMemberModal(false);
      const { data: mems } = await supabase
        .from('project_members')
        .select(`role, profile:profiles(id, name, role, status, avatar_color)`)
        .eq('project_id', selectedProjectId);
      if (mems) setMembers(mems as any);
    } catch(e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const currentUserMember = members.find(m => m.profile?.id === user?.id);
  const isProjectAdmin = currentUserMember?.role === 'Admin';
  const isGlobalAdmin = localStorage.getItem('userRole') === 'admin';

  if (loading && !projects.length) {
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
        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <button style={{ background: 'var(--surface-container-high)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--on-surface)', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface-bright)'} onMouseOut={e => e.currentTarget.style.background = 'var(--surface-container-high)'}>
                 <ArrowLeft size={20} />
               </button>
               <select 
                 value={selectedProjectId} 
                 onChange={e => setSelectedProjectId(e.target.value)}
                 className="glass-panel"
                 style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
               >
                 {projects.map(p => <option key={p.id} value={p.id} style={{ background: '#1a1b23' }}>{p.name}</option>)}
               </select>
             </div>
             
             {isGlobalAdmin && (
               <button onClick={() => setShowProjectModal(true)} className="btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Plus size={18} /> New Project
               </button>
             )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="header-title" style={{ fontSize: '48px', margin: '0 0 16px 0', paddingLeft: '56px', background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {selectedProject?.name || 'No Project'}
              </h1>
              <p className="text-muted" style={{ paddingLeft: '56px', fontSize: '18px', maxWidth: '600px', lineHeight: 1.6 }}>
                {selectedProject?.description || 'Select or create a project to view details.'}
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(255, 180, 171, 0.1)', color: 'var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}
        
        {selectedProject && (
          <div style={{ paddingLeft: '56px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  Strategic Milestones <span style={{ fontSize: '14px', padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', fontWeight: 500 }}>{milestones.filter(m => m.status === 'Completed').length} / {milestones.length}</span>
                </h2>
                {isProjectAdmin && (
                  <button onClick={() => setShowMilestoneModal(true)} style={{ background: 'rgba(208, 188, 255, 0.1)', border: '1px solid rgba(208, 188, 255, 0.2)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, padding: '8px 16px', borderRadius: '9999px', transition: 'all 0.2s' }}>
                    <Plus size={14} /> Add Milestone
                  </button>
                )}
              </div>
              
              <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {milestones.length === 0 ? (
                  <p className="text-muted">No milestones found.</p>
                ) : milestones.map((milestone) => (
                  <div key={milestone.id} className="glass-panel edge-glow card" style={{ borderColor: milestone.status === 'Completed' ? 'var(--tertiary)' : milestone.status === 'In Progress' ? 'var(--primary)' : 'rgba(255,255,255,0.05)', opacity: milestone.status === 'Pending' ? 0.7 : 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 className="card-title" style={{ lineHeight: 1.4 }}>{milestone.title}</h3>
                      {milestone.status === 'Completed' && <CheckCircle size={20} color="var(--tertiary)" />}
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', marginTop: '24px' }}>
                      <div style={{ width: `${milestone.progress_percentage}%`, height: '100%', background: milestone.status === 'Completed' ? 'var(--tertiary)' : 'var(--primary)', borderRadius: '3px', transition: 'width 1s ease' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h2 style={{ fontSize: '20px', margin: '16px 0 0 0' }}>Development Timeline</h2>
              <div className="glass-panel" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 0%, rgba(208, 188, 255, 0.05), transparent 70%)', pointerEvents: 'none' }}></div>
                 <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ position: 'absolute', top: '16px', left: '20px', right: '20px', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
                   <div style={{ position: 'absolute', top: '16px', left: '20px', width: '55%', height: '2px', background: 'var(--primary)', zIndex: 0, boxShadow: '0 0 10px var(--primary)' }}></div>
                   
                   {[1, 2, 3, 4].map((step, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', zIndex: 1, position: 'relative' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', 
                          background: i < 2 ? 'var(--primary)' : i === 2 ? 'var(--surface-container)' : 'var(--surface)', 
                          border: `3px solid ${i < 2 ? 'var(--primary)' : i === 2 ? 'var(--primary)' : 'var(--outline)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: i === 2 ? '0 0 0 4px rgba(208, 188, 255, 0.2)' : 'none'
                        }}>
                          {i < 2 && <CheckCircle size={16} color="var(--on-primary)" />}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: i <= 2 ? 'var(--on-surface)' : 'var(--outline)' }}>Phase {step}</span>
                          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--on-surface-variant)' }}>{['Planning', 'Architecture', 'Implementation', 'Release'][i]}</p>
                        </div>
                      </div>
                   ))}
                 </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-container-low)', padding: '16px 24px', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 600 }}>Assigned Team</h2>
                {isProjectAdmin && (
                  <button onClick={openAddMemberModal} style={{ background: 'var(--primary)', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, padding: '8px 16px', borderRadius: '9999px', transition: 'all 0.2s' }}>
                    <Plus size={14} /> Add Member
                  </button>
                )}
              </div>
              
              <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {members.length === 0 ? (
                  <p className="text-muted" style={{ textAlign: 'center', margin: 0 }}>No members assigned.</p>
                ) : members.map((member) => {
                  const user = member.profile;
                  if (!user) return null;
                  return (
                    <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '0.75rem', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `rgba(${user.avatar_color?.includes('primary') ? '208, 188, 255' : user.avatar_color?.includes('secondary') ? '251, 171, 255' : '76, 215, 246'}, 0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${user.avatar_color || 'var(--outline)'}` }}>
                            <span style={{ color: user.avatar_color || 'var(--on-surface)', fontWeight: 600, fontSize: '16px' }}>{user.name?.charAt(0) || '?'}</span>
                          </div>
                          <div style={{ position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', borderRadius: '50%', background: user.status === 'Online' ? 'var(--tertiary)' : user.status === 'In Meeting' ? 'var(--secondary)' : 'var(--outline)', border: '2px solid var(--surface-container)' }}></div>
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: 'var(--on-surface)' }}>{user.name}</h4>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--on-surface-variant)' }}>{user.role}</p>
                        </div>
                      </div>
                      {isProjectAdmin && member.role !== 'Admin' && (
                        <button onClick={() => handleRemoveMember(user.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '8px', fontSize: '12px', fontWeight: 600 }}>
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Create Project Modal */}
        {showProjectModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div className="glass-panel edge-glow" style={{ padding:'40px', width:'100%', maxWidth:'480px', borderRadius:'1.5rem', display:'flex', flexDirection:'column', gap:'24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--on-surface)' }}>New Project</h2>
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Project Name *</label>
                  <input type="text" required value={newProjectName} onChange={e => setNewProjectName(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Description</label>
                  <textarea value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowProjectModal(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--on-surface)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{loading ? 'Saving...' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Milestone Modal */}
        {showMilestoneModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div className="glass-panel edge-glow" style={{ padding:'40px', width:'100%', maxWidth:'480px', borderRadius:'1.5rem', display:'flex', flexDirection:'column', gap:'24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--on-surface)' }}>Add Milestone</h2>
              <form onSubmit={handleCreateMilestone} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Milestone Title *</label>
                  <input type="text" required value={newMilestoneTitle} onChange={e => setNewMilestoneTitle(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowMilestoneModal(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--on-surface)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{loading ? 'Saving...' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div className="glass-panel edge-glow" style={{ padding:'40px', width:'100%', maxWidth:'480px', borderRadius:'1.5rem', display:'flex', flexDirection:'column', gap:'24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--on-surface)' }}>Add Team Member</h2>
              <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Select User *</label>
                  {allProfiles.length === 0 ? (
                    <p style={{ color: 'var(--outline)' }}>No new users available to add.</p>
                  ) : (
                    <select required value={selectedProfileIdToAdd} onChange={e => setSelectedProfileIdToAdd(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }}>
                      {allProfiles.map(p => <option key={p.id} value={p.id} style={{ background: '#1a1b23' }}>{p.name}</option>)}
                    </select>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddMemberModal(false)} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--on-surface)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                  {allProfiles.length > 0 && <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{loading ? 'Adding...' : 'Add'}</button>}
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ProjectDetails;
