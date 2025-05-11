import { FC, useEffect, useState } from 'react';

// components
import { Modal, Button, Card } from 'antd';

import TransactionList from './TransactionList';
import { TransactionStepperForm } from '../components';

// APIs
import { accountsApi } from '../../../../integration/apis/accounts';

// type definitions
import type { Account } from '../../../../integration/apis/accounts';

export type TransactionsProps = {
  account: Account;
  dateFilter: {
    start_date: string;
    end_date: string;
  };
};

const Transactions: FC<TransactionsProps> = (props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { account, dateFilter } = props;

  const [getAccountTransactions, accountTransactions] = accountsApi.useLazyGetTransactionsQuery();

  useEffect(() => {
    if (!account.id) {
      return;
    }

    let includes = undefined;
    if (account.type === 'CREDIT') {
      includes = {
        tags: {},
      };
    }

    getAccountTransactions({
      id: account.id,
      requestBody: {
        filters: {
          date_range: dateFilter,
        },
        includes,
      },
    });
  }, [account.id, dateFilter]);

  return (
    <>
      {/**
       * Main render
       */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setModalOpen(true)}>Add transactions</Button>
        </div>
        <div className="transactions-list">
          <TransactionList accountType={account.type} listData={accountTransactions.data} />
        </div>
      </Card>

      {/**
       *  Modal component
       */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
        width={1500}
      >
        <div style={{ marginTop: '40px' }}>
          <TransactionStepperForm key={new Date().toString()} account={account} />
        </div>
      </Modal>
    </>
  );
};

export default Transactions;
