import { FC } from 'react';
import classNames from 'classnames';

import { Card } from 'antd';

// redux APIs
import { accountsApi } from '../../integration/apis';

import './accounts.styles.scss';

export type AccountsProps = {};

const Accounts: FC<AccountsProps> = (props) => {
  const { isLoading, data = [] } = accountsApi.useGetAccountsQuery();

  return (
    <div className={classNames('btt-accounts')}>
      <div style={{ display: 'flex', gap: 20 }}>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          data.map((item) => {
            return (
              <Card
                key={item.name}
                extra={item.type}
                hoverable
                style={{ flex: '1 1 0px' }}
              >
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Accounts;
