import React from 'react';
import './TopBar.css';

function TopBar() {
  return (
    <nav className="topbar">
      <div className="topbar-left">
        <h1 className="logo">Trade FE</h1>
      </div>
      <div className="topbar-right">
        <a href="#" className="nav-link">Home</a>
        <a href="#" className="nav-link">Products</a>
        <a href="#" className="nav-link">About</a>
        <a href="#" className="nav-link">Contact</a>
      </div>
    </nav>
  );
}

export default TopBar; 