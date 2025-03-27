import React, { useState } from 'react';
import {
  Modal,
  Form,
  InputNumber,
  Select,
  Switch,
  Slider,
  Alert,
  Space,
  Typography,
  Divider,
  Tag
} from 'antd';
import {
  DollarOutlined,
  PercentageOutlined,
  WarningOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { CopySettings, Trader } from '../../services/socialTradingService';

const { Option } = Select;
const { Text } = Typography;

interface CopyTradeSettingsProps {
  visible: boolean;
  trader: Trader;
  onClose: () => void;
  onSave: (settings: CopySettings) => void;
  availableInstruments: string[];
}

export const CopyTradeSettings: React.FC<CopyTradeSettingsProps> = ({
  visible,
  trader,
  onClose,
  onSave,
  availableInstruments
}) => {
  const [form] = Form.useForm();
  const [allocation, setAllocation] = useState<number>(1000);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(2);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSave({
        traderId: trader.id,
        allocation: values.allocation,
        maxRiskPerTrade: values.maxRiskPerTrade,
        instruments: values.instruments,
        excludedInstruments: values.excludedInstruments || [],
        copyStopLoss: values.copyStopLoss,
        copyTakeProfit: values.copyTakeProfit,
        maxDailyLoss: values.maxDailyLoss,
        maxWeeklyLoss: values.maxWeeklyLoss
      });
      onClose();
    });
  };

  return (
    <Modal
      title={`Copy Trade Settings - ${trader.username}`}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      width={600}
      className="copy-trade-settings"
    >
      <Alert
        message="Risk Warning"
        description="Copy trading involves substantial risk. Please ensure you understand the risks and set appropriate limits."
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        className="risk-warning"
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          allocation: 1000,
          maxRiskPerTrade: 2,
          instruments: availableInstruments,
          copyStopLoss: true,
          copyTakeProfit: true,
          maxDailyLoss: 10,
          maxWeeklyLoss: 20
        }}
      >
        <Divider>Allocation & Risk Settings</Divider>
        
        <Form.Item
          label="Copy Trading Allocation"
          name="allocation"
          rules={[{ required: true, message: 'Please set your allocation' }]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <InputNumber
              prefix={<DollarOutlined />}
              min={100}
              max={100000}
              style={{ width: '100%' }}
              onChange={value => setAllocation(value as number)}
            />
            <Text type="secondary">
              This is the amount you want to allocate for copy trading
            </Text>
          </Space>
        </Form.Item>

        <Form.Item
          label="Maximum Risk per Trade (%)"
          name="maxRiskPerTrade"
          rules={[{ required: true, message: 'Please set maximum risk per trade' }]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Slider
              min={0.1}
              max={10}
              step={0.1}
              marks={{
                0.1: 'Low',
                2: 'Medium',
                5: 'High',
                10: 'Very High'
              }}
              onChange={value => setRiskPerTrade(value as number)}
            />
            <Text type="secondary">
              Maximum risk: ${((allocation * riskPerTrade) / 100).toFixed(2)} per trade
            </Text>
          </Space>
        </Form.Item>

        <Divider>Instruments & Copy Settings</Divider>

        <Form.Item
          label="Instruments to Copy"
          name="instruments"
          rules={[{ required: true, message: 'Please select at least one instrument' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select instruments to copy"
            style={{ width: '100%' }}
          >
            {availableInstruments.map(instrument => (
              <Option key={instrument} value={instrument}>
                {instrument}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Excluded Instruments"
          name="excludedInstruments"
        >
          <Select
            mode="multiple"
            placeholder="Select instruments to exclude"
            style={{ width: '100%' }}
          >
            {availableInstruments.map(instrument => (
              <Option key={instrument} value={instrument}>
                {instrument}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Space size={16} style={{ width: '100%' }}>
          <Form.Item
            label="Copy Stop Loss"
            name="copyStopLoss"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Copy Take Profit"
            name="copyTakeProfit"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Space>

        <Divider>Loss Limits</Divider>

        <Space size={16} style={{ width: '100%' }}>
          <Form.Item
            label="Max Daily Loss (%)"
            name="maxDailyLoss"
            rules={[{ required: true, message: 'Please set daily loss limit' }]}
          >
            <InputNumber
              min={1}
              max={50}
              formatter={value => `${value}%`}
              parser={value => value!.replace('%', '')}
            />
          </Form.Item>

          <Form.Item
            label="Max Weekly Loss (%)"
            name="maxWeeklyLoss"
            rules={[{ required: true, message: 'Please set weekly loss limit' }]}
          >
            <InputNumber
              min={1}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value!.replace('%', '')}
            />
          </Form.Item>
        </Space>

        <Alert
          message="Copy Trading Summary"
          description={
            <Space direction="vertical">
              <Text>
                Allocation: <Tag color="blue">${allocation}</Tag>
              </Text>
              <Text>
                Max Risk per Trade: <Tag color="orange">{riskPerTrade}%</Tag>
              </Text>
              <Text>
                Max Loss per Trade: <Tag color="red">${((allocation * riskPerTrade) / 100).toFixed(2)}</Tag>
              </Text>
            </Space>
          }
          type="info"
          showIcon
          icon={<SafetyOutlined />}
        />
      </Form>
    </Modal>
  );
};

// Styles
const styles = `
.copy-trade-settings .risk-warning {
  margin-bottom: 24px;
}

.copy-trade-settings .ant-form-item {
  margin-bottom: 24px;
}

.copy-trade-settings .ant-slider {
  width: 100%;
}

.copy-trade-settings .ant-space {
  display: flex;
}

.copy-trade-settings .ant-alert {
  margin-top: 24px;
}

.copy-trade-settings .ant-divider {
  margin: 16px 0;
  color: #1890ff;
  font-weight: 500;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
