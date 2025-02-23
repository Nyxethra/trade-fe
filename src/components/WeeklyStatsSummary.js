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
  return (
    <div className="stats-summary">
      <div className="summary-item">
        <div className="summary-value">
          <span className={weeklyNetProfit >= 0 ? 'profit' : 'loss'}>
            {weeklyNetProfit >= 0 ? '+$' : '-$'}{Math.abs(weeklyNetProfit)}
          </span>
        </div>
        <div className="summary-label">TOTAL NET PROFIT</div>
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
        <div className="summary-label">BEST PERFORMING BOT</div>
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
        <div className="summary-label">WORST PERFORMING BOT</div>
      </div>

      <div className="summary-item">
        <div className="summary-value">
          {profitableBots}
          <span className="performance-value">
            / {totalBots}
          </span>
        </div>
        <div className="summary-label">AVG PROFITABLE BOTS/DAY</div>
      </div>
    </div>
  );
}

export default WeeklyStatsSummary; 