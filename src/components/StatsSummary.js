import React from 'react';
import { COLORS } from '../constants/colors';

function StatsSummary({ totalProfit, totalLoss, avgWinRate, profitableBots }) {
  return (
    <div className="stats-summary">
      <div className="summary-item">
        <div className="summary-value" style={{ color: COLORS.status.success }}>
          +{totalProfit}%
        </div>
        <div className="summary-label">
          TOTAL PROFIT
        </div>
      </div>
      
      <div className="summary-item">
        <div className="summary-value" style={{ color: COLORS.status.danger }}>
          {totalLoss}%
        </div>
        <div className="summary-label">
          TOTAL LOSS
        </div>
      </div>
      
      <div className="summary-item">
        <div className="summary-value" style={{ color: COLORS.text.primary }}>
          {avgWinRate}%
        </div>
        <div className="summary-label">
          AVG WIN RATE
        </div>
      </div>
      
      <div className="summary-item">
        <div className="summary-value" style={{ color: COLORS.text.primary }}>
          {profitableBots}
        </div>
        <div className="summary-label">
          PROFITABLE BOTS
        </div>
      </div>
    </div>
  );
}

export default StatsSummary; 