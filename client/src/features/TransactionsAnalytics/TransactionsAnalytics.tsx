import { FC } from 'react';

import { Row, Col, Statistic, Card, Spin } from 'antd';

import { accountsApi } from '../../integration/apis';

// type definitions
import type { Account } from '../../integration/apis/accounts';
import type { Tag } from '../../integration/apis/tags';

export type TransactionsAnalyticsProps = {
  account: Account;
  dateFilter: {
    start_date: string;
    end_date: string;
  };
  tagsFilter: Tag[];
};

const TransactionsAnalytics: FC<TransactionsAnalyticsProps> = (props) => {
  const { account, dateFilter, tagsFilter } = props;

  const accountAnalytics = accountsApi.useGetAccountTrxAnalyticsQuery(
    {
      id: account.unique_code,
      post_date: account.type === 'CREDIT' ? dateFilter : undefined,
      transaction_date: account.type === 'DEPOSIT' ? dateFilter : undefined,
      tags: tagsFilter.map((item) => item.id),
    },
    {
      skip: !account,
    }
  );

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

export default TransactionsAnalytics;
