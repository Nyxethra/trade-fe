import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Đăng ký các components cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ProfitChart({ botsData }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2c3e50',
        bodyColor: '#2c3e50',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          title: function(context) {
            const bot = botsData[context[0].dataIndex];
            return `${bot.name} (${bot.type})`;
          },
          label: function(context) {
            const value = context.raw;
            const type = value >= 0 ? 'Profit' : 'Loss';
            return `${type}: ${value > 0 ? '+' : ''}${value}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: (context) => {
            if (context.tick.value === 0) {
              return '#666';
            }
            return '#e5e5e5';
          },
          lineWidth: (context) => {
            if (context.tick.value === 0) {
              return 2;
            }
            return 0.5;
          },
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          },
          font: {
            family: "'Segoe UI', 'Roboto', sans-serif",
            size: 12
          },
          color: '#666'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Segoe UI', 'Roboto', sans-serif",
            size: 12,
            weight: '500'
          },
          color: '#666'
        }
      }
    },
    barPercentage: 0.8,
    categoryPercentage: 0.9
  };

  const data = {
    labels: botsData.map(bot => bot.name),
    datasets: [
      {
        data: botsData.map(bot => bot.performance),
        backgroundColor: botsData.map(bot => 
          `${bot.colorCode}${bot.performance >= 0 ? 'cc' : '66'}`
        ),
        borderColor: botsData.map(bot => bot.colorCode),
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: botsData.map(bot => 
          `${bot.colorCode}${bot.performance >= 0 ? 'dd' : '88'}`
        ),
        hoverBorderColor: botsData.map(bot => bot.colorCode),
        hoverBorderWidth: 3
      }
    ]
  };

  return <Bar options={options} data={data} />;
}

export default ProfitChart; 