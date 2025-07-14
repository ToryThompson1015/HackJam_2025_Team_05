import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI, activitiesAPI } from '../../services/api';
import { User, Edit3, Save, X, Award, TrendingUp, Activity, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [menteesCount, setMenteesCount] = useState(0);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    avatar: user?.avatar || '',
    skillsContributed: user?.skillsContributed || []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchRecentActivities();
      fetchMenteesCount();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await usersAPI.getUserStats(user._id);
      if (response.data.success) {
        setUserStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await activitiesAPI.getActivities({
        userId: user._id,
        limit: 5
      });
      if (response.data.success) {
        setRecentActivities(response.data.data.activities);
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const fetchMenteesCount = async () => {
    try {
      const response = await activitiesAPI.getActivities({
        userId: user._id,
        category: 'mentoring',
        limit: 1000 
      });
      
      if (response.data.success) {
        const mentoringActivities = response.data.data.activities;
        
        const uniqueMentees = new Set();
        
        mentoringActivities.forEach(activity => {
          const titleMatch = activity.title.match(/Mentored\s+(.+)/i);
          if (titleMatch) {
            uniqueMentees.add(titleMatch[1].trim());
          }
        });
        
        setMenteesCount(uniqueMentees.size);
      }
    } catch (error) {
      console.error('Error fetching mentees count:', error);
      
      const fallbackCount = userStats?.stats?.mentoringStats?.menteesCount ||
                           user?.mentoringStats?.menteesCount || 0;
      setMenteesCount(fallbackCount);
    }
  };

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
      const response = await usersAPI.updateProfile(formData);
      if (response.data.success) {
        updateUser(response.data.data);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || '',
      skillsContributed: user.skillsContributed || []
    });
    setIsEditing(false);
    setError('');
  };

  const getNextLevelPoints = () => {
    const nextLevel = user.currentLevel + 1;
    return Math.pow(nextLevel - 1, 2) * 100;
  };

  const getProgressPercentage = () => {
    const nextLevelPoints = getNextLevelPoints();
    return Math.min((user.experiencePoints / nextLevelPoints) * 100, 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCategoryName = (category) => {
    return category.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile">
      <div className="page-header">
        <h1>
          <User size={28} />
          My Profile
        </h1>
      </div>

      <div className="grid grid-2">
        {/* Profile Information */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Profile Information</h3>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                <Edit3 size={16} />
                Edit
              </button>
            ) : (
              <div className="button-group">
                <button onClick={handleCancel} className="btn btn-secondary">
                  <X size={16} />
                  Cancel
                </button>
                <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          {success && (
            <div className="success-message">{success}</div>
          )}

          <div className="profile-content">
            <div className="profile-avatar-section">
              <div className="user-avatar large">
                {(isEditing ? formData.avatar : user.avatar) ? (
                  <img src={isEditing ? formData.avatar : user.avatar} alt="Avatar" />
                ) : (
                  `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`
                )}
              </div>

              {isEditing && (
                <div className="form-group">
                  <label htmlFor="avatar" className="form-label">Avatar URL</label>
                  <input
                    type="url"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <label>Name</label>
                  <span>{user.firstName} {user.lastName}</span>
                </div>

                <div className="detail-item">
                  <label>Email</label>
                  <span>{user.email}</span>
                </div>

                <div className="detail-item">
                  <label>Cohort</label>
                  <span>{user.cohort}</span>
                </div>

                <div className="detail-item">
                  <label>Graduation Date</label>
                  <span>{formatDate(user.graduationDate)}</span>
                </div>

                {user.currentTitle && (
                  <div className="detail-item">
                    <label>Current Title</label>
                    <span className="title-badge">
                      <Award size={16} />
                      {user.currentTitle.name}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Level Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} />
              Level Progress
            </h3>
          </div>

          <div className="level-info">
            <div className="current-level">
              <span className="level-number">{user.currentLevel}</span>
              <span className="level-label">Current Level</span>
            </div>

            <div className="progress-container">
              <div className="progress-info">
                <span>Level {user.currentLevel}</span>
                <span>Level {user.currentLevel + 1}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {user.experiencePoints} / {getNextLevelPoints()} XP
              </div>
              <div className="points-needed">
                {getNextLevelPoints() - user.experiencePoints} XP needed for next level
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {userStats && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Statistics</h3>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{userStats.stats.totalActivities}</div>
              <div className="stat-label">Total Activities</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{userStats.stats.monthlyPoints}</div>
              <div className="stat-label">Points This Month</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{menteesCount}</div>
              <div className="stat-label">Mentees</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Activity size={20} />
            Recent Activities
          </h3>
        </div>

        {recentActivities.length > 0 ? (
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity._id} className="activity-item">
                <div className="activity-header">
                  <h4>{activity.title}</h4>
                  <span className="activity-points">+{activity.pointsAwarded} pts</span>
                </div>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span className="activity-category">
                    {formatCategoryName(activity.category)}
                  </span>
                  <span className="activity-difficulty">{activity.difficulty}</span>
                  <span className="activity-date">
                    <Calendar size={14} />
                    {formatDate(activity.completedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No activities yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;