import React from 'react';
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
import { BOT_COLORS } from '../constants/colors';

// Đăng ký các components cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ProfitChart({ botsData, onBotHover }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 16,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        callbacks: {
          title: function(context) {
            return context[0].label;
          },
          label: function(context) {
            const bot = botsData[context.dataIndex];
            return [
              `Performance: ${context.raw > 0 ? '+' : ''}${context.raw}%`,
              `Win Rate: ${bot.winRate}`,
              `Balance: $${bot.balance.toLocaleString()}`,
              `Net Profit: ${bot.netProfit >= 0 ? '+' : '-'}$${Math.abs(bot.netProfit).toLocaleString()}`
            ];
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const botName = botsData[elements[0].index].name;
        onBotHover(botName);
        
        // Scroll to bot card
        const botCard = document.getElementById(`bot-${botName}`);
        if (botCard) {
          botCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        onBotHover(null);
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#6b7280',
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          color: '#f3f4f6',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          },
          color: '#6b7280',
          callback: function(value) {
            return value + '%';
          }
        },
        border: {
          dash: [4, 4]
        }
      }
    },
    barPercentage: 0.7,
    categoryPercentage: 0.9,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  };

  const data = {
    labels: botsData.map(bot => bot.name),
    datasets: [
      {
        data: botsData.map(bot => bot.performance),
        backgroundColor: botsData.map((_, index) => `${BOT_COLORS[index]}CC`), // CC = 80% opacity
        borderColor: botsData.map((_, index) => BOT_COLORS[index]),
        borderWidth: 1,
        borderRadius: {
          topLeft: 4,
          topRight: 4
        },
        hoverBackgroundColor: botsData.map((_, index) => BOT_COLORS[index])
      }
    ]
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Bar options={options} data={data} />
    </div>
  );
}

export default ProfitChart; 