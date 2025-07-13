import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Trophy, 
  Users, 
  User,
  Plus
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/activities',
      label: 'Activities',
      icon: Activity
    },
    {
      path: '/activities/create',
      label: 'Create Activity',
      icon: Plus
    },
    {
      path: '/leaderboards',
      label: 'Leaderboards',
      icon: Trophy
    },
    {
      path: '/users',
      label: 'Users',
      icon: Users
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <aside className="sidebar">
      <nav>
        <ul className="nav-menu">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <IconComponent size={20} />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
