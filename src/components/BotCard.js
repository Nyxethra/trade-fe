import React from 'react';

function BotCard({ bot }) {
  const { name, type, colorName, performance, trades, winRate } = bot;
  const isProfit = performance >= 0;

  const getStatusColor = () => {
    if (winRate.replace('%', '') >= 60) return '#10b981';
    if (winRate.replace('%', '') >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className={`bot-card ${isProfit ? 'profit' : 'loss'}`}>
      <div className="bot-name">
        {name}
        <span style={{ 
          fontSize: '0.875rem',
          color: '#6b7280',
          fontWeight: 'normal'
        }}>
          ({colorName})
        </span>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          marginLeft: 'auto'
        }} />
      </div>
      <div className="bot-type">{type}</div>
      <div className="bot-stats">
        <div>
          <div className={`stat-value ${isProfit ? 'profit' : 'loss'}`}>
            {isProfit ? '+' : ''}{performance}%
          </div>
          <div className="stat-label">Performance</div>
        </div>
        <div>
          <div className="stat-value">{trades}</div>
          <div className="stat-label">Total Trades</div>
        </div>
        <div>
          <div className="stat-value" style={{ color: getStatusColor() }}>
            {winRate}
          </div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>
    </div>
  );
}

export default BotCard; 