import React from 'react';
import { COLORS } from '../constants/colors';

function WeeklyStats({ weeklyData }) {
  // Calculate weekly metrics
  const weeklyNetProfit = weeklyData.reduce((sum, day) => 
    sum + day.bots.reduce((daySum, bot) => daySum + bot.performance, 0), 0
  ).toFixed(1);

  const bestDay = weeklyData.reduce((best, current) => {
    const dayProfit = current.bots.reduce((sum, bot) => sum + bot.performance, 0);
    return dayProfit > best.profit ? { date: current.date, profit: dayProfit } : best;
  }, { date: '', profit: -Infinity });

  const worstDay = weeklyData.reduce((worst, current) => {
    const dayProfit = current.bots.reduce((sum, bot) => sum + bot.performance, 0);
    return dayProfit < worst.profit ? { date: current.date, profit: dayProfit } : worst;
  }, { date: '', profit: Infinity });

  const avgProfitableBots = Math.round(
    weeklyData.reduce((sum, day) => 
      sum + day.bots.filter(bot => bot.performance > 0).length, 0
    ) / weeklyData.length
  );

  return (
    <div className="weekly-stats">
      <div className="weekly-summary">
        <div className="weekly-item">
          <div className="weekly-value" style={{ color: weeklyNetProfit >= 0 ? COLORS.status.success : COLORS.status.danger }}>
            {weeklyNetProfit >= 0 ? '+' : ''}{weeklyNetProfit}%
          </div>
          <div className="weekly-label">WEEKLY NET PROFIT</div>
        </div>

        <div className="weekly-item">
          <div className="weekly-value" style={{ color: COLORS.status.success }}>
            {new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'short' })}
            <span className="day-performance">(+{bestDay.profit.toFixed(1)}%)</span>
          </div>
          <div className="weekly-label">BEST PERFORMING DAY</div>
        </div>

        <div className="weekly-item">
          <div className="weekly-value" style={{ color: COLORS.status.danger }}>
            {new Date(worstDay.date).toLocaleDateString('en-US', { weekday: 'short' })}
            <span className="day-performance">({worstDay.profit.toFixed(1)}%)</span>
          </div>
          <div className="weekly-label">WORST PERFORMING DAY</div>
        </div>

        <div className="weekly-item">
          <div className="weekly-value">
            {avgProfitableBots}
          </div>
          <div className="weekly-label">AVG PROFITABLE BOTS/DAY</div>
        </div>
      </div>

      <div className="weekly-chart">
        <div className="daily-bars">
          {weeklyData.map((day, index) => {
            const dayProfit = day.bots.reduce((sum, bot) => sum + bot.performance, 0);
            const height = Math.abs(dayProfit) * 3; // Scale factor for visualization
            const isPositive = dayProfit >= 0;

            return (
              <div key={day.date} className="day-column">
                <div className="day-label">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="bar-container">
                  <div 
                    className={`profit-bar ${isPositive ? 'positive' : 'negative'}`}
                    style={{ 
                      height: `${height}px`,
                      backgroundColor: isPositive ? COLORS.status.success : COLORS.status.danger 
                    }}
                  >
                    <span className="profit-label">
                      {isPositive ? '+' : ''}{dayProfit.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeeklyStats; 