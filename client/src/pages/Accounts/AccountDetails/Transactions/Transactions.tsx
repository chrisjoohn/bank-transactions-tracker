/**
 * TO DO:
 * check if we should move API integration here
 */
import { FC, useState } from 'react';

// components
import { Modal, Button, Card } from 'antd';

import TransactionList from './TransactionList';
import { TransactionStepperForm } from '../components';

// type definitions
import type { Account } from '../../../../integration/apis/accounts';
import type { DebitTransaction } from '../../../../integration/apis/debit_transactions';

export type TransactionsProps = {
  account: Account;
  listData: DebitTransaction[];
};

const Transactions: FC<TransactionsProps> = (props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { account, listData } = props;

  return (
    <>
      {/**
       * Main render
       */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setModalOpen(true)}>Add transactions</Button>
        </div>
        <div className='transactions-list'>
          <TransactionList
            account={account}
            listData={listData}
          />
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
          <TransactionStepperForm key={new Date().toString()} />
        </div>
      </Modal>
    </>
  );
};

export default Transactions;
