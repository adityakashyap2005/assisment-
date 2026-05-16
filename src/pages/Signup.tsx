import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage('Registration successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div className="page-center">
      <div className="glass-panel edge-glow auth-container floating-element">
        <div className="text-center">
          <h2 className="header-title">Initialize Profile</h2>
          <p className="text-muted">Join the spatial project network.</p>
        </div>
        
        {error && (
          <div style={{ padding: '12px', background: 'rgba(255, 180, 171, 0.1)', color: 'var(--error)', borderRadius: '8px', width: '100%', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        {message && (
          <div style={{ padding: '12px', background: 'rgba(76, 215, 246, 0.1)', color: 'var(--tertiary)', borderRadius: '8px', width: '100%', fontSize: '14px', textAlign: 'center' }}>
            {message}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSignup}>
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
            <label className="input-label">Password</label>
            <div className="input-field-wrapper">
              <span className="input-icon">
                <Lock />
              </span>
              <input 
                className="input-field" 
                placeholder="Create a secure key" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign Up <ArrowRight size={20} /></>}
          </button>
        </form>
        
        <div>
          <span className="text-muted" style={{ fontSize: '14px' }}>Already a member? </span>
          <Link to="/login" style={{ color: 'var(--tertiary)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Return to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
