import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Calendar, GraduationCap, UserPlus, ChevronDown } from 'lucide-react';

const COHORTS = [
  'Web Dev 2024-Winter', 'Web Dev 2023-Fall', 'Web Dev 2023-Summer', 'Web Dev 2023-Spring',
  'Data Analytics 2024-Winter', 'Data Analytics 2023-Fall', 'Data Analytics 2023-Summer', 'Data Analytics 2023-Spring',
  'Cybersecurity 2024-Winter', 'Cybersecurity 2023-Fall', 'Cybersecurity 2023-Summer',
  'Cloud Computing 2024-Winter', 'Cloud Computing 2023-Fall',
  'Software Engineering 2024-Winter', 'Software Engineering 2023-Fall'
];

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cohort: '',
    graduationDate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { register } = useAuth();

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

    const result = await register(formData);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep === 1 && formData.firstName && formData.lastName && formData.email) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const isStep1Valid = formData.firstName && formData.lastName && formData.email;
  const isStep2Valid = formData.password && formData.cohort && formData.graduationDate;

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
        <div className="auth-overlay"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card modern register">
          <div className="auth-header">
            <div className="auth-logo">
              <GraduationCap size={40} className="logo-icon" />
            </div>
            <h1 className="auth-title">Join Per Scholas Alumni</h1>
            <p className="auth-subtitle">Connect with fellow graduates and showcase your achievements</p>
          </div>

          {/* Progress Steps */}
          <div className="steps-container">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <span>Personal Info</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Account Setup</span>
            </div>
          </div>
          
          {error && (
            <div className="error-message modern">
              <div className="error-icon">⚠️</div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {currentStep === 1 && (
              <div className="step-content">
                <div className="form-row">
                  <div className="form-group modern half">
                    <label htmlFor="firstName" className="form-label modern">First Name</label>
                    <div className="input-container">
                      <User size={20} className="input-icon" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="form-input modern"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group modern half">
                    <label htmlFor="lastName" className="form-label modern">Last Name</label>
                    <div className="input-container">
                      <User size={20} className="input-icon" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="form-input modern"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>
                </div>

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

                <button 
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary modern full-width"
                  disabled={!isStep1Valid}
                >
                  Continue
                  <ChevronDown size={20} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
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
                      placeholder="Create a strong password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="password-hint">
                    Minimum 6 characters required
                  </div>
                </div>

                <div className="form-group modern">
                  <label htmlFor="cohort" className="form-label modern">Your Cohort</label>
                  <div className="select-container">
                    <GraduationCap size={20} className="input-icon" />
                    <select
                      id="cohort"
                      name="cohort"
                      value={formData.cohort}
                      onChange={handleChange}
                      className="form-select modern"
                      required
                    >
                      <option value="">Select your cohort</option>
                      {COHORTS.map(cohort => (
                        <option key={cohort} value={cohort}>{cohort}</option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="select-arrow" />
                  </div>
                </div>

                <div className="form-group modern">
                  <label htmlFor="graduationDate" className="form-label modern">Graduation Date</label>
                  <div className="input-container">
                    <Calendar size={20} className="input-icon" />
                    <input
                      type="date"
                      id="graduationDate"
                      name="graduationDate"
                      value={formData.graduationDate}
                      onChange={handleChange}
                      className="form-input modern"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="btn btn-secondary modern"
                  >
                    Back
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary modern"
                    disabled={loading || !isStep2Valid}
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus size={20} />
                        Create Account
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="btn btn-secondary modern full-width">
            Sign In Instead
          </Link>

          <div className="auth-footer">
            <p>© 2025 Per Scholas Alumni Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
