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

function ProfitChart() {
  // Định nghĩa màu cho từng bot
  const botColors = {
    'Bot Alpha': {
      name: 'Emerald',
      profit: 'rgba(16, 185, 129, 0.8)',
      loss: 'rgba(16, 185, 129, 0.3)',
      border: 'rgba(16, 185, 129, 1)'
    },
    'Bot Beta': {
      name: 'Ruby',
      profit: 'rgba(239, 68, 68, 0.8)',
      loss: 'rgba(239, 68, 68, 0.3)',
      border: 'rgba(239, 68, 68, 1)'
    },
    'Bot Gamma': {
      name: 'Sapphire',
      profit: 'rgba(59, 130, 246, 0.8)',
      loss: 'rgba(59, 130, 246, 0.3)',
      border: 'rgba(59, 130, 246, 1)'
    },
    'Bot Delta': {
      name: 'Amber',
      profit: 'rgba(245, 158, 11, 0.8)',
      loss: 'rgba(245, 158, 11, 0.3)',
      border: 'rgba(245, 158, 11, 1)'
    }
  };

  // Options cho biểu đồ
  const options = {
    responsive: true,
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: false // Ẩn legend vì giờ chỉ có 1 dataset
      },
      title: {
        display: true,
        text: 'Trading Bots Performance Analysis',
        font: {
          family: "'Segoe UI', 'Roboto', sans-serif",
          size: 20,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 30
        },
        color: '#2c3e50'
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
            const bot = context[0].label;
            return `${bot} (${botColors[bot].name})`;
          },
          label: function(context) {
            const value = context.raw;
            const type = value >= 0 ? 'Profit' : 'Loss';
            return `${type}: ${Math.abs(value)}%`;
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
            return Math.abs(value) + '%';
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
    barPercentage: 0.8, // Điều chỉnh độ rộng của cột
    categoryPercentage: 0.9 // Điều chỉnh khoảng cách giữa các cột
  };

  const rawData = [
    { bot: 'Bot Alpha', value: 5 },
    { bot: 'Bot Beta', value: -2 },
    { bot: 'Bot Gamma', value: 3.5 },
    { bot: 'Bot Delta', value: -1.5 }
  ];

  const data = {
    labels: rawData.map(item => item.bot),
    datasets: [
      {
        data: rawData.map(item => item.value),
        backgroundColor: rawData.map(item => 
          item.value >= 0 ? botColors[item.bot].profit : botColors[item.bot].profit
        ),
        borderColor: rawData.map(item => botColors[item.bot].border),
        borderWidth: 2,
        borderRadius: 5,
        hoverBackgroundColor: rawData.map(item => 
          item.value >= 0 ? botColors[item.bot].profit : botColors[item.bot].profit
        ),
        hoverBorderColor: rawData.map(item => botColors[item.bot].border),
        hoverBorderWidth: 3
      }
    ]
  };

  return (
    <Bar options={options} data={data} />
  );
}

export default ProfitChart; 