import { useState, useEffect, useRef } from 'react';
import { Search, Folder, CheckSquare, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ProjectResult {
  id: string;
  name: string;
  description: string;
}

interface TaskResult {
  id: string;
  title: string;
  status: string;
  priority: string;
  project: { name: string } | null;
}

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [projectResults, setProjectResults] = useState<ProjectResult[]>([]);
  const [taskResults, setTaskResults] = useState<TaskResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else if (!isOpen) {
      setQuery('');
      setProjectResults([]);
      setTaskResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setProjectResults([]);
      setTaskResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      
      const { data: pResults } = await supabase
        .from('projects')
        .select('id, name, description')
        .ilike('name', `%${query}%`)
        .limit(3);

      const { data: tResults } = await supabase
        .from('tasks')
        .select(`id, title, status, priority, project:projects(name)`)
        .ilike('title', `%${query}%`)
        .limit(5);

      setProjectResults(pResults ?? []);
      setTaskResults((tResults as any) ?? []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <div 
        className="glass-panel" 
        onClick={() => setIsOpen(true)}
        style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', transition: 'transform 0.2s' }} 
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} 
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Search size={20} color="var(--on-surface)" />
      </div>

      {isOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop: '10vh', zIndex:1000 }}>
          <div className="glass-panel edge-glow" style={{ padding:'24px', width:'100%', maxWidth:'600px', borderRadius:'1.5rem', display:'flex', flexDirection:'column', gap:'16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <Search size={24} color="var(--outline)" />
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects and tasks..."
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--on-surface)', fontSize: '18px', outline: 'none' }}
              />
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--outline)', cursor: 'pointer', display: 'flex' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {loading && <p className="text-muted" style={{ textAlign: 'center' }}>Searching...</p>}
              
              {!loading && query && projectResults.length === 0 && taskResults.length === 0 && (
                <p className="text-muted" style={{ textAlign: 'center' }}>No results found for "{query}"</p>
              )}

              {projectResults.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projects</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {projectResults.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => handleNavigate('/project-details')}
                        className="glass-panel" 
                        style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      >
                        <Folder size={20} color="var(--secondary)" />
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: 'var(--on-surface)' }}>{p.name}</p>
                          {p.description && <p style={{ margin: 0, fontSize: '12px', color: 'var(--on-surface-variant)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>{p.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {taskResults.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '14px', color: 'var(--tertiary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tasks</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {taskResults.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => handleNavigate('/tasks')}
                        className="glass-panel" 
                        style={{ padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      >
                        <CheckSquare size={20} color="var(--primary)" />
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: 'var(--on-surface)' }}>{t.title}</p>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--outline)' }}>{t.project?.name || 'No project'}</span>
                            <span style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)' }}>{t.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default SearchModal;
