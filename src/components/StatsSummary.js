import React from 'react';
import { COLORS } from '../constants/colors';

function StatsSummary({ 
  todayNetProfit, 
  todayNetProfitChange,
  topPerformer,
  topPerformanceValue,
  bottomPerformer,
  bottomPerformanceValue,
  profitableBots,
  totalBots,
  profitableBotsChange
}) {
  return (
    <div className="stats-summary">
      <div className="summary-item">
        <div className="summary-value" style={{ color: todayNetProfit >= 0 ? COLORS.status.success : COLORS.status.danger }}>
          {todayNetProfit >= 0 ? '+' : ''}{todayNetProfit}%
          <span className="change-indicator" style={{ color: todayNetProfitChange >= 0 ? COLORS.status.success : COLORS.status.danger }}>
            ({todayNetProfitChange >= 0 ? '↑' : '↓'}{Math.abs(todayNetProfitChange)}% so với hôm qua)
          </span>
        </div>
        <div className="summary-label">HIỆU SUẤT TỔNG HÔM NAY</div>
      </div>

      <div className="summary-item">
        <div className="summary-value" style={{ color: COLORS.status.success }}>
          {topPerformer}
          <span className="performance-value">(+{topPerformanceValue}%)</span>
        </div>
        <div className="summary-label">BOT HIỆU SUẤT CAO NHẤT</div>
      </div>

      <div className="summary-item">
        <div className="summary-value" style={{ color: COLORS.status.danger }}>
          {bottomPerformer}
          <span className="performance-value">({bottomPerformanceValue}%)</span>
        </div>
        <div className="summary-label">BOT HIỆU SUẤT THẤP NHẤT</div>
      </div>

      <div className="summary-item">
        <div className="summary-value">
          {profitableBots}/{totalBots}
          <span className="change-indicator" style={{ color: profitableBotsChange >= 0 ? COLORS.status.success : COLORS.status.danger }}>
            ({profitableBotsChange >= 0 ? '↑' : '↓'}{Math.abs(profitableBotsChange)} so với hôm qua)
          </span>
        </div>
        <div className="summary-label">SỐ BOT CÓ LỢI NHUẬN</div>
      </div>
    </div>
  );
}

export default StatsSummary; 