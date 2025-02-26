import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { BOT_COLORS, COLORS, getBackgroundColor, getHoverColor } from '../constants/colors';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function ProfitChart({ botsData, onBotHover, type = 'daily', weeklyData }) {
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  // Update selectedDayData when weeklyData or selectedDayIndex changes
  React.useEffect(() => {
    if (selectedDayIndex !== null) {
      setSelectedDayData(weeklyData[selectedDayIndex]);
    }
  }, [weeklyData, selectedDayIndex]);

  const getDailyChartData = () => {
    if (selectedDayData) {
      // Show detailed bot performance for selected day
      return {
        labels: selectedDayData.bots.map(bot => bot.name),
        datasets: [{
          data: selectedDayData.bots.map(bot => bot.performance),
          backgroundColor: selectedDayData.bots.map((_, index) => getBackgroundColor(BOT_COLORS[index % BOT_COLORS.length])),
          borderColor: selectedDayData.bots.map((_, index) => BOT_COLORS[index % BOT_COLORS.length]),
          borderWidth: 2,
          borderRadius: {
            topLeft: 4,
            topRight: 4
          },
          hoverBackgroundColor: selectedDayData.bots.map((_, index) => getHoverColor(BOT_COLORS[index % BOT_COLORS.length])),
          hoverBorderColor: selectedDayData.bots.map((_, index) => BOT_COLORS[index % BOT_COLORS.length]),
          hoverBorderWidth: 2
        }]
      };
    } else {
      // Show 7-day total profit chart
      return {
        labels: weeklyData.map(day => new Date(day.date).toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric'
        })).reverse(),
        datasets: [{
          data: weeklyData.map(day => {
            const totalProfit = day.bots.reduce((sum, bot) => sum + bot.performance, 0);
            return parseFloat(totalProfit.toFixed(1));
          }).reverse(),
          backgroundColor: weeklyData.map(day => {
            const totalProfit = day.bots.reduce((sum, bot) => sum + bot.performance, 0);
            return getBackgroundColor(totalProfit >= 0 ? COLORS.status.success : COLORS.status.danger);
          }).reverse(),
          borderColor: weeklyData.map(day => {
            const totalProfit = day.bots.reduce((sum, bot) => sum + bot.performance, 0);
            return totalProfit >= 0 ? COLORS.status.success : COLORS.status.danger;
          }).reverse(),
          borderWidth: 2,
          borderRadius: {
            topLeft: 4,
            topRight: 4
          },
          hoverBackgroundColor: weeklyData.map(day => {
            const totalProfit = day.bots.reduce((sum, bot) => sum + bot.performance, 0);
            return getHoverColor(totalProfit >= 0 ? COLORS.status.success : COLORS.status.danger);
          }).reverse(),
          hoverBorderColor: weeklyData.map(day => {
            const totalProfit = day.bots.reduce((sum, bot) => sum + bot.performance, 0);
            return totalProfit >= 0 ? COLORS.status.success : COLORS.status.danger;
          }).reverse(),
          hoverBorderWidth: 2,
          datalabels: {
            anchor: 'end',
            align: 'top',
            offset: 4,
            color: (context) => {
              const value = context.dataset.data[context.dataIndex];
              return value >= 0 ? COLORS.status.success : COLORS.status.danger;
            },
            font: {
              weight: '600',
              size: 12,
              family: "'Inter', sans-serif"
            },
            formatter: (value) => value > 0 ? `+${value}%` : `${value}%`
          }
        }]
      };
    }
  };

  const getWeeklyOrMonthlyChartData = () => {
    return {
      labels: botsData.map(bot => bot.name),
      datasets: [{
        data: botsData.map(bot => bot.performance),
        backgroundColor: botsData.map((_, index) => getBackgroundColor(BOT_COLORS[index % BOT_COLORS.length])),
        borderColor: botsData.map((_, index) => BOT_COLORS[index % BOT_COLORS.length]),
        borderWidth: 2,
        borderRadius: {
          topLeft: 4,
          topRight: 4
        },
        hoverBackgroundColor: botsData.map((_, index) => getHoverColor(BOT_COLORS[index % BOT_COLORS.length])),
        hoverBorderColor: botsData.map((_, index) => BOT_COLORS[index % BOT_COLORS.length]),
        hoverBorderWidth: 2
      }]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false,
        external: function(context) {
          let tooltipEl = document.getElementById('chartjs-tooltip');
          
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.style.background = COLORS.card;
            tooltipEl.style.backdropFilter = 'blur(10px)';
            tooltipEl.style.borderRadius = '6px';
            tooltipEl.style.padding = '8px 12px';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.transition = 'all .1s ease';
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.transform = 'translate(-50%, 0)';
            tooltipEl.style.border = `1px solid ${COLORS.border}`;
            document.body.appendChild(tooltipEl);
          }

          if (context.tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const dataPoint = context.tooltip.dataPoints[0];
          
          if (type === 'daily' && !selectedDayData) {
            // Tooltip for 7-day view
            const dayData = weeklyData[weeklyData.length - 1 - dataPoint.dataIndex];
            const date = new Date(dayData.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            
            tooltipEl.innerHTML = `
              <div style="font-family: Inter, sans-serif; min-width: 150px;">
                <div style="color: ${COLORS.text.primary}; font-size: 12px; margin-bottom: 4px;">
                  ${date}
                </div>
                <div style="color: ${dataPoint.raw >= 0 ? COLORS.status.success : COLORS.status.danger}; font-size: 16px; font-weight: 600;">
                  ${dataPoint.raw > 0 ? '+' : ''}${dataPoint.raw}%
                </div>
                <div style="color: ${COLORS.text.secondary}; font-size: 12px; margin-top: 4px;">
                  Click to view details
                </div>
              </div>
            `;
          } else {
            // Tooltip for bot details view
            const bot = type === 'daily' ? selectedDayData.bots[dataPoint.dataIndex] : botsData[dataPoint.dataIndex];
            const botColor = BOT_COLORS[dataPoint.dataIndex % BOT_COLORS.length];
            
            tooltipEl.innerHTML = `
              <div style="font-family: Inter, sans-serif; min-width: 150px;">
                <div style="color: ${botColor}; font-size: 12px; margin-bottom: 4px;">
                  ${bot.name}
                </div>
                <div style="color: ${dataPoint.raw >= 0 ? COLORS.status.success : COLORS.status.danger}; font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                  ${dataPoint.raw > 0 ? '+' : ''}${dataPoint.raw}%
                </div>
                <div style="color: ${COLORS.text.primary}; font-size: 13px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: ${COLORS.text.secondary};">Win Rate</span>
                    <span>${bot.winRate}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: ${COLORS.text.secondary};">Balance</span>
                    <span>$${bot.balance?.toLocaleString()}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: ${COLORS.text.secondary};">Net Profit</span>
                    <span style="color: ${bot.netProfit >= 0 ? COLORS.status.success : COLORS.status.danger}">
                      ${bot.netProfit >= 0 ? '+' : '-'}$${Math.abs(bot.netProfit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            `;
          }

          const position = context.chart.canvas.getBoundingClientRect();
          tooltipEl.style.opacity = 1;
          tooltipEl.style.left = position.left + window.pageXOffset + context.tooltip.caretX + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + context.tooltip.caretY + 'px';
        }
      },
      datalabels: {
        display: (context) => {
          // Only show labels for 7-day view
          return type === 'daily' && !selectedDayData;
        }
      }
    },
    onClick: (event, elements) => {
      if (type === 'daily') {
        if (!selectedDayData && elements && elements.length > 0) {
          // When clicking on a day in 7-day view
          const dayIndex = weeklyData.length - 1 - elements[0].index;
          setSelectedDayIndex(dayIndex);
        } else if (selectedDayData && elements && elements.length > 0) {
          // When clicking on a bot in detailed view
          const botName = selectedDayData.bots[elements[0].index].name;
          onBotHover(botName);
          
          const botCard = document.getElementById(`bot-${type}-${botName}`);
          if (botCard) {
            botCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          // When clicking outside bars, reset to 7-day view
          setSelectedDayIndex(null);
          setSelectedDayData(null);
          onBotHover(null);
        }
      } else {
        // Weekly/Monthly view click handling
        if (elements && elements.length > 0) {
          const botName = botsData[elements[0].index].name;
          onBotHover(botName);
          
          const botCard = document.getElementById(`bot-${type}-${botName}`);
          if (botCard) {
            botCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          onBotHover(null);
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: (context) => {
            if (type === 'daily' && !selectedDayData) {
              return COLORS.text.secondary;
            }
            const index = context.index;
            return BOT_COLORS[index % BOT_COLORS.length] + 'CC';
          },
          maxRotation: 45,
          minRotation: 45
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          color: COLORS.border,
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          color: COLORS.text.secondary,
          callback: function(value) {
            return value > 0 ? `+${value}%` : `${value}%`;
          },
          padding: 10
        },
        border: {
          display: false
        }
      }
    },
    barPercentage: 0.6,
    categoryPercentage: 0.8,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  };

  const data = type === 'daily' ? getDailyChartData() : getWeeklyOrMonthlyChartData();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {type === 'daily' && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          fontSize: '12px',
          color: COLORS.text.secondary + '99',
          textAlign: 'right',
          fontStyle: 'italic',
          background: 'rgba(0,0,0,0.4)',
          padding: '4px 12px',
          borderRadius: '12px',
          backdropFilter: 'blur(4px)',
          border: `1px solid ${COLORS.border}`,
          textShadow: '0 0 10px rgba(255,255,255,0.2)',
          zIndex: 1,
          cursor: selectedDayData ? 'pointer' : 'default'
        }} onClick={() => {
          setSelectedDayIndex(null);
          setSelectedDayData(null);
        }}>
          {selectedDayData ? 'Click anywhere to return to 7-day view' : 'Click on a day to view details'}
        </div>
      )}
      <Bar options={options} data={data} />
    </div>
  );
}

export default ProfitChart; 