import React from 'react';
import { COLORS } from '../constants/colors';

function WeeklyStatsSummary({ 
  weeklyNetProfit,
  topPerformer,
  topPerformanceValue,
  bottomPerformer,
  bottomPerformanceValue,
  profitableBots,
  totalBots
}) {
  // Hàm format số tiền theo định dạng VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value * 23000); // Giả sử tỷ giá 1 USD = 23000 VND
  };

  return (
    <div className="stats-summary">
      <div className="summary-item">
        <div className="summary-value">
          <span className={weeklyNetProfit >= 0 ? 'profit' : 'loss'}>
            {weeklyNetProfit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(weeklyNetProfit))}
          </span>
        </div>
        <div className="summary-label">TỔNG LỢI NHUẬN RÒNG</div>
      </div>

      <div className="summary-item">
        <div className="summary-value">
          <span style={{ color: COLORS.status.success }}>
            {topPerformer}
            <span className="performance-value">
              (+{topPerformanceValue}%)
            </span>
          </span>
        </div>
        <div className="summary-label">BOT HIỆU SUẤT TỐT NHẤT</div>
      </div>

      <div className="summary-item">
        <div className="summary-value">
          <span style={{ color: COLORS.status.danger }}>
            {bottomPerformer}
            <span className="performance-value">
              ({bottomPerformanceValue}%)
            </span>
          </span>
        </div>
        <div className="summary-label">BOT HIỆU SUẤT KÉM NHẤT</div>
      </div>

      <div className="summary-item">
        <div className="summary-value">
          {profitableBots}
          <span className="performance-value">
            / {totalBots}
          </span>
        </div>
        <div className="summary-label">TRUNG BÌNH BOT CÓ LỢI NHUẬN/NGÀY</div>
      </div>
    </div>
  );
}

export default WeeklyStatsSummary; 