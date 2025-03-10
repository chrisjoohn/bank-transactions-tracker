import { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { endOfMonth, format, startOfMonth } from 'date-fns';

import { Spin, Result } from 'antd';

// major components
import Analytics from './Analytics';
import Transactions from './Transactions';

// reusable components
import { DateFilter } from './components';

// apis
import { accountsApi } from '../../../integration/apis';

// styles
import './accountDetails.styles.scss';

const AccountDetails: FC = () => {
  const { id } = useParams();

  const [dateFilter, setDateFilter] = useState({
    start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end_date: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  const accountDetails = accountsApi.useGetAccountQuery(id || '');
  const [getAccountAnalytics, accountAnalytics] =
    accountsApi.useLazyGetAccountTrxAnalyticsQuery();
  const [getAccountTransactions, accountTransactions] =
    accountsApi.useLazyGetTransactionsQuery();

  useEffect(() => {
    /**
     * TO DO:
     * This one's on hold cause components are not yet ready for CREDIT account transactions
     */
    if (accountDetails.data?.type === 'CREDIT') {
      return;
    }

    if (!accountDetails.data?.id) {
      return;
    }

    getAccountAnalytics({
      date_range: dateFilter,
      id: accountDetails.data.id,
    });

    getAccountTransactions({
      id: accountDetails.data.id,
      requestBody: {
        filters: {
          date_range: dateFilter,
        },
      },
    });
  }, [accountDetails.data]);

  if (accountDetails.isFetching) {
    return <Spin size='large' />;
  }

  if (!accountDetails.data) {
    return <h2>Error 404: Account Not Found</h2>;
  }

  if (accountDetails.data.type === 'CREDIT') {
    return (
      <Result
        status='403'
        title='Oops'
        subTitle='This part is under construction'
      />
    );
  }

  const { name, description } = accountDetails.data;

  return (
    <div className={classNames('btt-account-details')}>
      <div className='basic-details'>
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
      <div className='date-filter'>
        <DateFilter
          onChange={(date) => {
            setDateFilter({
              start_date: date.startDate,
              end_date: date.endDate,
            });
          }}
        />
      </div>
      <div className={classNames('simple-analytics')}>
        <Analytics
          inflow={accountAnalytics.data?.data.totalInflow || 0}
          outflow={accountAnalytics.data?.data.totalOutflow || 0}
        />
      </div>
      <div className='transactions'>
        <Transactions
          account={accountDetails.data}
          listData={accountTransactions.data || []}
        />
      </div>
    </div>
  );
};

export default AccountDetails;
