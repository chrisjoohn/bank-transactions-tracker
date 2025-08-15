/**
 * TODO: Check if we should also implement React context here
 */
import { FC, useState } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

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

  const [dateFilter, setDateFilter] = useState<null | { start_date: string; end_date: string }>(null);

  const accountDetails = accountsApi.useGetAccountQuery(id || '');

  if (accountDetails.isFetching) {
    return <Spin size="large" />;
  }

  if (!accountDetails.data) {
    return <h2>Error 404: Account Not Found</h2>;
  }

  const { name, description } = accountDetails.data;

  return (
    <div className={classNames('btt-account-details')}>
      <div className="basic-details">
        <h2>{name}</h2>
        <p>{description}</p>
      </div>
      <div className="date-filter">
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
        {dateFilter && <Analytics account={accountDetails.data} dateFilter={dateFilter} />}
      </div>
      <div className="transactions">
        {dateFilter && <Transactions account={accountDetails.data} dateFilter={dateFilter} />}
      </div>
    </div>
  );
};

export default AccountDetails;
