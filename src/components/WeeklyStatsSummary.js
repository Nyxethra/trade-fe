import React from 'react';
import { COLORS } from '../constants/colors';

function WeeklyStatsSummary({
  weeklyNetProfit,
  totalProfitPercent,
  topPerformer,
  topPerformanceValue,
  bottomPerformer,
  bottomPerformanceValue,
  profitableBots,
  totalBots
}) {
  // Format currency in USD
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="stats-summary">
      <div className="summary-item">
        <div className="summary-value">
          <span className={weeklyNetProfit >= 0 ? 'profit' : 'loss'}>
            {weeklyNetProfit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(weeklyNetProfit))}
          </span>
          <div className="profit-percent" style={{
            color: totalProfitPercent >= 0 ? COLORS.status.success : COLORS.status.danger,
            fontSize: '1rem',

          }}>
            ({totalProfitPercent >= 0 ? '+' : ''}{totalProfitPercent}%)
          </div>
        </div>
        <div className="summary-label">TOTAL PROFIT</div>
      </div>

      <div className="summary-item">
        <div className="summary-value">
          <span style={{ color: COLORS.status.success }}>
            {topPerformer}
            <span className="profit-value">
              (+{topPerformanceValue}%)
            </span>
          </span>
        </div>
        <div className="summary-label">HIGHEST PROFIT BOT</div>
      </div>

      <div className="summary-item">
        <div className="summary-value">
          <span style={{ color: COLORS.status.danger }}>
            {bottomPerformer}
            <span className="profit-value">
              ({bottomPerformanceValue}%)
            </span>
          </span>
        </div>
        <div className="summary-label">LOWEST PROFIT BOT</div>
      </div>

      <div className="summary-item">
        <div className="summary-value">
          {profitableBots}
          <span className="profit-value">
            / {totalBots}
          </span>
        </div>
        <div className="summary-label">AVG PROFITABLE BOTS/DAY</div>
      </div>
    </div>
  );
}

export default WeeklyStatsSummary; 