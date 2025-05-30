import React from 'react';
import { Card, Avatar, Statistic, Button, Tag, Tooltip, Space } from 'antd';
import {
  TrophyOutlined,
  LineChartOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { Trader } from '../../services/socialTradingService';

interface TraderCardProps {
  trader: Trader;
  onFollow: (traderId: string) => void;
  onCopy: (traderId: string) => void;
  isFollowing?: boolean;
  isCopying?: boolean;
}

export const TraderCard: React.FC<TraderCardProps> = ({
  trader,
  onFollow,
  onCopy,
  isFollowing = false,
  isCopying = false
}) => {
  const {
    id,
    username,
    avatar,
    performance,
    statistics,
    badges,
    ranking,
    verified
  } = trader;

  return (
    <Card
      hoverable
      className="trader-card"
      actions={[
        <Button
          type={isFollowing ? 'default' : 'primary'}
          icon={<UserOutlined />}
          onClick={() => onFollow(id)}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Button>,
        <Button
          type={isCopying ? 'default' : 'primary'}
          icon={<CopyOutlined />}
          onClick={() => onCopy(id)}
        >
          {isCopying ? 'Stop Copying' : 'Copy Trades'}
        </Button>
      ]}
    >
      <div className="trader-header">
        <Avatar size={64} src={avatar} />
        <div className="trader-info">
          <div className="trader-name">
            <span>{username}</span>
            {verified && (
              <Tooltip title="Verified Trader">
                <CheckCircleOutlined className="verified-icon" />
              </Tooltip>
            )}
          </div>
          <Space size={4}>
            <Tag icon={<TrophyOutlined />} color="gold">
              Rank #{ranking}
            </Tag>
            {badges.map((badge, index) => (
              <Tooltip key={index} title={badge}>
                <Tag color="blue">{badge}</Tag>
              </Tooltip>
            ))}
          </Space>
        </div>
      </div>

      <div className="trader-stats">
        <Statistic
          title="Total Return"
          value={performance.totalReturn}
          precision={2}
          prefix="%"
          valueStyle={{ color: performance.totalReturn >= 0 ? '#3f8600' : '#cf1322' }}
        />
        <Statistic
          title="Win Rate"
          value={performance.winRate}
          precision={2}
          suffix="%"
          prefix={<LineChartOutlined />}
        />
        <Statistic
          title="Followers"
          value={statistics.followers}
          prefix={<UserOutlined />}
        />
      </div>

      <div className="trader-performance">
        <div className="performance-item">
          <Tooltip title="Average Profit per Trade">
            <DollarOutlined style={{ color: '#3f8600' }} />
            <span>${performance.avgProfit.toFixed(2)}</span>
          </Tooltip>
        </div>
        <div className="performance-item">
          <Tooltip title="Average Loss per Trade">
            <DollarOutlined style={{ color: '#cf1322' }} />
            <span>${performance.avgLoss.toFixed(2)}</span>
          </Tooltip>
        </div>
        <div className="performance-item">
          <Tooltip title="Sharpe Ratio">
            <LineChartOutlined />
            <span>{performance.sharpeRatio.toFixed(2)}</span>
          </Tooltip>
        </div>
      </div>

      <div className="trader-activity">
        <Tag color="blue">Total Trades: {statistics.totalTrades}</Tag>
        <Tag color="green">
          Successful: {statistics.successfulTrades}
        </Tag>
        <Tag color="orange">
          Success Rate: {((statistics.successfulTrades / statistics.totalTrades) * 100).toFixed(1)}%
        </Tag>
      </div>
    </Card>
  );
};

// Styles
const styles = `
.trader-card {
  width: 100%;
  max-width: 400px;
  margin: 16px;
  transition: all 0.3s;
}

.trader-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.trader-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.trader-info {
  flex: 1;
}

.trader-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.verified-icon {
  color: #1890ff;
  font-size: 16px;
}

.trader-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.trader-performance {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.performance-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trader-activity {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ant-statistic {
  text-align: center;
}

.ant-statistic-title {
  font-size: 12px;
}

.ant-statistic-content {
  font-size: 20px;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
