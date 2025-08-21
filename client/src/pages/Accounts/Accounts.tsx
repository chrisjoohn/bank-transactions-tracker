import { FC } from 'react';
import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

import './accounts.styles.scss';

export type AccountsProps = {};

const Accounts: FC<AccountsProps> = () => {
  return (
    <div className={classNames('btt-accounts')}>
      <Outlet />
    </div>
  );
};

export default Accounts;
