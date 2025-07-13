import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { activitiesAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Filter, Trash2, Edit3 } from 'lucide-react';

const CATEGORIES = [
  'mentoring', 'skill-development', 'community-contribution', 'networking',
  'career-advancement', 'learning', 'teaching', 'project-completion',
  'certification', 'volunteer-work'
];

const Activities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    userId: ''
  });

  useEffect(() => {
    fetchActivities();
  }, [currentPage, filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await activitiesAPI.getActivities(params);
      
      if (response.data.success) {
        setActivities(response.data.data.activities);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activitiesAPI.deleteActivity(activityId);
        fetchActivities(); // Refresh the list
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Failed to delete activity');
      }
    }
  };

  const formatCategoryName = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && activities.length === 0) {
    return <div className="loading">Loading activities...</div>;
  }

  return (
    <div className="activities">
      <div className="page-header">
        <h1>Activities</h1>
        <Link to="/activities/create" className="btn btn-primary">
          <Plus size={16} />
          Create Activity
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Filter size={20} />
            Filters
          </h3>
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {formatCategoryName(category)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Show</label>
            <select
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All Activities</option>
              <option value={user._id}>My Activities</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="activities-grid">
        {activities.length > 0 ? (
          activities.map(activity => (
            <div key={activity._id} className="card activity-card">
              <div className="activity-header">
                <h3 className="activity-title">{activity.title}</h3>
                <div className="activity-actions">
                  <span className="activity-points">+{activity.pointsAwarded} pts</span>
                  {activity.user._id === user._id && (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleDeleteActivity(activity._id)}
                        className="btn-icon btn-danger"
                        title="Delete Activity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="activity-description">{activity.description}</p>

              {activity.evidence && (
                <div className="activity-evidence">
                  <strong>Evidence:</strong> {activity.evidence}
                </div>
              )}

              <div className="activity-meta">
                <span className="activity-category">
                  {formatCategoryName(activity.category)}
                </span>
                <span className="activity-difficulty">{activity.difficulty}</span>
                <span className="activity-date">
                  {formatDate(activity.completedAt)}
                </span>
              </div>

              <div className="activity-user">
                <div className="user-avatar">
                  {activity.user.avatar ? (
                    <img src={activity.user.avatar} alt="Avatar" />
                  ) : (
                    `${activity.user.firstName?.charAt(0)}${activity.user.lastName?.charAt(0)}`
                  )}
                </div>
                <span className="user-name">
                  {activity.user.firstName} {activity.user.lastName}
                </span>
                {activity.status === 'verified' && (
                  <span className="verified-badge">Verified</span>
                )}
              </div>

              {activity.tags && activity.tags.length > 0 && (
                <div className="activity-tags">
                  {activity.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No activities found</p>
            <Link to="/activities/create" className="btn btn-primary">
              Create your first activity
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Activities;
