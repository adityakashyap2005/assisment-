import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';
import { timeAgo } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      setNotifications((data as Notification[]) ?? []);
      setUnreadCount(count ?? 0);
    };

    fetchNotifications();

    // Set up realtime subscription
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, payload => {
        setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 10));
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = async (n: Notification) => {
    if (!n.is_read && user) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', n.id);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    if (n.link) {
      setIsOpen(false);
      navigate(n.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'task_assigned': return <CheckCircle size={16} color="var(--primary)" />;
      case 'due_soon': return <AlertCircle size={16} color="var(--error)" />;
      case 'comment': return <MessageSquare size={16} color="var(--secondary)" />;
      default: return <Info size={16} color="var(--tertiary)" />;
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <div 
        className="glass-panel" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', position: 'relative', transition: 'transform 0.2s' }} 
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} 
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '4px', right: '4px', background: 'var(--error)', color: '#fff', fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '9999px', boxShadow: '0 0 8px var(--error)' }}>
            {unreadCount}
          </span>
        )}
        <Bell size={20} color="var(--on-surface)" />
      </div>

      {isOpen && (
        <div className="glass-panel edge-glow" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '360px', borderRadius: '1rem', padding: '16px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '24px 0' }}>No notifications right now.</p>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  onClick={() => handleNotificationClick(n)}
                  style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '8px', background: n.is_read ? 'transparent' : 'rgba(255,255,255,0.05)', cursor: n.link ? 'pointer' : 'default', transition: 'background 0.2s' }}
                  onMouseOver={e => { if (n.link) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                  onMouseOut={e => { if (n.link) e.currentTarget.style.background = n.is_read ? 'transparent' : 'rgba(255,255,255,0.05)' }}
                >
                  <div style={{ marginTop: '2px' }}>{getIcon(n.type)}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: n.is_read ? 500 : 600, color: 'var(--on-surface)' }}>{n.title}</p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--on-surface-variant)' }}>{n.message}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--outline)' }}>{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
