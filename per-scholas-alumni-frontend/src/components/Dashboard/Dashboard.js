import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { activitiesAPI, leaderboardsAPI } from '../../services/api';
import { Trophy, Activity, Users, Award, Plus, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentActivities, setRecentActivities] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent activities
      const activitiesResponse = await activitiesAPI.getActivities({ 
        page: 1, 
        limit: 5,
        userId: user._id 
      });
      
      if (activitiesResponse.data.success) {
        setRecentActivities(activitiesResponse.data.data.activities);
      }

      // Fetch top performers
      const leaderboardResponse = await leaderboardsAPI.getTopPerformers('points', 'all-time', 5);
      
      if (leaderboardResponse.data.success) {
        setTopPerformers(leaderboardResponse.data.data.participants);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextLevelPoints = () => {
    const nextLevel = user.currentLevel + 1;
    return Math.pow(nextLevel - 1, 2) * 100;
  };

  const getProgressPercentage = () => {
    const nextLevelPoints = getNextLevelPoints();
    return (user.experiencePoints / nextLevelPoints) * 100;
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.firstName}!</h1>
        <p>Here's what's happening with your progress</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{user.currentLevel}</div>
          <div className="stat-label">Current Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{user.totalPoints}</div>
          <div className="stat-label">Total Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{user.experiencePoints}</div>
          <div className="stat-label">Experience Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{getNextLevelPoints() - user.experiencePoints}</div>
          <div className="stat-label">Points to Next Level</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={20} />
            Level Progress
          </h3>
        </div>
        <div className="progress-container">
          <div className="progress-info">
            <span>Level {user.currentLevel}</span>
            <span>Level {user.currentLevel + 1}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {user.experiencePoints} / {getNextLevelPoints()} XP
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Activity size={20} />
              Recent Activities
            </h3>
            <Link to="/activities/create" className="btn btn-primary">
              <Plus size={16} />
              Add Activity
            </Link>
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
                    <span className="activity-category">{activity.category}</span>
                    <span className="activity-date">
                      {new Date(activity.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No activities yet. <Link to="/activities/create">Create your first activity!</Link></p>
            </div>
          )}
          
          <div style={{ marginTop: '15px' }}>
            <Link to="/activities" className="btn btn-secondary">View All Activities</Link>
          </div>
        </div>

        {/* Top Performers */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Trophy size={20} />
              Top Performers
            </h3>
            <Link to="/leaderboards" className="btn btn-secondary">View All</Link>
          </div>
          
          {topPerformers.length > 0 ? (
            <div className="leaderboard-list">
              {topPerformers.map((performer, index) => (
                <div key={performer.user._id} className="leaderboard-item">
                  <span className={`rank ${index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}`}>
                    #{performer.rank}
                  </span>
                  <div className="user-avatar">
                    {performer.user.avatar ? (
                      <img src={performer.user.avatar} alt="Avatar" />
                    ) : (
                      `${performer.user.firstName?.charAt(0)}${performer.user.lastName?.charAt(0)}`
                    )}
                  </div>
                  <div className="user-info-leaderboard">
                    <div className="user-name">
                      {performer.user.firstName} {performer.user.lastName}
                    </div>
                    <div className="user-cohort">{performer.user.cohort}</div>
                  </div>
                  <div className="score">{performer.score} pts</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No leaderboard data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="quick-actions">
          <Link to="/activities/create" className="action-card">
            <Plus size={24} />
            <span>Create Activity</span>
          </Link>
          <Link to="/leaderboards" className="action-card">
            <Trophy size={24} />
            <span>View Leaderboards</span>
          </Link>
          <Link to="/users" className="action-card">
            <Users size={24} />
            <span>Browse Users</span>
          </Link>
          <Link to="/profile" className="action-card">
            <Award size={24} />
            <span>My Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
