import { FC, useState } from 'react';

// components
import { Modal, Button } from 'antd';

import { TransactionStepperForm } from '../components';

// type definitions
import type { Account } from '../../../../integration/apis/accounts';

export type TransactionsProps = {
  account: Account;
};

const Transactions: FC<TransactionsProps> = (props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { account } = props;

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>Add transactions</Button>
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
