import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn, GraduationCap } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
        <div className="auth-overlay"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card modern">
          <div className="auth-header">
            <div className="auth-logo">
              <GraduationCap size={40} className="logo-icon" />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your Per Scholas Alumni account</p>
          </div>
          
          {error && (
            <div className="error-message modern">
              <div className="error-icon">⚠️</div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group modern">
              <label htmlFor="email" className="form-label modern">Email Address</label>
              <div className="input-container">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input modern"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group modern">
              <label htmlFor="password" className="form-label modern">Password</label>
              <div className="input-container">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input modern"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary modern full-width"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to Per Scholas Alumni?</span>
          </div>

          <Link to="/register" className="btn btn-secondary modern full-width">
            Create Account
          </Link>

          <div className="auth-footer">
            <p>© 2025 Per Scholas Alumni Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
