import { FC } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

import { Card, Spin } from 'antd';

// components
import { Transactions } from '../../../features';

// apis
import { accountsApi } from '../../../integration/apis';

// styles
import './accountDetails.styles.scss';

const AccountDetails: FC = () => {
  const { id } = useParams();

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
      <Card className="basic-details">
        <h2>{name}</h2>
        <p>{description}</p>
      </Card>
      <div className="transactions">
        <Transactions account={accountDetails.data} />
      </div>
    </div>
  );
};

export default AccountDetails;
