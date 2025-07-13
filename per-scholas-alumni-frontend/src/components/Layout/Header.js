import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">Per Scholas Alumni</div>
      </div>
      
      <div className="header-right">
        {user && (
          <>
            <div className="user-info">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="avatar" />
              ) : (
                <div className="avatar">
                  {getInitials(user.firstName, user.lastName)}
                </div>
              )}
              <span>{user.firstName} {user.lastName}</span>
              <span className="user-level">Level {user.currentLevel}</span>
            </div>
            
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;