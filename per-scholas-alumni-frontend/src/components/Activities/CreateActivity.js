import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { activitiesAPI } from '../../services/api';
import { ArrowLeft, Save } from 'lucide-react';

const CATEGORIES = [
  { value: 'mentoring', label: 'Mentoring', points: 50 },
  { value: 'teaching', label: 'Teaching', points: 60 },
  { value: 'certification', label: 'Certification', points: 75 },
  { value: 'community-contribution', label: 'Community Contribution', points: 40 },
  { value: 'skill-development', label: 'Skill Development', points: 30 },
  { value: 'career-advancement', label: 'Career Advancement', points: 35 },
  { value: 'project-completion', label: 'Project Completion', points: 45 },
  { value: 'volunteer-work', label: 'Volunteer Work', points: 30 },
  { value: 'learning', label: 'Learning', points: 25 },
  { value: 'networking', label: 'Networking', points: 20 }
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];

const CreateActivity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Medium',
    evidence: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const response = await activitiesAPI.createActivity(submitData);
      
      if (response.data.success) {
        setSuccess('Activity created successfully!');
        setTimeout(() => {
          navigate('/activities');
        }, 1500);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  const getPointsForCategory = (categoryValue) => {
    const category = CATEGORIES.find(cat => cat.value === categoryValue);
    return category ? category.points : 25;
  };

  return (
    <div className="create-activity">
      <div className="page-header">
        <button 
          onClick={() => navigate('/activities')}
          className="btn btn-secondary"
        >
          <ArrowLeft size={16} />
          Back to Activities
        </button>
        <h1>Create New Activity</h1>
      </div>

      <div className="card">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter activity title"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe what you did and what you learned"
              required
              maxLength={500}
              rows={4}
            />
            <small className="form-help">
              {formData.description.length}/500 characters
            </small>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label} (+{category.points} pts)
                  </option>
                ))}
              </select>
              {formData.category && (
                <small className="form-help">
                  This activity will award {getPointsForCategory(formData.category)} points
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="difficulty" className="form-label">Difficulty *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="form-select"
                required
              >
                {DIFFICULTIES.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="evidence" className="form-label">Evidence</label>
            <textarea
              id="evidence"
              name="evidence"
              value={formData.evidence}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Links, certificates, or proof of completion (optional)"
              rows={3}
            />
            <small className="form-help">
              Provide any links, certificates, or documentation that supports this activity
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
              placeholder="react, javascript, frontend (comma-separated)"
            />
            <small className="form-help">
              Add relevant tags separated by commas
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/activities')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Creating...' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActivity;
