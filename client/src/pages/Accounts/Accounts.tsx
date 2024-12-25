import { FC } from 'react';
import classNames from 'classnames';

import { Card } from 'antd';

import './accounts.styles.scss';

export type AccountsProps = {};

const accounts = [
  {
    name: 'Revenue Stream',
    description: 'Account for inflow/outflow money',
    type: 'DEPOSIT',
  },
  {
    name: 'Gold CC',
    description: 'CC account for testing',
    type: 'CREDIT',
  },
  {
    name: 'Travel Funds',
    description: 'Account from excess funds',
    type: 'DEPOSIT',
  },
];

const Accounts: FC<AccountsProps> = (props) => {
  return (
    <div className={classNames('btt-accounts')}>
      <div style={{ display: 'flex', gap: 20 }}>
        {accounts.map((item) => {
          return (
            <Card
              extra={item.type}
              hoverable
              style={{ flex: '1 1 0px' }}
            >
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Accounts;
