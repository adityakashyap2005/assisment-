import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import { Plus, Calendar, AlertCircle } from 'lucide-react';
import { formatDate, isOverdue } from '../lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  assignee_id: string | null;
  project_id: string;
  created_by: string;
  created_at: string;
  assignee?: { name: string; avatar_color: string };
}

interface Project {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  name: string;
}

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low'|'medium'|'high'>('medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    
    const fetchInitialData = async () => {
      const { data: p } = await supabase.from('projects').select('id, name');
      const { data: profs } = await supabase.from('profiles').select('id, name');
      if (cancelled) return;
      setProjects(p ?? []);
      setProfiles(profs ?? []);
      if (p && p.length > 0) {
        setSelectedProjectId(p[0].id);
      } else {
        setLoading(false);
      }
    };
    
    fetchInitialData();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!selectedProjectId) return;

    const fetchTasks = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('tasks')
        .select(`*, assignee:profiles!assignee_id(name, avatar_color)`)
        .eq('project_id', selectedProjectId)
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) setError(error.message);
      else setTasks(data as Task[] ?? []);
      setLoading(false);
    };

    fetchTasks();
    return () => { cancelled = true; };
  }, [selectedProjectId]);

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setAssigneeId(task.assignee_id || '');
      setDueDate(task.due_date || '');
    } else {
      setEditingTask(null);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssigneeId('');
      setDueDate('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProjectId || !title) return;

    setLoading(true);
    
    try {
      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update({
            title,
            description,
            priority,
            assignee_id: assigneeId || null,
            due_date: dueDate || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTask.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert({
            project_id: selectedProjectId,
            title,
            description,
            status: 'todo',
            priority,
            assignee_id: assigneeId || null,
            due_date: dueDate || null,
            created_by: user.id
          })
          .select()
          .single();

        if (error) throw error;
        
        // Notifications
        if (assigneeId && assigneeId !== user.id) {
          await supabase.from('notifications').insert({
            user_id: assigneeId,
            title: 'New task assigned',
            message: `You were assigned: "${title}"`,
            type: 'task_assigned',
            link: `/tasks`
          });
        }
      }

      // Refresh tasks
      const { data: updatedTasks } = await supabase
        .from('tasks')
        .select(`*, assignee:profiles!assignee_id(name, avatar_color)`)
        .eq('project_id', selectedProjectId)
        .order('created_at', { ascending: false });
        
      setTasks(updatedTasks as Task[] ?? []);
      closeModal();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId);
      
      if (error) throw error;
      
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const renderColumn = (status: string, title: string) => {
    const colTasks = tasks.filter(t => t.status === status);
    
    return (
      <div className="glass-panel" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--on-surface)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
          <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '9999px' }}>{colTasks.length}</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {colTasks.map(task => {
            const overdue = isOverdue(task.due_date, task.status);
            return (
              <div 
                key={task.id} 
                className="glass-panel card edge-glow"
                style={{ padding: '16px', border: overdue ? '1px solid var(--error)' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
                onClick={() => openModal(task)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: task.priority === 'high' ? 'var(--error)' : task.priority === 'medium' ? 'var(--tertiary)' : 'var(--primary)', background: `rgba(255,255,255,0.05)`, padding: '2px 6px', borderRadius: '4px' }}>
                    {task.priority}
                  </span>
                  {overdue && <AlertCircle size={14} color="var(--error)" />}
                </div>
                
                <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--on-surface)' }}>{task.title}</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: overdue ? 'var(--error)' : 'var(--outline)' }}>
                    <Calendar size={12} /> {formatDate(task.due_date)}
                  </div>
                  
                  {task.assignee && (
                    <div title={task.assignee.name} style={{ width: '24px', height: '24px', borderRadius: '50%', background: `rgba(${task.assignee.avatar_color?.includes('primary') ? '208, 188, 255' : '76, 215, 246'}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${task.assignee.avatar_color}` }}>
                      <span style={{ fontSize: '10px', color: task.assignee.avatar_color, fontWeight: 600 }}>{task.assignee.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {status !== 'todo' && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, 'todo'); }} style={{ flex: 1, padding: '4px', fontSize: '11px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--outline)', borderRadius: '4px', cursor: 'pointer' }}>Todo</button>}
                  {status !== 'in_progress' && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, 'in_progress'); }} style={{ flex: 1, padding: '4px', fontSize: '11px', background: 'rgba(208, 188, 255, 0.1)', border: 'none', color: 'var(--primary)', borderRadius: '4px', cursor: 'pointer' }}>Doing</button>}
                  {status !== 'done' && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, 'done'); }} style={{ flex: 1, padding: '4px', fontSize: '11px', background: 'rgba(76, 215, 246, 0.1)', border: 'none', color: 'var(--tertiary)', borderRadius: '4px', cursor: 'pointer' }}>Done</button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading && !tasks.length && !projects.length) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '64px', height: '64px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="header glass-panel edge-glow" style={{ padding: '24px', marginBottom: '40px', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="header-title" style={{ fontSize: '24px' }}>Tasks</h1>
            <p className="text-muted">Kanban board workload management.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <select 
              value={selectedProjectId} 
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="glass-panel"
              style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--on-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', outline: 'none' }}
            >
              {projects.map(p => <option key={p.id} value={p.id} style={{ background: '#1a1b23' }}>{p.name}</option>)}
            </select>
            <button className="btn-primary" onClick={() => openModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
              <Plus size={20} /> New Task
            </button>
          </div>
        </header>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(255, 180, 171, 0.1)', color: 'var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {loading && tasks.length > 0 && (
          <p className="text-muted" style={{ marginBottom: '16px' }}>Refreshing...</p>
        )}

        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '24px' }}>
          {renderColumn('todo', 'To Do')}
          {renderColumn('in_progress', 'In Progress')}
          {renderColumn('done', 'Done')}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
            <div className="glass-panel edge-glow" style={{ padding:'40px', width:'100%', maxWidth:'480px', borderRadius:'1.5rem', display:'flex', flexDirection:'column', gap:'24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--on-surface)' }}>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Title *</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }} />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value as any)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }}>
                      <option value="low" style={{ background: '#1a1b23' }}>Low</option>
                      <option value="medium" style={{ background: '#1a1b23' }}>Medium</option>
                      <option value="high" style={{ background: '#1a1b23' }}>High</option>
                    </select>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Due Date</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--on-surface-variant)' }}>Assignee</label>
                  <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--on-surface)', boxSizing: 'border-box' }}>
                    <option value="" style={{ background: '#1a1b23' }}>Unassigned</option>
                    {profiles.map(p => <option key={p.id} value={p.id} style={{ background: '#1a1b23' }}>{p.name}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'flex-end' }}>
                  {editingTask && (
                    <button type="button" onClick={() => { handleDelete(editingTask.id); closeModal(); }} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)', borderRadius: '8px', cursor: 'pointer', marginRight: 'auto' }}>
                      Delete
                    </button>
                  )}
                  <button type="button" onClick={closeModal} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--on-surface)', borderRadius: '8px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    {loading ? 'Saving...' : 'Save Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Tasks;
