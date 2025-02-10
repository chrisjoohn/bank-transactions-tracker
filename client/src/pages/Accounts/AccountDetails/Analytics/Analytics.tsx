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
            value={inflow}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title='Outflow'
            value={outflow}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title='Total'
            value={total}
            valueStyle={{ color: total > 0 ? '#3f8600' : '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Analytics;
