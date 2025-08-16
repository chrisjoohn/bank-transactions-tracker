import { FC } from 'react';

import { Card, Button, Modal } from 'antd';

// major components
import Analytics from '../TransactionsAnalytics';
import TransactionList from '../TransactionList';

// reusable components
import { DateFilter } from './components';

// hooks
import useTransactions from './useTransactions.hooks';

// types
import type { Account } from '../../integration/apis/accounts';
import TransactionStepperForm from '../TransactionStepperForm';

export interface TransactionsProps {
  withAnalytics?: boolean;
  account: Account;
}

const Transactions: FC<TransactionsProps> = (props) => {
  const { account } = props;

  const { dateFilter, setDateFilter, listData, showModal, setShowModal } = useTransactions(props);

  return (
    <div className="transactions">
      <div className="date-filter">
        <DateFilter
          onChange={(date) => {
            setDateFilter({ start_date: date.startDate, end_date: date.endDate });
          }}
        />
      </div>
      <div className="simple-analytics">
        {dateFilter && <Analytics dateFilter={dateFilter} account={account} />}
      </div>
      <div className="transactions-list">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <Button onClick={() => setShowModal(true)}>Add transactions</Button>
          </div>
          <TransactionList account={account} listData={listData} />
        </Card>
      </div>

      <Modal
        open={showModal}
        width={1500}
        centered
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <TransactionStepperForm account={account} key={new Date().toString()} />
      </Modal>
    </div>
  );
};

export default Transactions;
