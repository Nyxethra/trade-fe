import React from 'react';
import { COLORS } from '../constants/colors';

function QuickOverview({ 
  totalBots, 
  tradingVolume, 
  marketSentiment, 
  hotMarket,
  alerts,
  marketData
}) {
  return (
    <div className="quick-overview">
      <div className="overview-section stats">
        <div className="stat-box">
          <div className="stat-value">{totalBots}</div>
          <div className="stat-label">Active Bots</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{tradingVolume}</div>
          <div className="stat-label">24h Volume</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: marketSentiment === 'Bullish' ? COLORS.status.success : COLORS.status.danger }}>
            {marketSentiment}
          </div>
          <div className="stat-label">Market Sentiment</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{hotMarket}</div>
          <div className="stat-label">Hottest Market</div>
        </div>
      </div>

      <div className="overview-section alerts">
        <div className="section-title">Recent Alerts</div>
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              {alert}
            </div>
          ))}
        </div>
      </div>

      <div className="overview-section markets">
        <div className="section-title">Market Overview</div>
        <div className="markets-list">
          <div className="market-item">
            <img src="/icons/btc.svg" alt="BTC" className="market-icon" />
            <div className="market-name">BTC</div>
            <div className="market-price">{marketData.btc.price}</div>
            <div className="market-change" style={{ color: marketData.btc.change.startsWith('+') ? COLORS.status.success : COLORS.status.danger }}>
              {marketData.btc.change}
            </div>
          </div>
          <div className="market-item">
            <img src="/icons/eth.svg" alt="ETH" className="market-icon" />
            <div className="market-name">ETH</div>
            <div className="market-price">{marketData.eth.price}</div>
            <div className="market-change" style={{ color: marketData.eth.change.startsWith('+') ? COLORS.status.success : COLORS.status.danger }}>
              {marketData.eth.change}
            </div>
          </div>
          <div className="market-item">
            <img src="/icons/bnb.svg" alt="BNB" className="market-icon" />
            <div className="market-name">BNB</div>
            <div className="market-price">{marketData.bnb.price}</div>
            <div className="market-change" style={{ color: marketData.bnb.change.startsWith('+') ? COLORS.status.success : COLORS.status.danger }}>
              {marketData.bnb.change}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickOverview; 