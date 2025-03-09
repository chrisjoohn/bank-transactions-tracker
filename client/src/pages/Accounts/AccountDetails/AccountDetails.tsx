import { FC, useState } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { endOfMonth, format, startOfMonth } from 'date-fns';

import { Spin } from 'antd';

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

  const { data, isFetching } = accountsApi.useGetAccountQuery(id || '');
  const accountAnalytics = accountsApi.useGetAccountTrxAnalyticsQuery({
    date_range: dateFilter,
    id,
  });

  if (isFetching) {
    return <Spin size='large' />;
  }

  if (!data) {
    return <h2>Error 404: Account Not Found</h2>;
  }

  const { name, description } = data;

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
        <Transactions account={data} />
      </div>
    </div>
  );
};

export default AccountDetails;
