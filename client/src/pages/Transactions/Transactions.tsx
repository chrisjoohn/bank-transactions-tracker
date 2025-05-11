import { FC } from 'react';
import classNames from 'classnames';
import { Outlet } from 'react-router-dom';

const Transactions: FC = () => {
  return (
    <div className={classNames('btt-transactions')}>
      <Outlet />
    </div>
  );
};

export default Transactions;
