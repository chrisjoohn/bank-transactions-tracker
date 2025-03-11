import { FC } from 'react';

import { Row, Col, Statistic, Card } from 'antd';

export type AnalyticsProps = {
  inflow: number;
  outflow: number;
};

const Analytics: FC<AnalyticsProps> = (props) => {
  const { inflow, outflow } = props;

  const total = inflow - outflow;

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title='Inflow'
            value={inflow.toFixed(2)}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title='Outflow'
            value={outflow.toFixed(2)}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title='Total'
            value={total.toFixed(2)}
            valueStyle={{ color: total > 0 ? '#3f8600' : '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Analytics;
