import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// components
import { Flex, Empty, Table, Button, Tag } from 'antd';

// type definitions
import type { ColumnsType } from 'antd/es/table';

import type { TransactionsProps } from '../Transactions';
import type { DebitTransaction } from '../../../../../integration/apis/debitTransactions';
import type { CreditTransaction } from '../../../../../integration/apis/creditTransactions';
import { TransactionTagSelector } from '../../../../Transactions/components';
import { Account } from '../../../../../integration/apis/accounts';

export type TransactionListProps = {
  account: TransactionsProps['account'];
  listData: DebitTransaction[] | CreditTransaction[] | undefined;
};

const debitTrxColumns: ColumnsType<DebitTransaction> = [
  {
    title: 'ID',
    render: (_, record) => (
      <Button type="link" onClick={() => alert('This part is under construction.')}>
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
  const navigate = useNavigate();

  const _transactionClickHandler = ({ transactionId }: { transactionId: string }) => {
    navigate(`/transactions/${account.unique_code}/${transactionId}`);
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
          dataSource={listData as DebitTransaction[]}
          columns={debitTrxColumns}
          {...commonTblProps}
        />
      );
    }
  };

  return (
    <Flex style={{ width: '100%' }} justify="center" align="center">
      {listData ? tableRender() : <Empty />}
    </Flex>
  );
};

export default TransactionList;
