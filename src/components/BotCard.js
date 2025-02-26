import React from 'react';
import { BOT_COLORS, COLORS } from '../constants/colors';

function BotCard({ bot, index, isHighlighted, type = 'daily' }) {
  // Get color for bot
  const botColor = BOT_COLORS[index % BOT_COLORS.length];
  
  return (
    <div 
      id={`bot-${type}-${bot.name}`}
      className={`bot-card ${isHighlighted ? 'highlighted' : ''}`}
      style={{ '--bot-color': botColor }}
    >
      <div className="bot-header">
        <h3>{bot.name}</h3>
        <div className="profit">
          {bot.performance > 0 ? '+' : ''}{bot.performance}%
        </div>
      </div>
      <div className="bot-stats">
        <div className="stat-item">
          <span className="label">Win Rate</span>
          <span className="value">{bot.winRate}</span>
        </div>
        <div className="stat-item">
          <span className="label">Balance</span>
          <span className="value">${bot.balance.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="label">Net Profit</span>
          <span className="value" style={{ color: bot.netProfit >= 0 ? COLORS.status.success : COLORS.status.danger }}>
            {bot.netProfit >= 0 ? '+' : '-'}${Math.abs(bot.netProfit).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BotCard; 