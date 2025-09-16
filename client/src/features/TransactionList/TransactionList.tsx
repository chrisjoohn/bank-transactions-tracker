import { FC, useState } from 'react';
import { format } from 'date-fns';

// components
import { Flex, Empty, Table, Button, Modal } from 'antd';

import TransactionDetails from '../TransactionDetails';
import TransactionTagSelector from '../TransactionTagSelector';

// type definitions
import type { ColumnsType } from 'antd/es/table';

import type { DebitTransaction } from '../../integration/apis/debitTransactions';
import type { CreditTransaction } from '../../integration/apis/creditTransactions';
import { Account } from '../../integration/apis/accounts';
import { useModal } from '../../hooks';

export type TransactionListProps = {
  account: Account;
  listData: (DebitTransaction | CreditTransaction)[];
};

const debitTrxColumns = ({
  account,
  recordClickHandler,
}: {
  account: Account;
  recordClickHandler: ({
    transactionId,
  }: {
    transactionId: DebitTransaction['unique_code'];
  }) => void;
}): ColumnsType<DebitTransaction> => [
  {
    title: 'ID',
    render: (_, record) => (
      <Button type="link" onClick={() => recordClickHandler({ transactionId: record.unique_code })}>
        {record.unique_code.slice(0, 6)}
      </Button>
    ),
  },
  {
    title: 'Transaction Date',
    dataIndex: 'transaction_date',
    render: (item) => format(item, 'MMM dd, yyyy'),
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Transaction Type',
    dataIndex: 'transaction_type',
  },
  {
    title: 'Tags',
    render: (_, record) => {
      return (
        <TransactionTagSelector
          transactionId={record.unique_code}
          accountId={account.unique_code}
        />
      );
    },
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
  },
];

const creditTrxColumns = ({
  recordClickHandler,
  account,
}: {
  recordClickHandler: ({
    transactionId,
  }: {
    transactionId: CreditTransaction['unique_code'];
  }) => void;
  account: Account;
}): ColumnsType<CreditTransaction> => [
  {
    title: 'ID',
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => {
          recordClickHandler({
            transactionId: record.unique_code,
          });
        }}
      >
        {record.unique_code.slice(0, 6)}
      </Button>
    ),
  },
  {
    title: 'Transaction Date',
    dataIndex: 'transaction_date',
    render: (item) => format(item, 'MMM dd, yyyy'),
  },

  {
    title: 'Post Date',
    dataIndex: 'post_date',
    render: (item) => format(item, 'MMM dd, yyyy'),
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Tags',
    render: (_, record) => {
      return (
        <TransactionTagSelector
          transactionId={record.unique_code}
          accountId={account.unique_code}
        />
      );
    },
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    align: 'right',
    render: (value) => value.toFixed(2),
  },
];

const TransactionList: FC<TransactionListProps> = (props) => {
  const { listData, account } = props;
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const { showModal, toggleModal } = useModal();

  const _transactionClickHandler = ({ transactionId }: { transactionId: string }) => {
    toggleModal(true);
    setTransactionId(transactionId);
  };

  const tableRender = () => {
    const commonTblProps = {
      scroll: {
        y: 400,
      },
    };
    if (account.type === 'CREDIT') {
      return (
        <Table<CreditTransaction>
          rowKey="unique_code"
          dataSource={listData as CreditTransaction[]}
          columns={creditTrxColumns({
            recordClickHandler: _transactionClickHandler,
            account,
          })}
          {...commonTblProps}
        />
      );
    }

    if (account.type === 'DEPOSIT') {
      return (
        <Table<DebitTransaction>
          rowKey={'unique_code'}
          dataSource={listData as DebitTransaction[]}
          columns={debitTrxColumns({ account, recordClickHandler: _transactionClickHandler })}
          {...commonTblProps}
        />
      );
    }
  };

  return (
    <Flex style={{ width: '100%' }} justify="center" align="center">
      <Modal open={showModal} onCancel={() => toggleModal(false)} footer={null} width={800}>
        {transactionId && (
          <TransactionDetails accountId={account.unique_code} transactionId={transactionId} />
        )}
      </Modal>
      {listData ? tableRender() : <Empty />}
    </Flex>
  );
};

export default TransactionList;
