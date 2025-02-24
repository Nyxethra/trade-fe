import React from 'react';
import './TopBar.css';

function TopBar() {
  return (
    <nav className="topbar">
      <div className="topbar-left">
        <h1 className="logo">
          <span className="logo-icon">⚡</span>
          Trade<span className="highlight">FE</span>
        </h1>
      </div>
      <div className="topbar-right">
        <div className="nav-links">
          <a href="#" className="nav-link active">
            <span className="nav-icon">📊</span>
            Bảng Điều Khiển
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">🤖</span>
            Bot
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">📈</span>
            Thị Trường
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">⚙️</span>
            Cài Đặt
          </a>
        </div>
        <div className="user-section">
          <div className="network-status">
            <span className="status-dot online"></span>
            Mạng Chính
          </div>
          <button className="connect-wallet">
            Kết Nối Ví
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopBar; 