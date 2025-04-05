import { FC } from 'react';
import { format } from 'date-fns';

// components
import { Flex, Empty, Table } from 'antd';

// type definitions
import type { ColumnsType } from 'antd/es/table';

import type { TransactionsProps } from '../Transactions';
import type { DebitTransaction } from '../../../../../integration/apis/debitTransactions';
import type { CreditTransaction } from '../../../../../integration/apis/creditTransactions';

export type TransactionListProps = {
  accountType: TransactionsProps['account']['type'];
  listData: DebitTransaction[] | CreditTransaction[] | undefined;
};

const debitTrxColumns: ColumnsType<DebitTransaction> = [
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

const creditTrxColumns: ColumnsType<CreditTransaction> = [
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
    title: 'Amount',
    dataIndex: 'amount',
    align: 'right',
    render: (value) => value.toFixed(2),
  },
];

const TransactionList: FC<TransactionListProps> = (props) => {
  const { accountType, listData } = props;

  const tableRender = () => {
    const commonTblProps = {
      scroll: {
        y: 400,
      },
    };
    if (accountType === 'CREDIT') {
      return (
        <Table<CreditTransaction>
          dataSource={listData as CreditTransaction[]}
          columns={creditTrxColumns}
          {...commonTblProps}
        />
      );
    }

    if (accountType === 'DEPOSIT') {
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
