import { FC } from 'react';

import { Card, CardProps } from 'antd';

import type { Account } from '../../../../integration/apis/accounts';

export interface AccountCardProps {
  account: Partial<Account>;
  onClick?: CardProps['onClick'];
}

// TODO: implement edit/delete account
const AccountCard: FC<AccountCardProps> = (props) => {
  const { account, onClick } = props;
  const { name, description, type } = account;

  return (
    <Card extra={type} hoverable style={{ flex: '0 0 calc(33.33% - 20px)' }} onClick={onClick}>
      <h3>{name}</h3>
      <p>{description}</p>
    </Card>
  );
};

export default AccountCard;
