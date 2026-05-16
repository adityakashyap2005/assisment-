import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Activity, Target, ShieldAlert, Clock, CheckCircle2, Circle, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import SearchModal from '../components/SearchModal';
import NotificationBell from '../components/NotificationBell';
import { timeAgo, isOverdue, formatDate } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface DashboardMetrics {
  activeTasks: number;
  systemLoad: number;
  networkSync: number;
}

interface ActivityItem {
  id: string;
  title: string;
  status: string;
  created_at: string;
  assignee?: { name: string; avatar_color: string };
}

interface TaskItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  project?: { name: string };
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState<DashboardMetrics>({ activeTasks: 0, systemLoad: 0, networkSync: 0 });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [myTasks, setMyTasks] = useState<TaskItem[]>([]);
  const [taskFilter, setTaskFilter] = useState<'All' | 'Overdue' | 'Due Today' | 'In Progress'>('All');
  const [statusStats, setStatusStats] = useState({ todo: 0, in_progress: 0, done: 0 });
  const [userStats, setUserStats] = useState<Record<string, number>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError('');

      try {
        const { count: activeTasks, error: err1 } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'done');

        if (err1) throw err1;

        const { data: acts, error: err2 } = await supabase
          .from('activities')
          .select(`*, assignee:profiles(name, avatar_color)`)
          .order('created_at', { ascending: false })
          .limit(6);

        if (err2) throw err2;

        const { data: tasks, error: err3 } = await supabase
          .from('tasks')
          .select(`*, project:projects(name), assignee:profiles!assignee_id(name)`)
          .order('due_date', { ascending: true })
          .limit(100);

        if (err3) throw err3;

        const myTasksList = tasks?.filter(t => t.assignee_id === user.id && t.status !== 'done').slice(0, 15) || [];
        
        const counts = { todo: 0, in_progress: 0, done: 0 };
        const uCounts: Record<string, number> = {};
        
        tasks?.forEach(t => {
          if (t.status === 'todo') counts.todo++;
          else if (t.status === 'in_progress') counts.in_progress++;
          else if (t.status === 'done') counts.done++;
          
          const uName = (t.assignee as any)?.name || 'Unassigned';
          uCounts[uName] = (uCounts[uName] || 0) + 1;
        });

        if (cancelled) return;

        setMetrics({
          activeTasks: activeTasks ?? 0,
          systemLoad: Math.floor(Math.random() * 40) + 30, // simulated
          networkSync: 99.9, // simulated
        });
        setActivities(acts ?? []);
        setMyTasks(myTasksList);
        setStatusStats(counts);
        setUserStats(uCounts);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => { cancelled = true; };
  }, [user]);

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase().replace(' ', '_');
    if (s === 'completed' || s === 'done') return <CheckCircle2 size={16} color="var(--tertiary)" />;
    if (s === 'in_progress') return <Activity size={16} color="var(--primary)" />;
    if (s === 'blocked') return <AlertCircle size={16} color="var(--error)" />;
    return <Circle size={16} color="var(--outline)" />;
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase().replace(' ', '_');
    if (s === 'completed' || s === 'done') return 'rgba(76, 215, 246, 0.1)';
    if (s === 'in_progress') return 'rgba(208, 188, 255, 0.1)';
    if (s === 'blocked') return 'rgba(255, 180, 171, 0.1)';
    return 'rgba(255, 255, 255, 0.05)';
  };

  const getStatusTextColor = (status: string) => {
    const s = status.toLowerCase().replace(' ', '_');
    if (s === 'completed' || s === 'done') return 'var(--tertiary)';
    if (s === 'in_progress') return 'var(--primary)';
    if (s === 'blocked') return 'var(--error)';
    return 'var(--outline)';
  };

  const today = new Date().toISOString().split('T')[0];
  const filteredTasks = myTasks.filter(t => {
    if (taskFilter === 'Overdue') return t.due_date && t.due_date < today;
    if (taskFilter === 'Due Today') return t.due_date === today;
    if (taskFilter === 'In Progress') return t.status === 'in_progress';
    return true;
  }).slice(0, 5);

  if (loading) {
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
            <h1 className="header-title" style={{ fontSize: '24px' }}>Aether Control</h1>
            <p className="text-muted">System telemetry and active workloads.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
             <SearchModal />
             <NotificationBell />
          </div>
        </header>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(255, 180, 171, 0.1)', color: 'var(--error)', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}
        
        <div className="dashboard-grid">
          <div className="glass-panel edge-glow card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="card-title">Tasks by Status</h3>
              <Activity size={20} color="var(--primary)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>To Do</span>
                <span style={{ color: 'var(--on-surface)', fontWeight: 'bold' }}>{statusStats.todo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--primary)', fontSize: '14px' }}>In Progress</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{statusStats.in_progress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--tertiary)', fontSize: '14px' }}>Done</span>
                <span style={{ color: 'var(--tertiary)', fontWeight: 'bold' }}>{statusStats.done}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel edge-glow card">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="card-title">Tasks Per User</h3>
              <Target size={20} color="var(--tertiary)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '100px', overflowY: 'auto' }}>
              {Object.entries(userStats).map(([name, count]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>{name}</span>
                  <span style={{ color: 'var(--on-surface)', fontWeight: 'bold' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel edge-glow card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title">Network Sync</h3>
              <ShieldAlert size={20} color="var(--tertiary)" />
            </div>
            <p className="card-value" style={{ color: 'var(--tertiary)', fontSize: '48px' }}>{metrics.networkSync}%</p>
            <p className="text-muted" style={{ fontSize: '14px' }}>Node connections stable</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '40px', marginTop: '48px' }}>
          
          {/* Left Column: Global Activity Stream */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', margin: 0 }}>Global Activity Stream</h2>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>View All Logs</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activities.length === 0 ? (
                <p className="text-muted" style={{ padding: '24px' }}>No recent activity.</p>
              ) : activities.map((activity) => (
                <div key={activity.id} className="glass-panel edge-glow" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: activity.assignee ? `rgba(${activity.assignee.avatar_color?.includes('primary') ? '208, 188, 255' : '76, 215, 246'}, 0.1)` : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${activity.assignee?.avatar_color || 'var(--outline)'}` }}>
                      <span style={{ color: activity.assignee?.avatar_color || 'var(--on-surface)', fontWeight: 600 }}>{activity.assignee?.name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600, color: 'var(--on-surface)' }}>{activity.title}</h4>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--on-surface-variant)' }}>{activity.assignee?.name || 'Unassigned'}</p>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--outline-variant)' }}></span>
                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--outline)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {timeAgo(activity.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: getStatusColor(activity.status), borderRadius: '9999px', border: `1px solid ${getStatusColor(activity.status).replace('0.1', '0.2')}` }}>
                    {getStatusIcon(activity.status)}
                    <span style={{ fontSize: '12px', fontWeight: 600, color: getStatusTextColor(activity.status), letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {activity.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: My Tasks */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', margin: 0 }}>My Tasks</h2>
              <button onClick={() => navigate('/tasks')} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>View All</button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {['All', 'Overdue', 'Due Today', 'In Progress'].map(f => (
                <button 
                  key={f}
                  onClick={() => setTaskFilter(f as any)}
                  style={{ background: taskFilter === f ? 'rgba(208, 188, 255, 0.15)' : 'transparent', border: taskFilter === f ? '1px solid rgba(208, 188, 255, 0.3)' : '1px solid rgba(255,255,255,0.1)', color: taskFilter === f ? 'var(--primary)' : 'var(--on-surface-variant)', padding: '6px 12px', borderRadius: '9999px', fontSize: '12px', cursor: 'pointer' }}
                >
                  {f}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTasks.length === 0 ? (
                <div className="glass-panel card" style={{ textAlign: 'center', padding: '32px' }}>
                  <p className="text-muted" style={{ margin: 0 }}>No tasks found for "{taskFilter}"</p>
                </div>
              ) : filteredTasks.map(t => (
                <div key={t.id} className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: isOverdue(t.due_date, t.status) ? '1px solid var(--error)' : '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: t.priority === 'high' ? 'var(--error)' : t.priority === 'medium' ? 'var(--tertiary)' : 'var(--primary)', background: `rgba(255,255,255,0.05)`, padding: '2px 6px', borderRadius: '4px' }}>{t.priority}</span>
                      <span style={{ fontSize: '12px', color: 'var(--outline)' }}>{t.project?.name || 'No Project'}</span>
                    </div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--on-surface)' }}>{t.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: isOverdue(t.due_date, t.status) ? 'var(--error)' : 'var(--on-surface-variant)' }}>
                      <Calendar size={12} /> {formatDate(t.due_date)} {isOverdue(t.due_date, t.status) && ' (Overdue)'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: getStatusTextColor(t.status), background: getStatusColor(t.status), padding: '4px 12px', borderRadius: '9999px' }}>
                    {t.status.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
