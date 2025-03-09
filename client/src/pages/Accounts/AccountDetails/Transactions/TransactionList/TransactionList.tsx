/**
 * TO DO: check on how we can make this component reusable
 */
import { FC } from 'react';
import { format } from 'date-fns';

// components
import { Flex, Empty, Table } from 'antd';

// type definitions
import type { TransactionsProps } from '../Transactions';
import type { DebitTransaction } from '../../../../../integration/apis/debit_transactions';

export type TransactionListProps = {
  account: TransactionsProps['account'];
  filters?: {
    date: string;
  };
  listData: DebitTransaction[];
};

const TransactionList: FC<TransactionListProps> = (props) => {
  const { listData } = props;

  return (
    <Flex
      style={{ width: '100%' }}
      justify='center'
      align='center'
    >
      {listData ? (
        <Table<DebitTransaction>
          dataSource={listData}
          scroll={{
            y: 400,
          }}
          columns={[
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
          ]}
        />
      ) : (
        <Empty />
      )}
    </Flex>
  );
};

export default TransactionList;
