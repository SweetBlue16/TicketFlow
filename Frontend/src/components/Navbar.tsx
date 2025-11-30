import React from 'react';
import { UserInfo } from '../types/ticket';
import './Navbar.css';

interface NavbarProps {
  user: UserInfo;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const userRole = user.roles.includes('admin') ? 'Admin' 
                  : user.roles.includes('soporte') ? 'Soporte' 
                  : 'Usuario';

  const getBadgeColor = () => {
    if (user.roles.includes('admin')) return 'badge-admin';
    if (user.roles.includes('soporte')) return 'badge-soporte';
    return 'badge-usuario';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h2>🎫 TicketFlow</h2>
        </div>
        
        <div className="navbar-user">
          <span className="user-name">{user.name}</span>
          <span className={`badge ${getBadgeColor()}`}>{userRole}</span>
          <button onClick={onLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;