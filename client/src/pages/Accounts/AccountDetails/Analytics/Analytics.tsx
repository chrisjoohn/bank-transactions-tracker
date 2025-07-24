import { FC, useEffect } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Legend, Line, Tooltip } from 'recharts';
import DynamicAnalytics from '../DynamicAnalytics';

import { Row, Col, Statistic, Card, Spin } from 'antd';

import { accountsApi } from '../../../../integration/apis';

// type definitions
import type { Account } from '../../../../integration/apis/accounts';
import type { AnalyticsData } from '../DynamicAnalytics/DynamicAnalytics';

export type AnalyticsProps = {
  account: Account;
  dateFilter: {
    start_date: string;
    end_date: string;
  };
};

const analyticsData: AnalyticsData = [
  {
    title: 'Necessary expenses',
    chartType: 'line',
    dimensions: ['week'],
    metrics: [
      {
        key: 'food',
        label: 'Food',
      },
      {
        key: 'grocery',
        label: 'Grocery',
      },
    ],
    data: [
      {
        week: 'Week 1',
        food: 600,
        grocery: 2000,
      },
      {
        week: 'Week 2',
        food: 500,
        grocery: 200,
      },
      {
        week: 'Week 3',
        food: 720,
        grocery: 1800,
      },
      {
        week: 'Week 4',
        food: 100,
        grocery: 0,
      },
    ],
  },
  {
    title: 'Included/Not Included',
    chartType: 'bar',
    dimensions: ['week'],
    metrics: [
      {
        key: 'included',
        label: 'Included',
        fill: '#8884d8',
      },
      {
        key: 'not included',
        label: 'Not Included',
        fill: '#82ca9d',
      },
    ],
    data: [
      {
        week: 'Week 1',
        included: 600,
        'not included': 2000,
      },
      {
        week: 'Week 2',
        included: 500,
        'not included': 200,
      },
      {
        week: 'Week 3',
        included: 720,
        'not included': 1800,
      },
      {
        week: 'Week 4',
        included: 100,
        'not included': 0,
      },
    ],
  },
];

const Analytics: FC<AnalyticsProps> = (props) => {
  const { account, dateFilter } = props;

  const [getAccountAnalytics, accountAnalytics] = accountsApi.useLazyGetAccountBasicAnalyticsQuery();

  useEffect(() => {
    if (!account.id) {
      return;
    }

    if (account.type === 'CREDIT') {
      getAccountAnalytics({
        id: account.id,
        post_date: dateFilter,
      });
      return;
    }
    if (account.type === 'DEPOSIT') {
      getAccountAnalytics({
        id: account.id,
        transaction_date: dateFilter,
      });
    }
  }, [account.id, dateFilter]);

  if (accountAnalytics.isUninitialized || accountAnalytics.isLoading) {
    return <Spin size="large" />;
  }

  if (!accountAnalytics.data) {
    return null;
  }

  const { totalInflow, totalOutflow, total } = accountAnalytics.data?.data;

  // TODO: Update this one
  if (account.type === 'CREDIT') {
    return (
      <Row gutter={16}>
        <DynamicAnalytics data={analyticsData} />
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Outflow"
              value={totalOutflow.toFixed(2)}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Inflow"
            value={totalInflow.toFixed(2)}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Outflow"
            value={totalOutflow.toFixed(2)}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Total"
            value={total.toFixed(2)}
            valueStyle={{ color: total > 0 ? '#3f8600' : '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Analytics;
