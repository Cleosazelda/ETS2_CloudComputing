import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        Feeder<span className="dot">Kota</span>
      </div>
      
      <ul className="nav-links">
        <li>
          <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/rute" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Kelola Rute
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/armada" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Kelola Armada
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/jadwal" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Kelola Jadwal
          </NavLink>
        </li>
        <li style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <NavLink to="/" className="nav-item">
            🌐 Kembali ke Publik
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
