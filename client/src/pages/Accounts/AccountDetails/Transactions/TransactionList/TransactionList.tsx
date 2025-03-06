import { FC } from 'react';
import { format } from 'date-fns';

// components
import { Flex, Empty, Spin, Table } from 'antd';

// apis
import { debitTransactionsApi } from '../../../../../integration/apis';

// type definitions
import type { TransactionsProps } from '../Transactions';
import type { DebitTransaction } from '../../../../../integration/apis/debit_transactions';

export type TransactionListProps = {
  account: TransactionsProps['account'];
  filters?: {
    date: string;
  };
};

const TransactionList: FC<TransactionListProps> = (props) => {
  const {} = props;

  const { isLoading, data } = debitTransactionsApi.useFindAllQuery();

  return (
    <Flex
      style={{ width: '100%' }}
      justify='center'
      align='center'
    >
      {isLoading && <Spin size='large' />}
      {data ? (
        <Table<DebitTransaction>
          dataSource={data}
          scroll={{
            y: 400,
          }}
          columns={[
            {
              title: 'Transaction Date',
              dataIndex: 'transaction_date',
            render: (item) => format(item, 'MMM dd, yyyy')
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
