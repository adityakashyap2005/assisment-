import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const isRoleAdmin = window.location.search.includes('role=admin');
      localStorage.setItem('userRole', isRoleAdmin ? 'admin' : 'member');
      navigate(isRoleAdmin ? '/admin-ops' : '/dashboard');
    }
  };

  return (
    <div className="page-center">
      <div className="glass-panel edge-glow auth-container floating-element">
        <div className="text-center">
          <h2 className="header-title">Welcome Back</h2>
          <p className="text-muted">Access your secure project command center.</p>
        </div>
        
        {error && (
          <div style={{ padding: '12px', background: 'rgba(255, 180, 171, 0.1)', color: 'var(--error)', borderRadius: '8px', width: '100%', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-container">
            <label className="input-label">Email</label>
            <div className="input-field-wrapper">
              <span className="input-icon">
                <User />
              </span>
              <input 
                className="input-field" 
                placeholder="Enter your email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="input-container">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="input-label">Password</label>
              <a href="#" className="input-label" style={{ color: 'var(--tertiary)', textDecoration: 'none' }}>FORGOT?</a>
            </div>
            <div className="input-field-wrapper">
              <span className="input-icon">
                <Lock />
              </span>
              <input 
                className="input-field" 
                placeholder="••••••••" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Login <ArrowRight size={20} /></>}
          </button>
        </form>
        
        <div>
          <span className="text-muted" style={{ fontSize: '14px' }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Sign Up for Aethera</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
