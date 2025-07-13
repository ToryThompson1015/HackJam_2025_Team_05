import React, { useState, useEffect } from 'react';
import { leaderboardsAPI } from '../../services/api';
import { Trophy, Medal, Award, Filter } from 'lucide-react';

const Leaderboards = () => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'points',
    timeframe: 'all-time'
  });

  useEffect(() => {
    fetchLeaderboard();
  }, [filters]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardsAPI.getTopPerformers(
        filters.type, 
        filters.timeframe, 
        20
      );
      
      if (response.data.success) {
        setTopPerformers(response.data.data.participants);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="rank-icon gold" size={24} />;
      case 2:
        return <Medal className="rank-icon silver" size={24} />;
      case 3:
        return <Award className="rank-icon bronze" size={24} />;
      default:
        return <span className="rank">#{rank}</span>;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getScoreLabel = () => {
    return filters.type === 'points' ? 'Points' : 'Level';
  };

  if (loading) {
    return <div className="loading">Loading leaderboards...</div>;
  }

  return (
    <div className="leaderboards">
      <div className="page-header">
        <h1>Leaderboards</h1>
        <p>See how you rank against other Per Scholas alumni</p>
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
            <label className="filter-label">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="points">Points</option>
              <option value="level">Level</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Timeframe</label>
            <select
              name="timeframe"
              value={filters.timeframe}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all-time">All Time</option>
              <option value="yearly">This Year</option>
              <option value="monthly">This Month</option>
              <option value="weekly">This Week</option>
              <option value="daily">Today</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Trophy size={20} />
            {getScoreLabel()} Leaderboard - {filters.timeframe.replace('-', ' ')}
          </h3>
        </div>

        {topPerformers.length > 0 ? (
          <div className="leaderboard">
            {/* Top 3 Podium */}
            {topPerformers.slice(0, 3).length > 0 && (
              <div className="podium">
                {topPerformers.slice(0, 3).map(performer => (
                  <div 
                    key={performer.user._id} 
                    className={`podium-item ${getRankClass(performer.rank)}`}
                  >
                    <div className="podium-rank">
                      {getRankIcon(performer.rank)}
                    </div>
                    <div className="podium-user">
                      <div className="user-avatar large">
                        {performer.user.avatar ? (
                          <img src={performer.user.avatar} alt="Avatar" />
                        ) : (
                          `${performer.user.firstName?.charAt(0)}${performer.user.lastName?.charAt(0)}`
                        )}
                      </div>
                      <div className="user-name">
                        {performer.user.firstName} {performer.user.lastName}
                      </div>
                      {performer.user.cohort && (
                        <div className="user-cohort">{performer.user.cohort}</div>
                      )}
                      {performer.user.graduationDate && (
                        <div className="user-graduation">
                          Graduated {formatDate(performer.user.graduationDate)}
                        </div>
                      )}
                    </div>
                    <div className="podium-score">
                      <span className="score-number">{performer.score}</span>
                      <span className="score-label">{getScoreLabel()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rest of the leaderboard */}
            <div className="leaderboard-list">
              {topPerformers.slice(3).map(performer => (
                <div key={performer.user._id} className="leaderboard-item">
                  <span className="rank">#{performer.rank}</span>
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
                    {performer.user.cohort && (
                      <div className="user-cohort">{performer.user.cohort}</div>
                    )}
                    {performer.user.graduationDate && (
                      <div className="user-graduation">
                        Graduated {formatDate(performer.user.graduationDate)}
                      </div>
                    )}
                  </div>
                  <div className="score">
                    {performer.score} {getScoreLabel().toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>No leaderboard data available for the selected filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboards;
