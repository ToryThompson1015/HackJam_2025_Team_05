import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { Users as UsersIcon, Search, Award } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers(currentPage, 12);
      
      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const cohort = user.cohort?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || cohort.includes(search);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getSkillBadges = (skillsContributed) => {
    if (!skillsContributed || skillsContributed.length === 0) return null;
    
    return skillsContributed.slice(0, 3).map((skill, index) => (
      <span key={index} className="skill-badge">
        {skill.skill}
      </span>
    ));
  };

  const getLevelColor = (level) => {
    if (level >= 10) return '#e74c3c'; // Red for high levels
    if (level >= 5) return '#f39c12';  // Orange for medium levels
    return '#27ae60';                  // Green for low levels
  };

  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="users">
      <div className="page-header">
        <h1>
          <UsersIcon size={28} />
          Per Scholas Alumni
        </h1>
        <p>Connect with fellow graduates and see their achievements</p>
      </div>

      {/* Search */}
      <div className="card">
        <div className="search-container">
          <div className="search-input-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or cohort..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="users-grid">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-card-header">
                <div className="user-avatar large">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" />
                  ) : (
                    `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`
                  )}
                </div>
                <div className="user-level-badge" style={{ backgroundColor: getLevelColor(user.currentLevel) }}>
                  Level {user.currentLevel}
                </div>
              </div>

              <div className="user-card-body">
                <h3 className="user-name">
                  {user.firstName} {user.lastName}
                </h3>
                
                {user.currentTitle && (
                  <div className="user-title">
                    <Award size={16} />
                    {user.currentTitle.name}
                  </div>
                )}

                {user.cohort && (
                  <div className="user-cohort">{user.cohort}</div>
                )}

                {user.graduationDate && (
                  <div className="user-graduation">
                    Graduated {formatDate(user.graduationDate)}
                  </div>
                )}

                <div className="user-stats">
                  <div className="stat">
                    <span className="stat-number">{user.totalPoints}</span>
                    <span className="stat-label">Points</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{user.experiencePoints}</span>
                    <span className="stat-label">XP</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{user.currentLevel}</span>
                    <span className="stat-label">Badges</span>
                  </div>
                </div>

                {user.skillsContributed && user.skillsContributed.length > 0 && (
                  <div className="user-skills">
                    <div className="skills-label">Skills:</div>
                    <div className="skills-badges">
                      {getSkillBadges(user.skillsContributed)}
                      {user.skillsContributed.length > 3 && (
                        <span className="skill-badge more">
                          +{user.skillsContributed.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {user.mentoringStats && user.mentoringStats.menteesCount > 0 && (
                  <div className="mentoring-stats">
                    <span className="mentoring-badge">
                      Mentor • {user.mentoringStats.menteesCount} mentees
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>
              {searchTerm ? `No users found matching "${searchTerm}"` : 'No users found'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !searchTerm && (
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

export default Users;
