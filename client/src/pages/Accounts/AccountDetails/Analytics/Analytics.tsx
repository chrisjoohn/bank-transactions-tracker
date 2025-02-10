import { FC } from 'react';

import { Row, Col, Statistic, Card } from 'antd';

export type AnalyticsProps = {
  inflow: number;
  outflow: number;
};

const Analytics: FC<AnalyticsProps> = (props) => {
  const { inflow, outflow } = props;
  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title='Inflow'
            value={inflow}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title='Outflow'
            value={outflow}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Analytics;
