import { FC, useEffect } from 'react';

import { Row, Col, Statistic, Card, Spin } from 'antd';

import { accountsApi } from '../../../../integration/apis';

// type definitions
import type { Account } from '../../../../integration/apis/accounts';

export type AnalyticsProps = {
  account: Account;
  dateFilter: {
    start_date: string;
    end_date: string;
  };
};

const Analytics: FC<AnalyticsProps> = (props) => {
  const { account, dateFilter } = props;

  const [getAccountAnalytics, accountAnalytics] =
    accountsApi.useLazyGetAccountTrxAnalyticsQuery();

  useEffect(() => {
    if (!account.id) {
      return;
    }

    // blocked for now. to think of another concept for credi trx analytics
    if (account.type === 'CREDIT') {
      return;
    }

    getAccountAnalytics({
      id: account.id,
      date_range: dateFilter,
    });
  }, [account.id, dateFilter]);

  if (account.type === 'CREDIT') {
    return null;
  }

  if (accountAnalytics.isUninitialized || accountAnalytics.isLoading) {
    return <Spin size='large' />;
  }

  if (!accountAnalytics.data) {
    return null;
  }

  const { totalInflow, totalOutflow, total } = accountAnalytics.data?.data;

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title='Inflow'
            value={totalInflow.toFixed(2)}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title='Outflow'
            value={totalOutflow.toFixed(2)}
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
